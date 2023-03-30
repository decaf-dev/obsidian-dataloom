# Obsidian Notion-Like Tables

[![Actively Maintained](https://img.shields.io/badge/Maintenance%20Level-Actively%20Maintained-green.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

Notion-Like Tables is your premiere tool for creating and managing tabular data in Obsidian.md.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

## Version 6.0.0

After consideration, I have decided to continue development on this project.

One of the main limitations of version 5 was that I was using the `MarkdownCodeBlockProcessor` to embed tables into markdown notes. This caused various preformance issues and was very difficult to maintain. I have opted to create my own dedicated window for this plugin, as well as a corresponding file extension. The `.table` extension will now be used, similar to how canvas uses `.canvas`. Data will now be loaded and saved directly into json instead of using the settings cache.

-   See: [Release 6.0.0](https://github.com/trey-wallis/obsidian-notion-like-tables/releases/tag/6.0.0) for more details.

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
-   Click `Community plugins`
-   Go to `Restricted mode` and click `Turn off` to allow community plugins
-   Click `Browse` and search for `Notion-Like Tables`
-   Click `Install` then `Enable`

## Basic Usage

### Making a Table via Command

To quickly make a table you can use the add table command.

1. Press `ctrl + p` (Windows) or `cmd + p` (Mac) on your keyboard and search `Create new Notion-Like Table`

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

Multi-tag cells offer the same as regular tag cells but allow multiple tags.

#### Tag Colors

Once a tag has been added to a cell, you click on any cell that has that tag and then click on the horizontal menu button to the side of the tag name. A menu will then pop up through which you can change the tag color.

### Date Cell

Dates can be rendered in cells that are in a column with the `date` content type selected. To render a date please follow the format `yyyy/mm/dd` in your markdown.

### Checkbox Cell

Checkboxes can be rendered in cells that are in a column with the `checkbox` content type selected.

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
