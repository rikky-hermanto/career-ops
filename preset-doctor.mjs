#!/usr/bin/env node
/**
 * preset-doctor.mjs — schema drift check for targeting presets.
 *
 * `preset.mjs` keeps presets switchable; this keeps them CURRENT. After a
 * system update, upstream may have added keys to `config/profile.example.yml`
 * or `templates/portals.example.yml` that the presets (snapshots taken before
 * the update) know nothing about. Switching to such a preset would silently
 * roll the canonical file back to the old schema.
 *
 * Three checks, all zero-LLM:
 *   1. parse      — every preset file is valid YAML
 *   2. schema     — keys present in the upstream example files but missing from
 *                   a preset (and, informationally, keys a preset has that the
 *                   example does not — usually the user's own additions)
 *   3. identity   — non-targeting blocks must be IDENTICAL across all presets;
 *                   any divergence means `preset.mjs sync-identity` is overdue
 *
 * Usage:
 *   node preset-doctor.mjs            JSON report (exit 1 if any error)
 *   node preset-doctor.mjs --summary  human-readable table
 *   node preset-doctor.mjs --self-test
 *
 * Exit codes: 0 clean (warnings allowed), 1 errors found.
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import * as yaml from 'js-yaml'

const SCRIPT_ROOT = dirname(fileURLToPath(import.meta.url))

/** Preset file -> the upstream example that defines its schema. */
const SCHEMA_SOURCES = [
  { preset: 'profile.yml', example: 'config/profile.example.yml' },
  { preset: 'portals.yml', example: 'templates/portals.example.yml' },
]

/**
 * Blocks that are SUPPOSED to differ between presets — the whole point of a
 * preset. Kept in step with TARGETING_BLOCKS in preset.mjs.
 */
const TARGETING_BLOCKS = new Set(['target_roles', 'deal_breakers', 'job_preferences'])

/**
 * Keys whose absence from a preset is not drift. `title_filter` and
 * `tracked_companies` are targeting by nature; `candidate`-level optional
 * fields are the user's to leave blank.
 */
const SCHEMA_EXEMPT_PREFIXES = ['title_filter', 'tracked_companies', 'search_queries', 'location_filter', 'content_filter']

// ------------------------------------------------------------- key walking

/**
 * Flatten an object into dotted key paths. Arrays are recorded as a single
 * leaf: their CONTENTS are user data (which companies, which keywords), not
 * schema, and comparing them would report every targeting difference as drift.
 */
function keyPaths(value, prefix = '', out = new Set()) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    if (prefix) out.add(prefix)
    return out
  }
  for (const [k, v] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${k}` : k
    out.add(path)
    keyPaths(v, path, out)
  }
  return out
}

const isExempt = (path) => SCHEMA_EXEMPT_PREFIXES.some((p) => path === p || path.startsWith(`${p}.`))

/** Stable stringify so two parsed blocks can be compared for equality. */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(',')}}`
  }
  return JSON.stringify(value ?? null)
}

// -------------------------------------------------------------- the checks

