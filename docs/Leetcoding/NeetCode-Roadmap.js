#!/usr/bin/env node
// Builds NeetCode-Roadmap.html — a self-contained, offline NeetCode 150 roadmap.
// Problem data is baked in below (sourced from neetcode-gh/leetcode's own
// .problemSiteData.json, filtered to neetcode150: true) — no external file needed.
// Progress ticks are stored in the browser's localStorage.
//
// Usage: node NeetCode-Roadmap.js

const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

const OUT_PATH = join(__dirname, 'NeetCode-Roadmap.html');

// ------------------------------------------------------------------ data

const PROBLEMS = [
  { cat: "Arrays & Hashing", num: 1, name: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", diff: "Easy" },
  { cat: "Arrays & Hashing", num: 2, name: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", diff: "Easy" },
  { cat: "Arrays & Hashing", num: 3, name: "Two Sum", url: "https://leetcode.com/problems/two-sum/", diff: "Easy" },
  { cat: "Arrays & Hashing", num: 4, name: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", diff: "Medium" },
  { cat: "Arrays & Hashing", num: 5, name: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", diff: "Medium" },
  { cat: "Arrays & Hashing", num: 6, name: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", diff: "Medium" },
  { cat: "Arrays & Hashing", num: 7, name: "Valid Sudoku", url: "https://leetcode.com/problems/valid-sudoku/", diff: "Medium" },
  { cat: "Arrays & Hashing", num: 8, name: "Encode and Decode Strings", url: "https://leetcode.com/problems/encode-and-decode-strings/", diff: "Medium" },
  { cat: "Arrays & Hashing", num: 9, name: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", diff: "Medium" },
  { cat: "Two Pointers", num: 1, name: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", diff: "Easy" },
  { cat: "Two Pointers", num: 2, name: "Two Sum II Input Array Is Sorted", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", diff: "Medium" },
  { cat: "Two Pointers", num: 3, name: "3Sum", url: "https://leetcode.com/problems/3sum/", diff: "Medium" },
  { cat: "Two Pointers", num: 4, name: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", diff: "Medium" },
  { cat: "Two Pointers", num: 5, name: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", diff: "Hard" },
  { cat: "Sliding Window", num: 1, name: "Best Time to Buy And Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", diff: "Easy" },
  { cat: "Sliding Window", num: 2, name: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", diff: "Medium" },
  { cat: "Sliding Window", num: 3, name: "Longest Repeating Character Replacement", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", diff: "Medium" },
  { cat: "Sliding Window", num: 4, name: "Permutation In String", url: "https://leetcode.com/problems/permutation-in-string/", diff: "Medium" },
  { cat: "Sliding Window", num: 5, name: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", diff: "Hard" },
  { cat: "Sliding Window", num: 6, name: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/", diff: "Hard" },
  { cat: "Stack", num: 1, name: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", diff: "Easy" },
  { cat: "Stack", num: 2, name: "Min Stack", url: "https://leetcode.com/problems/min-stack/", diff: "Medium" },
  { cat: "Stack", num: 3, name: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", diff: "Medium" },
  { cat: "Stack", num: 4, name: "Generate Parentheses", url: "https://leetcode.com/problems/generate-parentheses/", diff: "Medium" },
  { cat: "Stack", num: 5, name: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", diff: "Medium" },
  { cat: "Stack", num: 6, name: "Car Fleet", url: "https://leetcode.com/problems/car-fleet/", diff: "Medium" },
  { cat: "Stack", num: 7, name: "Largest Rectangle In Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", diff: "Hard" },
  { cat: "Binary Search", num: 1, name: "Binary Search", url: "https://leetcode.com/problems/binary-search/", diff: "Easy" },
  { cat: "Binary Search", num: 2, name: "Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix/", diff: "Medium" },
  { cat: "Binary Search", num: 3, name: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", diff: "Medium" },
  { cat: "Binary Search", num: 4, name: "Find Minimum In Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", diff: "Medium" },
  { cat: "Binary Search", num: 5, name: "Search In Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", diff: "Medium" },
  { cat: "Binary Search", num: 6, name: "Time Based Key Value Store", url: "https://leetcode.com/problems/time-based-key-value-store/", diff: "Medium" },
  { cat: "Binary Search", num: 7, name: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", diff: "Hard" },
  { cat: "Linked List", num: 1, name: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", diff: "Easy" },
  { cat: "Linked List", num: 2, name: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", diff: "Easy" },
  { cat: "Linked List", num: 3, name: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", diff: "Easy" },
  { cat: "Linked List", num: 4, name: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", diff: "Medium" },
  { cat: "Linked List", num: 5, name: "Remove Nth Node From End of List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", diff: "Medium" },
  { cat: "Linked List", num: 6, name: "Copy List With Random Pointer", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", diff: "Medium" },
  { cat: "Linked List", num: 7, name: "Add Two Numbers", url: "https://leetcode.com/problems/add-two-numbers/", diff: "Medium" },
  { cat: "Linked List", num: 8, name: "Find The Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/", diff: "Medium" },
  { cat: "Linked List", num: 9, name: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", diff: "Medium" },
  { cat: "Linked List", num: 10, name: "Merge K Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", diff: "Hard" },
  { cat: "Linked List", num: 11, name: "Reverse Nodes In K Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", diff: "Hard" },
  { cat: "Trees", num: 1, name: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", diff: "Easy" },
  { cat: "Trees", num: 2, name: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", diff: "Easy" },
  { cat: "Trees", num: 3, name: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", diff: "Easy" },
  { cat: "Trees", num: 4, name: "Balanced Binary Tree", url: "https://leetcode.com/problems/balanced-binary-tree/", diff: "Easy" },
  { cat: "Trees", num: 5, name: "Same Tree", url: "https://leetcode.com/problems/same-tree/", diff: "Easy" },
  { cat: "Trees", num: 6, name: "Subtree of Another Tree", url: "https://leetcode.com/problems/subtree-of-another-tree/", diff: "Easy" },
  { cat: "Trees", num: 7, name: "Lowest Common Ancestor of a Binary Search Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", diff: "Medium" },
  { cat: "Trees", num: 8, name: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", diff: "Medium" },
  { cat: "Trees", num: 9, name: "Binary Tree Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view/", diff: "Medium" },
  { cat: "Trees", num: 10, name: "Count Good Nodes In Binary Tree", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/", diff: "Medium" },
  { cat: "Trees", num: 11, name: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", diff: "Medium" },
  { cat: "Trees", num: 12, name: "Kth Smallest Element In a Bst", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", diff: "Medium" },
  { cat: "Trees", num: 13, name: "Construct Binary Tree From Preorder And Inorder Traversal", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", diff: "Medium" },
  { cat: "Trees", num: 14, name: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", diff: "Hard" },
  { cat: "Trees", num: 15, name: "Serialize And Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", diff: "Hard" },
  { cat: "Tries", num: 1, name: "Implement Trie Prefix Tree", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", diff: "Medium" },
  { cat: "Tries", num: 2, name: "Design Add And Search Words Data Structure", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", diff: "Medium" },
  { cat: "Tries", num: 3, name: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", diff: "Hard" },
  { cat: "Heap / Priority Queue", num: 1, name: "Kth Largest Element In a Stream", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", diff: "Easy" },
  { cat: "Heap / Priority Queue", num: 2, name: "Last Stone Weight", url: "https://leetcode.com/problems/last-stone-weight/", diff: "Easy" },
  { cat: "Heap / Priority Queue", num: 3, name: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin/", diff: "Medium" },
  { cat: "Heap / Priority Queue", num: 4, name: "Kth Largest Element In An Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", diff: "Medium" },
  { cat: "Heap / Priority Queue", num: 5, name: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler/", diff: "Medium" },
  { cat: "Heap / Priority Queue", num: 6, name: "Design Twitter", url: "https://leetcode.com/problems/design-twitter/", diff: "Medium" },
  { cat: "Heap / Priority Queue", num: 7, name: "Find Median From Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", diff: "Hard" },
  { cat: "Backtracking", num: 1, name: "Subsets", url: "https://leetcode.com/problems/subsets/", diff: "Medium" },
  { cat: "Backtracking", num: 2, name: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", diff: "Medium" },
  { cat: "Backtracking", num: 3, name: "Permutations", url: "https://leetcode.com/problems/permutations/", diff: "Medium" },
  { cat: "Backtracking", num: 4, name: "Subsets II", url: "https://leetcode.com/problems/subsets-ii/", diff: "Medium" },
  { cat: "Backtracking", num: 5, name: "Combination Sum II", url: "https://leetcode.com/problems/combination-sum-ii/", diff: "Medium" },
  { cat: "Backtracking", num: 6, name: "Word Search", url: "https://leetcode.com/problems/word-search/", diff: "Medium" },
  { cat: "Backtracking", num: 7, name: "Palindrome Partitioning", url: "https://leetcode.com/problems/palindrome-partitioning/", diff: "Medium" },
  { cat: "Backtracking", num: 8, name: "Letter Combinations of a Phone Number", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", diff: "Medium" },
  { cat: "Backtracking", num: 9, name: "N Queens", url: "https://leetcode.com/problems/n-queens/", diff: "Hard" },
  { cat: "Graphs", num: 1, name: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", diff: "Medium" },
  { cat: "Graphs", num: 2, name: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", diff: "Medium" },
  { cat: "Graphs", num: 3, name: "Max Area of Island", url: "https://leetcode.com/problems/max-area-of-island/", diff: "Medium" },
  { cat: "Graphs", num: 4, name: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", diff: "Medium" },
  { cat: "Graphs", num: 5, name: "Surrounded Regions", url: "https://leetcode.com/problems/surrounded-regions/", diff: "Medium" },
  { cat: "Graphs", num: 6, name: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", diff: "Medium" },
  { cat: "Graphs", num: 7, name: "Walls And Gates", url: "https://leetcode.com/problems/walls-and-gates/", diff: "Medium" },
  { cat: "Graphs", num: 8, name: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", diff: "Medium" },
  { cat: "Graphs", num: 9, name: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/", diff: "Medium" },
  { cat: "Graphs", num: 10, name: "Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/", diff: "Medium" },
  { cat: "Graphs", num: 11, name: "Number of Connected Components In An Undirected Graph", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", diff: "Medium" },
  { cat: "Graphs", num: 12, name: "Graph Valid Tree", url: "https://leetcode.com/problems/graph-valid-tree/", diff: "Medium" },
  { cat: "Graphs", num: 13, name: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", diff: "Hard" },
  { cat: "Advanced Graphs", num: 1, name: "Min Cost to Connect All Points", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", diff: "Medium" },
  { cat: "Advanced Graphs", num: 2, name: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", diff: "Medium" },
  { cat: "Advanced Graphs", num: 3, name: "Cheapest Flights Within K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", diff: "Medium" },
  { cat: "Advanced Graphs", num: 4, name: "Reconstruct Itinerary", url: "https://leetcode.com/problems/reconstruct-itinerary/", diff: "Hard" },
  { cat: "Advanced Graphs", num: 5, name: "Swim In Rising Water", url: "https://leetcode.com/problems/swim-in-rising-water/", diff: "Hard" },
  { cat: "Advanced Graphs", num: 6, name: "Alien Dictionary", url: "https://leetcode.com/problems/alien-dictionary/", diff: "Hard" },
  { cat: "1-D Dynamic Programming", num: 1, name: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", diff: "Easy" },
  { cat: "1-D Dynamic Programming", num: 2, name: "Min Cost Climbing Stairs", url: "https://leetcode.com/problems/min-cost-climbing-stairs/", diff: "Easy" },
  { cat: "1-D Dynamic Programming", num: 3, name: "House Robber", url: "https://leetcode.com/problems/house-robber/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 4, name: "House Robber II", url: "https://leetcode.com/problems/house-robber-ii/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 5, name: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 6, name: "Palindromic Substrings", url: "https://leetcode.com/problems/palindromic-substrings/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 7, name: "Decode Ways", url: "https://leetcode.com/problems/decode-ways/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 8, name: "Coin Change", url: "https://leetcode.com/problems/coin-change/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 9, name: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 10, name: "Word Break", url: "https://leetcode.com/problems/word-break/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 11, name: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", diff: "Medium" },
  { cat: "1-D Dynamic Programming", num: 12, name: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 1, name: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 2, name: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 3, name: "Best Time to Buy And Sell Stock With Cooldown", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 4, name: "Coin Change II", url: "https://leetcode.com/problems/coin-change-ii/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 5, name: "Target Sum", url: "https://leetcode.com/problems/target-sum/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 6, name: "Interleaving String", url: "https://leetcode.com/problems/interleaving-string/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 7, name: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", diff: "Medium" },
  { cat: "2-D Dynamic Programming", num: 8, name: "Longest Increasing Path In a Matrix", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", diff: "Hard" },
  { cat: "2-D Dynamic Programming", num: 9, name: "Distinct Subsequences", url: "https://leetcode.com/problems/distinct-subsequences/", diff: "Hard" },
  { cat: "2-D Dynamic Programming", num: 10, name: "Burst Balloons", url: "https://leetcode.com/problems/burst-balloons/", diff: "Hard" },
  { cat: "2-D Dynamic Programming", num: 11, name: "Regular Expression Matching", url: "https://leetcode.com/problems/regular-expression-matching/", diff: "Hard" },
  { cat: "Greedy", num: 1, name: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", diff: "Medium" },
  { cat: "Greedy", num: 2, name: "Jump Game", url: "https://leetcode.com/problems/jump-game/", diff: "Medium" },
  { cat: "Greedy", num: 3, name: "Jump Game II", url: "https://leetcode.com/problems/jump-game-ii/", diff: "Medium" },
  { cat: "Greedy", num: 4, name: "Gas Station", url: "https://leetcode.com/problems/gas-station/", diff: "Medium" },
  { cat: "Greedy", num: 5, name: "Hand of Straights", url: "https://leetcode.com/problems/hand-of-straights/", diff: "Medium" },
  { cat: "Greedy", num: 6, name: "Merge Triplets to Form Target Triplet", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/", diff: "Medium" },
  { cat: "Greedy", num: 7, name: "Partition Labels", url: "https://leetcode.com/problems/partition-labels/", diff: "Medium" },
  { cat: "Greedy", num: 8, name: "Valid Parenthesis String", url: "https://leetcode.com/problems/valid-parenthesis-string/", diff: "Medium" },
  { cat: "Intervals", num: 1, name: "Meeting Rooms", url: "https://leetcode.com/problems/meeting-rooms/", diff: "Easy" },
  { cat: "Intervals", num: 2, name: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", diff: "Medium" },
  { cat: "Intervals", num: 3, name: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", diff: "Medium" },
  { cat: "Intervals", num: 4, name: "Non Overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", diff: "Medium" },
  { cat: "Intervals", num: 5, name: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", diff: "Medium" },
  { cat: "Intervals", num: 6, name: "Minimum Interval to Include Each Query", url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/", diff: "Hard" },
  { cat: "Math & Geometry", num: 1, name: "Happy Number", url: "https://leetcode.com/problems/happy-number/", diff: "Easy" },
  { cat: "Math & Geometry", num: 2, name: "Plus One", url: "https://leetcode.com/problems/plus-one/", diff: "Easy" },
  { cat: "Math & Geometry", num: 3, name: "Rotate Image", url: "https://leetcode.com/problems/rotate-image/", diff: "Medium" },
  { cat: "Math & Geometry", num: 4, name: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/", diff: "Medium" },
  { cat: "Math & Geometry", num: 5, name: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes/", diff: "Medium" },
  { cat: "Math & Geometry", num: 6, name: "Pow(x, n)", url: "https://leetcode.com/problems/powx-n/", diff: "Medium" },
  { cat: "Math & Geometry", num: 7, name: "Multiply Strings", url: "https://leetcode.com/problems/multiply-strings/", diff: "Medium" },
  { cat: "Math & Geometry", num: 8, name: "Detect Squares", url: "https://leetcode.com/problems/detect-squares/", diff: "Medium" },
  { cat: "Bit Manipulation", num: 1, name: "Single Number", url: "https://leetcode.com/problems/single-number/", diff: "Easy" },
  { cat: "Bit Manipulation", num: 2, name: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", diff: "Easy" },
  { cat: "Bit Manipulation", num: 3, name: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", diff: "Easy" },
  { cat: "Bit Manipulation", num: 4, name: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", diff: "Easy" },
  { cat: "Bit Manipulation", num: 5, name: "Missing Number", url: "https://leetcode.com/problems/missing-number/", diff: "Easy" },
  { cat: "Bit Manipulation", num: 6, name: "Sum of Two Integers", url: "https://leetcode.com/problems/sum-of-two-integers/", diff: "Medium" },
  { cat: "Bit Manipulation", num: 7, name: "Reverse Integer", url: "https://leetcode.com/problems/reverse-integer/", diff: "Medium" },
];

// ------------------------------------------------------------ graph layout
// Hand-placed to mirror the neetcode.io roadmap. x,y = node centre, in the
// 1100x1120 design canvas. Nudge these if you want to re-space the graph.

const LAYOUT = {
  'Arrays & Hashing':        { x: 577,  y: 204,  w: 150 },
  'Two Pointers':            { x: 479,  y: 314,  w: 140 },
  'Stack':                   { x: 645,  y: 300,  w: 140 },
  'Binary Search':           { x: 334,  y: 427,  w: 148 },
  'Sliding Window':          { x: 502,  y: 427,  w: 152 },
  'Linked List':             { x: 678,  y: 431,  w: 140 },
  'Trees':                   { x: 496,  y: 537,  w: 140 },
  'Tries':                   { x: 346,  y: 645,  w: 140 },
  'Backtracking':            { x: 642,  y: 640,  w: 148 },
  'Heap / Priority Queue':   { x: 446,  y: 736,  w: 152 },
  'Graphs':                  { x: 634,  y: 761,  w: 140 },
  '1-D Dynamic Programming': { x: 820,  y: 760,  w: 152 },
  'Intervals':               { x: 170,  y: 847,  w: 148 },
  'Greedy':                  { x: 352,  y: 889,  w: 148 },
  'Advanced Graphs':         { x: 514,  y: 868,  w: 156 },
  '2-D Dynamic Programming': { x: 704,  y: 900,  w: 152 },
  'Bit Manipulation':        { x: 896,  y: 885,  w: 152 },
  'Math & Geometry':         { x: 830,  y: 1006, w: 152 },
};

const EDGES = [
  ['Arrays & Hashing', 'Two Pointers'],
  ['Arrays & Hashing', 'Stack'],
  ['Two Pointers', 'Binary Search'],
  ['Two Pointers', 'Sliding Window'],
  ['Two Pointers', 'Linked List'],
  ['Binary Search', 'Trees'],
  ['Sliding Window', 'Trees'],
  ['Linked List', 'Trees'],
  ['Trees', 'Tries'],
  ['Trees', 'Heap / Priority Queue'],
  ['Trees', 'Backtracking'],
  ['Heap / Priority Queue', 'Intervals'],
  ['Heap / Priority Queue', 'Greedy'],
  ['Heap / Priority Queue', 'Advanced Graphs'],
  ['Backtracking', 'Graphs'],
  ['Backtracking', '1-D Dynamic Programming'],
  ['Graphs', 'Advanced Graphs'],
  ['Graphs', '2-D Dynamic Programming'],
  ['1-D Dynamic Programming', '2-D Dynamic Programming'],
  ['1-D Dynamic Programming', 'Bit Manipulation'],
  ['Bit Manipulation', 'Math & Geometry'],
  ['2-D Dynamic Programming', 'Math & Geometry'],
];

const byCategory = new Map();
for (const p of PROBLEMS) {
  if (!byCategory.has(p.cat)) byCategory.set(p.cat, []);
  byCategory.get(p.cat).push(p);
}

for (const cat of byCategory.keys()) {
  if (!LAYOUT[cat]) console.warn(`! category "${cat}" has no layout entry — it will not be drawn`);
}
for (const [a, b] of EDGES) {
  if (!LAYOUT[a] || !LAYOUT[b]) console.warn(`! edge ${a} -> ${b} references an unplaced node`);
}

const NODE_H = 46;

// Vertical-tangent bezier, so edges leave the bottom of a box and enter the top
// of the next — the same soft S-curve the site uses.
function edgePath(a, b) {
  const from = LAYOUT[a], to = LAYOUT[b];
  const x1 = from.x, y1 = from.y + NODE_H / 2;
  const x2 = to.x,   y2 = to.y - NODE_H / 2;
  const dy = Math.max(28, (y2 - y1) * 0.55);
  return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
}

const svgEdges = EDGES
  .filter(([a, b]) => LAYOUT[a] && LAYOUT[b])
  .map(([a, b]) => `<path class="edge" d="${edgePath(a, b)}" />`)
  .join('\n      ');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const nodeDivs = Object.entries(LAYOUT)
  .filter(([cat]) => byCategory.has(cat))
  .map(([cat, pos]) => {
    const total = byCategory.get(cat).length;
    const style = `left:${pos.x - pos.w / 2}px; top:${pos.y - NODE_H / 2}px; width:${pos.w}px; min-height:${NODE_H}px;`;
    return `<button class="node" style="${style}" data-cat="${esc(cat)}" type="button">
        <span class="node-label">${esc(cat)}</span>
        <span class="bar"><span class="bar-fill" data-bar="${esc(cat)}"></span></span>
        <span class="node-count" data-count="${esc(cat)}">0 / ${total}</span>
      </button>`;
  })
  .join('\n      ');

// ------------------------------------------------------------------ output

const DATA = {
  categories: Object.keys(LAYOUT).filter((c) => byCategory.has(c)),
  problems: PROBLEMS,
  generated: new Date().toISOString().slice(0, 10),
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>NeetCode Roadmap</title>
<style>
  :root {
    --bg: #16171b;
    --dot: #232429;
    --node: #4b4b8f;
    --node-hover: #5a5aa8;
    --node-done: #1f7a52;
    --node-text: #eceefb;
    --green: #2cbd7e;
    --edge: #6c6d75;
    --panel: #1e1f24;
    --panel-line: #2e3038;
    --text: #e8e9ee;
    --muted: #9a9cab;
    --easy: #2cbd7e;
    --medium: #e0a33a;
    --hard: #e05a5a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 0) 0 0 / 22px 22px,
      var(--bg);
    color: var(--text);
    font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  header {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 14px 22px; border-bottom: 1px solid var(--panel-line);
    background: rgba(22,23,27,.92); backdrop-filter: blur(6px);
    position: sticky; top: 0; z-index: 30;
  }
  header h1 { font-size: 17px; margin: 0; font-weight: 650; letter-spacing: .2px; }
  .total { color: var(--muted); font-size: 13px; }
  .total strong { color: var(--green); font-variant-numeric: tabular-nums; }
  .spacer { flex: 1 1 auto; }
  button.act {
    background: #2a2b33; color: var(--text); border: 1px solid #3a3c46;
    border-radius: 7px; padding: 7px 13px; font-size: 13px; cursor: pointer;
    font-family: inherit;
  }
  button.act:hover { background: #34363f; border-color: #4a4d59; }

  /* ---- graph ---- */
  .scroll { overflow: auto; padding: 26px 0 60px; }
  .canvas { position: relative; width: 1100px; height: 1120px; margin: 0 auto; }
  .canvas svg { position: absolute; inset: 0; width: 1100px; height: 1120px; pointer-events: none; }
  .edge { fill: none; stroke: var(--edge); stroke-width: 1.6; opacity: .75; }

  .node {
    position: absolute; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 5px;
    padding: 7px 10px 8px; border: 0; border-radius: 8px;
    background: var(--node); color: var(--node-text);
    font: 600 13.5px/1.25 inherit; text-align: center; cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,.4); transition: background .13s, transform .13s;
  }
  .node:hover { background: var(--node-hover); transform: translateY(-1px); }
  .node.complete { background: var(--node-done); }
  .node.active { outline: 2px solid var(--green); outline-offset: 2px; }
  .bar { display: block; width: 76%; height: 3px; border-radius: 2px; background: rgba(255,255,255,.85); overflow: hidden; }
  .bar-fill { display: block; height: 100%; width: 0; background: var(--green); transition: width .2s; }
  .node-count { font-size: 10.5px; font-weight: 500; opacity: .78; font-variant-numeric: tabular-nums; }

  /* ---- side panel ---- */
  .panel {
    position: fixed; top: 0; right: 0; height: 100vh; width: 440px; max-width: 92vw;
    background: var(--panel); border-left: 1px solid var(--panel-line);
    transform: translateX(100%); transition: transform .22s ease;
    display: flex; flex-direction: column; z-index: 40;
    box-shadow: -12px 0 34px rgba(0,0,0,.42);
  }
  .panel.open { transform: none; }
  .panel-head { padding: 18px 20px 14px; border-bottom: 1px solid var(--panel-line); }
  .panel-head .row { display: flex; align-items: flex-start; gap: 12px; }
  .panel-head h2 { margin: 0; font-size: 18px; font-weight: 650; flex: 1; }
  .panel-sub { margin-top: 6px; color: var(--muted); font-size: 13px; font-variant-numeric: tabular-nums; }
  .close { background: none; border: 0; color: var(--muted); font-size: 22px; line-height: 1; cursor: pointer; padding: 0 2px; }
  .close:hover { color: var(--text); }
  .panel-body { overflow: auto; padding: 6px 10px 26px; }

  .prob { display: flex; align-items: center; gap: 11px; padding: 9px 10px; border-radius: 7px; }
  .prob:hover { background: #26272e; }
  .prob input { width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; flex: none; }
  .prob a { color: var(--text); text-decoration: none; flex: 1; font-size: 14px; }
  .prob a:hover { text-decoration: underline; }
  .prob.done a { color: var(--muted); text-decoration: line-through; }
  .diff { font: 600 11px/1 ui-monospace, monospace; letter-spacing: .3px; flex: none; }
  .diff.Easy { color: var(--easy); } .diff.Medium { color: var(--medium); } .diff.Hard { color: var(--hard); }

  .toast {
    position: fixed; bottom: 22px; left: 50%; transform: translate(-50%, 14px);
    background: #26694d; color: #fff; padding: 10px 18px; border-radius: 8px;
    font-size: 13.5px; opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s; z-index: 60;
  }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }
  footer { text-align: center; color: var(--muted); font-size: 12px; padding: 0 20px 30px; }
  footer code { background: #24252c; padding: 1px 5px; border-radius: 4px; }
</style>
</head>
<body>

<header>
  <h1>NeetCode Roadmap</h1>
  <span class="total"><strong id="doneTotal">0</strong> / <span id="allTotal">0</span> solved</span>
  <span class="spacer"></span>
  <button class="act" id="btnReset" type="button">Reset progress</button>
</header>

<div class="scroll">
  <div class="canvas">
    <svg viewBox="0 0 1100 1120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${svgEdges}
    </svg>
    ${nodeDivs}
  </div>
</div>

<footer>
  Generated ${DATA.generated} · rebuild with <code>node NeetCode-Roadmap.js</code> · progress is stored in this browser's localStorage
</footer>

<aside class="panel" id="panel" aria-hidden="true">
  <div class="panel-head">
    <div class="row">
      <h2 id="panelTitle">—</h2>
      <button class="close" id="panelClose" type="button" aria-label="Close">&times;</button>
    </div>
    <div class="panel-sub" id="panelSub"></div>
  </div>
  <div class="panel-body" id="panelBody"></div>
</aside>

<div class="toast" id="toast"></div>

<script>
const DATA = ${JSON.stringify(DATA)};
const LS_KEY = 'neetcode-roadmap-status';

let state = {};
try { state = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { state = {}; }

const keyOf = (p) => p.cat + '::' + p.name;
const isDone = (p) => !!state[keyOf(p)];

function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }

const byCat = new Map();
for (const p of DATA.problems) {
  if (!byCat.has(p.cat)) byCat.set(p.cat, []);
  byCat.get(p.cat).push(p);
}

document.getElementById('allTotal').textContent = DATA.problems.length;

function refreshCounts() {
  let total = 0;
  for (const cat of DATA.categories) {
    const items = byCat.get(cat) || [];
    const done = items.filter(isDone).length;
    total += done;
    const pct = items.length ? (done / items.length) * 100 : 0;
    const bar = document.querySelector('[data-bar="' + cssEsc(cat) + '"]');
    const cnt = document.querySelector('[data-count="' + cssEsc(cat) + '"]');
    const node = document.querySelector('.node[data-cat="' + cssEsc(cat) + '"]');
    if (bar) bar.style.width = pct + '%';
    if (cnt) cnt.textContent = done + ' / ' + items.length;
    if (node) node.classList.toggle('complete', items.length > 0 && done === items.length);
  }
  document.getElementById('doneTotal').textContent = total;
}

function cssEsc(s) { return s.replace(/"/g, '\\\\"'); }

// ---- side panel ----
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panelTitle');
const panelSub = document.getElementById('panelSub');
const panelBody = document.getElementById('panelBody');
let openCat = null;

function renderPanel(cat) {
  const items = byCat.get(cat) || [];
  const done = items.filter(isDone).length;
  panelTitle.textContent = cat;
  panelSub.textContent = done + ' / ' + items.length + ' solved';
  panelBody.innerHTML = '';

  for (const p of items) {
    const row = document.createElement('div');
    row.className = 'prob' + (isDone(p) ? ' done' : '');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = isDone(p);
    cb.addEventListener('change', () => {
      state[keyOf(p)] = cb.checked;
      save();
      row.classList.toggle('done', cb.checked);
      panelSub.textContent = items.filter(isDone).length + ' / ' + items.length + ' solved';
      refreshCounts();
    });

    const a = document.createElement('a');
    a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = p.num + '. ' + p.name;

    const d = document.createElement('span');
    d.className = 'diff ' + p.diff;
    d.textContent = p.diff;

    row.append(cb, a, d);
    panelBody.append(row);
  }
}

function openPanel(cat) {
  openCat = cat;
  renderPanel(cat);
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  document.querySelectorAll('.node').forEach((n) =>
    n.classList.toggle('active', n.dataset.cat === cat));
}

function closePanel() {
  openCat = null;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.node').forEach((n) => n.classList.remove('active'));
}

document.querySelectorAll('.node').forEach((n) => {
  n.addEventListener('click', () => {
    if (openCat === n.dataset.cat) closePanel();
    else openPanel(n.dataset.cat);
  });
});
document.getElementById('panelClose').addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

document.getElementById('btnReset').addEventListener('click', () => {
  if (!confirm('Clear all progress ticks in this browser?')) return;
  state = {};
  save();
  refreshCounts();
  if (openCat) renderPanel(openCat);
  toast('Progress reset');
});

refreshCounts();
</script>
</body>
</html>
`;

writeFileSync(OUT_PATH, html, 'utf-8');
console.log(`Parsed ${PROBLEMS.length} problems in ${byCategory.size} categories.`);
console.log(`Wrote ${OUT_PATH}`);
