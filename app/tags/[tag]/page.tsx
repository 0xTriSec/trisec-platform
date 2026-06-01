import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { getUsedTagsWithCounts, normalizeTag, type TagDataJson } from '@/lib/taxonomy'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tagSlug = decodeURI(params.tag)
  const tag = normalizeTag(tagSlug)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tagSlug}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const rawTagCounts = tagData as TagDataJson
  const sortedTags = getUsedTagsWithCounts(rawTagCounts)
  return sortedTags.map(({ slug: tagSlug }) => ({
    tag: encodeURI(tagSlug),
  }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tagSlug = decodeURI(params.tag)
  const tag = normalizeTag(tagSlug)

  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => {
        if (!post.tags || post.draft === true) return false
        return post.tags.some((t) => normalizeTag(t) === tag)
      })
    )
  )

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={tag}
    />
  )
}
