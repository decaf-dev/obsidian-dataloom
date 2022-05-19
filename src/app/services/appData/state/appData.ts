import { Header } from "./header";
import { Row } from "./row";
import { Cell } from "./cell";
import { Tag } from "./tag";

export interface AppData {
	headers: Header[];
	rows: Row[];
	cells: Cell[];
	tags: Tag[];
}
