# Obsidian Notion-Like Tables

## About

Obsidian Notion-Like Tables allows you to create markdown tables using an interface similar to that found in Notion.so.

## Built With

-   [Obsidian.md Plugin Template](https://github.com/obsidianmd/obsidian-sample-plugin)

## Development

### Installation

Install packages

-   `npm install`

Run development script

-   `npm run dev`

Go to community plugins in Obsidian and disable safe mode.

Create a plugins folder if one doesn't already exist

-   `mkdir /Desktop/my-vault/.obsidian/plugins`

Make a symbolic link between where you cloned the repo and your vault plugins folder

-   `ln -s ./obsidian-collaboration/plugin /Desktop/my-vault/.obsidian/plugins/`

Clone the hot reload plugin into your plugins folder

-   `cd /Desktop/my-vault/.obsidian/plugins && git clone https://github.com/pjeby/hot-reload.git`

Now enable the hot reload plugin in Obsidian

### Plugin

Create build script

-   `npm run build`

## Resources

-   [Obsidian API Documentation](https://github.com/obsidianmd/obsidian-api)
-   [Hot Reload Plugin](https://github.com/pjeby/hot-reload)

## License

-   MIT

## Author

-   Trey Wallis
