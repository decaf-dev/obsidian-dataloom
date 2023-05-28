import Menu from "src/react/shared/menu";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnWithMarkdown } from "./types";
import Wrap from "src/react/shared/wrap";

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
		<Menu isOpen={isOpen} isReady={isReady} id={id} top={top} left={left}>
			<div className="NLT__toggle-column-menu">
				<Padding p="md">
					<Stack spacing="md" isVertical>
						{columns.map((column) => {
							const { id, markdown, isVisible } = column;
							return (
								<Wrap
									key={id}
									justify="space-between"
									spacingX="4xl"
								>
									<Text value={markdown} maxWidth="250px" />
									<Switch
										isChecked={isVisible}
										onToggle={() => onToggle(id)}
									/>
								</Wrap>
							);
						})}
					</Stack>
				</Padding>
			</div>
		</Menu>
	);
}
