import Flex from "src/react/shared/flex";
import Padding from "src/react/shared/padding";
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
			<Padding py="sm">
				<Flex justify="space-between" align="center">
					<Text value="Display calculation row" />
					<Switch
						value={showCalculationRow}
						onToggle={onCalculationRowToggle}
					/>
				</Flex>
			</Padding>
		</Submenu>
	);
}
