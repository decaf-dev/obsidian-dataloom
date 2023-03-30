import FileOperations from "./FileOperations";

describe("createFile", () => {
	test("creates a markdown file", async () => {
		const mock = jest.spyOn(FileOperations, "createObsidianFile");
		mock.mockImplementation(() => Promise.resolve(true));

		const testData = {
			filePath: "Untitled.md",
			fileData: '{"key": "value"}',
		};

		const filePath = await FileOperations.createFile(
			testData.filePath,
			testData.fileData
		);
		expect(mock).toBeCalledTimes(1);
		expect(mock).toHaveBeenCalledWith(testData.filePath, testData.fileData);
		expect(filePath).toEqual(testData.filePath);
		mock.mockRestore();
	});

	test("appends a number to the file name if file already exists", async () => {
		const mock = jest.spyOn(FileOperations, "createObsidianFile");
		mock.mockImplementationOnce(() =>
			Promise.reject(new Error("File already exists"))
		);
		mock.mockImplementationOnce(() => Promise.resolve(true));

		const testData = {
			filePath: "Untitled.md",
			filePath2: "Untitled 0.md",
			fileData: '{"key": "value"}',
		};

		const filePath = await FileOperations.createFile(
			testData.filePath,
			testData.fileData
		);
		expect(mock).toBeCalledTimes(2);
		expect(mock).toHaveBeenLastCalledWith(
			testData.filePath2,
			testData.fileData
		);
		expect(filePath).toEqual(testData.filePath2);
		mock.mockRestore();
	});
});
