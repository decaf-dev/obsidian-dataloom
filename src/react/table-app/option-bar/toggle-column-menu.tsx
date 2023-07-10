import Menu from "src/react/shared/menu";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { ColumnWithMarkdown } from "./types";
import Wrap from "src/react/shared/wrap";
import React from "react";

interface Props {
	id: string;
	top: number;
	left: number;
	isOpen: boolean;
	columns: ColumnWithMarkdown[];
	onToggle: (id: string) => void;
}
const ToggleColumnMenu = React.forwardRef<HTMLDivElement, Props>(
	function ToggleColumnMenu(
		{ id, top, left, isOpen, columns, onToggle }: Props,
		ref
	) {
		return (
			<Menu isOpen={isOpen} id={id} top={top} left={left} ref={ref}>
				<div className="DataLoom__toggle-column-menu">
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
										<Text
											value={markdown}
											maxWidth="250px"
										/>
										<Switch
											value={isVisible}
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
);

export default ToggleColumnMenu;
