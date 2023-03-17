import fs from "fs";
import { resolve } from "path";

export default function replaceManifest(path: string, value: string, manifestPath: string = resolve(__dirname, "../src/manifest.json")) {
  // const manifestPath =
  let Manifest = fs.readFileSync(manifestPath, { encoding: "utf-8" });
  const arr = path.split(".");
  const len = arr.length;
  const lastItem = arr[len - 1];

  let i = 0;
  const ManifestArr = Manifest.split(/\n/);

  for (let index = 0; index < ManifestArr.length; index++) {
    const item = ManifestArr[index];
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
    if (i === len) {
      const hasComma = /,/.test(item);
      ManifestArr[index] = item.replace(new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`), `"${lastItem}": ${value}${hasComma ? "," : ""}`);
      break;
    }
  }
  Manifest = ManifestArr.join("\n");
  fs.writeFileSync(manifestPath, Manifest, {
    flag: "w"
  });
}
