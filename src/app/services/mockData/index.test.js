import { mockTable } from "./index";

describe("mockTable", () => {
	it("creates a mock table", () => {
		const table = mockTable(
			["test 1", "test 2"],
			[
				["cell 1", "cell 2"],
				["cell 3", "cell 4"],
			]
		);
		const tr = table.querySelectorAll("tr");
		expect(tr.length).toBe(3);

		const th = tr[0].querySelectorAll("th");
		expect(th.length).toEqual(2);

		let td = tr[1].querySelectorAll("td");
		expect(td.length).toEqual(2);

		td = tr[2].querySelectorAll("td");
		expect(td.length).toEqual(2);
	});
});
