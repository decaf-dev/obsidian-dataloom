# Frozen Columns

## Purpose

A frozen table column is a column that stays in place as the table scrolls. The header and footer in a loom are frozen by default. The first few columns of the table should be able to be frozen or unfrozen by the user.

## Table

A frozen column can be created by using the `position: sticky` attribute on a cell. In order to get cells collapsing underneath each other, the `z-index` must be used.

```css
.dataloom-cell--header {
	position: sticky;
	top: 0;
	z-index: 1;
	...;
}

.dataloom-cell--footer {
	position: sticky;
	top: 0;
	z-index: 1;
	...;
}

.dataloom-cell.dataloom-cell--freeze {
	position: sticky;
	left: 0;
	z-index: 2;
	background-color: var(--background-primary);
}

.dataloom-cell.dataloom-cell--freeze-header {
	background-color: var(--background-secondary);
	z-index: 3;
}

.dataloom-cell.dataloom-cell--freeze-footer {
	z-index: 3;
}
```

We use `z-index: 3` to make sure that the first header cell and first footer cell can handle scrolling
in both the x and y direction.

## Header Menu

In order to freeze a column, you can select the freeze menu item from the header menu. If a column is already frozen, you can select the unfreeze menu item.

## Settings

By default, the first column will be frozen. This can be changed in the settings

## Loom File

```javascript
interface LoomState {
	model: {
		numFrozenColumns: number,
	};
}
```

If the numFrozenColumns is 1, then the first column will be frozen. If 2, the second column will be frozen, etc.
