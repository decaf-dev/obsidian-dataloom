import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import * as fs from "fs";
import path from "path";

const prod = process.argv[2] === "production";

// Define your custom plugin
const replaceImportPlugin = {
	name: "replace-import-plugin",
	setup(build) {
		build.onResolve(
			{ filter: /src\/obsidian-shim\/development/ },
			(args) => {
				const indexOfSrc = args.resolveDir.indexOf("src");
				const srcDir = args.resolveDir.slice(0, indexOfSrc);
				const resolvedPath = path.resolve(
					srcDir,
					args.path.replace(
						"obsidian-shim/development",
						"obsidian-shim/build"
					)
				);

				const possibleExtensions = [".tsx", ".ts"];
				let resolvedPathWithExtension = resolvedPath;
				for (const extension of possibleExtensions) {
					const pathWithExtension = resolvedPath + extension;
					if (fs.existsSync(pathWithExtension)) {
						resolvedPathWithExtension = pathWithExtension;
						break;
					}
				}

				return {
					path: resolvedPathWithExtension,
				};
			}
		);
	},
};

esbuild
	.build({
		entryPoints: ["src/main.ts"],
		bundle: true,
		external: [
			"obsidian",
			"electron",
			"@codemirror/autocomplete",
			"@codemirror/closebrackets",
			"@codemirror/collab",
			"@codemirror/commands",
			"@codemirror/comment",
			"@codemirror/fold",
			"@codemirror/gutter",
			"@codemirror/highlight",
			"@codemirror/history",
			"@codemirror/language",
			"@codemirror/lint",
			"@codemirror/matchbrackets",
			"@codemirror/panel",
			"@codemirror/rangeset",
			"@codemirror/rectangular-selection",
			"@codemirror/search",
			"@codemirror/state",
			"@codemirror/stream-parser",
			"@codemirror/text",
			"@codemirror/tooltip",
			"@codemirror/view",
			...builtins,
		],
		format: "cjs",
		watch: prod
			? false
			: {
					onRebuild(error) {
						if (error) console.error("watch build failed:", error);
						else
							fs.rename("main.css", "styles.css", (err) => {
								if (err) console.log(err);
							});
					},
			  },

		target: "es2016",
		logLevel: "info",
		sourcemap: !prod,
		treeShaking: true,
		outfile: "main.js",
		plugins: [replaceImportPlugin],
	})
	.then(() => {
		if (prod) {
			fs.rename("main.css", "styles.css", (err) => {
				if (err) console.log(err);
			});
		}
	})
	.catch(() => process.exit(1));
