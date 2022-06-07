import { build, emptyDir } from "dnt";
import { Exit } from "docopt/src/error.ts";
import docopt from "docopt";
import {
  basename,
  dirname,
  fromFileUrl,
  join,
  relative,
} from "deno/path/mod.ts";
import { valid } from "semver";
try {
  const {
    "<version>": version,
    "<scope>": scope,
  } = docopt(`
Build NPM.

Usage:
  build-npm <version> <scope>
  build-npm -h | --help

Options:
  -h --help     Show this screen.
`);

  if (!version) {
    throw new TypeError(`VERSION environment variable is missing`);
  }
  if (typeof version !== "string" || !valid(version)) {
    throw new TypeError(`${version} isn't a valid semver version`);
  }

  if (!scope) {
    throw new TypeError(`SCOPE environment variable is missing`);
  }
  if (typeof scope !== "string") {
    throw new TypeError(`${scope} isn't a valid scope`);
  }

  const file = fromFileUrl(import.meta.url);
  const rootDir = dirname(join(file, ".."));

  const name = basename(rootDir);

  await emptyDir("./dist/npm");

  await build({
    entryPoints: ["mod.ts"],
    outDir: "dist/npm",
    shims: {
      deno: "dev",
      custom: [
        {
          globalNames: [
            {
              name: "Worker",
              exportName: "default",
            },
          ],
          package: {
            name: "web-worker",
            version: "~1.2.0",
          },
        },
        {
          module: "./shims/navigator.ts",
          globalNames: ["navigator"],
        },
      ],
    },
    package: {
      name: `@${scope.toLowerCase()}/${name.toLowerCase()}`,
      version,
      description:
        "Synchronization functions (mutex, semaphore) between workers (and the main thread)",
      keywords: ["sync", "worker", "mutex", "semaphore"],
      homepage: `https://github.com/Eyal-Shalev/${name}`,
      bugs: {
        url: `https://github.com/Eyal-Shalev/${name}/issues`,
      },
      license: "GPL-3.0-or-later",
      author: `Eyal Shalev <eyalsh@gmail.com> (https://github.com/Eyal-Shalev)`,
      repository: {
        type: "git",
        url: `git+https://github.com/Eyal-Shalev/${name}.git`,
      },
    },
    importMap: relative(Deno.cwd(), join(rootDir, "import_map.json")),
    compilerOptions: {
      lib: ["webworker", "esnext"],
    },
    typeCheck: false,
  });

  // post build steps
  Deno.copyFileSync("LICENSE", "dist/npm/LICENSE");
  Deno.copyFileSync("README.md", "dist/npm/README.md");
} catch (e) {
  console.error(e instanceof Exit ? e.message : e);
  Deno.exit(1);
}
