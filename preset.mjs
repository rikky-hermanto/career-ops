#!/usr/bin/env node
/**
 * preset.mjs — targeting presets for career-ops.
 *
 * A preset is a full snapshot of the three TARGETING files:
 *   presets/<name>/profile.yml   ->  config/profile.yml
 *   presets/<name>/portals.yml   ->  portals.yml
 *   presets/<name>/_profile.md   ->  modes/_profile.md
 *
 * `cv.md`, `article-digest.md`, `data/`, `reports/`, `interview-prep/` and
 * `modes/_custom.md` are NOT part of any preset: they hold facts and history,
 * which are the same whichever track you are searching on. A preset changes
 * what you look for and how you are framed — never what is true about you.
 *
 * Commands:
 *   node preset.mjs list                     show presets, mark the active one
 *   node preset.mjs current                  print the active preset name
 *   node preset.mjs use <name>               switch (auto-saves the active one first)
 *   node preset.mjs save [name]              snapshot canonical files into a preset
 *   node preset.mjs new <name> --from <src>  fork a preset
 *   node preset.mjs diff <a> <b>             line diff of two presets
 *   node preset.mjs sync-identity            push non-targeting profile.yml blocks
 *                                            from the active preset to all others
 *   node preset.mjs --self-test              run the built-in test suite
 *
 * Add --json to any command for machine-readable output.
 */

import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

const SCRIPT_ROOT = dirname(fileURLToPath(import.meta.url))

/** The three files a preset owns, preset-side name -> repo-relative canonical path. */
const FILES = [
  { preset: 'profile.yml', canonical: 'config/profile.yml' },
  { preset: 'portals.yml', canonical: 'portals.yml' },
  { preset: '_profile.md', canonical: 'modes/_profile.md' },
]

/**
 * Top-level profile.yml blocks that are the WHOLE POINT of a preset — never
 * synced between presets. Everything else (candidate, location, experience,
 * skills, narrative, comp, ...) is identity and is kept in step by
 * `sync-identity`, including blocks added to profile.yml in the future.
 */
const TARGETING_BLOCKS = new Set(['target_roles', 'deal_breakers', 'job_preferences'])

const ctx = (root) => ({
  root,
  presetsDir: join(root, 'presets'),
  activeFile: join(root, 'presets', '_active'),
})

// ---------------------------------------------------------------- helpers

const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory()

function listPresets(c) {
  if (!isDir(c.presetsDir)) return []
  return fs
    .readdirSync(c.presetsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name)
    .sort()
}

function readActive(c) {
  if (!fs.existsSync(c.activeFile)) return null
  const v = fs.readFileSync(c.activeFile, 'utf8').trim()
  return v || null
}

const writeActive = (c, name) => fs.writeFileSync(c.activeFile, `${name}\n`, 'utf8')

/** Missing preset-side files, so an incomplete preset can never be switched to. */
function missingFiles(c, name) {
  return FILES.filter((f) => !fs.existsSync(join(c.presetsDir, name, f.preset))).map((f) => f.preset)
}

function assertPreset(c, name) {
  if (!name) fail('preset name required')
  if (!isDir(join(c.presetsDir, name))) {
    fail(`unknown preset "${name}" — have: ${listPresets(c).join(', ') || '(none)'}`)
  }
  const missing = missingFiles(c, name)
  if (missing.length) fail(`preset "${name}" is incomplete — missing ${missing.join(', ')}`)
}

const sameBytes = (a, b) =>
  fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b))

/** Copy canonical -> preset. Byte-for-byte: no YAML parse, no re-encoding. */
function snapshot(c, name) {
  const changed = []
  fs.mkdirSync(join(c.presetsDir, name), { recursive: true })
  for (const f of FILES) {
    const from = join(c.root, f.canonical)
    const to = join(c.presetsDir, name, f.preset)
    if (!fs.existsSync(from)) continue
    if (sameBytes(from, to)) continue
    fs.copyFileSync(from, to)
    changed.push(f.canonical)
  }
  return changed
}

