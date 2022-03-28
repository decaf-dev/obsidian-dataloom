import { CELL_COLOR } from "../../constants";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(CELL_COLOR).length);
	return Object.values(CELL_COLOR)[index];
};
