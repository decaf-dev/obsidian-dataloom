import { isImage, isURL } from "../match";

export const getEmbedCellContent = (
	markdown: string,
	renderMarkdown: boolean
) => {
	if (isURL(markdown)) {
		if (renderMarkdown) return `![](${markdown})`;
		return markdown;
	} else if (isImage(markdown)){
		return markdown;
	}
	return "";


	if (isURL(markdown)) {
	// 	if (renderMarkdown) return `![](${markdown})`;
	// 	return markdown;
	// } else {
	return `![[${markdown}]]`;
	// return markdown;
	//}
	//return "";
};
