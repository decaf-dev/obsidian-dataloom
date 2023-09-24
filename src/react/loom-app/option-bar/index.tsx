import Stack from "../../shared/stack";
import SearchBar from "./search-bar";
import ActiveFilterBubble from "./active-filter-bubble";
import Padding from "src/react/shared/padding";
import Icon from "src/react/shared/icon";
import MenuButton from "src/react/shared/menu-button";
import MoreMenu from "./more-menu";
import ToggleColumnMenu from "./toggle-column-menu";
import FilterMenu from "./filter-menu";
import SortBubbleList from "./sort-bubble-list";

import {
	SortDir,
	Column,
	Filter,
} from "src/shared/loom-state/types/loom-state";
import { isSmallScreenSize } from "src/shared/render/utils";
import { useMenu } from "../../shared/menu/hooks";

import "./styles.css";

interface Props {
	numFrozenColumns: number;
	columns: Column[];
	filters: Filter[];
	showCalculationRow: boolean;
	onSortRemoveClick: (columnId: string) => void;
	onColumnToggle: (columnId: string, isVisible: boolean) => void;
	onFilterUpdate: (
		filterId: string,
		data: Partial<Filter>,
		isPartial?: boolean
	) => void;
	onFilterDeleteClick: (filterId: string) => void;
	onFilterAddClick: () => void;
	onFrozenColumnsChange: (value: number) => void;
	onCalculationRowToggle: (value: boolean) => void;
}
export default function OptionBar({
	numFrozenColumns,
	columns,
	filters,
	showCalculationRow,
	onSortRemoveClick,
	onColumnToggle,
	onFilterUpdate,
	onFilterDeleteClick,
	onFilterAddClick,
	onFrozenColumnsChange,
	onCalculationRowToggle,
}: Props) {
	const {
		menu: moreMenu,
		triggerRef: moreMenuTriggerRef,
		triggerPosition: moreMenuTriggerPosition,
		isOpen: isMoreMenuOpen,
		onOpen: onMoreMenuOpen,
		onRequestClose: onMoreMenuRequestClose,
		onClose: onMoreMenuClose,
	} = useMenu();

	const {
		menu: toggleMenu,
		triggerRef: toggleMenuTriggerRef,
		triggerPosition: toggleMenuTriggerPosition,
		isOpen: isToggleMenuOpen,
		onOpen: onToggleMenuOpen,
		onRequestClose: onToggleMenuRequestClose,
		onClose: onToggleMenuClose,
	} = useMenu();

	const {
		menu: filterMenu,
		triggerRef: filterMenuTriggerRef,
		triggerPosition: filterMenuTriggerPosition,
		isOpen: isFilterMenuOpen,
		onOpen: onFilterMenuOpen,
		onRequestClose: onFilterMenuRequestClose,
		onClose: onFilterMenuClose,
	} = useMenu();

	//TODO re-enable
	// const previousLength = usePrevious(filterRules.length);
	// React.useEffect(() => {
	// 	if (previousLength !== undefined) {
	// 		if (previousLength < filterRules.length) {
	// 			if (filterMenuRef.current) {
	// 				//Scroll to the bottom if we're adding a new filter
	// 				filterMenuRef.current.scrollTop =
	// 					filterMenuRef.current.scrollHeight;
	// 			}
	// 		}
	// 	}
	// }, [previousLength, filterRules.length, filterMenuRef]);

	const activeFilters = filters.filter((filter) => filter.isEnabled);

	const sortedColumns = columns.filter(
		(column) => column.sortDir !== SortDir.NONE
	);

	const isSmallScreen = isSmallScreenSize();
	return (
		<>
			<div className="dataloom-option-bar">
				<Padding py="lg">
					<Stack
						isHorizontal={!isSmallScreen}
						spacing="sm"
						{...(!isSmallScreen && { justify: "space-between" })}
					>
						<Stack
							isHorizontal
							spacing="md"
							overflow="auto"
							{...(isSmallScreen && {
								width: "100%",
								justify: "flex-end",
							})}
						>
							<SortBubbleList
								sortedColumns={sortedColumns}
								onRemoveClick={onSortRemoveClick}
							/>
							<ActiveFilterBubble
								numActive={activeFilters.length}
							/>
						</Stack>
						<Stack
							isHorizontal
							spacing="sm"
							justify="flex-end"
							{...(isSmallScreen && {
								height: "40px",
								width: "100%",
							})}
						>
							<SearchBar />
							{isSmallScreen === false && (
								<MenuButton
									ref={filterMenuTriggerRef}
									menu={filterMenu}
									onOpen={onFilterMenuOpen}
								>
									Filter
								</MenuButton>
							)}
							{isSmallScreen === false && (
								<MenuButton
									ref={toggleMenuTriggerRef}
									menu={toggleMenu}
									onOpen={onToggleMenuOpen}
								>
									Toggle
								</MenuButton>
							)}
							<MenuButton
								ref={moreMenuTriggerRef}
								menu={moreMenu}
								icon={<Icon lucideId="more-vertical" />}
								onOpen={onMoreMenuOpen}
							/>
						</Stack>
					</Stack>
				</Padding>
			</div>
			<MoreMenu
				id={moreMenu.id}
				isOpen={isMoreMenuOpen}
				showCalculationRow={showCalculationRow}
				triggerPosition={moreMenuTriggerPosition}
				numFrozenColumns={numFrozenColumns}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onFilterClick={() => onFilterMenuOpen()}
				onToggleColumnClick={() => onToggleMenuOpen()}
				onRequestClose={onMoreMenuRequestClose}
				onCalculationRowToggle={onCalculationRowToggle}
				onClose={onMoreMenuClose}
			/>
			<ToggleColumnMenu
				id={toggleMenu.id}
				isOpen={isToggleMenuOpen}
				triggerPosition={
					isSmallScreen
						? moreMenuTriggerPosition
						: toggleMenuTriggerPosition
				}
				columns={columns}
				onToggle={onColumnToggle}
				onRequestClose={onToggleMenuRequestClose}
				onClose={onToggleMenuClose}
			/>
			<FilterMenu
				id={filterMenu.id}
				isOpen={isFilterMenuOpen}
				triggerPosition={
					isSmallScreen
						? moreMenuTriggerPosition
						: filterMenuTriggerPosition
				}
				columns={columns}
				filters={filters}
				onUpdate={onFilterUpdate}
				onDeleteClick={onFilterDeleteClick}
				onAddClick={onFilterAddClick}
				onRequestClose={onFilterMenuRequestClose}
				onClose={onFilterMenuClose}
			/>
		</>
	);
}
