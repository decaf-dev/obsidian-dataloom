import { Header } from "./header";
import { Row } from "./row";
import { Cell } from "./cell";
import { Tag } from "./tag";

/**
 * This represents a state that is serializable
 */
export interface TableModel {
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}

/**
 * This represent a state that is able to saved in the settings cache
 */
export interface TableSettings {
	columns: ColumnSettings[];
	tag: TagSettings[];
}

export interface ColumnSettings {}

export interface TagSettings {}
