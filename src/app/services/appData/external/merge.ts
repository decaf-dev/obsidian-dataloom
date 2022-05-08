export const mergeAppData = (
	oldAppData: AppData,
	newAppData: AppData
): AppData => {
	//Grab sort settings
	const merged = { ...newAppData };
	oldAppData.headers.forEach((header, i) => {
		merged.headers[i].sortName = header.sortName;
		merged.headers[i].width = header.width;
	});

	newAppData.cells.forEach((cell, i) => {
		if (oldAppData.cells.length >= i + 1) {
			merged.cells[i].id = oldAppData.cells[i].id;
		} else {
			merged.cells[i].id = cell.id;
		}
	});

	//TODO change
	//This allows the user to add new rows or delete existing rows
	//and still have the correct creationTime
	newAppData.rows.forEach((row, i) => {
		if (oldAppData.rows.length >= i + 1) {
			merged.rows[i].creationTime = oldAppData.rows[i].creationTime;
		} else {
			merged.rows[i].creationTime = row.creationTime;
		}
	});

	//Grab tag settings
	oldAppData.tags.forEach((tag, i) => {
		const index = merged.tags.findIndex((t) => t.content === tag.content);
		if (index !== -1) {
			merged.tags[index].id = tag.id;
			merged.tags[index].selected = tag.selected;
			merged.tags[index].color = tag.color;
		}
	});
	return merged;
};
