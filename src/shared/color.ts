import { Color } from "src/shared/loom-state/types/loom-state";

export const findColorClassName = (
	isDarkMode: boolean,
	color: Color
): string => {
	switch (color) {
		case Color.LIGHT_GRAY:
			return isDarkMode
				? "dataloom-light-gray--dark"
				: "dataloom-light-gray--light";
		case Color.GRAY:
			return isDarkMode ? "dataloom-gray--dark" : "dataloom-gray--light";
		case Color.BROWN:
			return isDarkMode
				? "dataloom-brown--dark"
				: "dataloom-brown--light";
		case Color.ORANGE:
			return isDarkMode
				? "dataloom-orange--dark"
				: "dataloom-orange--light";
		case Color.YELLOW:
			return isDarkMode
				? "dataloom-yellow--dark"
				: "dataloom-yellow--light";
		case Color.GREEN:
			return isDarkMode
				? "dataloom-green--dark"
				: "dataloom-green--light";
		case Color.BLUE:
			return isDarkMode ? "dataloom-blue--dark" : "dataloom-blue--light";
		case Color.PURPLE:
			return isDarkMode
				? "dataloom-purple--dark"
				: "dataloom-purple--light";
		case Color.PINK:
			return isDarkMode ? "dataloom-pink--dark" : "dataloom-pink--light";
		case Color.RED:
			return isDarkMode ? "dataloom-red--dark" : "dataloom-red--light";
		default:
			return "";
	}
};

export const randomColor = () => {
	const index = Math.floor(Math.random() * Object.values(Color).length);
	return Object.values(Color)[index];
};
