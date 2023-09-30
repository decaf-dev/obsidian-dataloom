import Stack from "../../shared/stack";
import SearchBar from "./search-bar";
import ActiveFilterBubble from "./active-filter-bubble";
import Padding from "src/react/shared/padding";
import Icon from "src/react/shared/icon";
import MenuButton from "src/react/shared/menu-button";
import MoreMenu from "./more-menu";
import FilterMenu from "./filter-menu";
import SortBubbleList from "./sort-bubble-list";

import {
	SortDir,
	Column,
	Filter,
	Source,
	SourceType,
} from "src/shared/loom-state/types/loom-state";
import { isSmallScreenSize } from "src/shared/render/utils";
import { useMenu } from "../../shared/menu/hooks";

import "./styles.css";
import SourcesMenu from "./sources-menu";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";

interface Props {
	columns: Column[];
	filters: Filter[];
	sources: Source[];
	showCalculationRow: boolean;
	onFilterUpdate: (
		filterId: string,
		data: Partial<Filter>,
		isPartial?: boolean
	) => void;
	onFilterDeleteClick: (filterId: string) => void;
	onFilterAddClick: () => void;
	onCalculationRowToggle: (value: boolean) => void;
	onSourceAdd: (
		type: SourceType,
		name: string,
		fileColumnId: string | null
	) => void;
	onSourceDelete: (id: string) => void;
	onColumnChange: ColumnChangeHandler;
}
export default function OptionBar({
	columns,
	filters,
	sources,
	showCalculationRow,
	onFilterUpdate,
	onFilterDeleteClick,
	onFilterAddClick,
	onCalculationRowToggle,
	onSourceAdd,
	onSourceDelete,
	onColumnChange,
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
		menu: sourcesMenu,
		triggerRef: sourcesMenuTriggerRef,
		triggerPosition: sourcesMenuTriggerPosition,
		isOpen: isSourcesMenuOpen,
		onOpen: onSourcesMenuOpen,
		onRequestClose: onSourcesMenuRequestClose,
		onClose: onSourcesMenuClose,
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

	function handleRemoveClick(columnId: string) {
		onColumnChange(
			columnId,
			{ sortDir: SortDir.NONE },
			{
				shouldSortRows: true,
			}
		);
	}

	function handleColumnToggle(columnId: string, isVisible: boolean) {
		onColumnChange(columnId, { isVisible });
	}

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
								onRemoveClick={handleRemoveClick}
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
							{isSmallScreen === false && (
								<MenuButton
									ref={sourcesMenuTriggerRef}
									menu={sourcesMenu}
									onOpen={onSourcesMenuOpen}
								>
									Sources
								</MenuButton>
							)}
							{isSmallScreen === false && (
								<MenuButton
									ref={filterMenuTriggerRef}
									menu={filterMenu}
									onOpen={onFilterMenuOpen}
								>
									Filter
								</MenuButton>
							)}
							<SearchBar />
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
			<SourcesMenu
				id={sourcesMenu.id}
				isOpen={isSourcesMenuOpen}
				triggerPosition={sourcesMenuTriggerPosition}
				sources={sources}
				columns={columns}
				onAddSource={onSourceAdd}
				onDeleteSource={onSourceDelete}
				onRequestClose={onSourcesMenuRequestClose}
				onClose={onSourcesMenuClose}
			/>
			<MoreMenu
				id={moreMenu.id}
				isOpen={isMoreMenuOpen}
				showCalculationRow={showCalculationRow}
				triggerPosition={moreMenuTriggerPosition}
				columns={columns}
				onFilterClick={() => onFilterMenuOpen()}
				onColumnToggle={handleColumnToggle}
				onRequestClose={onMoreMenuRequestClose}
				onCalculationRowToggle={onCalculationRowToggle}
				onClose={onMoreMenuClose}
				onSourcesClick={() => onSourcesMenuOpen()}
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
