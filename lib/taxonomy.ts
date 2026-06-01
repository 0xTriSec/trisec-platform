/**
 * Centralized taxonomy/tag utility for consistent tag management across the blog.
 *
 * This module provides:
 * - Tag normalization (handling inconsistent naming like "infosec" → "InfoSec")
 * - Tag counting from blog posts
 * - Sorted tag lists with required tags always included
 * - Consistent display formatting
 */

import { slug } from 'github-slugger'
import type { Blog } from 'contentlayer/generated'

/**
 * Required tags that should always appear in the sidebar and tags page,
 * even if no posts currently use them.
 */
export const REQUIRED_TAGS = [
  'AI',
  'AI Security',
  'Cybersecurity',
  'InfoSec',
  'Pentest',
  'Red Team',
  'Blue Team',
  'OSINT',
  'Malware',
  'Reverse Engineering',
  'Web Security',
  'Network Security',
  'Cloud Security',
  'Linux',
  'Tools',
] as const

export type RequiredTag = (typeof REQUIRED_TAGS)[number]

/**
 * Tag normalization map: maps various input formats to canonical display names.
 * This ensures consistent tag names regardless of how authors write them.
 */
const TAG_NORMALIZATION_MAP: Readonly<Record<string, string>> = {
  // Case variations
  ai: 'AI',
  'a.i': 'AI',
  'a.i.': 'AI',

  // AI Security variations
  'ai security': 'AI Security',
  'ai-security': 'AI Security',
  aisecurity: 'AI Security',
  'ai sec': 'AI Security',
  'ai-sec': 'AI Security',

  // Cybersecurity variations
  cybersecurity: 'Cybersecurity',
  'cyber security': 'Cybersecurity',
  'cyber-security': 'Cybersecurity',
  cyber: 'Cybersecurity',
  cybersec: 'Cybersecurity',

  // InfoSec variations
  infosec: 'InfoSec',
  'info sec': 'InfoSec',
  'info-sec': 'InfoSec',
  'information security': 'InfoSec',
  'information-security': 'InfoSec',

  // Pentest variations
  pentest: 'Pentest',
  'pen test': 'Pentest',
  'pen-test': 'Pentest',
  'penetration testing': 'Pentest',
  'penetration-testing': 'Pentest',
  pentesting: 'Pentest',

  // Red Team variations
  'red team': 'Red Team',
  'red-team': 'Red Team',
  redteam: 'Red Team',
  redteaming: 'Red Team',
  'red-teaming': 'Red Team',

  // Blue Team variations
  'blue team': 'Blue Team',
  'blue-team': 'Blue Team',
  blueteam: 'Blue Team',
  blueteaming: 'Blue Team',
  'blue-teaming': 'Blue Team',
  'defensive security': 'Blue Team',
  defensive: 'Blue Team',

  // OSINT variations
  osint: 'OSINT',
  'os int': 'OSINT',
  'open source intelligence': 'OSINT',
  'open-source-intelligence': 'OSINT',

  // Malware variations
  malware: 'Malware',
  'malicious software': 'Malware',
  'malicious-software': 'Malware',

  // Reverse Engineering variations
  'reverse engineering': 'Reverse Engineering',
  'reverse-engineering': 'Reverse Engineering',
  reversing: 'Reverse Engineering',
  re: 'Reverse Engineering',
  reveng: 'Reverse Engineering',

  // Web Security variations
  'web security': 'Web Security',
  'web-security': 'Web Security',
  'webapp security': 'Web Security',
  'web-app security': 'Web Security',
  'web application security': 'Web Security',
  appsec: 'Web Security',
  'application security': 'Web Security',

  // Network Security variations
  'network security': 'Network Security',
  'network-security': 'Network Security',
  'net sec': 'Network Security',
  netsec: 'Network Security',

  // Cloud Security variations
  'cloud security': 'Cloud Security',
  'cloud-security': 'Cloud Security',
  cloudsec: 'Cloud Security',

  // Linux variations
  linux: 'Linux',
  'linux security': 'Linux',

  // Tools variations
  tools: 'Tools',
  tool: 'Tools',
  utilities: 'Tools',
  utility: 'Tools',
} as const

