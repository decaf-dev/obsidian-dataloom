import { Color } from "src/shared/types";

export const findColorClassName = (
	isDarkMode: boolean,
	color: Color
): string => {
	switch (color) {
		case Color.LIGHT_GRAY:
			return isDarkMode
				? "DataLoom__light-gray--dark"
				: "DataLoom__light-gray--light";
		case Color.GRAY:
			return isDarkMode
				? "DataLoom__gray--dark"
				: "DataLoom__gray--light";
		case Color.BROWN:
			return isDarkMode
				? "DataLoom__brown--dark"
				: "DataLoom__brown--light";
		case Color.ORANGE:
			return isDarkMode
				? "DataLoom__orange--dark"
				: "DataLoom__orange--light";
		case Color.YELLOW:
			return isDarkMode
				? "DataLoom__yellow--dark"
				: "DataLoom__yellow--light";
		case Color.GREEN:
			return isDarkMode
				? "DataLoom__green--dark"
				: "DataLoom__green--light";
		case Color.BLUE:
			return isDarkMode
				? "DataLoom__blue--dark"
				: "DataLoom__blue--light";
		case Color.PURPLE:
			return isDarkMode
				? "DataLoom__purple--dark"
				: "DataLoom__purple--light";
		case Color.PINK:
			return isDarkMode
				? "DataLoom__pink--dark"
				: "DataLoom__pink--light";
		case Color.RED:
			return isDarkMode ? "DataLoom__red--dark" : "DataLoom__red--light";
		default:
			return "";
	}
};

export const randomColor = () => {
	const index = Math.floor(Math.random() * Object.values(Color).length);
	return Object.values(Color)[index];
};
