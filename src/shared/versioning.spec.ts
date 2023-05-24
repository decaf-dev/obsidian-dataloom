import { isVersionLessThan, legacyVersionToString } from "./versioning";

describe("legacyVersionToString", () => {
	it("should return a version string", () => {
		const result = legacyVersionToString("152");
		expect(result).toEqual("1.5.2");
	});
});

describe("isVersionLessThan", () => {
	it("should return true if oldVersion is a patch version less than newVersion", () => {
		const result = isVersionLessThan("1.0.0", "1.0.1");
		expect(result).toEqual(true);
	});

	it("should return true if oldVersion is a minor version less than newVersion", () => {
		const result = isVersionLessThan("1.0.0", "1.1.0");
		expect(result).toEqual(true);
	});

	it("should return true if oldVersion is a major version less than newVersion", () => {
		const result = isVersionLessThan("1.0.0", "2.0.0");
		expect(result).toEqual(true);
	});

	it("should return false if oldVersion is a patch version greater than newVersion", () => {
		const result = isVersionLessThan("1.0.1", "1.0.0");
		expect(result).toEqual(false);
	});

	it("should return false if a is a major version less than b", () => {
		const result = isVersionLessThan("1.1.0", "1.0.0");
		expect(result).toEqual(false);
	});

	it("should return false if a is a major version less than b", () => {
		const result = isVersionLessThan("2.0.0", "1.0.0");
		expect(result).toEqual(false);
	});
});
