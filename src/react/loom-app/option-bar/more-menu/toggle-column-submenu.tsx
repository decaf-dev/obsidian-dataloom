import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import Wrap from "src/react/shared/wrap";
import { type Column } from "src/shared/loom-state/types/loom-state";

interface Props {
	columns: Column[];
	onColumnToggle: (id: string, isVisible: boolean) => void;
	onBackClick: () => void;
}

export default function ToggleColumnSubmenu({
	columns,
	onColumnToggle,
	onBackClick,
}: Props) {
	return (
		<Submenu title="Toggle" onBackClick={onBackClick}>
			<Padding py="sm">
				<Stack spacing="md">
					{columns.map((column) => {
						const { id, content, isVisible } = column;
						return (
							<Wrap
								key={id}
								justify="space-between"
								spacingX="4xl"
							>
								<Text value={content} maxWidth="250px" />
								<Switch
									value={isVisible}
									onToggle={() =>
										onColumnToggle(id, !isVisible)
									}
								/>
							</Wrap>
						);
					})}
				</Stack>
			</Padding>
		</Submenu>
	);
}
