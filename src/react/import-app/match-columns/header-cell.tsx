import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";
import Icon from "src/react/shared/icon";
import SelectColumnMenu from "./select-column-menu";
import MenuButton from "src/react/shared/menu-button";

import { useOverflow } from "src/shared/spacing/hooks";
import { ColumnMatch, ImportColumn } from "../types";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

interface Props {
	isDisabled: boolean;
	columns: ImportColumn[];
	columnMatches: ColumnMatch[];
	index: number;
	importValue: string;
	matchId: string | null;
	onColumnToggle: (index: number) => void;
	onColumnMatch: (index: number, columnId: string | null) => void;
}

export default function HeaderCell({
	isDisabled,
	columns,
	columnMatches,
	index,
	importValue,
	matchId,
	onColumnMatch,
	onColumnToggle,
}: Props) {
	const overflowClassName = useOverflow(false, {
		ellipsis: true,
	});

	const COMPONENT_ID = `header-cell-${index}`;
	const menu = useMenu(COMPONENT_ID);

	function handleColumnClick(columnId: string | null) {
		onColumnMatch(index, columnId);
		menu.onClose();
	}

	return (
		<>
			<th className={overflowClassName}>
				<Stack
					className={isDisabled ? "dataloom-disabled" : undefined}
					isHorizontal
					justify="space-between"
					spacing="xl"
					width="100%"
				>
					<Stack isHorizontal spacing="sm">
						<Text value={importValue} />
						<Icon
							color={matchId ? "green" : "red"}
							ariaLabel={
								matchId !== null ? "Matched" : "Unmatched"
							}
							lucideId={
								matchId !== null
									? "shield-check"
									: "shield-question"
							}
							size="xl"
						/>
					</Stack>
					<Stack isHorizontal spacing="sm">
						<input
							aria-label="Toggle column"
							type="checkbox"
							checked={!isDisabled}
							onChange={() => onColumnToggle(index)}
						/>
						<MenuButton
							ref={menu.triggerRef}
							isFocused={menu.isTriggerFocused}
							menuId={menu.id}
							level={LoomMenuLevel.ONE}
							ariaLabel="Match column"
							icon={<Icon lucideId="columns" size="lg" />}
							onOpen={() =>
								menu.onOpen(LoomMenuLevel.ONE, {
									shouldFocusTriggerOnClose: false,
								})
							}
						/>
					</Stack>
				</Stack>
			</th>
			<SelectColumnMenu
				id={menu.id}
				isOpen={menu.isOpen}
				position={menu.position}
				selectedColumnId={matchId}
				columnMatches={columnMatches}
				columns={columns}
				onColumnClick={handleColumnClick}
			/>
		</>
	);
}
