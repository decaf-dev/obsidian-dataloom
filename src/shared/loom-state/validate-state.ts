import {
	Boolean,
	Number,
	String,
	Literal,
	Array,
	Record,
	Union,
} from "runtypes";
import {
	CellType,
	Color,
	SortDir,
	DateFormat,
	NumberFormat,
	CurrencyType,
	PaddingSize,
	AspectRatio,
	GeneralCalculation,
	NumberCalculation,
	TextFilterCondition,
	NumberFilterCondition,
	DateFilterCondition,
	DateFilterOption,
	SourceType,
	DateFormatSeparator,
} from "./types/loom-state";
import { ObsidianPropertyType } from "../frontmatter/types";

const FilterOperatorUnion = Union(Literal("and"), Literal("or"));

const TextFilterConditionUnion = Union(
	Literal(TextFilterCondition.IS),
	Literal(TextFilterCondition.IS_NOT),
	Literal(TextFilterCondition.CONTAINS),
	Literal(TextFilterCondition.DOES_NOT_CONTAIN),
	Literal(TextFilterCondition.STARTS_WITH),
	Literal(TextFilterCondition.ENDS_WITH),
	Literal(TextFilterCondition.IS_EMPTY),
	Literal(TextFilterCondition.IS_NOT_EMPTY)
);

const NumberFilterConditionUnion = Union(
	Literal(NumberFilterCondition.IS_EQUAL),
	Literal(NumberFilterCondition.IS_NOT_EQUAL),
	Literal(NumberFilterCondition.IS_GREATER),
	Literal(NumberFilterCondition.IS_LESS),
	Literal(NumberFilterCondition.IS_GREATER_OR_EQUAL),
	Literal(NumberFilterCondition.IS_LESS_OR_EQUAL),
	Literal(NumberFilterCondition.IS_EMPTY),
	Literal(NumberFilterCondition.IS_NOT_EMPTY)
);

const DateFilterConditionUnion = Union(
	Literal(DateFilterCondition.IS),
	Literal(DateFilterCondition.IS_BEFORE),
	Literal(DateFilterCondition.IS_AFTER),
	Literal(DateFilterCondition.IS_EMPTY),
	Literal(DateFilterCondition.IS_NOT_EMPTY)
);

const DateFilterOptionUnion = Union(
	Literal(DateFilterOption.UNSELECTED),
	Literal(DateFilterOption.TODAY),
	Literal(DateFilterOption.TOMORROW),
	Literal(DateFilterOption.YESTERDAY),
	Literal(DateFilterOption.ONE_WEEK_AGO),
	Literal(DateFilterOption.ONE_WEEK_FROM_NOW),
	Literal(DateFilterOption.ONE_MONTH_AGO),
	Literal(DateFilterOption.ONE_MONTH_FROM_NOW)
);

const GeneralCalculationUnion = Union(
	Literal(GeneralCalculation.NONE),
	Literal(GeneralCalculation.COUNT_ALL),
	Literal(GeneralCalculation.COUNT_VALUES),
	Literal(GeneralCalculation.COUNT_UNIQUE),
	Literal(GeneralCalculation.COUNT_EMPTY),
	Literal(GeneralCalculation.COUNT_NOT_EMPTY),
	Literal(GeneralCalculation.PERCENT_EMPTY),
	Literal(GeneralCalculation.PERCENT_NOT_EMPTY)
);

const NumberCalculationUnion = Union(
	Literal(NumberCalculation.SUM),
	Literal(NumberCalculation.AVG),
	Literal(NumberCalculation.MIN),
	Literal(NumberCalculation.MAX),
	Literal(NumberCalculation.MEDIAN),
	Literal(NumberCalculation.RANGE)
);

const CalculationTypeUnion = Union(
	GeneralCalculationUnion,
	NumberCalculationUnion
);

const PaddingSizeUnion = Union(
	Literal(PaddingSize.UNSET),
	Literal(PaddingSize.SM),
	Literal(PaddingSize.MD),
	Literal(PaddingSize.LG),
	Literal(PaddingSize.XL),
	Literal(PaddingSize.XXL),
	Literal(PaddingSize.XXXL),
	Literal(PaddingSize.XXXXL)
);

const AspectRatioUnion = Union(
	Literal(AspectRatio.UNSET),
	Literal(AspectRatio.NINE_BY_SIXTEEN),
	Literal(AspectRatio.FOUR_BY_THREE),
	Literal(AspectRatio.SIXTEEN_BY_NINE)
);

const ColorUnion = Union(
	Literal(Color.LIGHT_GRAY),
	Literal(Color.GRAY),
	Literal(Color.BROWN),
	Literal(Color.ORANGE),
	Literal(Color.YELLOW),
	Literal(Color.GREEN),
	Literal(Color.BLUE),
	Literal(Color.PURPLE),
	Literal(Color.PINK),
	Literal(Color.RED)
);

const SortDirUnion = Union(
	Literal(SortDir.ASC),
	Literal(SortDir.DESC),
	Literal(SortDir.NONE)
);

