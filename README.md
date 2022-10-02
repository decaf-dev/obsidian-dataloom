# Obsidian Notion-Like Tables

[![Active Development](https://img.shields.io/badge/Maintenance%20Level-Actively%20Developed-brightgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

Notion-Like Tables is your premiere tool for creating and managing tabular data in Obsidian.md.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

Want to support development?

<a href="https://www.buymeacoffee.com/treywallis"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=treywallis&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

## Version 5.0.0

Make some noise, because version 5 of Notion-Like-Tables has arrived!

Notion Like Tables now supports usage of all HTML entities. This means that previosuly broken entites, such as emoji-icons are now fully supported. This will also allow usage of any language characters with Notion-Like Tables. Fixes have made for Obsidian direct links and direct link aliases.

Live preview is now fully functional. You may use Notion Like Tables in editing mode and have them sync with the table rendered in reading mode. If you edit a table in reading mode, it will be synced to your live preview table.

Multiple tables can now be used in your markdown files. You may also display the same display across multiple files through the new system of NLT codeblocks.

Multi-tag support has been added, as well as support for dark colors for our dark theme users.

Various other bug fixes and optimizations have been added. See: [Release 5.0.0]() for more details.

For migrating to NLT `5.0.0` from NLT `4.3.1` or less, please following the [migration guide](#previous-version-migration)

## About

-   [Installation](#installation)
-   [Basic usage](#basic-usage)
-   [Hotkeys](#hotkeys)
-   [Header menu](#header-menu)
-   [Cell types](#cell-types)
-   [Markdown support](#markdown-support)
-   [Column resizing](#column-resizing)
-   [Copying cell content](#copying-cell-content)
-   [Plugin settings](#plugin-settings)
-   [Undoing changes](#undoing-changes)
-   [Custom themes](#custom-themes)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

-   Click the settings gear in the bottom left corner of your Obsidian application
-   Click `Community plugins` and next to `Restricted mode` click `Turn off` to allow community plugins
-   Now click `Browse` and search for `Notion-Like Tables`
-   Click `Install` then click `Enable`

## Basic Usage

### Making a Table via Command

To quickly make a table you can use the add table command. Press `cmd + p` on your keyboard search "Add table". A NLT codeblock will be inserted into your markdown file. Once you click outside of the codeblock, a table will immediately render.

Note: you must be in editing mode for this command to appear.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/add-table-command.png)

### NLT Codeblocks

To render a table, you need to place a NLT codeblock into your markdown file.

A normal codeblock contain the following format:

```notion-like-tables
table-id-123456
```

The codeblock begins with `notion-like-tables` directive.

The inside of the codeblock includes a table id. The table id is of the format: `table-id-<my-specifier>`.

The specifier may include the following characters

-   `a-Z` - Any lowercase letters
-   `A-Z` - Any uppercase letters
-   `0-9` - Any numbers
-   `-` - Hyphens
-   `_` - Underscores

Once you add the block, a `table defintion file` will automatically be created, and your table will render.

### Table Definition Files

Table definition files contain the markdown for your table. They also contain `columnIds` and `rowIds` that are connected to each column and row of the table.

**Example table definition file**

```markdown
---
columnIds: ["column-id-Zet1HHJm"]
rowIds: ["row-id-BtUYxXIV", "row-id-A6PfNOAV"]
---

| New Column |
| ---------- |
|            |
```

The `columnIds` and `rowIds` are included in a frontmatter declaration after which the table markdown is declared. Both key are connected to an array of ids.

If your table has 3 columns, it must have 3 column ids. Likewise, if your table has 3 rows, it must have 3 row ids. Please note that the hyphen row doesn't count as a row. In the example above, the table only has 2 row ids.

Notion Like Tables use the `MarkdownCodeBlockProcessor` to replace a NLT codeblock in your markdown file with a React app generated from your table definition file.

All table definition files are stored in a folder called [`_notion-like-tables`](#table-definition-folder).

## Previous Migration Guide

In order to migrate from Notion Like Tables 4.3.1 or earlier, please follow the following steps

-   Delete your `data.json` file found in `<your-vault>/.obsidian/plugins/notion-like-tables`
-   For every table you want to migrate, please make a table definition file and place them into the table definition folder

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

### Multi-Tag Cell

Multi-tag cells offer the same as regular tag cells but allow multiple tags. If you would like to manually add multiple tags to the markdown file, please make sure that you separate each tag with a comma and no space.

```markdown
tag1,tag2,tag3
```

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

All cells have an option called `Auto Width`. Auto width means that the column will automatically resize to the `max-content` of the HTML rendered in the cell.

This feature can be enabled by clicking on a header, clicking "Edit" and then clicking the toggle for `Auto Width`.

### Manually Resizing

When auto width is disabled, you have the option to manually size a column. You can do this by hovering your mouse over a column's right border. Your cursor will then show a resize indicator. You may then click and drag to resize the column to your desired size.

### Wrap Overflow

With auto width disabled, you have the option to set the behavior of the text on overflow. This property is known as `Wrap Overflow`.

When wrap overflow is enabled the text will wrap once it reaches the width of the column. This is useful for long blocks of text.

When wrap overflow is disabled the text will cut off at the column width and create an ellipsis (...)

## Plugin Settings

### Table Definition Folder

The table definition folder is the folder that contains the table definition files for all tables in your vault. The default value is `_notion-like-tables`. You may change this value to any folder name. If the folder has not yet been created, the folder will be created on table load.

## Undoing Changes

NLTs does not currently have built in history. If you need to undo changes, go to editing mode and undo markdown changes using `ctrl+z` (or `option-z` on mac). Then go back to reading mode.

## Custom Themes

Please override the following classes for custom theme development.

| Class                  | Element  | Usage       |
| ---------------------- | -------- | ----------- |
| `.NLT\_\_button`       | `button` |             |
| `.NLT\_\_table`        | `table`  |             |
| `.NLT\_\_tr`           | `tr`     |             |
| `.NLT\_\_th`           | `th`     | Text styles |
| `.NLT\_\_th-content`   | `div`    | Padding     |
| `.NLT\_\_td`           | `td`     | Text styles |
| `.NLT\_\_td-container` | `div`    | Padding     |

## Contributing

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues).

## License

-   GNU GPLv3
