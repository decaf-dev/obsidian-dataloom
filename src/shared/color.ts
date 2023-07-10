import { Color } from "src/shared/types";

export const findColorClassName = (
	isDarkMode: boolean,
	color: Color
): string => {
	switch (color) {
		case Color.LIGHT_GRAY:
			return isDarkMode
				? "Dashboards__light-gray--dark"
				: "Dashboards__light-gray--light";
		case Color.GRAY:
			return isDarkMode
				? "Dashboards__gray--dark"
				: "Dashboards__gray--light";
		case Color.BROWN:
			return isDarkMode
				? "Dashboards__brown--dark"
				: "Dashboards__brown--light";
		case Color.ORANGE:
			return isDarkMode
				? "Dashboards__orange--dark"
				: "Dashboards__orange--light";
		case Color.YELLOW:
			return isDarkMode
				? "Dashboards__yellow--dark"
				: "Dashboards__yellow--light";
		case Color.GREEN:
			return isDarkMode
				? "Dashboards__green--dark"
				: "Dashboards__green--light";
		case Color.BLUE:
			return isDarkMode
				? "Dashboards__blue--dark"
				: "Dashboards__blue--light";
		case Color.PURPLE:
			return isDarkMode
				? "Dashboards__purple--dark"
				: "Dashboards__purple--light";
		case Color.PINK:
			return isDarkMode
				? "Dashboards__pink--dark"
				: "Dashboards__pink--light";
		case Color.RED:
			return isDarkMode ? "Dashboards__red--dark" : "DataLoom--light";
		default:
			return "";
	}
};

export const randomColor = () => {
	const index = Math.floor(Math.random() * Object.values(Color).length);
	return Object.values(Color)[index];
};
