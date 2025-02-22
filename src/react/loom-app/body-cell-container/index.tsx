import React from "react";

import { Notice } from "obsidian";

import MenuTrigger from "src/react/shared/menu-trigger";
import Menu from "../../shared/menu";
import CheckboxCell from "../checkbox-cell";
import CreationTimeCell from "../creation-time-cell";
import DateCell from "../date-cell";
import DateCellEdit from "../date-cell-edit";
import EmbedCell from "../embed-cell";
import EmbedCellEdit from "../embed-cell-edit";
import FileCell from "../file-cell";
import FileCellEdit from "../file-cell-edit";
import LastEditedTimeCell from "../last-edited-time-cell";
import MultiTagCell from "../multi-tag-cell";
import NumberCell from "../number-cell";
import NumberCellEdit from "../number-cell-edit";
import SourceCell from "../source-cell";
import SourceFileCell from "../source-file-cell";
import TagCell from "../tag-cell";
import TagCellEdit from "../tag-cell-edit";
import TextCell from "../text-cell";
import TextCellEdit from "../text-cell-edit";

import {
	type CheckboxCell as CheckboxCellInterface,
	type CreationTimeCell as CreationTimeCellInterface,
	type DateCell as DateCellInterface,
	type EmbedCell as EmbedCellInterface,
	type FileCell as FileCellInterface,
	type LastEditedTimeCell as LastEditedTimeCellInterface,
	type MultiTagCell as MultiTagCellInterface,
	type NumberCell as NumberCellInterface,
	type SourceCell as SourceCellInterface,
	type SourceFileCell as SourceFileCellInterface,
	SourceType,
	type TagCell as TagCellInterface,
	type TextCell as TextCellInterface,
} from "src/shared/loom-state/types/loom-state";

import { useMenu } from "src/react/shared/menu-provider/hooks";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import {
	AspectRatio,
	CellType,
	Color,
	CurrencyType,
	DateFormat,
	DateFormatSeparator,
	NumberFormat,
	PaddingSize,
	type Source,
	type Tag,
} from "src/shared/loom-state/types/loom-state";
import { type CellChangeHandler } from "../app/hooks/use-cell/types";
import { type ColumnChangeHandler } from "../app/hooks/use-column/types";
import {
	type TagAddHandler,
	type TagCellAddHandler,
	type TagChangeHandler,
} from "../app/hooks/use-tag/types";

import { getDateCellContent } from "src/shared/cell-content/date-cell-content";
import { getFileCellContent } from "src/shared/cell-content/file-cell-content";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";
import { getSourceCellContent } from "src/shared/cell-content/source-cell-content";
import { getSourceFileContent } from "src/shared/cell-content/source-file-content";
import { getTimeCellContent } from "src/shared/cell-content/time-content";
import { useOverflow } from "src/shared/spacing/hooks";
import DisabledCell from "../disabled-cell";
import "./styles.css";