const CellTypeUnion = Union(
	Literal(CellType.TEXT),
	Literal(CellType.SOURCE),
	Literal(CellType.SOURCE_FILE),
	Literal(CellType.EMBED),
	Literal(CellType.FILE),
	Literal(CellType.NUMBER),
	Literal(CellType.TAG),
	Literal(CellType.MULTI_TAG),
	Literal(CellType.DATE),
	Literal(CellType.CHECKBOX),
	Literal(CellType.CREATION_TIME),
	Literal(CellType.LAST_EDITED_TIME)
);

const DateFormatUnion = Union(
	Literal(DateFormat.MM_DD_YYYY),
	Literal(DateFormat.DD_MM_YYYY),
	Literal(DateFormat.YYYY_MM_DD)
);

const DateFormatSeparatorUnion = Union(
	Literal(DateFormatSeparator.HYPHEN),
	Literal(DateFormatSeparator.SLASH),
	Literal(DateFormatSeparator.DOT)
);

const NumberFormatUnion = Union(
	Literal(NumberFormat.NUMBER),
	Literal(NumberFormat.CURRENCY)
);

const CurrencyUnion = Union(
	Literal(CurrencyType.ARGENTINA),
	Literal(CurrencyType.AUSTRALIA),
	Literal(CurrencyType.BRAZIL),
	Literal(CurrencyType.CANADA),
	Literal(CurrencyType.CHINA),
	Literal(CurrencyType.COLOMBIA),
	Literal(CurrencyType.DENMARK),
	Literal(CurrencyType.EUROPE),
	Literal(CurrencyType.GREAT_BRITAIN),
	Literal(CurrencyType.ICELAND),
	Literal(CurrencyType.ISRAEL),
	Literal(CurrencyType.INDIA),
	Literal(CurrencyType.JAPAN),
	Literal(CurrencyType.MEXICO),
	Literal(CurrencyType.NORWAY),
	Literal(CurrencyType.RUSSIA),
	Literal(CurrencyType.SAUDI_ARABIA),
	Literal(CurrencyType.SINGAPORE),
	Literal(CurrencyType.SOUTH_KOREA),
	Literal(CurrencyType.SWEDEN),
	Literal(CurrencyType.SWITZERLAND),
	Literal(CurrencyType.UAE),
	Literal(CurrencyType.UNITED_STATES)
);

const BaseFilter = Record({
	id: String,
	columnId: String,
	operator: FilterOperatorUnion,
	isEnabled: Boolean,
});

const TextFilter = BaseFilter.extend({
	type: Literal(CellType.TEXT),
	condition: TextFilterConditionUnion,
	text: String,
});

const FileFilter = BaseFilter.extend({
	type: Literal(CellType.FILE),
	condition: TextFilterConditionUnion,
	text: String,
});

const SourceFileFilter = BaseFilter.extend({
	type: Literal(CellType.SOURCE_FILE),
	condition: TextFilterConditionUnion,
	text: String,
});

const CheckboxConditionUnion = Union(
	Literal(TextFilterCondition.IS),
	Literal(TextFilterCondition.IS_NOT)
);

const CheckboxFilter = BaseFilter.extend({
	type: Literal(CellType.CHECKBOX),
	condition: CheckboxConditionUnion,
	value: Boolean,
});

const TagFilterConditionUnion = Union(
	Literal(TextFilterCondition.IS),
	Literal(TextFilterCondition.IS_NOT),
	Literal(TextFilterCondition.IS_EMPTY),
	Literal(TextFilterCondition.IS_NOT_EMPTY)
);

const TagFilter = BaseFilter.extend({
	type: Literal(CellType.TAG),
	condition: TagFilterConditionUnion,
	tagId: String,
});

const MultiTagConditionUnion = Union(
	Literal(TextFilterCondition.CONTAINS),
	Literal(TextFilterCondition.DOES_NOT_CONTAIN),
	Literal(TextFilterCondition.IS_EMPTY),
	Literal(TextFilterCondition.IS_NOT_EMPTY)
);

const MultiTagFilter = BaseFilter.extend({
	type: Literal(CellType.MULTI_TAG),
	condition: MultiTagConditionUnion,
	tagIds: Array(String),
});

const EmbedConditionUnion = Union(
	Literal(TextFilterCondition.IS_EMPTY),
	Literal(TextFilterCondition.IS_NOT_EMPTY)
);

const EmbedFilter = BaseFilter.extend({
	type: Literal(CellType.EMBED),
	condition: EmbedConditionUnion,
	text: String,
});

const NumberFilter = BaseFilter.extend({
	type: Literal(CellType.NUMBER),
	condition: NumberFilterConditionUnion,
	text: String,
});

const DateFilter = BaseFilter.extend({
	type: Literal(CellType.DATE),
	condition: DateFilterConditionUnion,
	option: DateFilterOptionUnion,
	dateTime: Union(String, Literal(null)),
});

const CreationTimeConditionUnion = Union(
	Literal(DateFilterCondition.IS),
	Literal(DateFilterCondition.IS_AFTER),
	Literal(DateFilterCondition.IS_BEFORE)
);

