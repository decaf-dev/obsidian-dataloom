import Stack from "../../shared/stack";
import SearchBar from "./search-bar";
import ActiveFilterBubble from "./active-filter-bubble";
import Padding from "src/react/shared/padding";
import Icon from "src/react/shared/icon";
import MenuButton from "src/react/shared/menu-button";
import MoreMenu from "./more-menu";
import FilterMenu from "./filter-menu";
import SortBubbleList from "./sort-bubble-list";
import SourcesMenu from "./sources-menu";

import {
	SortDir,
	Column,
	Filter,
	Source,
	FilterCondition,
} from "src/shared/loom-state/types/loom-state";
import { isSmallScreenSize } from "src/shared/render/utils";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";
import { SourceAddHandler } from "../app/hooks/use-source/types";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

import "./styles.css";

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
	onSourceAdd: SourceAddHandler;
	onSourceDelete: (id: string) => void;
	onColumnChange: ColumnChangeHandler;
	onSourceUpdate: (id: string, data: Partial<Source>) => void;
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
	onSourceUpdate,
}: Props) {
	const COMPONENT_ID = "option-bar";
	const SOURCE_MENU_ID = "sources-menu";
	const MORE_MENU_ID = "more-menu";
	const FILTER_MENU_ID = "filter-menu";

	const sourcesMenu = useMenu(COMPONENT_ID, { name: SOURCE_MENU_ID });
	const moreMenu = useMenu(COMPONENT_ID, { name: MORE_MENU_ID });
	const filterMenu = useMenu(COMPONENT_ID, { name: FILTER_MENU_ID });

	// TODO re-enable
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

	function handleSourceFilterConditionChange(
		sourceId: string,
		value: FilterCondition
	) {
		onSourceUpdate(sourceId, { filterCondition: value });
	}

	function handleSourceFilterTextChange(sourceId: string, value: string) {
		onSourceUpdate(sourceId, { filterText: value });
	}

	function handleSourceMenuOpen() {
		sourcesMenu.onOpen(LoomMenuLevel.ONE);
	}

	function handleFilterMenuOpen() {
		filterMenu.onOpen(LoomMenuLevel.ONE);
		if (filters.length === 0) {
			onFilterAddClick();
		}
	}

	function handleMoreMenuOpen() {
		moreMenu.onOpen(LoomMenuLevel.ONE);
	}

	function handleFilterDelete(id: string) {
		onFilterDeleteClick(id);

		//Close the menu when the last filter is deleted
		if (filters.length === 1) {
			filterMenu.onClose();
		}
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
									isFocused={sourcesMenu.isTriggerFocused}
									menuId={sourcesMenu.id}
									ref={sourcesMenu.triggerRef}
									level={LoomMenuLevel.ONE}
									onOpen={handleSourceMenuOpen}
								>
									Sources
								</MenuButton>
							)}
							{isSmallScreen === false && (
								<MenuButton
									isFocused={filterMenu.isTriggerFocused}
									menuId={filterMenu.id}
									ref={filterMenu.triggerRef}
									level={LoomMenuLevel.ONE}
									onOpen={handleFilterMenuOpen}
								>
									Filter
								</MenuButton>
							)}
							<SearchBar />
							<MenuButton
								isFocused={moreMenu.isTriggerFocused}
								menuId={moreMenu.id}
								ref={moreMenu.triggerRef}
								level={LoomMenuLevel.ONE}
								icon={<Icon lucideId="more-vertical" />}
								onOpen={handleMoreMenuOpen}
							/>
						</Stack>
					</Stack>
				</Padding>
			</div>
			<SourcesMenu
				id={sourcesMenu.id}
				isOpen={sourcesMenu.isOpen}
				position={sourcesMenu.position}
				sources={sources}
				columns={columns}
				onSourceAdd={onSourceAdd}
				onSourceDelete={onSourceDelete}
				onSourceFilterConditionChange={
					handleSourceFilterConditionChange
				}
				onSourceFilterTextChange={handleSourceFilterTextChange}
				onClose={sourcesMenu.onClose}
			/>
			<MoreMenu
				id={moreMenu.id}
				isOpen={moreMenu.isOpen}
				showCalculationRow={showCalculationRow}
				position={moreMenu.position}
				columns={columns}
				onFilterClick={handleFilterMenuOpen}
				onColumnToggle={handleColumnToggle}
				onCalculationRowToggle={onCalculationRowToggle}
				onClose={moreMenu.onClose}
				onSourcesClick={handleSourceMenuOpen}
			/>
			<FilterMenu
				id={filterMenu.id}
				isOpen={filterMenu.isOpen}
				position={
					isSmallScreen ? moreMenu.position : filterMenu.position
				}
				columns={columns}
				filters={filters}
				onUpdate={onFilterUpdate}
				onDeleteClick={handleFilterDelete}
				onAddClick={onFilterAddClick}
			/>
		</>
	);
}
