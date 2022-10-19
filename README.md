# Obsidian Notion-Like Tables

[![Not Maintained](https://img.shields.io/badge/Maintenance%20Level-Abandoned-orange.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

**NOTE: This plugin is no longer maintained. If you would like to continue development, please fork the project and make your own version.**

Notion-Like Tables is your premiere tool for creating and managing tabular data in Obsidian.md.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

## Version 5.0.0

-   Notion-Like Tables now support usage of all HTML entities. This means that previously broken entities, such as emoji icons are now fully supported. Obsidian direct links and direct link aliases are now functional.

-   Live preview is now fully functional. You may use Notion-Like Tables in editing mode and have them sync with the table rendered in reading mode. If you edit a table in reading mode, it will be synced to your live preview table.

-   Multiple tables can now be used in your markdown files. You may also display the same table across multiple files through the new system of `NLT Code Blocks`.

-   Multi-tag support has been added, as well as support for dark colors for our dark theme users.

-   Various other bug fixes and optimizations have been added. See: [Release 5.0.0](https://github.com/trey-wallis/obsidian-notion-like-tables/releases/tag/5.0.0) for more details.

**🔥 WARNING: ALL PREVIOUSLY CREATED TABLES MUST BE MIGRATED TO 5.0.0 🔥**

You will also lose your previous `data.json` settings for this plugin. This is necessary as the plugin now uses a different structure for its settings data. You will NOT lose any markdown data or notes

**For migrating to NLT `5.0.0` from NLT `4.3.1` or less, please use the [migration tool](#migration-tool)**

## About

-   [Installation](#installation)
-   [Basic usage](#basic-usage)
-   [Migration tool](#migration-tool)
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
-   Click `Community plugins`
-   Go to `Restricted mode` and click `Turn off` to allow community plugins
-   Click `Browse` and search for `Notion-Like Tables`
-   Click `Install` then `Enable`

## Basic Usage

### Making a Table via Command

To quickly make a table you can use the add table command.

1. Open up a markdown file and change your view to editing mode.
2. Press `ctrl + p` (Windows) or `cmd + p` (Mac) on your keyboard and search `Add table`. An NLT code block will be inserted into your markdown file.
3. Click outside of the code block, and a table will immediately render.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/add-table-command.png)

### NLT Code Blocks

To render a table, you need to place an NLT Code Block into your markdown file.

**Example NLT Code Block**

````markdown
```notion-like-tables
table-id-123456
```
````

-   The code block begins with `notion-like-tables` directive.

-   The inside of the code block includes a table id. The table id is of the format: `table-id-<my-specifier>`. A specifier can only contain [valid id characters](#valid-id-characters).

Once you add the block, a `table definition file` will automatically be created, and your table will render.

### Table Definition Files

A table definition file contains the table markdown for a Notion-Like Table. It also contains specific ids that are needed to maintain the integrity of the table in the React application.

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

The `columnIds` and `rowIds` keys are included in a frontmatter declaration after which the table markdown is declared. Both keys are connected to an array of ids.

-   The number of ids in the `columnIds` array must match the number of columns in the markdown table
-   The number of ids in the `rowIds` array must match the number of rows in the markdown table
    -   Please note that the hyphen row doesn't count as a row. In the example above, the table only has 2 row ids
-   Each row or column id must only contain [valid id characters](#valid-id-characters)

Notion Like Tables uses the `MarkdownCodeBlockProcessor` to replace an NLT code block in your markdown file with a React app generated from your table definition file.

All table definition files are stored in a folder called [`_notion-like-tables`](#table-definition-folder).

### Valid ID Characters

Table ids, row ids, and column ids may only contain valid id characters:

-   `a-Z` - Any lowercase letters
-   `A-Z` - Any uppercase letters
-   `0-9` - Any numbers
-   `-` - Hyphens
-   `_` - Underscores

## Migration Tool

Please make sure that you have read [NLT Code Blocks](#nlt-code-blocks) and [Table Definition Files] sections(#table-definition-files) before continuing.

To make code blocks for your previous tables:

1. Press on your keyboard `ctrl + p` (Windows) or `cmd + p` (Mac) on your keyboard and search for `Migration tool` (alternatively you can also use the shortcut `cmd + shift + m`)
2. Paste your previous markdown text into the textarea
3. Click `Generate code block`. A table definition file will be created for your migrated table.
4. Click the `Copy` button
5. Paste the code block into your markdown file

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

Click on a header name to view the header menu. In the header menu, you can rename the header, sort your column values or change the column content type.

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

Right-click a cell and its content will be added to your clipboard.

NOTE: The table must be in focus for this to work. Click on the table to focus on it.

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

The table definition folder is the folder that contains the table definition files for all tables in your vault. The default value is `_notion-like-tables`. You may change this value to any valid folder name. If the folder has not yet been created, the folder will be created on the first table load.

## Undoing Changes

There is currently no support for undoing changes. This is part of the roadmap for future releases.

## Custom Themes

Please override the following classes for custom theme development.

| Class                | Element  | Usage       |
| -------------------- | -------- | ----------- |
| `.NLT__button`       | `button` |             |
| `.NLT__table`        | `table`  |             |
| `.NLT__tr`           | `tr`     |             |
| `.NLT__th`           | `th`     | Text styles |
| `.NLT__th-content`   | `div`    | Padding     |
| `.NLT__td`           | `td`     | Text styles |
| `.NLT__td-container` | `div`    | Padding     |

## Contributing

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues).

## License

-   GNU GPLv3
