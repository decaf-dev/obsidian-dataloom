# Obsidian Notion-Like Tables

[![Active Development](https://img.shields.io/badge/Maintenance%20Level-Actively%20Developed-brightgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)

Obsidian Notion-Like Tables allows you to create markdown tables using an interface similar to that found in Notion.so.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/preview.png)

## Usage

### Making a Table via Command

To quickly make a table you can use the add table command. Press `cmd + p` on your keyboard search "Add table".

Note: you must be in editing mode for this command to appear.

Toggle to reading mode and the table will automatically render.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/add-table-command.png)

### Making a Table Manually

A Notion-Like Table uses normal Obsidian table markdown syntax with 2 additional rows:

-   A table id row
-   A type definition row

#### Table ID Row

The table id row is a normal markdown row with the first column containing a unique string. This string must be unique per table per file. If you use the same id in another file that's fine. The id is used to map a table to its data in the settings. If you change this id, your table will not be able to find its settings and will create new ones. If you omit this id, your table will not be rendered as an NLT table.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/table-id-row.png)

##### Type Definition Row

The type definition row is a normal markdown row with each column defining the type of data you want that column to accept. The plugin currently supports 3 column types: `text`, `number` and `tag`.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/type-definition-row.png)

### Editing Cells

To edit a cell, just click on it. Changes made to the cell will be propagated to the markdown.

#### Tags

Tags have a special notion-like menu that will appear. Tags are scoped to each column of a table. You can type text to filter existing tags and select one. Or you can create a new tag by typing text and clicking "Create New" or pressing enter.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/tag-menu.png)

### Headers

Click on a header name to view the header menu. In the header menu you can rename the header, sort your column values or change the header type.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/header.png)

### Links

If you want to render a link in text, just add square brackets [[My Link]].

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/internal-link-edit.png)

### URLs

If you want to display a url, type the url making sure it begins with `http://` or `https://`. NLT will automatically render it in the table.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/url.png)

### Copy Cell Content

Right click a cell and its content will be added to your clipboard

### Undoing a Type Change

If you accidently change your column to a different type, all data will be erased. It this happens, go to editing mode and use `ctrl+z` or `option-z` on your keyboard to undo the change.

### Errors

#### Not Rendering

If your table is missing a table id row or type definition row then it will not be rendered as a Notion-Like Table. Likewise, if you use an invalid column type other than the accepted types `text`, `number`, or `tag`. The table will not be rendered.

#### Cell Type Errors

A cell type error will occur if you enter data which doesn't match the column data type. Please correct this error in your markdown to continue.

![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/cell-error-1.png)
![Screenshot](https://raw.githubusercontent.com/trey-wallis/obsidian-notion-like-tables/master/.readme/cell-error-2.png)

## Custom Themes

NLT tables uses normal table semantic elements (`table`, `th`, `tr`, `td`, etc) to render. If you wish to edit the display of the table, just style those elements in your CSS.

## Roadmap

-   0.1.0
    -   MVP (basic NLT table)
-   0.2.0
    -   Semantic table tags for theming (table, tr, td, etc)
-   0.3.0
    -   Notion-Like sort menu (default, ascending, descending)
-   1.0.0
    -   Settings cache system to persist app data
    -   Sorting updates source markdown
-   1.1.0
    -   Support for http/https links
-   1.2.0
    -   UI updates
    -   Insert row above or below an existing row
-   2.0.0
    -   Table id row support & upgrading caching system
-   2.1.0
    -   Insert new column to the left or right of an existing column
    -   Move column to the left or right
    -   Move row up or down
    -   Right click to copy cell contents
-   2.2.0
    -   Navigate cells with arrow key and tab key
    -   Create new row with keyboard
-   2.3.0
    -   TBA

## Build With

-   [ReactJS](https://reactjs.org/)
-   [TypeScript](https://github.com/microsoft/TypeScript)
-   [Obsidian API](https://github.com/obsidianmd/obsidian-api)

## Development

The app can be development in either Obsidian or in your browser using `react-scripts`.

### Development in Obsidian

Install packages

-   `npm install`

Run development script

-   `npm run dev`

Go to community plugins in Obsidian and disable safe mode.

Create a plugins folder if one doesn't already exist

-   `mkdir /Desktop/my-vault/.obsidian/plugins`

Make a symbolic link between where you cloned the repo and your vault plugins folder

-   `ln -s ./obsidian-collaboration/plugin /Desktop/my-vault/.obsidian/plugins/`

### Development using React Scripts

Install packages

-   `npm install`

Run development server

-   `npm run start`

## Bugs/Feature Requests

If you find a bug or would like to suggest a feature, please open an issue [here](https://github.com/trey-wallis/obsidian-notion-like-tables/issues). I will try to respond as soon as possible.

## Donate

-   If you find this plugin helpful, please consider [buying me an herbal tea](https://www.buymeacoffee.com/treywallis) ;)

## License

-   GNU GPLv3

## Author

-   Trey Wallis
