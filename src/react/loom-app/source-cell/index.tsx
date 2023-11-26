import { SourceType } from "src/shared/loom-state/types/loom-state";
import Bubble from "src/react/shared/bubble";
import Icon from "src/react/shared/icon";
import { getIconIdForSourceType } from "src/react/shared/icon/utils";
import { ObsidianPropertyType } from "src/shared/frontmatter/types";

interface Props {
	content: string;
	sourceType: SourceType;
	propertyType?: ObsidianPropertyType;
}

export default function SourceCell({
	content,
	sourceType,
	propertyType,
}: Props) {
	return (
		<div className="dataloom-source-cell">
			<Bubble
				variant="no-fill"
				icon={
					<Icon
						lucideId={getIconIdForSourceType(sourceType, {
							propertyType,
						})}
					/>
				}
				value={content}
			/>
		</div>
	);
}
