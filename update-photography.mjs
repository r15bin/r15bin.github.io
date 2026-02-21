// node update-photography.mjs

import { readdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const photographyDir = join(__dirname, "photography");
const jsonPath = join(photographyDir, "photography.json");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

const files = await readdir(photographyDir);
const images = files
  .filter((name) => IMAGE_EXT.has(name.slice(name.lastIndexOf(".")).toLowerCase()))
  .filter((name) => name !== "photography.json")
  .sort();

await writeFile(jsonPath, JSON.stringify(images, null, 2) + "\n", "utf8");
console.log(`Updated ${jsonPath} with ${images.length} image(s).`);