# Obsidian Notion-Like Tables

## About

Obsidian Notion-Like Tables allows you to create markdown tables using an interface similar to that found in Notion.so.

![Screenshot](.readme/preview.png)

## Roadmap

-   0.1.0
    -   MVP
-   0.2.0
    -   Semantic table tags
-   0.3.0
    -   UI and accessibility updates
-   0.4.0
    -   Multi-tagging
-   0.5.0
    -   Editable table width
-   0.6.0
    -   Draggable columns
    -   Draggable rows

## Usage

### Making a Table

Make a table using normal markdown syntax. Under the hyphen row, specify the types of each column.

The plugin currently supports 3 cell types: `text`, `number`, and `tag`.

![Screenshot](.readme/markdown.png)

Toggle to preview mode and the table will automatically render.

### Editing Cells

To edit a cell, just click on it. Changes made to the cell will be propagated to the markdown.

### Headers

Click on a header name to edit the header title and change the column type.

![Screenshot](.readme/header.png)

### Links

If you want to render a link in text, just add square brackets [[My Link]].

![Screenshot](.readme/text-link-1.png)
![Screenshot](.readme/text-link-2.png)

### Errors
A cell type error will occur if you enter data which doesn't match the column data type. Please correct this error in your markdown to continue.

![Screenshot](.readme/cell-error-1.png)
![Screenshot](.readme/cell-error-2.png)

### Live Preview

April 9, 2022:
Tables display with live preview is still being developed in Obsidian. If you're using live preview, please always use the table in "Reading" mode not "Editing" mode.

### Theming
NLT tables uses normal table semantic elements (table, th, tr, td, etc) to render. If you wish to edit the style of the table, just style those elements in your css.

## Built With

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

## Reporting Bugs

If you find a bug, please open an issue. I will try to respond as soon as possible.

## Resources

-   [Obsidian API Documentation](https://github.com/obsidianmd/obsidian-api)
-   [Obsidian Plugin Docs](https://marcus.se.net/obsidian-plugin-docs)

## License

-   GNU GPLv3

## Author

-   Trey Wallis

## Donate

-   If you find this plugin helpful, please consider [buying me an herbal tea](https://www.buymeacoffee.com/treywallis) ;)
