import { Color } from "../color/types";

export const randomColor = () => {
	const index = Math.floor(Math.random() * Object.values(Color).length);
	return Object.values(Color)[index];
};
