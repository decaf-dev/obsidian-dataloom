import Stack from "src/react/shared/stack";
import Text from "src/react/shared/text";
import { HeaderCell } from "src/shared/loom-state/types/loom-state";
import { useOverflow } from "src/shared/spacing/hooks";
import { ColumnMatch, ImportColumn } from "../types";
import Icon from "src/react/shared/icon";
import SelectColumnMenu from "./select-column-menu";
import { useModalMenu } from "src/react/shared/menu/hooks";
import MenuButton from "src/react/shared/menu-button";

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

	const {
		menu,
		triggerPosition,
		triggerRef,
		isOpen,
		onOpen,
		onClose,
		onRequestClose,
	} = useModalMenu({
		shouldFocusTriggerOnClose: false,
	});

	function handleColumnClick(columnId: string | null) {
		onColumnMatch(index, columnId);
		onClose();
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
							menu={menu}
							ref={triggerRef}
							ariaLabel="Match column"
							icon={<Icon lucideId="columns" size="lg" />}
							onOpen={onOpen}
						/>
					</Stack>
				</Stack>
			</th>
			<SelectColumnMenu
				id={menu.id}
				isOpen={isOpen}
				triggerPosition={triggerPosition}
				selectedColumnId={matchId}
				columnMatches={columnMatches}
				columns={columns}
				onRequestClose={onRequestClose}
				onClose={onClose}
				onColumnClick={handleColumnClick}
			/>
		</>
	);
}
