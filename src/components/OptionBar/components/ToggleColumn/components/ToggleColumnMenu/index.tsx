import Flex from "src/components/Flex";
import Menu from "src/components/Menu";
import Switch from "src/components/Switch";
import Text from "src/components/Text";
import { ToggleColumn } from "../../types";
import Padding from "src/components/Padding";
import Stack from "src/components/Stack";

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
		<Menu isOpen={isOpen} id={id} top={top} left={left} width={125}>
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
