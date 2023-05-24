import Flex from "src/react/shared/flex";
import Menu from "src/react/shared/menu";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnWithMarkdown } from "./types";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	isReady: boolean;
	columns: ColumnWithMarkdown[];
	onToggle: (id: string) => void;
}

export default function ToggleColumnMenu({
	id,
	top,
	left,
	isOpen,
	isReady,
	columns,
	onToggle,
}: Props) {
	return (
		<Menu
			isOpen={isOpen}
			isReady={isReady}
			id={id}
			top={top}
			left={left}
			width={175}
		>
			<div className="NLT__toggle-column-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						{columns.map((column) => {
							const { id, markdown, isVisible } = column;
							return (
								<Flex key={id} justify="space-between">
									<Text value={markdown} maxWidth="100px" />
									<Switch
										isChecked={isVisible}
										onToggle={() => onToggle(id)}
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
