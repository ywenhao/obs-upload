import fg from 'fast-glob'
import fs from 'node:fs'
import fsP from 'node:fs/promises'
import { type Plugin } from 'vite'

export function deleteStatic(exclude: string[] = []): Plugin {
  return {
    name: 'delete-static',
    async closeBundle() {
      setTimeout(async () => {
        const ignore = exclude.map((e) => `static/${e}`)

        let glob = await fg(`dist/*/*/static/**/*`)
        glob = glob.filter((g) => !ignore.some((i) => g.includes(i)))

        glob.forEach((g) => fsP.rm(g))

        deleteEmptyDir('dist/*/*/static')
      }, 2000)
    }
  }
}

async function deleteEmptyDir(dir: string) {
  let dirs = await fg(`${dir}/**/*`, { onlyDirectories: true })
  dirs = dirs.reverse().filter((d) => fs.existsSync(d) && fs.statSync(d).isDirectory())
  dirs.forEach((d) => {
    fs.readdirSync(d).length ? deleteEmptyDir(d) : fsP.rmdir(d)
  })
}
