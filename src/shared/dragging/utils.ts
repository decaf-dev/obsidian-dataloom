export const getRowId = (rowEl: HTMLElement) => {
	//React Virtuoso only works with our keyboard focus navigation system when we memorize the row component
	//We can only do this if we don't place a `data-row-id` attr on the row itself. The workaround to this is to place
	//the `data-row-id` attr on the last td element in the row (which contains the drag menu)
	const td = rowEl.firstChild as HTMLElement | null;
	if (!td) return null;

	const id = td.getAttribute("data-row-id");
	return id ?? null;
};
