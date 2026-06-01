import Link from '@/components/Link'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { getAllTagsWithCounts, getTagSlug, type TagDataJson } from '@/lib/taxonomy'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const rawTagCounts = tagData as TagDataJson
  const sortedTags = getAllTagsWithCounts(rawTagCounts)

  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {sortedTags.length === 0 && 'No tags found.'}
          {sortedTags.map(({ tag, slug: tagSlug, count }) => (
            <div key={tag} className="mt-2 mr-5 mb-2">
              <Link
                href={`/tags/${tagSlug}`}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
                aria-label={`View posts tagged ${tag}`}
              >
                {tag}
              </Link>
              <span className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">
                {` (${count})`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
