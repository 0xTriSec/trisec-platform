import { ReactNode } from 'react'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Link from '@/components/Link'

interface AuthorContent {
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  github?: string
  tryhackme?: string
  education1?: string
  education1Desc?: string
  education2?: string
  education2Desc?: string
}

interface Props {
  children: ReactNode
  content: AuthorContent
}

export default function AuthorLayout({ children, content }: Props) {
  const {
    name,
    avatar,
    occupation,
    company,
    email,
    twitter,
    github,
    tryhackme,
    education1,
    education1Desc,
    education2,
    education2Desc,
  } = content

  return (
    <>
      <div className="space-y-8 pt-6 pb-10">
        <div className="items-start gap-8 xl:grid xl:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col items-center text-center">
              {avatar && (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={192}
                  height={192}
                  className="h-36 w-36 rounded-full border-4 border-white shadow-lg dark:border-gray-800"
                />
              )}
              <h3 className="pt-4 pb-1 text-2xl leading-8 font-bold tracking-tight">{name}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">{occupation}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{company}</div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                  Cybersecurity
                </span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  OSINT
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Security Research
                </span>
              </div>

              <div className="mt-6 flex space-x-3">
                {email && <SocialIcon kind="mail" href={`mailto:${email}`} />}
                {github && <SocialIcon kind="github" href={github} />}
                {twitter && <SocialIcon kind="x" href={twitter} />}
                {tryhackme && <SocialIcon kind="tryhackme" href={tryhackme} />}
              </div>
            </div>
          </div>

          <div className="space-y-6 xl:col-span-2">
            <div className="prose dark:prose-invert max-w-none rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              {children}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 hover:shadow-md dark:border-sky-800 dark:bg-gray-900 dark:text-sky-400 dark:hover:border-sky-600 dark:hover:bg-sky-900/30"
              >
                View Projects
              </Link>
              <Link
                href="/blog"
                className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 hover:shadow-md dark:border-sky-800 dark:bg-gray-900 dark:text-sky-400 dark:hover:border-sky-600 dark:hover:bg-sky-900/30"
              >
                Read Articles
              </Link>
              {email && (
                <Link
                  href={`mailto:${email}`}
                  className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 hover:shadow-md dark:border-sky-800 dark:bg-gray-900 dark:text-sky-400 dark:hover:border-sky-600 dark:hover:bg-sky-900/30"
                >
                  Contact Me
                </Link>
              )}
            </div>

            {(education1 || education2) && (
              <div className="rounded-xl border border-gray-200 bg-white/80 p-5 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
                <p className="mb-4 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                  Education
                </p>

                <div className="relative pl-5">
                  {/* Timeline line */}
                  <div className="absolute top-2 left-2 h-[calc(100%-4px)] w-px bg-gray-200 dark:bg-gray-700" />

                  <div className="space-y-4">
                    {education1 && (
                      <div className="relative">
                        {/* Timeline dot */}
                        <div className="absolute top-1.5 -left-[18px] h-2.5 w-2.5 rounded-full border-2 border-sky-500 bg-white dark:bg-gray-900" />

                        <div>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                              {education1.split('(')[0].trim()}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {education1.match(/\((.*?)\)/)?.[1] || '2023 - Present'}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            {education1Desc}
                          </p>
                        </div>
                      </div>
                    )}

                    {education2 && (
                      <div className="relative">
                        {/* Timeline dot */}
                        <div className="absolute top-1.5 -left-[18px] h-2.5 w-2.5 rounded-full border-2 border-indigo-500 bg-white dark:bg-gray-900" />

                        <div>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                              {education2.split('(')[0].trim()}
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {education2.match(/\((.*?)\)/)?.[1] || '2023 - 2024'}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            {education2Desc}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