function run(root) {
  const presetsDir = join(root, 'presets')
  const report = { presets: [], errors: [], warnings: [], activePreset: null }

  if (!fs.existsSync(presetsDir)) {
    report.errors.push({ check: 'setup', message: 'presets/ does not exist — run: node preset.mjs save mix' })
    return report
  }

  const activeFile = join(presetsDir, '_active')
  report.activePreset = fs.existsSync(activeFile) ? fs.readFileSync(activeFile, 'utf8').trim() || null : null
  if (!report.activePreset) {
    report.warnings.push({ check: 'setup', message: 'no active preset recorded in presets/_active' })
  }

  const names = fs
    .readdirSync(presetsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name)
    .sort()

  // 1. parse + 2. schema
  const parsed = new Map() // name -> { 'profile.yml': doc, 'portals.yml': doc }
  for (const name of names) {
    const entry = { name, files: [] }
    const docs = {}
    for (const src of SCHEMA_SOURCES) {
      const file = join(presetsDir, name, src.preset)
      const fileEntry = { file: src.preset, parsed: false, missingKeys: [], unknownKeys: [] }
      if (!fs.existsSync(file)) {
        report.errors.push({ check: 'parse', preset: name, file: src.preset, message: 'file missing from preset' })
        entry.files.push(fileEntry)
        continue
      }
      let doc
      try {
        doc = yaml.load(fs.readFileSync(file, 'utf8'))
        fileEntry.parsed = true
      } catch (e) {
        report.errors.push({ check: 'parse', preset: name, file: src.preset, message: e.message.split('\n')[0] })
        entry.files.push(fileEntry)
        continue
      }
      docs[src.preset] = doc

      const examplePath = join(root, src.example)
      if (!fs.existsSync(examplePath)) {
        report.warnings.push({ check: 'schema', file: src.example, message: 'example file not found — schema check skipped' })
        entry.files.push(fileEntry)
        continue
      }
      let example
      try {
        example = yaml.load(fs.readFileSync(examplePath, 'utf8'))
      } catch (e) {
        report.warnings.push({ check: 'schema', file: src.example, message: `example unparseable: ${e.message.split('\n')[0]}` })
        entry.files.push(fileEntry)
        continue
      }

      const have = keyPaths(doc)
      const want = keyPaths(example)
      fileEntry.missingKeys = [...want].filter((k) => !have.has(k) && !isExempt(k)).sort()
      fileEntry.unknownKeys = [...have].filter((k) => !want.has(k) && !isExempt(k)).sort()
      entry.files.push(fileEntry)
    }
    parsed.set(name, docs)
    report.presets.push(entry)
  }

  // 2b. classify schema gaps.
  //
  // Missing from EVERY preset means the user's own config predates that upstream
  // key — a heads-up, not a broken preset, and often a genuinely optional field
  // (a photo, a second messenger handle). Missing from only SOME presets is the
  // dangerous case: switching to the stale one silently reverts the schema.
  for (const src of SCHEMA_SOURCES) {
    const withFile = report.presets.filter((p) => p.files.some((f) => f.file === src.preset && f.parsed))
    if (!withFile.length) continue
    const missingBy = new Map() // key -> [preset names]
    for (const p of withFile) {
      for (const k of p.files.find((f) => f.file === src.preset).missingKeys) {
        missingBy.set(k, [...(missingBy.get(k) ?? []), p.name])
      }
    }
    for (const [key, presets] of missingBy) {
      if (presets.length === withFile.length) {
        report.warnings.push({
          check: 'schema',
          file: src.preset,
          key,
          message: `"${key}" exists in ${src.example} but in none of your presets — your config predates this upstream key; add it if you want the feature`,
        })
      } else {
        for (const preset of presets) {
          report.errors.push({
            check: 'schema',
            preset,
            file: src.preset,
            key,
            message: `"${key}" is present in other presets but missing here — switching to this preset would roll the canonical file back`,
          })
        }
      }
    }
  }

  // 3. identity drift across presets
  const profiles = [...parsed.entries()].filter(([, d]) => d['profile.yml']).map(([n, d]) => [n, d['profile.yml']])
  if (profiles.length > 1) {
    const [refName, refDoc] = profiles[0]
    const identityKeys = Object.keys(refDoc).filter((k) => !TARGETING_BLOCKS.has(k))
    for (const [name, doc] of profiles.slice(1)) {
      for (const k of identityKeys) {
        if (canonical(doc[k]) !== canonical(refDoc[k])) {
          report.errors.push({
            check: 'identity',
            preset: name,
            key: k,
            message: `"${k}" differs from preset "${refName}" but is not a targeting block — run: node preset.mjs sync-identity`,
          })
        }
      }
      for (const k of Object.keys(doc)) {
        if (!TARGETING_BLOCKS.has(k) && !identityKeys.includes(k)) {
          report.warnings.push({ check: 'identity', preset: name, key: k, message: `block "${k}" exists here but not in "${refName}"` })
        }
      }
    }
  }

  return report
}

