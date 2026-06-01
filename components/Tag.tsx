import Link from 'next/link'
import { getTagSlug, normalizeTag } from '@/lib/taxonomy'

interface TagProps {
  text: string
}

const Tag = ({ text }: TagProps) => {
  const normalizedTag = normalizeTag(text)
  const tagSlug = getTagSlug(normalizedTag)

  return (
    <Link
      href={`/tags/${tagSlug}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {normalizedTag}
    </Link>
  )
}

export default Tag
