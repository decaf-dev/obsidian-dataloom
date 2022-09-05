# Obsidian Notion-Like Tables

[![Active Development](https://img.shields.io/badge/Maintenance%20Level-Actively%20Developed-brightgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

Obsidian Notion-Like Tables allows you to manage markdown tables using a WYSIWYG interface. The plugin supports editing of vanilla table markdown offering features such as editing cells, sorting, deleting, and adding new rows and columns.

As plugin development continues, the goal is to add many of the features found in Notion.so.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

Want to support development?

<a href="
https://www.buymeacoffee.com/treywallis"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=treywallis&button_colour=6a8695&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00"></a>

## Version 4.3.1

-   Type switching now works without any data loss. Fixes [#196](https://github.com/trey-wallis/obsidian-notion-like-tables/issues/196)

## Version 4.3.0

-   Updated table replacement algorithm. This should fix any tables in which the markdown wasn't updating
-   Enabled multi-table support for files
    -   To accomodate this feature, NLT tables are now an "opt-in" feature for markdown tables and require a block id to render.
    -   See: [Basic usage](#basic-usage)
-   Removed excluded files setting
-   Sorting rows will now sort the source markdown

Current limitations in 4.3.0 include:

-   No live preview support (to be fixed in 4.4.0)

## About

-   [Installation](#installation)
-   [Basic usage](#basic-usage)
-   [Hotkeys](#hotkeys)
-   [Header menu](#header-menu)
-   [Cell types](#cell-types)
-   [Markdown support](#markdown-support)
-   [Column resizing](#column-resizing)
-   [Copying cell content](#copying-cell-content)
-   [Undoing changes](#undoing-changes)
-   [Custom themes](#custom-themes)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

-   Go to `Community plugins` and turn off `Safe mode`
-   Under community plugins click `Browse`. Search for `Notion-Like Tables` and click `Install` then click `Enable`

## Basic Usage

Notion Like Tables are an opt-in feature. To render a markdown table as a Notion-Like Table, you must add a block id to your existing table.

A block id is a string that starts with carrot `^` and followed directly by any length of characters e.g. `^abc123`

This id must be placed 1 or 2 spaces below the last table line.

```markdown
| Column 1 |
| -------- |

^abc123
```

Once you add a block id, you will have to restart Obsidian for the plugin to recognize the it.

### Making a Table via Command

To quickly make a table you can use the add table command. Press `cmd + p` on your keyboard search "Add table".

Note: you must be in editing mode for this command to appear.

Toggle to reading mode and the table will automatically render.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/add-table-command.png)

## Hotkeys

-   Add a new NLT markdown table
    -   `ctrl + shift + +` (Windows) (Press + once)
    -   `cmd + shift + +` (Mac)
-   Add a new column to a focused table
    -   `ctrl + shift + \` (Windows)
    -   `cmd + shift + \ ` (Mac)
-   Add a new row to a focused table
    -   `ctrl + shift + enter` (Windows)
    -   `cmd + shift + enter` (Mac)

## Header Menu

Click on a header name to view the header menu. In the header menu you can rename the header, sort your column values or change the column content type.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/header.png)

## Cell Types

To edit a cell, just click on it. An textarea or menu will appear which will allow you to edit the cell's content. Make the necessary changes and then click outside the box or press enter to save the text. Notion-Like tables will automatically handle updating your markdown.

### Text Cell

Text can be rendered in cells that are in a column with the `text` content type selected.

### Number Cell

Numbers can be rendered in cells that are in a column with the `number` content type selected. A valid number only includes digits 0-9

### Tag Cell

Tags can be rendered in cells that are in a column with the `tag` content type selected.

Tags have a special notion-like menu that will appear. Tags are scoped to each column of a table. You can type text to filter existing tags and select one. You can also create a new tag by typing text and clicking "Create New" or pressing enter.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/tag-menu.png)

#### Tag Colors

Once a tag has been added to a cell, you click on any cell that has that tag and then click on the horizontal menu button to the side of the tag name. A menu will then pop up through which you can change the tag color.

### Date Cell

Dates can be rendered in cells that are in a column with the `date` content type selected. To render a date please follow the format `yyyy/mm/dd` in your markdown.

### Checkbox Cell

Checkboxes can be rendered in cells that are in a column with the `checkbox` content type selected. To render a checkbox, add two square brackets with a space `[ ]` for unchecked or two square brackets surrounding an x `[x]` for checked.

## Markdown Support

Notion-Like Tables supports all markdown that is found in Obsidian.md

## Copying Cell Content

Right click a cell and its content will be added to your clipboard.

NOTE: The table must be in focus for this to work. Click on the table to focus it.

## Column Resizing

### Auto Width

Text and number cells have an option for `Auto Width`. Auto width means that the column will automatically resize to the largest width of the cell.

Please note that this will calculate the maximum length of the text without wrapping.

This feature can be enabled by clicking on a header, clicking "Edit" and then clicking the toggle for `Auto Width`.

### Manually Resizing

When auto width is disabled, you have the option to manually size a column. You can do this by hovering your mouse over a header's right border. Your cursor will then show a resize indicator and you can click and drag until you set the desired length.

### Wrap Overflow

With auto width disabled, you have the option to set the behavior of the text on overflow. This property is known as `Wrap Overflow`.

When wrap overflow is enabled the text will wrap once it reaches the width of the column. This may be useful for long blocks of text.

When wrap overflow is disabled the text will cut off at the column width and create an ellipsis (...)

## Undoing Changes

NLTs does not currently have built in history. If you need to undo changes, go to editing mode and undo markdown changes using `ctrl+z` (or `option-z` on mac). Then go back to reading mode.

## Custom Themes

NLT tables uses normal table semantic elements to render:

-   `table`
-   `th`
-   `tr`
-   `td`

If you wish to edit the table style, you may stylize these elements in your CSS.

## Contributing

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues). I will try to respond as soon as possible.

## License

-   GNU GPLv3
