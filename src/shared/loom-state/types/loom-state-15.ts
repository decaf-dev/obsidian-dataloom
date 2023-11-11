/******* Type definitions for v8.7.0 *******/

/**
 * v8.7.0
 */
export interface LoomState15 {
	pluginVersion: string;
	model: TableModel;
}

interface TableModel {
	columns: Column[];
	rows: Row[];
	filters: Filter[];
	settings: TableSettings;
	sources: Source[];
	externalRowOrder: ExternalRowOrder[];
}

interface ExternalRowOrder {
	sourceId: string;
	index: number;
	uniqueId: string; //This could be a file path, tag name, or url
}

interface TableSettings {
	numFrozenColumns: number;
	showCalculationRow: boolean;
}

export interface Column {
	id: string;
	sortDir: SortDir;
	width: string;
	type: CellType;
	isVisible: boolean;
	dateFormat: DateFormat;
	content: string;
	numberFormat: NumberFormat;
	currencyType: CurrencyType;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	shouldWrapOverflow: boolean;
	tags: Tag[];
	calculationType: CalculationType;
	aspectRatio: AspectRatio;
	horizontalPadding: PaddingSize;
	verticalPadding: PaddingSize;
	frontmatterKey: FrontmatterKey | null;
}

interface FrontmatterKey {
	isCustom: boolean;
	value: string;
}

export interface Row {
	id: string;
	index: number;
	creationTime: number;
	lastEditedTime: number;
	sourceId: string | null;
	cells: Cell[];
}

interface Cell {
	id: string;
	columnId: string;
	isExternalLink: boolean;
	dateTime: number | null;
	content: string;
	tagIds: string[];
}

interface Tag {
	id: string;
	content: string;
	color: Color;
}

interface BaseSource {
	id: string;
	type: SourceType;
}

export interface ObsidianFolderSource extends BaseSource {
	type: SourceType.FOLDER;
	path: string;
	showNested: boolean;
	showMarkdownOnly: boolean;
}

interface ObsidianTagSource extends BaseSource {
	type: SourceType.TAG;
	name: string;
}

type Source = ObsidianFolderSource | ObsidianTagSource;

enum SourceType {
	FOLDER = "folder",
	TAG = "tag",
}

enum Color {
	LIGHT_GRAY = "light gray",
	GRAY = "gray",
	BROWN = "brown",
	ORANGE = "orange",
	YELLOW = "yellow",
	GREEN = "green",
	BLUE = "blue",
	PURPLE = "purple",
	PINK = "pink",
	RED = "red",
}

enum PaddingSize {
	UNSET = "unset",
	SM = "sm",
	MD = "md",
	LG = "lg",
	XL = "xl",
	XXL = "2xl",
	XXXL = "3xl",
	XXXXL = "4xl",
}

enum SortDir {
	ASC = "asc",
	DESC = "desc",
	NONE = "default",
}

enum CellType {
	SOURCE_FILE = "source-file",
	SOURCE = "source",
	TEXT = "text",
	EMBED = "embed",
	FILE = "file",
	NUMBER = "number",
	TAG = "tag",
	MULTI_TAG = "multi-tag",
	DATE = "date",
	CHECKBOX = "checkbox",
	CREATION_TIME = "creation-time",
	LAST_EDITED_TIME = "last-edited-time",
}

enum DateFormat {
	MM_DD_YYYY = "mm/dd/yyyy",
	DD_MM_YYYY = "dd/mm/yyyy",
	YYYY_MM_DD = "yyyy/mm/dd",
	FULL = "full",
	RELATIVE = "relative",
}

enum NumberFormat {
	NUMBER = "number",
	CURRENCY = "currency",
}

enum CurrencyType {
	ARGENTINA = "ARS",
	AUSTRALIA = "AUD",
	CANADA = "CAD",
	COLOMBIA = "COP",
	DENMARK = "DKK",
	UAE = "AED",
	EUROPE = "EUR",
	ICELAND = "ISK",
	ISRAEL = "ILS",
	MEXICO = "MXN",
	NORWAY = "NOK",
	GREAT_BRITAIN = "GBP",
	BRAZIL = "BRL",
	SAUDI_ARABIA = "SAR",
	RUSSIA = "RUB",
	INDIA = "INR",
	SINGAPORE = "SGB",
	SWEDEN = "SEK",
	SWITZERLAND = "CHF",
	UNITED_STATES = "USD",
	SOUTH_KOREA = "KRW",
	JAPAN = "JPY",
	CHINA = "CNY",
}

enum AspectRatio {
	UNSET = "unset",
	NINE_BY_SIXTEEN = "9/16",
	FOUR_BY_THREE = "4/3",
	SIXTEEN_BY_NINE = "16/9",
}

/********** CALCULATIONS **********/
enum GeneralCalculation {
	NONE = "none",
	COUNT_ALL = "count-all",
	COUNT_VALUES = "count-values",
	COUNT_UNIQUE = "count-unique",
	COUNT_EMPTY = "count-empty",
	COUNT_NOT_EMPTY = "count-not-empty",
	PERCENT_EMPTY = "percent-empty",
	PERCENT_NOT_EMPTY = "percent-not-empty",
}

