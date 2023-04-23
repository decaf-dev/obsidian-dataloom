# Obsidian Notion-Like Tables

<img width="1091" alt="cover" src="https://user-images.githubusercontent.com/40307803/233756888-5747bd5f-824b-42e1-be0e-e92518972cf0.png">

Notion-Like Tables is your premiere tool for creating and managing tabular data in Obsidian.md.

[![Active Development](https://img.shields.io/badge/Maintenance%20Level-Actively%20Developed-brightgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22notion-like-tables%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json) ![Release Version](https://img.shields.io/github/v/release/trey-wallis/obsidian-notion-like-tables)

<video src="https://user-images.githubusercontent.com/40307803/233739359-1de10f4f-a850-4c75-996c-9cc4257d5d36.mov" controls></video>

[Lastest release notes](https://github.com/trey-wallis/obsidian-notion-like-tables/releases/tag/6.5.0)

## About

-   [Installation](#installation)
-   [Getting Started](#getting-started)
-   [Hot Keys](#hot-keys)
-   [Features](#features)
-   [Settings](#settings)
-   [Known Issues](#known-issues)
-   [CSS Styling](#css-styling)
-   [Issues](#issues)
-   [License](#license)

## Installation

-   Open Obsidian Settings
-   Click `Community plugins`
-   Go to `Restricted mode` and click `Turn off` to allow community plugins
-   Click `Browse` and search for `Notion-Like Tables`
-   Click `Install` then `Enable`

## Getting Started

To get started all you need to do is to create a table.

You can do this by clicking on the table icon on the sidebar

## Hot Keys

| Name             | Windows                    | Mac                       |
| ---------------- | -------------------------- | ------------------------- |
| Create new table | `ctrl` + `shift` + `=`     | `cmd` + `shift` + `=`     |
| Add new column   | `ctrl` + `shift` + `\`     | `cmd` + `shift` + `\`     |
| Add new row      | `ctrl` + `shift` + `enter` | `cmd` + `shift` + `enter` |

## Features

-   Header menu - change various settings for each column
-   Wrap overflow - wraps text overflow instead of cutting it off when its too big for the cell
-   Text cell - accepts any markdown. press `shift` + `enter` to create a new line
-   Number cell - accepts any number, including decimals
-   Currency cell - accepts a number and renders a currency value. Change the currency format in the header options menu
-   Date cell - accepts a date according to the column date format set. Change the date format in the header options menu
-   Tag cell - accepts text with no spaces and renders a single tag
-   Multi-tag cell - accepts text with no spaces and renders multiple tags
-   Checkbox cell - renders a checkbox
-   Creation time cell - renders the creation time of the row. Change the date format in the header options menu
-   Last edited time cell - renders the last edited time of the row. Change the date format in the header options menu
-   Tag color menu - allows you to select a color for each tag
-   Right click to copy - right click a cell to have its contents copied to your clipboard
-   Double click to resize column - hover your mouse near the right border of the header cell. Double click to resize the column to the max size of the content
-   Search filter - filter rows by a search value
-   Sort by column - sort rows by ascending or descending order
-   Toggle column filter - toggle visibility of columns
-   Drag and drop columns - drag a column above another column to have them change positions
-   Drag and drop rows - drag a row to above another row to have them change positions
-   Sticky headers - headers will remain visible as you scroll
-   Function cells - allows you to make calculations based on column data. If the column cell type is set to number or currency, you have arithmetic operations available such as: min, max, range, median, sum, and average
-   Import modal - allows you to create cells from markdown data

## Settings

| Name                                                      | Value         |
| --------------------------------------------------------- | ------------- |
| Create new tables in attachment folder                    | `true/false`  |
| Custom location for new tables                            | `folder path` |
| Create table name based on active file name and timestamp | `true/false`  |

## Known Issues

### Markdown Support

Notion-Like Tables uses the Obsidian function `MarkdownRenderer.renderMarkdown` to render HTML element from markdown.
There are some known issues with this function where embedded elements, such as rendering links, is not working properly. This part of the road map for future releases.

### Undoing Changes

There is currently no support for undoing changes. This is part of the road map for future releases.

## CSS Styling

Please override the following classes for custom theme development.

| Class                | Element  | Usage                  |
| -------------------- | -------- | ---------------------- |
| `.NLT__button`       | `button` |                        |
| `.NLT__table`        | `table`  |                        |
| `.NLT__tr`           | `tr`     |                        |
| `.NLT__th`           | `th`     | Border and text styles |
| `.NLT__th-content`   | `div`    | Padding                |
| `.NLT__td`           | `td`     | Border and text styles |
| `.NLT__td-container` | `div`    | Padding                |

## Issues

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues).

## License

-   GNU GPLv3
