import Text from "src/react/shared/text";

import "./styles.css";

interface Props {
	hasValidFrontmatter: boolean;
}

export default function DisabledCell({ hasValidFrontmatter }: Props) {
	// ariaLabel =
	// 	"This cell is disabled until you choose a frontmatter key for this column";
	return (
		<div className="dataloom-disabled-cell">
			<Text
				value={hasValidFrontmatter ? "" : "Invalid frontmatter value"}
			/>
		</div>
	);
}
