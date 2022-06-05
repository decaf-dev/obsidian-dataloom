# Obsidian Notion-Like Tables

[![Active Development](https://img.shields.io/badge/Maintenance%20Level-Actively%20Developed-brightgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

Obsidian Notion-Like Tables allows you to create markdown tables using an interface similar to that found in Notion.so.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

## What's New?

### Version 4.0.0

Starting in 4.0.0, table ids, row ids, and column ids are no longer required in your table. Thus, Notion-Like Tables will automatically render a NLT from your standard Obsidian markdown tables. If you would like to override this behavior, please seeing the Settings section below.

## Usage

### Hotkeys

-   Add a new NLT markdown table
    -   `ctrl + shift + +` (Windows) (Press + once)
    -   `cmd + shift + +` (Mac)
-   Add a new column to a focused table
    -   `ctrl + shift + \` (Windows)
    -   `cmd + shift + \ ` (Mac)
-   Add a new row to a focused table
    -   `ctrl + shift + enter` (Windows)
    -   `cmd + shift + enter` (Mac)

### Making a Table via Command

To quickly make a table you can use the add table command. Press `cmd + p` on your keyboard search "Add table".

Note: you must be in editing mode for this command to appear.

Toggle to reading mode and the table will automatically render.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/add-table-command.png)

### How Tables Are Rendered

Renaming a table id will cause your table to become orphaned from its saved data in the cache and create new data from the markdown. This can cause you to lose the saved column width, sorting, or tag colors on your table. If you would like to rename your table-id to something meaningful, I recommend doing this at the creation of your table.

### Headers

Click on a header name to view the header menu. In the header menu you can rename the header, sort your column values or change the header type.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/header.png)

### Editing Cells

To edit a cell, just click on it. An input, textarea or menu will appear which will allow you to edit the cell's content. Make the necessary changes and then click outside the box or press enter to save the text. Notion-Like tables will automatically handle updating your markdown.

### Text Cells

Text can be rendered in cells that are in a column with the `text` type selected.

#### Markdown

To bold text use either double astericks `**` or the bold tag `<b>`

-   `**This is bold**`
-   `<b>This is bold</b>`

To italicize text use either single astericks `*` or the italics tag `<i>`

-   `*This is italicized*`
-   `<i>This is italicized</i>`

To highlight text use the double equal sign syntax `==`

-   `==This is highlighted==`

To underline text use the underline tag `<u>`

-   `<u>This is underlined</u>`

#### Links

Links can be rendered in cells that are in a column with the `text` column type is selected. To render a link, add double squares surrounding text `[[My Link]]`.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/internal-link-edit.png)

#### URLs

If you want to display a url, type the url making sure it begins with `http://` or `https://`. NLT will automatically render it in the table.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/url.png)

#### Line Breaks

Line breaks can be added using the break line HTML tag `<br>`. For example, if you would like to create a line between two pieces of text, you could add:

`This is my text<br><br>There is now a line between us`

### Tags

Tags can be rendered in cells that are in a column with the `tag` type selected.

Tags have a special notion-like menu that will appear. Tags are scoped to each column of a table. You can type text to filter existing tags and select one. You can also create a new tag by typing text and clicking "Create New" or pressing enter.

Tags can be rendered with or without a pound sign `#`. If you use a pound sign, then the tag will be rendered as a internal Obsidian tag link. Otherwise, it will be rendered as plain text.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/tag-menu.png)

#### Tag Colors

Once a tag has been added to a cell, you click on any cell that has that tag and then click on the horizontal menu button to the side of the tag name. A menu will then pop up through which you can change the tag color.

### Dates

Dates can be rendered in cells that are in a column with the `date` type selected. To render a date please follow the format `yyyy/mm/dd` in your markdown.

### Checkboxes

Checkboxes can be rendered in cells that are in a column with the `checkbox` type selected. To render a checkbox, add two square brackets with a space `[ ]` for unchecked or two square brackets surrounding an x `[x]` for checked.

### Copy Cell Content

Right click a cell and its content will be added to your clipboard.

NOTE: The table must be in focus for this to work. Click on the table to focus it.

### Undoing a Type Change

NLTs does not currently have built in history. If you need to undo changes, go to editing mode and undo markdown changes using `ctrl+z` (or `option-z`on mac). Then go back to reading mode.

### Errors

#### NLT Tables Not Rendering

If your table is missing a table id row or type definition row then it will not be rendered as a Notion-Like Table. Likewise, if you use an invalid column type other than the accepted column types. A Notion-Like Table will not be rendered.

Please check your console for more information regarding your errors:
You can view the console using `cmd + alt + i` (Windows) or `cmd + option + i` (Mac)

#### Cell Type Errors

A cell type error will occur if you enter data which doesn't match the column data type. You can correct this error by clicking on the cell and entering in data valid for the set column type.

## Custom Themes

NLT tables uses normal table semantic elements (`table`, `th`, `tr`, `td`, etc) to render. If you wish to edit the display of the table, just style those elements in your CSS.

## Bugs and Feature Requests

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues). I will try to respond as soon as possible.

## Support Plugin Development

-   I have a lot of features that I am excited to add to this plugin. If you would like to help support plugin development, you can [buy me an herbal tea](https://www.buymeacoffee.com/treywallis) ;)

## License

-   GNU GPLv3

## Author

-   Trey Wallis
