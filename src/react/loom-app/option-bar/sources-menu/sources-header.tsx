import Button from "src/react/shared/button";
import Flex from "src/react/shared/flex";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";

interface Props {
	onAddClick: () => void;
	onEditClick: () => void;
}

export default function SourcesHeader({ onAddClick, onEditClick }: Props) {
	return (
		<Flex justify="space-between" align="center">
			<Text value="Sources" />
			<Stack isHorizontal spacing="sm">
				<Button
					icon={<Icon lucideId="edit"></Icon>}
					onClick={() => onEditClick()}
				/>
				<Button
					icon={<Icon lucideId="plus"></Icon>}
					onClick={() => onAddClick()}
				/>
			</Stack>
		</Flex>
	);
}
