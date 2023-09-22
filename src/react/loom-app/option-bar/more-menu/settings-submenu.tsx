import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";

interface Props {
	showCalculationRow: boolean;
	onCalculationRowToggle: (value: boolean) => void;
	onBackClick: () => void;
}

export default function SettingsSubmenu({
	showCalculationRow,
	onCalculationRowToggle,
	onBackClick,
}: Props) {
	return (
		<Submenu title="Settings" onBackClick={onBackClick}>
			<Padding px="lg" py="md">
				<Stack isHorizontal spacing="lg">
					<Text value="Calculation row" />
					<Switch
						value={showCalculationRow}
						onToggle={onCalculationRowToggle}
					/>
				</Stack>
			</Padding>
		</Submenu>
	);
}
