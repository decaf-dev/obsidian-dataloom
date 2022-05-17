import { COLOR } from "src/app/constants";

export const findColorClass = (color: string): string => {
	switch (color) {
		case COLOR.LIGHT_GRAY:
			return "NLT__color--light-gray";
		case COLOR.GRAY:
			return "NLT__color--gray";
		case COLOR.BROWN:
			return "NLT__color--brown";
		case COLOR.ORANGE:
			return "NLT__color--orange";
		case COLOR.YELLOW:
			return "NLT__color--yellow";
		case COLOR.GREEN:
			return "NLT__color--green";
		case COLOR.BLUE:
			return "NLT__color--blue";
		case COLOR.PURPLE:
			return "NLT__color--purple";
		case COLOR.PINK:
			return "NLT__color--pink";
		case COLOR.RED:
			return "NLT__color--red";
		default:
			return "";
	}
};
