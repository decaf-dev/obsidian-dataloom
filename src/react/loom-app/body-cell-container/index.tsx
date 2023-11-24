import React from "react";

import { Notice } from "obsidian";

import TextCell from "../text-cell";
import TagCell from "../tag-cell";
import CheckboxCell from "../checkbox-cell";
import DateCell from "../date-cell";
import NumberCell from "../number-cell";
import NumberCellEdit from "../number-cell-edit";
import TextCellEdit from "../text-cell-edit";
import TagCellEdit from "../tag-cell-edit";
import DateCellEdit from "../date-cell-edit";
import MultiTagCell from "../multi-tag-cell";
import Menu from "../../shared/menu";
import MenuTrigger from "src/react/shared/menu-trigger";
import FileCell from "../file-cell";
import FileCellEdit from "../file-cell-edit";
import EmbedCell from "../embed-cell";
import EmbedCellEdit from "../embed-cell-edit";
import LastEditedTimeCell from "../last-edited-time-cell";
import CreationTimeCell from "../creation-time-cell";
import SourceFileCell from "../source-file-cell";
import SourceCell from "../source-cell";

import {
	TextCell as TextCellInterface,
	NumberCell as NumberCellInterface,
	TagCell as TagCellInterface,
	MultiTagCell as MultiTagCellInterface,
	DateCell as DateCellInterface,
	CheckboxCell as CheckboxCellInterface,
	CreationTimeCell as CreationTimeCellInterface,
	LastEditedTimeCell as LastEditedTimeCellInterface,
	SourceCell as SourceCellInterface,
	SourceFileCell as SourceFileCellInterface,
	FileCell as FileCellInterface,
	EmbedCell as EmbedCellInterface,
} from "src/shared/loom-state/types/loom-state";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	DateFormatSeparator,
	NumberFormat,
	PaddingSize,
	Source,
	Tag,
} from "src/shared/loom-state/types/loom-state";
import { Color } from "src/shared/loom-state/types/loom-state";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";
import { CellChangeHandler } from "../app/hooks/use-cell/types";
import {
	TagAddHandler,
	TagCellAddHandler,
	TagChangeHandler,
} from "../app/hooks/use-tag/types";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

import "./styles.css";
import { useOverflow } from "src/shared/spacing/hooks";

interface BaseCellProps {
	frontmatterKey: string | null;
	aspectRatio: AspectRatio;
	verticalPadding: PaddingSize;
	horizontalPadding: PaddingSize;
	dateFormat: DateFormat;
	numberPrefix: string;
	hour12: boolean;
	includeTime: boolean;
	dateFormatSeparator: DateFormatSeparator;
	numberSuffix: string;
	numberSeparator: string;
	numberFormat: NumberFormat;
	currencyType: CurrencyType;
	columnId: string;
	width: string;
	rowCreationTime: string;
	rowLastEditedTime: string;
	shouldWrapOverflow: boolean;
	columnTags: Tag[];
	source: Source | null;
	onCellChange: CellChangeHandler;
}

type TextCellProps = BaseCellProps &
	TextCellInterface & {
		type: CellType.TEXT;
	};

type EmbedCellProps = BaseCellProps &
	EmbedCellInterface & {
		type: CellType.EMBED;
	};

type FileCellProps = BaseCellProps &
	FileCellInterface & {
		type: CellType.FILE;
	};

type TagCellProps = BaseCellProps &
	TagCellInterface & {
		type: CellType.TAG;
		onTagCellRemove: (cellId: string, tagId: string) => void;
		onTagCellMultipleRemove: (cellId: string, tagIds: string[]) => void;
		onTagCellAdd: TagCellAddHandler;
		onTagAdd: TagAddHandler;
		onTagDeleteClick: (columnId: string, tagId: string) => void;
		onTagChange: TagChangeHandler;
	};

