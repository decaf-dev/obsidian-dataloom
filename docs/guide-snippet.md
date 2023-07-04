# Creating a snippet

A [snippet](https://help.obsidian.md/Extending+Obsidian/CSS+snippets) is a `css` file that overrides existing styles in Obsidian.

## Changing the padding of cells

For example, if you wanted to change the padding size of cells, you could create a snippet that targets all of the cell containers

```css
/* nlt-snippet.css */

.Dashboards__th-content {
	padding: 10px;
}

.Dashboards__body-td-container {
	padding: 20px 10px;
}

.Dashboards__footer-td-container {
	padding: 20px 10px;
}
```

## Classes

The following table is a list of various plugin classes that you may override.

| Class                              | Element               |
| ---------------------------------- | --------------------- |
| `.Dashboards__app`                 | Main app conatiner    |
| `.Dashboards__option-bar`          | Option bar            |
| `.Dashboards__table`               | Table                 |
| `.Dashboards__th`                  | Header cell           |
| `.Dashboards__th-container`        | Header cell container |
| `.Dashboards__th-content`          | Header cell content   |
| `.Dashboards__body-td`             | Body cell             |
| `.Dashboards__body-td-container`   | Body cell container   |
| `.Dashboards__footer-td`           | Footer cell           |
| `.Dashboards__footer-td-container` | Footer cell container |
| `.Dashboards__button`              | Button                |
| `.Dashboards__p`                   | Text                  |
