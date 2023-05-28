# Creating a snippet

A [snippet](https://help.obsidian.md/Extending+Obsidian/CSS+snippets) is a `css` file that overrides existing styles in Obsidian.

## Changing the padding of cells

For example, if you wanted to change the padding size of cells, you could create a snippet that targets all of the cell containers

```css
/* nlt-snippet.css */

.NLT__th-content {
	padding: 10px;
}

.NLT__body-td-container {
	padding: 20px 10px;
}

.NLT__footer-td-container {
	padding: 20px 10px;
}
```

## Classes

The following table is a list of various plugin classes that you may override.

| Class                       | Element               |
| --------------------------- | --------------------- |
| `.NLT__app`                 | Main app conatiner    |
| `.NLT__option-bar`          | Option bar            |
| `.NLT__table`               | Table                 |
| `.NLT__th`                  | Header cell           |
| `.NLT__th-container`        | Header cell container |
| `.NLT__th-content`          | Header cell content   |
| `.NLT__body-td`             | Body cell             |
| `.NLT__body-td-container`   | Body cell container   |
| `.NLT__footer-td`           | Footer cell           |
| `.NLT__footer-td-container` | Footer cell container |
| `.NLT__button`              | Button                |
| `.NLT__p`                   | Text                  |
