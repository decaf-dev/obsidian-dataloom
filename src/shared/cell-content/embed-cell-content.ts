import { isURL } from "../validators";

export const getEmbedCellContent = (markdown: string) => {
	if (isURL(markdown)) return `![](${markdown})`;
	return markdown;
};
