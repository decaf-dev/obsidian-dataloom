import Stack from "src/react/shared/stack";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import { CellType, HeaderCell } from "src/shared/loom-state/types";
import { useOverflow } from "src/shared/spacing/hooks";
import { ImportColumn } from "../types";
import Icon from "src/react/shared/icon";
import SelectColumnMenu from "./select-column-menu";
import { useModalMenu } from "src/react/shared/menu/hooks";
import MenuButton from "src/react/shared/menu-button";

interface Props {
	isDisabled: boolean;
	columns: ImportColumn[];
	index: number;
	importValue: string;
	matchId: string | null;
	onColumnToggle: (index: number) => void;
	onColumnMatch: (index: number, columnId: string) => void;
}

export default function HeaderCell({
	isDisabled,
	columns,
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

	const column = columns.find((column) => column.id === matchId) ?? {
		id: "-1",
		type: CellType.TEXT,
		name: importValue,
	};
	const { name } = column;

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
					<Stack isHorizontal spacing="md">
						<Icon
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
						<Text value={name} />
					</Stack>
					<Stack isHorizontal spacing="md">
						<Switch
							ariaLabel="Toggle column"
							value={!isDisabled}
							onToggle={() => onColumnToggle(index)}
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
				columns={columns}
				onRequestClose={onRequestClose}
				onClose={onClose}
				onColumnClick={(columnId) => onColumnMatch(index, columnId)}
			/>
		</>
	);
}
