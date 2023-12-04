import Text from "src/react/shared/text";

import "./styles.css";

interface Props {
	hasValidFrontmatter: boolean;
	doesColumnHaveFrontmatterKey: boolean;
}

export default function DisabledCell({
	hasValidFrontmatter,
	doesColumnHaveFrontmatterKey,
}: Props) {
	let ariaLabel = "";
	if (!doesColumnHaveFrontmatterKey) {
		ariaLabel =
			"This cell is disabled until you choose a frontmatter key for this column";
	} else if (!hasValidFrontmatter) {
		ariaLabel =
			"This cell has an invalid property value. Please correct it in the source file.";
	}
	return (
		<div className="dataloom-disabled-cell" aria-label={ariaLabel}>
			<Text value={hasValidFrontmatter ? "" : "Invalid property value"} />
		</div>
	);
}