/** Copy preset -> canonical. */
function restore(c, name) {
  const changed = []
  for (const f of FILES) {
    const from = join(c.presetsDir, name, f.preset)
    const to = join(c.root, f.canonical)
    if (sameBytes(from, to)) continue
    fs.mkdirSync(dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    changed.push(f.canonical)
  }
  return changed
}

// ------------------------------------------------- YAML top-level blocks

/**
 * Split a YAML document into ordered top-level blocks by column-0 `key:` lines.
 * A contiguous run of comment lines immediately above a key belongs to that
 * key's block, so comments travel with the block they document. The walk stops
 * at a blank line — that is what keeps a file's top header in the preamble
 * instead of being swallowed by the first key.
 * Returns { preamble, blocks: [{key, text}] }.
 */
function splitTopLevel(text) {
  const lines = text.split(/\r?\n/)
  const keyAt = /^([A-Za-z_][\w-]*):/
  const starts = []
  for (let i = 0; i < lines.length; i++) {
    if (!keyAt.test(lines[i])) continue
    let s = i
    while (s > 0 && /^\s*#/.test(lines[s - 1])) s--
    if (starts.length && s <= starts[starts.length - 1].start) s = i
    starts.push({ start: s, key: lines[i].match(keyAt)[1] })
  }
  if (!starts.length) return { preamble: text, blocks: [] }
  const preamble = lines.slice(0, starts[0].start).join('\n')
  const blocks = starts.map((sec, i) => ({
    key: sec.key,
    text: lines.slice(sec.start, i + 1 < starts.length ? starts[i + 1].start : lines.length).join('\n'),
  }))
  return { preamble, blocks }
}

const joinTopLevel = ({ preamble, blocks }) =>
  (preamble ? `${preamble}\n` : '') + blocks.map((b) => b.text).join('\n')

/**
 * Overwrite target's non-targeting blocks with source's, keeping source order.
 * Works on LF internally and restores the target's own line endings, so a sync
 * that changes nothing really writes nothing (these files are CRLF on Windows).
 */
function mergeIdentity(sourceText, targetText) {
  const crlf = targetText.includes('\r\n')
  const src = splitTopLevel(sourceText.replace(/\r\n/g, '\n'))
  const tgt = splitTopLevel(targetText.replace(/\r\n/g, '\n'))
  const tgtByKey = new Map(tgt.blocks.map((b) => [b.key, b]))
  const used = new Set()
  const out = []
  for (const b of src.blocks) {
    used.add(b.key)
    if (TARGETING_BLOCKS.has(b.key)) {
      out.push(tgtByKey.get(b.key) ?? b) // keep the preset's own targeting
    } else {
      out.push(b)
    }
  }
  for (const b of tgt.blocks) if (!used.has(b.key)) out.push(b) // target-only extras
  const merged = joinTopLevel({ preamble: tgt.preamble, blocks: out }) // target keeps its own header
  return crlf ? merged.replace(/\n/g, '\r\n') : merged
}

// ------------------------------------------------------------------ diff

/** Minimal LCS line diff -> array of {op: ' '|'-'|'+', line}. */
function diffLines(aText, bText) {
  const a = aText.split(/\r?\n/)
  const b = bText.split(/\r?\n/)
  const n = a.length
  const m = b.length
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }
  const out = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) out.push({ op: ' ', line: a[i++] }), j++
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) out.push({ op: '-', line: a[i++] })
    else out.push({ op: '+', line: b[j++] })
  }
  while (i < n) out.push({ op: '-', line: a[i++] })
  while (j < m) out.push({ op: '+', line: b[j++] })
  return out
}

// -------------------------------------------------------------- commands

function cmdList(c) {
  const active = readActive(c)
  return {
    active,
    presets: listPresets(c).map((name) => ({
      name,
      active: name === active,
      complete: missingFiles(c, name).length === 0,
      inSync: FILES.every((f) => sameBytes(join(c.presetsDir, name, f.preset), join(c.root, f.canonical))),
    })),
  }
}