const CreationTimeFilter = BaseFilter.extend({
	type: Literal(CellType.CREATION_TIME),
	condition: CreationTimeConditionUnion,
	option: DateFilterOptionUnion,
	dateTime: Union(String, Literal(null)),
});

const LastEditedTimeConditionUnion = Union(
	Literal(DateFilterCondition.IS),
	Literal(DateFilterCondition.IS_AFTER),
	Literal(DateFilterCondition.IS_BEFORE)
);

const LastEditedTimeFilter = BaseFilter.extend({
	type: Literal(CellType.LAST_EDITED_TIME),
	condition: LastEditedTimeConditionUnion,
	option: DateFilterOptionUnion,
	dateTime: Union(String, Literal(null)),
});

const Filter = Union(
	TextFilter,
	TagFilter,
	MultiTagFilter,
	CheckboxFilter,
	FileFilter,
	EmbedFilter,
	NumberFilter,
	DateFilter,
	CreationTimeFilter,
	LastEditedTimeFilter,
	SourceFileFilter
);

const Tag = Record({
	id: String,
	content: String,
	color: ColorUnion,
});

const Column = Record({
	id: String,
	sortDir: SortDirUnion,
	width: String,
	type: CellTypeUnion,
	isVisible: Boolean,
	dateFormat: DateFormatUnion,
	dateFormatSeparator: DateFormatSeparatorUnion,
	hour12: Boolean,
	includeTime: Boolean,
	content: String,
	numberFormat: NumberFormatUnion,
	currencyType: CurrencyUnion,
	numberPrefix: String,
	numberSuffix: String,
	numberSeparator: String,
	shouldWrapOverflow: Boolean,
	tags: Array(Tag),
	calculationType: CalculationTypeUnion,
	aspectRatio: AspectRatioUnion,
	horizontalPadding: PaddingSizeUnion,
	verticalPadding: PaddingSizeUnion,
});

const BaseCell = Record({
	id: String,
	columnId: String,
	hasValidFrontmatter: Union(Boolean, Literal(null)),
});

const TextCell = BaseCell.extend({
	content: String,
});

const EmbedCell = BaseCell.extend({
	content: String,
});

const FileCell = BaseCell.extend({
	isExternalLink: Boolean,
	content: String,
});

const NumberCell = BaseCell.extend({
	content: Union(Number, Literal(null)),
});

const TagCell = BaseCell.extend({
	tagId: Union(String, Literal(null)),
});

const MultiTagCell = BaseCell.extend({
	tagIds: Array(String),
});

const DateCell = BaseCell.extend({
	dateTime: Union(String, Literal(null)),
});

const CheckboxCell = BaseCell.extend({
	content: Boolean,
});

const CreationTimeCell = BaseCell.extend({});

const LastEditedTimeCell = BaseCell.extend({});

const SourceFileCell = BaseCell.extend({});

const SourceCell = BaseCell.extend({});

const Cell = Union(
	TextCell,
	TagCell,
	MultiTagCell,
	CheckboxCell,
	FileCell,
	EmbedCell,
	NumberCell,
	DateCell,
	CreationTimeCell,
	LastEditedTimeCell,
	SourceCell,
	SourceFileCell
);

const Row = Record({
	id: String,
	index: Number,
	creationDateTime: String,
	lastEditedDateTime: String,
	cells: Array(Cell),
});

const SourceUnion = Union(
	Literal(SourceType.FOLDER),
	Literal(SourceType.FRONTMATTER)
);

const BaseSource = Record({
	id: String,
	type: SourceUnion,
});

const ObsidianFolderSource = BaseSource.extend({
	type: Literal(SourceType.FOLDER),
	path: String,
	includeSubfolders: Boolean,
});

const ObsidianPropertyTypeUnion = Union(
	Literal(ObsidianPropertyType.ALIASES),
	Literal(ObsidianPropertyType.CHECKBOX),
	Literal(ObsidianPropertyType.DATE),
	Literal(ObsidianPropertyType.DATETIME),
	Literal(ObsidianPropertyType.NUMBER),
	Literal(ObsidianPropertyType.TEXT),
	Literal(ObsidianPropertyType.TAGS),
	Literal(ObsidianPropertyType.MULTITEXT)
);

const ObsidianFrontmatterSource = BaseSource.extend({
	type: Literal(SourceType.FRONTMATTER),
	propertyType: ObsidianPropertyTypeUnion,
	propertyKey: String,
	filterCondition: Union(
		TextFilterConditionUnion,
		NumberFilterConditionUnion,
		DateFilterConditionUnion
	),
	filterText: String,
});

const Source = Union(ObsidianFolderSource, ObsidianFrontmatterSource);

const TableSettings = Record({
	numFrozenColumns: Number,
	showCalculationRow: Boolean,
});

const SourceRowOrder = Record({
	sourceId: String,
	index: Number,
	uniqueId: String,
});

const TableModel = Record({
	columns: Array(Column),
	rows: Array(Row),
	filters: Array(Filter),
	settings: TableSettings,
	sources: Array(Source),
	externalRowOrder: Array(SourceRowOrder),
});

export const LoomStateObject = Record({
	pluginVersion: String,
	model: TableModel,
});
