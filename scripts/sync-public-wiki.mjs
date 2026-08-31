import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const defaultSource = "C:\\Users\\CHUCK\\Documents\\CHUCK Vault\\40_PUBLIC_WIKI"
const source = path.resolve(process.env.CHUCK_PUBLIC_WIKI || defaultSource)
const destination = path.resolve("content")
const allowedAssetExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".mp3",
  ".mp4",
  ".ogg",
  ".pdf",
  ".png",
  ".svg",
  ".webm",
  ".webp",
])

function isExplicitlyPublished(markdown) {
  const frontmatter = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)
  return Boolean(frontmatter && /^publish:\s*true\s*$/m.test(frontmatter[1]))
}

async function syncDirectory(currentSource, currentDestination, relative = "") {
  const entries = await readdir(currentSource, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "private" || entry.name === "_private")
      continue

    const sourcePath = path.join(currentSource, entry.name)
    const destinationPath = path.join(currentDestination, entry.name)
    const relativePath = path.join(relative, entry.name)

    if (entry.isDirectory()) {
      await mkdir(destinationPath, { recursive: true })
      await syncDirectory(sourcePath, destinationPath, relativePath)
      continue
    }

    const extension = path.extname(entry.name).toLowerCase()
    if (extension === ".md") {
      const markdown = await readFile(sourcePath, "utf8")
      if (!isExplicitlyPublished(markdown)) {
        console.log(`SKIP (publish:true 없음): ${relativePath}`)
        continue
      }
      await mkdir(path.dirname(destinationPath), { recursive: true })
      await cp(sourcePath, destinationPath)
      console.log(`COPY: ${relativePath}`)
      continue
    }

    const inAssetsFolder = relativePath.split(path.sep).includes("assets")
    if (inAssetsFolder && allowedAssetExtensions.has(extension)) {
      await mkdir(path.dirname(destinationPath), { recursive: true })
      await cp(sourcePath, destinationPath)
      console.log(`ASSET: ${relativePath}`)
    } else {
      console.log(`SKIP (허용되지 않은 첨부): ${relativePath}`)
    }
  }
}

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await syncDirectory(source, destination)
console.log(`\n공개 위키 동기화 완료: ${source} -> ${destination}`)