function cmdUse(c, name) {
  assertPreset(c, name)
  const active = readActive(c)
  let autoSaved = []
  if (active && active !== name && isDir(join(c.presetsDir, active))) {
    autoSaved = snapshot(c, active) // never lose edits made while `active` was on
  }
  const changed = restore(c, name)
  writeActive(c, name)
  return { active: name, previous: active, autoSaved, changed }
}

function cmdSave(c, name) {
  const target = name || readActive(c)
  if (!target) fail('no active preset — pass a name: node preset.mjs save <name>')
  const changed = snapshot(c, target)
  return { saved: target, changed }
}

function cmdNew(c, name, from) {
  if (!name) fail('usage: node preset.mjs new <name> --from <source>')
  if (isDir(join(c.presetsDir, name))) fail(`preset "${name}" already exists`)
  const src = from || readActive(c)
  if (!src) fail('no source preset — pass --from <name>')
  assertPreset(c, src)
  fs.mkdirSync(join(c.presetsDir, name), { recursive: true })
  for (const f of FILES) {
    fs.copyFileSync(join(c.presetsDir, src, f.preset), join(c.presetsDir, name, f.preset))
  }
  return { created: name, from: src }
}

function cmdDiff(c, a, b) {
  assertPreset(c, a)
  assertPreset(c, b)
  return {
    a,
    b,
    files: FILES.map((f) => {
      const d = diffLines(
        fs.readFileSync(join(c.presetsDir, a, f.preset), 'utf8'),
        fs.readFileSync(join(c.presetsDir, b, f.preset), 'utf8'),
      )
      return {
        file: f.preset,
        removed: d.filter((x) => x.op === '-').map((x) => x.line),
        added: d.filter((x) => x.op === '+').map((x) => x.line),
      }
    }),
  }
}

function cmdSyncIdentity(c, sourceName) {
  const source = sourceName || readActive(c)
  if (!source) fail('no active preset — pass a source: node preset.mjs sync-identity <name>')
  assertPreset(c, source)
  const srcText = fs.readFileSync(join(c.presetsDir, source, 'profile.yml'), 'utf8')
  const updated = []
  for (const name of listPresets(c)) {
    if (name === source) continue
    const p = join(c.presetsDir, name, 'profile.yml')
    if (!fs.existsSync(p)) continue
    const before = fs.readFileSync(p, 'utf8')
    const after = mergeIdentity(srcText, before)
    if (after !== before) {
      fs.writeFileSync(p, after, 'utf8')
      updated.push(name)
    }
  }
  // Keep the canonical file in step when the source is the active preset.
  if (source === readActive(c)) restore(c, source)
  return { source, updated, unchanged: listPresets(c).filter((n) => n !== source && !updated.includes(n)) }
}

// ----------------------------------------------------------- self-test

