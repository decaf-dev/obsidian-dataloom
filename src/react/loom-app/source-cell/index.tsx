import { SourceType } from "src/shared/loom-state/types/loom-state";
import Bubble from "src/react/shared/bubble";
import Icon from "src/react/shared/icon";
import { getIconIdForSourceType } from "src/react/shared/icon/utils";

interface Props {
	content: string;
	type: SourceType;
}

export default function SourceCell({ content, type }: Props) {
	return (
		<div className="dataloom-source-cell">
			<Bubble
				variant="no-fill"
				icon={<Icon lucideId={getIconIdForSourceType(type)} />}
				value={content}
			/>
		</div>
	);
}
