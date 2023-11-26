import Bubble from "src/react/shared/bubble";
import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import SourceItem from "../source-item";

import { SourceType } from "src/shared/loom-state/types/loom-state";
import { getIconIdForSourceType } from "src/react/shared/icon/utils";
import Flex from "src/react/shared/flex";

interface Props {
	id: string;
	content: string;
	type: SourceType;
	onDelete: (id: string) => void;
}

export default function FolderSourceItem({
	id,
	content,
	type,
	onDelete,
}: Props) {
	return (
		<SourceItem>
			<Flex justify="space-between" align="center" height="100%">
				<Stack isHorizontal spacing="sm">
					<Bubble
						icon={<Icon lucideId={getIconIdForSourceType(type)} />}
						variant="no-fill"
						value={content}
					/>
				</Stack>
				<Button
					icon={<Icon lucideId="trash" />}
					ariaLabel="Delete source"
					onClick={() => onDelete(id)}
				/>
			</Flex>
		</SourceItem>
	);
}
