import { COLOR } from "../../constants";

export const randomColor = (): string => {
	const index = Math.floor(Math.random() * Object.keys(COLOR).length);
	return Object.values(COLOR)[index];
};