function selfTest() {
  const tmp = fs.mkdtempSync(join(os.tmpdir(), 'preset-test-'))
  const c = ctx(tmp)
  const results = []
  const check = (name, fn) => {
    try {
      fn()
      results.push({ name, ok: true })
    } catch (e) {
      results.push({ name, ok: false, error: e.message })
    }
  }
  const assert = (cond, msg) => {
    if (!cond) throw new Error(msg)
  }

  // scaffold: two presets with distinct content
  fs.mkdirSync(join(tmp, 'config'), { recursive: true })
  fs.mkdirSync(join(tmp, 'modes'), { recursive: true })
  const mk = (name, tag) => {
    fs.mkdirSync(join(c.presetsDir, name), { recursive: true })
    fs.writeFileSync(
      join(c.presetsDir, name, 'profile.yml'),
      `# header ${name}\n\ncandidate:\n  name: "Rikky"\n\ntarget_roles:\n  primary:\n    - "${tag}"\n\nskills:\n  primary: ["C#"]\n`,
    )
    fs.writeFileSync(join(c.presetsDir, name, 'portals.yml'), `title_filter:\n  positive:\n    - ${tag}\n`)
    fs.writeFileSync(join(c.presetsDir, name, '_profile.md'), `# ${name}\n\nframing: ${tag}\n`)
  }
  mk('alpha', 'Alpha Role')
  mk('beta', 'Beta Role')
  writeActive(c, 'alpha')
  restore(c, 'alpha')

  const snapshotOf = () => FILES.map((f) => fs.readFileSync(join(tmp, f.canonical)))

  check('use round-trip is byte-identical', () => {
    const before = snapshotOf()
    cmdUse(c, 'beta')
    cmdUse(c, 'alpha')
    const after = snapshotOf()
    before.forEach((buf, i) => assert(buf.equals(after[i]), `${FILES[i].canonical} changed across A->B->A`))
    assert(readActive(c) === 'alpha', 'active preset not restored')
  })

  check('use auto-saves edits made under the previous preset', () => {
    fs.appendFileSync(join(tmp, 'portals.yml'), '    - Edited While Alpha\n')
    cmdUse(c, 'beta')
    const saved = fs.readFileSync(join(c.presetsDir, 'alpha', 'portals.yml'), 'utf8')
    assert(saved.includes('Edited While Alpha'), 'edit was lost instead of auto-saved into alpha')
    const live = fs.readFileSync(join(tmp, 'portals.yml'), 'utf8')
    assert(!live.includes('Edited While Alpha'), 'beta did not overwrite the canonical file')
    cmdUse(c, 'alpha')
  })

  check('save is idempotent', () => {
    const first = cmdSave(c, 'alpha')
    const second = cmdSave(c, 'alpha')
    assert(first.changed.length === 0 || true, 'unreachable')
    assert(second.changed.length === 0, 'second save reported changes when nothing changed')
  })

  check('sync-identity replaces identity blocks and preserves targeting', () => {
    const alphaPath = join(c.presetsDir, 'alpha', 'profile.yml')
    fs.writeFileSync(alphaPath, fs.readFileSync(alphaPath, 'utf8').replace('"Rikky"', '"Rikky Updated"'))
    cmdSyncIdentity(c, 'alpha')
    const beta = fs.readFileSync(join(c.presetsDir, 'beta', 'profile.yml'), 'utf8')
    assert(beta.includes('"Rikky Updated"'), 'identity block was not propagated')
    assert(beta.includes('Beta Role'), 'targeting block was overwritten — must never happen')
    assert(!beta.includes('Alpha Role'), 'source targeting leaked into target preset')
    assert(beta.startsWith('# header beta'), 'target preset lost its own header')
  })

  check('sync-identity is a no-op the second time, and keeps CRLF intact', () => {
    const betaPath = join(c.presetsDir, 'beta', 'profile.yml')
    fs.writeFileSync(betaPath, fs.readFileSync(betaPath, 'utf8').replace(/\n/g, '\r\n')) // CRLF, as on Windows
    cmdSyncIdentity(c, 'alpha')
    const after = fs.readFileSync(betaPath)
    assert(after.includes('\r\n'), 'CRLF line endings were rewritten to LF')
    const second = cmdSyncIdentity(c, 'alpha')
    assert(second.updated.length === 0, `second sync rewrote ${second.updated.join(', ')} — must be a no-op`)
    assert(fs.readFileSync(betaPath).equals(after), 'second sync changed bytes')
  })

  check('unknown and incomplete presets are refused', () => {
    let threw = false
    try {
      assertPreset(c, 'nope')
    } catch {
      threw = true
    }
    assert(threw, 'unknown preset was accepted')
    fs.mkdirSync(join(c.presetsDir, 'partial'), { recursive: true })
    fs.writeFileSync(join(c.presetsDir, 'partial', 'profile.yml'), 'candidate:\n')
    threw = false
    try {
      assertPreset(c, 'partial')
    } catch {
      threw = true
    }
    assert(threw, 'incomplete preset was accepted')
    fs.rmSync(join(c.presetsDir, 'partial'), { recursive: true, force: true })
  })

  check('diff reports the targeting delta', () => {
    const d = cmdDiff(c, 'alpha', 'beta')
    const portals = d.files.find((f) => f.file === 'portals.yml')
    assert(portals.removed.some((l) => l.includes('Alpha Role')), 'diff missed removed line')
    assert(portals.added.some((l) => l.includes('Beta Role')), 'diff missed added line')
  })

  fs.rmSync(tmp, { recursive: true, force: true })
  const failed = results.filter((r) => !r.ok)
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : ` — ${r.error}`}`)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  process.exit(failed.length ? 1 : 0)
}

// ------------------------------------------------------------------ cli

/** Throws rather than exits, so the self-test can assert on refusals. */
function fail(msg) {
  throw new Error(msg)
}

function render(cmd, r) {
  if (cmd === 'list') {
    if (!r.presets.length) return 'No presets yet.'
    return r.presets
      .map((p) => {
        const flags = [p.active ? 'ACTIVE' : null, p.complete ? null : 'INCOMPLETE', p.active && !p.inSync ? 'unsaved edits' : null]
          .filter(Boolean)
          .join(', ')
        return `${p.active ? '*' : ' '} ${p.name}${flags ? `   (${flags})` : ''}`
      })
      .join('\n')
  }
  if (cmd === 'current') return r.active || '(none)'
  if (cmd === 'use') {
    const lines = [`Active preset: ${r.active}${r.previous ? ` (was: ${r.previous})` : ''}`]
    if (r.autoSaved.length) lines.push(`Auto-saved into "${r.previous}": ${r.autoSaved.join(', ')}`)
    lines.push(r.changed.length ? `Updated: ${r.changed.join(', ')}` : 'Canonical files already matched this preset.')
    return lines.join('\n')
  }
  if (cmd === 'save') {
    return r.changed.length ? `Saved into "${r.saved}": ${r.changed.join(', ')}` : `"${r.saved}" already up to date.`
  }
  if (cmd === 'new') return `Created preset "${r.created}" from "${r.from}".`
  if (cmd === 'diff') {
    return r.files
      .map((f) => {
        if (!f.removed.length && !f.added.length) return `--- ${f.file}: identical`
        return [
          `--- ${f.file}`,
          ...f.removed.map((l) => `- ${l}`),
          ...f.added.map((l) => `+ ${l}`),
        ].join('\n')
      })
      .join('\n\n')
  }
  if (cmd === 'sync-identity') {
    return [
      `Identity synced from "${r.source}".`,
      r.updated.length ? `Updated: ${r.updated.join(', ')}` : 'All presets already in sync.',
    ].join('\n')
  }
  return JSON.stringify(r, null, 2)
}

const argv = process.argv.slice(2)
if (argv.includes('--self-test')) selfTest()

const json = argv.includes('--json')
const positional = argv.filter((a) => !a.startsWith('--'))
const flagValue = (name) => {
  const i = argv.indexOf(`--${name}`)
  if (i !== -1 && argv[i + 1]) return argv[i + 1]
  const inline = argv.find((a) => a.startsWith(`--${name}=`))
  return inline ? inline.slice(name.length + 3) : null
}

const c = ctx(resolve(SCRIPT_ROOT))
const cmd = positional[0] || 'list'

try {
  let result
  switch (cmd) {
    case 'list':
      result = cmdList(c)
      break
    case 'current':
      result = { active: readActive(c) }
      break
    case 'use':
      result = cmdUse(c, positional[1])
      break
    case 'save':
      result = cmdSave(c, positional[1])
      break
    case 'new':
      result = cmdNew(c, positional[1], flagValue('from') || positional[2])
      break
    case 'diff':
      result = cmdDiff(c, positional[1], positional[2])
      break
    case 'sync-identity':
      result = cmdSyncIdentity(c, positional[1])
      break
    default:
      fail(`unknown command "${cmd}" — use list | current | use | save | new | diff | sync-identity`)
  }
  console.log(json ? JSON.stringify(result, null, 2) : render(cmd, result))
} catch (e) {
  console.error(`preset: ${e.message}`)
  process.exit(1)
}
