import Button from "src/react/shared/button";
import Flex from "src/react/shared/flex";
import Icon from "src/react/shared/icon";
import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";

interface Props {
	showEditButton: boolean;
	onAddClick: () => void;
	onEditClick: () => void;
}

export default function SourcesHeader({
	showEditButton,
	onAddClick,
	onEditClick,
}: Props) {
	return (
		<Flex justify="space-between" align="center">
			<Text value="Sources" />
			<Stack isHorizontal spacing="sm">
				{showEditButton && (
					<Button
						icon={<Icon lucideId="edit"></Icon>}
						ariaLabel="Edit source"
						onClick={() => onEditClick()}
					/>
				)}
				<Button
					icon={<Icon lucideId="plus"></Icon>}
					onClick={() => onAddClick()}
					ariaLabel="Add source"
				/>
			</Stack>
		</Flex>
	);
}
