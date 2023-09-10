import Token from "markdown-it/lib/token";
import markdownIt from "markdown-it";

export const parseMarkdownTableIntoTokens = (markdown: string) => {
	const md = markdownIt();

	//If any of the lines have a tab, the entire table will be rendered as a code block.
	//This is a workaround to prevent that.
	const lines = markdown.split("\n");
	const trimmedLines = lines.map((line) => line.trim());
	const updatedMarkdown = trimmedLines.join("\n");
	return md.parse(updatedMarkdown, {});
};

export const tableTokensToArr = (tokens: Token[]) => {
	const tableData: string[][] = [];
	for (const token of tokens) {
		if (token.type === "tr_open") {
			// Initialize a new row
			tableData.push([]);
		} else if (token.type === "inline") {
			const cellContent = token.content.trim();
			tableData[tableData.length - 1].push(cellContent);
		}
	}

	return tableData;
};

export const validateMarkdownTable = (tokens: Token[]) => {
	let numTables = 0;
	let hasHeaderRow = false;
	let hasDataRows = false;

	for (const token of tokens) {
		if (token.type === "table_open") {
			hasHeaderRow = false;
			hasDataRows = false;
		} else if (token.type === "table_close") {
			if (!hasHeaderRow) {
				throw new Error("Markdown table must have a header row.");
			} else if (!hasDataRows) {
				throw new Error(
					"Markdown table must have at least one data row."
				);
			}
			numTables++;
		} else if (token.type === "thead_open") {
			hasHeaderRow = true;
		} else if (token.type === "tbody_open") {
			hasDataRows = true;
		}
	}

	if (numTables === 0) {
		throw new Error("Markdown must have a table.");
	} else if (numTables > 1) {
		throw new Error("Markdown must have only one table.");
	}
};
