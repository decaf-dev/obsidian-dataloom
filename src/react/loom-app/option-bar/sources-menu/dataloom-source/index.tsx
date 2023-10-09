import Bubble from "src/react/shared/bubble";
import Button from "src/react/shared/button";
import Flex from "src/react/shared/flex";
import Icon from "src/react/shared/icon";
import { getIconIdForSourceType } from "src/react/shared/icon/utils";
import Stack from "src/react/shared/stack";
import { SourceType } from "src/shared/loom-state/types/loom-state";

import "./styles.css";

interface Props {
	id: string;
	content: string;
	type: SourceType;
	isEditing: boolean;
	onDelete: (id: string) => void;
}

export default function SourceItem({
	id,
	content,
	type,
	isEditing,
	onDelete,
}: Props) {
	return (
		<div className="dataloom-source">
			<Flex justify="space-between" align="center" height="100%">
				<Stack isHorizontal spacing="sm">
					{/* <Icon lucideId="grip-vertical" /> */}
					<Bubble
						icon={<Icon lucideId={getIconIdForSourceType(type)} />}
						variant="no-fill"
						value={content}
					/>
				</Stack>
				{isEditing && (
					<Button
						icon={<Icon lucideId="trash" />}
						ariaLabel="Delete source"
						onClick={() => onDelete(id)}
					/>
				)}
			</Flex>
		</div>
	);
}