/**
 * Normalizes a tag string to its canonical display name.
 * Handles case variations, spacing, and common aliases.
 */
export function normalizeTag(rawTag: string): string {
  const trimmed = rawTag.trim()
  const lower = trimmed.toLowerCase()

  // Check normalization map first
  if (lower in TAG_NORMALIZATION_MAP) {
    return TAG_NORMALIZATION_MAP[lower]
  }

  // Apply title case for unmatched tags
  return toTitleCase(trimmed)
}

/**
 * Converts a string to Title Case.
 */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Converts a display tag name to its URL slug.
 * Handles special cases like "AI" to preserve capitalization when needed.
 */
export function tagToSlug(tag: string): string {
  // Special case: "AI" should become "ai" (lowercase) for URL consistency
  if (tag === 'AI') return 'ai'
  return slug(tag)
}

/**
 * Converts a URL slug back to its display name.
 * Tries to match against known tags first, then falls back to title case.
 */
export function slugToTag(slugStr: string): string {
  // Try to find matching required tag
  const requiredMatch = REQUIRED_TAGS.find((t) => tagToSlug(t) === slugStr)
  if (requiredMatch) return requiredMatch

  // Convert slug back to normalized tag name
  const titleCase = toTitleCase(slugStr.replace(/-/g, ' '))
  return normalizeTag(titleCase)
}

/**
 * Gets the URL-friendly slug for a tag, using the tag's canonical name.
 */
export function getTagSlug(tag: string): string {
  return tagToSlug(normalizeTag(tag))
}

/**
 * Counts tag occurrences from a list of blog posts.
 * Returns a map of normalized tag name -> count.
 */
export function countTags(posts: Blog[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const post of posts) {
    if (post.tags && post.draft !== true) {
      for (const rawTag of post.tags) {
        const tag = normalizeTag(rawTag)
        counts[tag] = (counts[tag] || 0) + 1
      }
    }
  }

  return counts
}

/**
 * Tag with count information, sorted for display.
 */
export interface TagWithCount {
  tag: string
  slug: string
  count: number
}

/**
 * Gets all tags with their counts, including required tags.
 * Required tags with no posts will have count of 0.
 * Sorted by: count DESC, then alphabetical ASC.
 */
export function getAllTagsWithCounts(tagCounts: Record<string, number>): TagWithCount[] {
  const tagSet = new Set<string>()
  const normalizedCounts: Record<string, number> = {}

  // Normalize and merge tags from counts
  for (const [tag, count] of Object.entries(tagCounts)) {
    const normalizedTag = normalizeTag(tag)
    normalizedCounts[normalizedTag] = (normalizedCounts[normalizedTag] || 0) + count
    tagSet.add(normalizedTag)
  }

  // Add all required tags
  for (const requiredTag of REQUIRED_TAGS) {
    tagSet.add(requiredTag)
  }

  // Create tag list with counts
  const tagsWithCounts: TagWithCount[] = Array.from(tagSet).map((tag) => ({
    tag,
    slug: tagToSlug(tag),
    count: normalizedCounts[tag] || 0,
  }))

  // Sort: count DESC, then alphabetical ASC
  return tagsWithCounts.sort((a, b) => {
    // First sort by count (descending)
    if (b.count !== a.count) {
      return b.count - a.count
    }
    // Then alphabetically (ascending)
    return a.tag.localeCompare(b.tag)
  })
}

/**
 * Gets tags that have at least one post.
 * Sorted by: count DESC, then alphabetical ASC.
 */
export function getUsedTagsWithCounts(tagCounts: Record<string, number>): TagWithCount[] {
  return getAllTagsWithCounts(tagCounts).filter((t) => t.count > 0)
}

/**
 * Type for the tag data JSON file format.
 */
export type TagDataJson = Record<string, number>

/**
 * Converts raw tag counts (with slugs as keys) to normalized display names.
 * This is useful when migrating from the old slug-based format.
 */
export function normalizeTagData(rawTagData: TagDataJson): Record<string, number> {
  const normalized: Record<string, number> = {}

  for (const [slugKey, count] of Object.entries(rawTagData)) {
    const displayName = slugToTag(slugKey)
    normalized[displayName] = (normalized[displayName] || 0) + count
  }

  return normalized
}