enum NumberCalculation {
	SUM = "sum",
	AVG = "avg",
	MIN = "min",
	MAX = "max",
	MEDIAN = "median",
	RANGE = "range",
}

type CalculationType = GeneralCalculation | NumberCalculation;

/************* FILTERS ****************/
type FilterOperator = "and" | "or";

enum TextFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

enum NumberFilterCondition {
	IS_EQUAL = "is-equal",
	IS_NOT_EQUAL = "is-not-equal",
	IS_GREATER = "is-greater",
	IS_LESS = "is-less",
	IS_GREATER_OR_EQUAL = "is-greater-or-equal",
	IS_LESS_OR_EQUAL = "is-less-or-equal",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

//TODO add support for more date types
enum DateFilterCondition {
	IS = "is",
	IS_BEFORE = "is-before",
	IS_AFTER = "is-after",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

enum DateFilterOption {
	UNSELECTED = "unselected",
	TODAY = "today",
	TOMORROW = "tomorrow",
	YESTERDAY = "yesterday",
	ONE_WEEK_AGO = "one-week-ago",
	ONE_WEEK_FROM_NOW = "one-week-from-now",
	ONE_MONTH_AGO = "one-month-ago",
	ONE_MONTH_FROM_NOW = "one-month-from-now",
}

interface BaseFilter {
	id: string;
	columnId: string;
	operator: FilterOperator;
	isEnabled: boolean;
}

/* Text filter */
type TextCondition = TextFilterCondition;

interface TextFilter extends BaseFilter {
	type: CellType.TEXT;
	condition: TextCondition;
	text: string;
}

/* File filter */
type FileCondition = TextFilterCondition;

interface FileFilter extends BaseFilter {
	type: CellType.FILE;
	condition: FileCondition;
	text: string;
}

/* Checkbox filter */
type CheckboxCondition = TextFilterCondition.IS | TextFilterCondition.IS_NOT;

interface CheckboxFilter extends BaseFilter {
	type: CellType.CHECKBOX;
	condition: CheckboxCondition;
	text: string;
}

/* Tag filter */
type TagCondition =
	| TextFilterCondition.IS
	| TextFilterCondition.IS_NOT
	| TextFilterCondition.IS_EMPTY
	| TextFilterCondition.IS_NOT_EMPTY;

interface TagFilter extends BaseFilter {
	type: CellType.TAG;
	condition: TagCondition;
	tagId: string;
}

/* Multi-tag filter */
type MultiTagCondition =
	| TextFilterCondition.CONTAINS
	| TextFilterCondition.DOES_NOT_CONTAIN
	| TextFilterCondition.IS_EMPTY
	| TextFilterCondition.IS_NOT_EMPTY;

interface MultiTagFilter extends BaseFilter {
	type: CellType.MULTI_TAG;
	condition: MultiTagCondition;
	tagIds: string[];
}

/* Embed filter */
type EmbedCondition =
	| TextFilterCondition.IS_EMPTY
	| TextFilterCondition.IS_NOT_EMPTY;

interface EmbedFilter extends BaseFilter {
	type: CellType.EMBED;
	condition: EmbedCondition;
	text: string;
}

/* Number filter */
type NumberCondition = NumberFilterCondition;

interface NumberFilter extends BaseFilter {
	type: CellType.NUMBER;
	condition: NumberCondition;
	text: string;
}

/* Date filter */
type DateCondition = DateFilterCondition;

interface DateFilter extends BaseFilter {
	type: CellType.DATE;
	condition: DateCondition;
	option: DateFilterOption;
	dateTime: number | null;
}

/* Creation time filter  */
type CreationTimeCondition =
	| DateFilterCondition.IS
	| DateFilterCondition.IS_AFTER
	| DateFilterCondition.IS_BEFORE;

interface CreationTimeFilter extends BaseFilter {
	type: CellType.CREATION_TIME;
	condition: CreationTimeCondition;
	option: DateFilterOption;
	dateTime: number | null;
}

/* Last edited filter  */
type LastEditedTimeCondition =
	| DateFilterCondition.IS
	| DateFilterCondition.IS_AFTER
	| DateFilterCondition.IS_BEFORE;

interface LastEditedTimeFilter extends BaseFilter {
	type: CellType.LAST_EDITED_TIME;
	condition: LastEditedTimeCondition;
	option: DateFilterOption;
	dateTime: number | null;
}

/* Source File condition */
type SourceFileCondition = TextFilterCondition;

interface SourceFileFilter extends BaseFilter {
	type: CellType.SOURCE_FILE;
	condition: SourceFileCondition;
	text: string;
}

type Filter =
	| TextFilter
	| TagFilter
	| MultiTagFilter
	| CheckboxFilter
	| FileFilter
	| EmbedFilter
	| NumberFilter
	| DateFilter
	| CreationTimeFilter
	| LastEditedTimeFilter
	| SourceFileFilter;
