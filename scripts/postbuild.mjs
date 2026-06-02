import rss from './rss.mjs'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function postbuild() {
  await rss()
  const src = join(__dirname, '..', 'public', '_headers')
  const dst = join(__dirname, '..', 'out', '_headers')
  if (existsSync(src)) {
    mkdirSync(join(__dirname, '..', 'out'), { recursive: true })
    copyFileSync(src, dst)
  }
}

postbuild()