type MultiTagCellProps = BaseCellProps &
	MultiTagCellInterface & {
		type: CellType.MULTI_TAG;
		onTagCellRemove: (cellId: string, tagId: string) => void;
		onTagCellMultipleRemove: (cellId: string, tagIds: string[]) => void;
		onTagCellAdd: TagCellAddHandler;
		onTagAdd: TagAddHandler;
		onTagDeleteClick: (columnId: string, tagId: string) => void;
		onTagChange: TagChangeHandler;
	};

type NumberCellProps = BaseCellProps &
	NumberCellInterface & {
		type: CellType.NUMBER;
	};

type DateCellProps = BaseCellProps &
	DateCellInterface & {
		type: CellType.DATE;
		onColumnChange: ColumnChangeHandler;
	};

type CheckboxCellProps = BaseCellProps &
	CheckboxCellInterface & {
		type: CellType.CHECKBOX;
	};

type CreationTimeCellProps = BaseCellProps &
	CreationTimeCellInterface & {
		type: CellType.CREATION_TIME;
	};

type LastEditedTimeCellProps = BaseCellProps &
	LastEditedTimeCellInterface & {
		type: CellType.LAST_EDITED_TIME;
	};

type SourceCellProps = BaseCellProps &
	SourceCellInterface & {
		type: CellType.SOURCE;
	};

type SourceFileCellProps = BaseCellProps &
	SourceFileCellInterface & {
		type: CellType.SOURCE_FILE;
	};

type Props =
	| TextCellProps
	| EmbedCellProps
	| FileCellProps
	| TagCellProps
	| MultiTagCellProps
	| NumberCellProps
	| DateCellProps
	| CheckboxCellProps
	| CreationTimeCellProps
	| LastEditedTimeCellProps
	| SourceCellProps
	| SourceFileCellProps;