import { sortByText } from "src/shared/sort-utils";

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
		hasValidFrontmatter,
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

	let isDisabled = false;
	if (hasValidFrontmatter === false) {
		isDisabled = true;
	} else if (
		source !== null &&
		frontmatterKey === null &&
		type !== CellType.SOURCE &&
		type !== CellType.SOURCE_FILE
	) {
		isDisabled = true;
	}

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
			new Notice("Copied cell content to clipboard");
		} catch (err) {
			console.error(err);
		}
	}

	function onMenuTriggerEnterDown(cellActionCallback: () => void) {
		return () => {
			cellActionCallback();
		};
	}

	function onMenuTriggerClick(cellActionCallback: () => void) {
		return () => {
			cellActionCallback();
		};
	}

	const handleTextChange = React.useCallback(
		(value: string) => {
			onCellChange(id, { content: value });
		},
		[id, onCellChange]
	);

	const handleNumberChange = React.useCallback(
		(value: number | null) => {
			onCellChange(id, { value });
		},
		[id, onCellChange]
	);

	const handleDateTimeChange = React.useCallback(
		(value: string | null) => {
			onCellChange(id, { dateTime: value });
		},
		[id, onCellChange]
	);

	const handleEmbedChange = React.useCallback(
		(pathOrUrl: string) => {
			onCellChange(id, { pathOrUrl });
		},
		[id, onCellChange]
	);

	const handleFileChange = React.useCallback(
		(path: string) => {
			//TODO add types
			onCellChange(id, { path });
		},
		[id, onCellChange]
	);

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
	}

	let shouldRunTrigger = true;
	if (isUneditable) {
		shouldRunTrigger = false;
	}

	if (isDisabled) {
		return (
			<div
				className={
					className + " dataloom-cell--body__container--no-padding"
				}
				style={{
					width,
				}}
			>
				<DisabledCell
					hasValidFrontmatter={hasValidFrontmatter ?? true}
					doesColumnHaveFrontmatterKey={frontmatterKey !== null}
				/>
			</div>
		);
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

			contentNode = <TextCell value={content} />;
			menuNode = (
				<TextCellEdit
					cellId={id}
					closeRequest={menu.closeRequest}
					shouldWrapOverflow={shouldWrapOverflow}
					value={content}
					onChange={handleTextChange}
					onClose={menu.onClose}
				/>
			);
			break;
		}
		case CellType.NUMBER: {
			const { value } = props as NumberCellProps;

			const content = getNumberCellContent(numberFormat, value, {
				currency: currencyType,
				prefix: numberPrefix,
				suffix: numberSuffix,
				separator: numberSeparator,
			});

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { value: null });
			};

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			contentNode = <NumberCell content={content} />;
			menuNode = (
				<NumberCellEdit
					closeRequest={menu.closeRequest}
					value={value}
					onChange={handleNumberChange}
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
				const { tagIds, multiTagSortDir } = props as MultiTagCellProps;

				cellTags = columnTags.filter((tag) => tagIds.includes(tag.id));
				cellTags.sort((a, b) =>
					sortByText(a.content, b.content, multiTagSortDir, false)
				);

				handleMenuTriggerBackspaceDown = () => {
					onTagCellMultipleRemove(id, tagIds);
				};
			}

			handleCellContextClick = () => {
				const content = cellTags.map((tag) => tag.content).join(",");
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

			const content = getDateCellContent(
				dateTime,
				dateFormat,
				dateFormatSeparator,
				includeTime,
				hour12
			);

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { dateTime: null });
			};

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

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
			contentNode = <DateCell content={content} />;

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
			const content = getTimeCellContent(
				rowCreationTime,
				dateFormat,
				dateFormatSeparator,
				hour12
			);

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			contentNode = <CreationTimeCell value={content} />;
			break;
		}
		case CellType.LAST_EDITED_TIME: {
			const content = getTimeCellContent(
				rowLastEditedTime,
				dateFormat,
				dateFormatSeparator,
				hour12
			);

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			contentNode = <LastEditedTimeCell value={content} />;
			break;
		}
		case CellType.SOURCE: {
			const content = getSourceCellContent(source);

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			let propertyType = undefined;
			if (source?.type === SourceType.FRONTMATTER) {
				propertyType = source?.propertyType;
			}

			contentNode = (
				<SourceCell
					sourceType={source?.type as SourceType}
					propertyType={propertyType}
					content={content}
				/>
			);
			break;
		}
		case CellType.SOURCE_FILE: {
			const { path } = props as SourceFileCellProps;
			const content = getSourceFileContent(path);

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			contentNode = <SourceFileCell content={content} />;
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
					onChange={handleEmbedChange}
					onClose={menu.onClose}
					onExternalLinkToggle={handleExternalLinkToggle}
				/>
			);
			break;
		}
		case CellType.FILE: {
			const { path } = props as FileCellProps;
			const content = getFileCellContent(path, false);

			handleMenuTriggerBackspaceDown = () => {
				onCellChange(id, { path: "", alias: null });
			};

			handleCellContextClick = () => {
				copyTextToClipboard(content);
			};

			contentNode = <FileCell content={content} />;
			menuNode = (
				<FileCellEdit
					onChange={handleFileChange}
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
