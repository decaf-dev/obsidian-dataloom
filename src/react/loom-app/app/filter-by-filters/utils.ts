import { DateFilterOption } from "src/shared/loom-state/types/loom-state";

export const getDateFromDateFilterOption = (
	option: DateFilterOption
): Date | null => {
	switch (option) {
		case DateFilterOption.TODAY: {
			const date = new Date();
			return date;
		}
		case DateFilterOption.TOMORROW: {
			const date = new Date();
			date.setDate(date.getDate() + 1);
			return date;
		}
		case DateFilterOption.YESTERDAY: {
			const date = new Date();
			date.setDate(date.getDate() - 1);
			return date;
		}
		case DateFilterOption.ONE_WEEK_AGO: {
			const date = new Date();
			date.setDate(date.getDate() - 7);
			return date;
		}
		case DateFilterOption.ONE_WEEK_FROM_NOW: {
			const date = new Date();
			date.setDate(date.getDate() + 7);
			return date;
		}
		case DateFilterOption.ONE_MONTH_AGO: {
			const date = new Date();
			date.setMonth(date.getMonth() - 1);
			return date;
		}
		case DateFilterOption.ONE_MONTH_FROM_NOW: {
			const date = new Date();
			date.setMonth(date.getMonth() + 1);
			return date;
		}
		default:
			return null;
	}
};

export const getDateAtMidnight = (date: Date) => {
	const newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

export const getDateJustBeforeMidnight = (date: Date) => {
	const newDate = new Date(date);
	newDate.setHours(23, 59, 59, 999);
	return newDate;
};