export default function BodyCellContainer(props: Props) {
	const {
		id,
		columnId,
		source,
		includeTime,
		aspectRatio,
		dateFormatSeparator,
		numberFormat,
		verticalPadding,
		frontmatterKey,
		currencyType,
		horizontalPadding,
		dateFormat,
		hour12,
		numberPrefix,
		numberSuffix,
		numberSeparator,
		type,
		rowCreationTime,
		rowLastEditedTime,
		columnTags,
		width,
		shouldWrapOverflow,
		onCellChange,
	} = props;

	const shouldRequestOnClose =
		type === CellType.TEXT ||
		type === CellType.EMBED ||
		type === CellType.NUMBER ||
		type === CellType.TAG ||
		type === CellType.MULTI_TAG ||
		type === CellType.DATE;

	const isDisabled = source !== null && frontmatterKey === null;

	const isUneditable =
		type === CellType.CHECKBOX ||
		type === CellType.CREATION_TIME ||
		type === CellType.LAST_EDITED_TIME ||
		type === CellType.SOURCE ||
		type === CellType.SOURCE_FILE;

	const COMPONENT_ID = `body-cell-${id}`;
	const menu = useMenu(COMPONENT_ID);

	async function copyTextToClipboard(value: string) {
		try {
			await navigator.clipboard.writeText(value);
			new Notice("Copied text to clipboard");
		} catch (err) {
			console.error(err);
		}
	}

	function onMenuTriggerEnterDown(cellActionCallback: () => void) {
		return () => {
			if (isDisabled) return;
			cellActionCallback();
		};
	}

	function onMenuTriggerClick(cellActionCallback: () => void) {
		return () => {
			if (isDisabled) return;
			cellActionCallback();
		};
	}

	let menuWidth = menu.position.width;
	if (
		type === CellType.TAG ||
		type === CellType.MULTI_TAG ||
		type === CellType.EMBED
	) {
		menuWidth = 250;
	} else if (type === CellType.FILE) {
		menuWidth = 275;
	} else if (type === CellType.DATE) {
		menuWidth = 235;
	}

	let menuHeight = menu.position.height;
	if (
		type === CellType.TAG ||
		type === CellType.MULTI_TAG ||
		type === CellType.DATE ||
		type === CellType.NUMBER ||
		type === CellType.FILE ||
		type === CellType.EMBED
	) {
		menuHeight = 0;
	}

	let className = "dataloom-cell--body__container";

	const overflowClass = useOverflow(shouldWrapOverflow, {
		ellipsis: type === CellType.DATE,
	});

	className += " " + overflowClass;

	if (isUneditable) {
		className += " dataloom-cell--uneditable";
	} else if (isDisabled) {
		className += " dataloom-cell--disabled";
	}

	let shouldRunTrigger = true;
	if (isUneditable || isDisabled) {
		shouldRunTrigger = false;
	}

	let ariaLabel = "";
	if (isDisabled) {
		ariaLabel =
			"This cell is disabled until you choose a frontmatter key for this column";
	}

	let contentNode: React.ReactNode | null = null;
	let menuNode: React.ReactNode | null = null;
	let handleCellContextClick: () => void = () => undefined;
	let handleMenuTriggerEnterDown: () => void = () => undefined;
	let handleMenuTriggerClick: () => void = () => undefined;
	let handleMenuTriggerBackspaceDown: () => void = () => undefined;

	switch (type) {
		case CellType.TEXT: {
			const { content } = props as TextCellProps;

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { content: "" });
			};

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			const handleInputChange = React.useCallback(
				(value: string) => {
					onCellChange(id, { content: value });
				},
				[id, onCellChange]
			);

			contentNode = <TextCell value={content} />;
			menuNode = (
				<TextCellEdit
					cellId={id}
					closeRequest={menu.closeRequest}
					shouldWrapOverflow={shouldWrapOverflow}
					value={content}
					onChange={handleInputChange}
					onClose={menu.onClose}
				/>
			);
			break;
		}
		case CellType.NUMBER: {
			const { value } = props as NumberCellProps;

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { value: null });
			};

			handleCellContextClick = () => {
				//TODO fix
				//This is a get content function?
				copyTextToClipboard(value?.toString() ?? "");
			};

			const handleInputChange = React.useCallback(
				(value: number | null) => {
					onCellChange(id, { value });
				},
				[id, onCellChange]
			);

			contentNode = (
				<NumberCell
					value={value}
					currency={currencyType}
					format={numberFormat}
					prefix={numberPrefix}
					suffix={numberSuffix}
					separator={numberSeparator}
				/>
			);
			menuNode = (
				<NumberCellEdit
					closeRequest={menu.closeRequest}
					value={value}
					onChange={handleInputChange}
					onClose={menu.onClose}
				/>
			);
			break;
		}
		case CellType.TAG:
		case CellType.MULTI_TAG: {
			const {
				onTagCellRemove,
				onTagAdd,
				onTagChange,
				onTagCellAdd,
				onTagDeleteClick,
				onTagCellMultipleRemove,
			} = props as TagCellProps | MultiTagCellProps;

			let cellTags: Tag[] = [];
			if (type === CellType.TAG) {
				const { tagId } = props as TagCellProps;
				cellTags = columnTags.filter((tag) => tag.id === tagId);

				handleMenuTriggerBackspaceDown = () => {
					if (tagId !== null) {
						onTagCellRemove(id, tagId);
					}
				};
			} else {
				const { tagIds } = props as MultiTagCellProps;
				cellTags = columnTags.filter((tag) => tagIds.includes(tag.id));

				handleMenuTriggerBackspaceDown = () => {
					onTagCellMultipleRemove(id, tagIds);
				};
			}

			handleCellContextClick = () => {
				const content = cellTags.map((tag) => tag.content).join(", ");
				copyTextToClipboard(content);
			};

			function handleTagAdd(markdown: string, color: Color) {
				if (markdown === "") return;
				onTagAdd(id, columnId, markdown.trim(), color);
			}

			function handleRemoveTagClick(tagId: string) {
				onTagCellRemove(id, tagId);
			}

			function handleTagColorChange(tagId: string, value: Color) {
				onTagChange(columnId, tagId, { color: value });
			}

			function handleTagDeleteClick(tagId: string) {
				onTagDeleteClick(columnId, tagId);
			}

			function handleTagContentChange(tagId: string, value: string) {
				onTagChange(columnId, tagId, { content: value });
			}

			function handleTagClick(tagId: string) {
				onTagCellAdd(id, tagId);
			}

			if (type === CellType.TAG) {
				if (cellTags.length > 0) {
					contentNode = (
						<TagCell
							content={cellTags[0].content}
							color={cellTags[0].color}
						/>
					);
				}
			} else {
				contentNode = <MultiTagCell cellTags={cellTags} />;
			}

			menuNode = (
				<TagCellEdit
					isMulti={type === CellType.MULTI_TAG}
					closeRequest={menu.closeRequest}
					columnTags={columnTags}
					cellTags={cellTags}
					onTagColorChange={handleTagColorChange}
					onTagAdd={handleTagAdd}
					onRemoveTag={handleRemoveTagClick}
					onTagClick={handleTagClick}
					onTagDelete={handleTagDeleteClick}
					onTagContentChange={handleTagContentChange}
					onClose={menu.onClose}
				/>
			);
			break;
		}
		case CellType.DATE: {
			const { dateTime, onColumnChange } = props as DateCellProps;

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { dateTime: null });
			};

			//TODO fix
			handleCellContextClick = () => {
				copyTextToClipboard(dateTime ?? "");
			};

			const handleDateTimeChange = React.useCallback(
				(value: string | null) => {
					onCellChange(id, { dateTime: value });
				},
				[id, onCellChange]
			);

			function handleDateFormatChange(value: DateFormat) {
				onColumnChange(
					columnId,
					{ dateFormat: value },
					{ shouldSortRows: true }
				);
			}

			function handleDateFormatSeparatorChange(
				value: DateFormatSeparator
			) {
				onColumnChange(
					columnId,
					{ dateFormatSeparator: value },
					{ shouldSortRows: true }
				);
			}

			function handleTimeFormatChange(value: boolean) {
				onColumnChange(
					columnId,
					{ hour12: value },
					{ shouldSortRows: true }
				);
			}

			async function handleIncludeTimeToggle(value: boolean) {
				onColumnChange(
					columnId,
					{ includeTime: value, frontmatterKey },
					{ shouldSortRows: true }
				);
			}
			contentNode = (
				<DateCell
					value={dateTime}
					format={dateFormat}
					formatSeparator={dateFormatSeparator}
					includeTime={includeTime}
					hour12={hour12}
				/>
			);

			menuNode = (
				<DateCellEdit
					cellId={id}
					value={dateTime}
					includeTime={includeTime}
					closeRequest={menu.closeRequest}
					dateFormat={dateFormat}
					hour12={hour12}
					dateFormatSeparator={dateFormatSeparator}
					onDateTimeChange={handleDateTimeChange}
					onDateFormatChange={handleDateFormatChange}
					onClose={menu.onClose}
					onCloseRequestClear={menu.onCloseRequestClear}
					onIncludeTimeToggle={handleIncludeTimeToggle}
					onDateFormatSeparatorChange={
						handleDateFormatSeparatorChange
					}
					onTimeFormatChange={handleTimeFormatChange}
				/>
			);
			break;
		}
		case CellType.CHECKBOX: {
			const { value } = props as CheckboxCellProps;

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { value: false });
			};

			handleCellContextClick = () => {
				copyTextToClipboard(value ? "true" : "false");
			};

			handleMenuTriggerClick = onMenuTriggerClick(() => {
				if (value) {
					handleCheckboxChange(false);
				} else {
					handleCheckboxChange(true);
				}
			});

			handleMenuTriggerEnterDown = onMenuTriggerEnterDown(() => {
				if (value) {
					handleCheckboxChange(false);
				} else {
					handleCheckboxChange(true);
				}
			});

			function handleCheckboxChange(value: boolean) {
				onCellChange(id, { value });
			}

			contentNode = <CheckboxCell value={value} />;
			break;
		}
		case CellType.CREATION_TIME: {
			//TODO fix
			handleCellContextClick = () => {
				copyTextToClipboard(rowCreationTime);
			};

			contentNode = (
				<CreationTimeCell
					value={rowCreationTime}
					format={dateFormat}
					formatSeparator={dateFormatSeparator}
					hour12={hour12}
				/>
			);
			break;
		}
		case CellType.LAST_EDITED_TIME: {
			//TODO fix
			handleCellContextClick = () => {
				copyTextToClipboard(rowLastEditedTime);
			};

			contentNode = (
				<LastEditedTimeCell
					value={rowLastEditedTime}
					format={dateFormat}
					formatSeparator={dateFormatSeparator}
					hour12={hour12}
				/>
			);
			break;
		}
		case CellType.SOURCE: {
			contentNode = <SourceCell source={source} />;
			break;
		}
		case CellType.SOURCE_FILE: {
			const { path } = props as SourceFileCellProps;

			handleCellContextClick = () => {
				copyTextToClipboard(path);
			};

			contentNode = <SourceFileCell path={path} />;
			break;
		}
		case CellType.EMBED: {
			const { pathOrUrl, isExternal } = props as EmbedCellProps;

			handleCellContextClick = () => {
				copyTextToClipboard(pathOrUrl);
			};

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { pathOrUrl: "", alias: null });
			};

			function handleExternalLinkToggle(value: boolean) {
				onCellChange(id, { isExternal: value });
			}

			const handleInputChange = React.useCallback(
				(pathOrUrl: string) => {
					onCellChange(id, { pathOrUrl });
				},
				[id, onCellChange]
			);

			contentNode = (
				<EmbedCell
					isExternal={isExternal}
					pathOrUrl={pathOrUrl}
					verticalPadding={verticalPadding}
					horizontalPadding={horizontalPadding}
					aspectRatio={aspectRatio}
				/>
			);
			menuNode = (
				<EmbedCellEdit
					isExternalLink={isExternal}
					closeRequest={menu.closeRequest}
					value={pathOrUrl}
					onChange={handleInputChange}
					onClose={menu.onClose}
					onExternalLinkToggle={handleExternalLinkToggle}
				/>
			);
			break;
		}
		case CellType.FILE: {
			const { path } = props as FileCellProps;

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { path: "", alias: null });
			};

			const handlePathChange = React.useCallback(
				(path: string) => {
					//TODO add types
					onCellChange(id, { path });
				},
				[id, onCellChange]
			);

			handleCellContextClick = () => {
				copyTextToClipboard(path);
			};

			contentNode = <FileCell path={path} />;
			menuNode = (
				<FileCellEdit
					onChange={handlePathChange}
					onClose={menu.onClose}
				/>
			);
			break;
		}
		default:
			throw new Error("Unhandled cell type");
	}

	return (
		<>
			<MenuTrigger
				ariaLabel={ariaLabel}
				ref={menu.triggerRef}
				variant="cell"
				menuId={menu.id}
				isFocused={menu.isTriggerFocused}
				level={LoomMenuLevel.ONE}
				onClick={handleMenuTriggerClick}
				onEnterDown={handleMenuTriggerEnterDown}
				onBackspaceDown={handleMenuTriggerBackspaceDown}
				shouldRunTrigger={shouldRunTrigger}
				onOpen={() =>
					menu.onOpen(LoomMenuLevel.ONE, {
						shouldRequestOnClose,
					})
				}
			>
				<div
					onContextMenu={handleCellContextClick}
					className={className}
					style={{
						width,
					}}
				>
					{contentNode}
				</div>
			</MenuTrigger>
			<Menu
				id={menu.id}
				hideBorder={type === CellType.TEXT || type === CellType.NUMBER}
				isOpen={menu.isOpen}
				position={menu.position}
				width={menuWidth}
				height={menuHeight}
			>
				{menuNode}
			</Menu>
		</>
	);
}
