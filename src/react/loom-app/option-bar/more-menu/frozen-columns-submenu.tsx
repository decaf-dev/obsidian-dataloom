import Button from "src/react/shared/button";
import Icon from "src/react/shared/icon";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import Submenu from "src/react/shared/submenu";
import Text from "src/react/shared/text";
import { useAppSelector } from "src/redux/hooks";

interface Props {
	numFrozenColumns: number;
	onFrozenColumnsChange: (value: number) => void;
	onBackClick: () => void;
}

export default function FrozenColumnsSubmenu({
	numFrozenColumns,
	onFrozenColumnsChange,
	onBackClick,
}: Props) {
	const { defaultFrozenColumnCount } = useAppSelector(
		(state) => state.global.settings
	);

	function handlePlusClick() {
		const newValue = numFrozenColumns + 1;
		if (newValue > 3) return;
		onFrozenColumnsChange(newValue);
	}

	function handleMinusClick() {
		const newValue = numFrozenColumns - 1;
		if (newValue < 0) return;
		onFrozenColumnsChange(newValue);
	}

	return (
		<Submenu title="Freeze" onBackClick={onBackClick}>
			<Padding py="sm">
				<Stack isHorizontal spacing="sm">
					<Button
						icon={<Icon lucideId="rotate-ccw" />}
						ariaLabel="Restore default"
						onClick={() =>
							onFrozenColumnsChange(defaultFrozenColumnCount)
						}
					/>
					<Button
						icon={<Icon lucideId="minus" />}
						ariaLabel="Subtract column"
						onClick={() => handleMinusClick()}
					/>
					<Padding px="sm">
						<Text value={numFrozenColumns} />
					</Padding>
					<Button
						icon={<Icon lucideId="plus" />}
						ariaLabel="Add column"
						onClick={() => handlePlusClick()}
					/>
				</Stack>
			</Padding>
		</Submenu>
	);
}
