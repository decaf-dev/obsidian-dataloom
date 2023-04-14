import { getDateParts } from "./utils";

describe("getDartParts", () => {
	it("returns correct date parts", () => {
		const date = new Date(1704006000000);
		const { year, month, day, time } = getDateParts(date);
		expect(year).toEqual("2023");
		expect(month).toEqual("12");
		expect(day).toEqual("31");
		expect(time).toEqual("12:00 AM");
	});
});
