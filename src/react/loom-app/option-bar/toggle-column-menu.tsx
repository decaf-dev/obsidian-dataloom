import Menu from "src/react/shared/menu";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnWithMarkdown } from "./types";
import Wrap from "src/react/shared/wrap";

import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	columns: ColumnWithMarkdown[];
	onToggle: (id: string, isVisible: boolean) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}
export default function ToggleColumnMenu({
	id,
	triggerPosition,
	isOpen,
	columns,
	onToggle,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<Menu
			isOpen={isOpen}
			id={id}
			triggerPosition={triggerPosition}
			openDirection="bottom-left"
			maxHeight={220}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div className="dataloom-toggle-column-menu">
				<Padding p="md">
					<Stack spacing="md">
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
										value={isVisible}
										onToggle={() =>
											onToggle(id, !isVisible)
										}
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
