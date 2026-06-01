'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-6'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <img src={siteMetadata.siteLogo} alt="Logo" className="h-26 w-auto" />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              <span className="from-primary-600 to-primary-400 hover:from-primary-400 hover:to-primary-600 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
                {siteMetadata.headerTitle}
              </span>
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => {
              const isActive = (path) => {
                return path === '/' ? pathname === '/' : pathname.startsWith(path)
              }
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group relative m-1 inline-block font-medium transition-all duration-200"
                >
                  <span
                    className={`transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'hover:text-primary-500 dark:hover:text-primary-400 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {link.title}
                  </span>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 transform transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                      isActive(link.href)
                        ? 'bg-primary-500 dark:bg-primary-400 scale-x-100'
                        : 'bg-primary-500 dark:bg-primary-400'
                    }`}
                  />
                </Link>
              )
            })}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