// ----------------------------------------------------------------- render

function summarize(r) {
  const lines = []
  lines.push(`Active preset: ${r.activePreset ?? '(none)'}`)
  lines.push('')
  lines.push('PRESET                    PROFILE   PORTALS   MISSING KEYS')
  for (const p of r.presets) {
    const f = (n) => p.files.find((x) => x.file === n)
    const mark = (x) => (!x ? '   ?   ' : x.parsed ? '  ok   ' : ' PARSE!')
    const missing = p.files.flatMap((x) => x.missingKeys)
    lines.push(
      `${p.name.padEnd(24)}  ${mark(f('profile.yml'))}   ${mark(f('portals.yml'))}   ${missing.length ? missing.join(', ') : '—'}`,
    )
  }
  if (r.errors.length) {
    lines.push('')
    lines.push(`ERRORS (${r.errors.length}):`)
    for (const e of r.errors) lines.push(`  [${e.check}] ${e.preset ?? ''}${e.key ? ` ${e.key}` : ''} — ${e.message}`)
  }
  if (r.warnings.length) {
    lines.push('')
    lines.push(`WARNINGS (${r.warnings.length}):`)
    for (const w of r.warnings) lines.push(`  [${w.check}] ${w.preset ?? w.file ?? ''} — ${w.message}`)
  }
  lines.push('')
  lines.push(r.errors.length ? '🔴 Presets need attention before switching.' : '✅ Presets are consistent with the current schema.')
  return lines.join('\n')
}

// -------------------------------------------------------------- self-test

