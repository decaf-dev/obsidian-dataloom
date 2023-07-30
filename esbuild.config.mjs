import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import * as fs from "fs";

const prod = process.argv[2] === "production";
const tools = process.argv[2] === "tools";

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
		define: {
			"process.env.ENABLE_REACT_DEVTOOLS": tools
				? JSON.stringify("true")
				: JSON.stringify("false"),
		},
		treeShaking: true,
		outfile: "main.js",
	})
	.then(() => {
		if (prod) {
			fs.rename("main.css", "styles.css", (err) => {
				if (err) console.log(err);
			});
		}
	})
	.catch(() => process.exit(1));
