import Flex from "src/react/shared/Flex";
import Menu from "src/react/shared/Menu";
import Switch from "src/react/shared/Switch";
import Text from "src/react/shared/Text";
import { ToggleColumn } from "../../types";
import Padding from "src/react/shared/Padding";
import Stack from "src/react/shared/Stack";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	columns: ToggleColumn[];
	onToggle: (id: string) => void;
}

export default function ToggleColumnMenu({
	id,
	top,
	left,
	isOpen,
	columns,
	onToggle,
}: Props) {
	return (
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={175}>
			<div className="NLT__toggle-column-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						{columns.map((column) => {
							return (
								<Flex key={column.id} justify="space-between">
									<Text value={column.name} />
									<Switch
										isChecked={column.isVisible}
										onToggle={() => onToggle(column.id)}
									/>
								</Flex>
							);
						})}
					</Stack>
				</Padding>
			</div>
		</Menu>
	);
}