function selfTest() {
  const tmp = fs.mkdtempSync(join(os.tmpdir(), 'preset-doctor-'))
  const results = []
  const check = (name, fn) => {
    try {
      fn()
      results.push({ name, ok: true })
    } catch (e) {
      results.push({ name, ok: false, error: e.message })
    }
  }
  const assert = (c, m) => {
    if (!c) throw new Error(m)
  }

  fs.mkdirSync(join(tmp, 'config'), { recursive: true })
  fs.mkdirSync(join(tmp, 'templates'), { recursive: true })
  fs.writeFileSync(
    join(tmp, 'config/profile.example.yml'),
    'candidate:\n  full_name: ""\n  email: ""\ncompensation:\n  target_range: ""\ntarget_roles:\n  primary: []\n',
  )
  fs.writeFileSync(join(tmp, 'templates/portals.example.yml'), 'title_filter:\n  positive: []\n')

  const writePreset = (name, profile) => {
    fs.mkdirSync(join(tmp, 'presets', name), { recursive: true })
    fs.writeFileSync(join(tmp, 'presets', name, 'profile.yml'), profile)
    fs.writeFileSync(join(tmp, 'presets', name, 'portals.yml'), 'title_filter:\n  positive:\n    - Backend\n')
    fs.writeFileSync(join(tmp, 'presets', name, '_profile.md'), `# ${name}\n`)
  }
  const GOOD = 'candidate:\n  full_name: "Rikky"\n  email: "r@example.com"\ncompensation:\n  target_range: "$50K"\ntarget_roles:\n  primary: ["A"]\n'
  writePreset('mix', GOOD)
  writePreset('dotnet', GOOD.replace('["A"]', '["B"]')) // targeting differs — legitimate
  fs.writeFileSync(join(tmp, 'presets', '_active'), 'mix\n')

  check('clean setup reports no errors', () => {
    const r = run(tmp)
    assert(r.errors.length === 0, `expected clean, got: ${JSON.stringify(r.errors)}`)
    assert(r.activePreset === 'mix', 'active preset not detected')
  })

  check('a key missing from EVERY preset is a warning, not an error', () => {
    fs.appendFileSync(join(tmp, 'config/profile.example.yml'), 'new_upstream_block:\n  some_key: ""\n')
    const r = run(tmp)
    assert(r.errors.filter((e) => e.check === 'schema').length === 0, 'config-behind-upstream wrongly escalated to an error')
    const warned = r.warnings.filter((w) => w.check === 'schema').map((w) => w.key)
    assert(warned.includes('new_upstream_block'), `upstream key not surfaced: ${JSON.stringify(warned)}`)
    assert(warned.includes('new_upstream_block.some_key'), 'nested upstream key not surfaced')
    assert(warned.filter((k) => k === 'new_upstream_block').length === 1, 'warning reported once per preset instead of once overall')
  })

  check('a key missing from only SOME presets is an error', () => {
    // adopt the new block in mix only — dotnet is now the stale one
    const mixPath = join(tmp, 'presets', 'mix', 'profile.yml')
    fs.writeFileSync(mixPath, `${fs.readFileSync(mixPath, 'utf8')}new_upstream_block:\n  some_key: "on"\n`)
    const r = run(tmp)
    const stale = r.errors.filter((e) => e.check === 'schema')
    assert(stale.length > 0, 'stale preset not flagged')
    assert(stale.every((e) => e.preset === 'dotnet'), `wrong preset flagged: ${JSON.stringify(stale.map((e) => e.preset))}`)
    fs.writeFileSync(mixPath, GOOD) // restore for later checks
    fs.writeFileSync(
      join(tmp, 'config/profile.example.yml'),
      'candidate:\n  full_name: ""\n  email: ""\ncompensation:\n  target_range: ""\ntarget_roles:\n  primary: []\n',
    )
  })

  check('identity drift is an error, targeting difference is not', () => {
    // restore schema parity so only the identity check can fire
    fs.writeFileSync(
      join(tmp, 'config/profile.example.yml'),
      'candidate:\n  full_name: ""\n  email: ""\ncompensation:\n  target_range: ""\ntarget_roles:\n  primary: []\n',
    )
    let r = run(tmp)
    assert(r.errors.length === 0, `targeting difference wrongly flagged: ${JSON.stringify(r.errors)}`)

    const p = join(tmp, 'presets', 'dotnet', 'profile.yml')
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('r@example.com', 'stale@example.com'))
    r = run(tmp)
    const drift = r.errors.filter((e) => e.check === 'identity')
    assert(drift.length === 1 && drift[0].key === 'candidate', `identity drift not caught: ${JSON.stringify(r.errors)}`)
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('stale@example.com', 'r@example.com'))
  })

  check('unparseable preset is an error, not a crash', () => {
    const p = join(tmp, 'presets', 'dotnet', 'profile.yml')
    const good = fs.readFileSync(p, 'utf8')
    fs.writeFileSync(p, 'candidate:\n  full_name: "x"\n   bad_indent: y\n')
    const r = run(tmp)
    assert(r.errors.some((e) => e.check === 'parse' && e.preset === 'dotnet'), 'parse error not reported')
    fs.writeFileSync(p, good)
  })

  check('missing presets/ is reported, not thrown', () => {
    const empty = fs.mkdtempSync(join(os.tmpdir(), 'preset-doctor-empty-'))
    const r = run(empty)
    assert(r.errors.some((e) => e.check === 'setup'), 'missing presets/ not reported')
    fs.rmSync(empty, { recursive: true, force: true })
  })

  fs.rmSync(tmp, { recursive: true, force: true })
  const failed = results.filter((r) => !r.ok)
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : ` — ${r.error}`}`)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  process.exit(failed.length ? 1 : 0)
}

// -------------------------------------------------------------------- cli

const argv = process.argv.slice(2)
if (argv.includes('--self-test')) selfTest()

const report = run(SCRIPT_ROOT)
console.log(argv.includes('--summary') ? summarize(report) : JSON.stringify(report, null, 2))
process.exit(report.errors.length ? 1 : 0)
