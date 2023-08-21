![](/docusaurus/static/img/cover.png)

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22notion-like-tables%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

Find detailed documentation at [dataloom.xyz](https://dataloom.xyz)

DataLoom is an [Obsidian.md](https://obsidian.md/) plugin for desktop and mobile. DataLoom allows you to weave together data from diverse sources into a cohesive table view.

Support development

<a href="https://www.buymeacoffee.com/treywallis" target="_blank" rel="noopener"><img width="180" src="https://img.buymeacoffee.com/button-api/?text=Buy me a herbal tea&emoji=%F0%9F%8D%B5&slug=treywallis&button_colour=9478F0&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00" /></a>

## About

-   [Screenshots](#screenshots)
-   [FAQ](#faq)
-   [Installation](#installation)
-   [Getting started](#getting-started)
-   [Issues](#issues)
-   [Contributing](#contributing)
-   [Network Usage](#network-usage)
-   [License](#license)
-   [Disclaimer](#disclaimer)

## Screenshots

DataLoom supports both light and dark modes and a majority of Obsidian themes.

![](/docusaurus/static/img/light-mode.png)
![](/docusaurus/static/img/dark-mode.png)

Choose from 11 different cell types

<img src="./docusaurus/static/img/type-menu.png" width="200">

Notion-like tag menu system

![](/docusaurus/static/img/tag-menu.png)

Toggle visibility of different columns

<img src="./docusaurus/static/img/toggle-menu.png" width="200">

Reference notes directly from the table

![](/docusaurus/static/img/file-menu.png)

Advanced filtering menu

![](/docusaurus/static/img/filter-menu.png)

## FAQ

### What is the purpose of this plugin?

DataLoom offers an interactive WSIWYG user interface for managing tabular data. It allows you to quickly create a table, edit data, and filter data based on specific criteria.

### Why is this plugin called DataLoom?

I wanted a name that would convey the functionality of rendering data from different sources.

Development planned for this plugin includes rendering data from both Obsidian sources such as folders or tags, and external sources such as the YouTube or Instagram API.

### What is the difference between DataLoom and Projects?

[Projects](https://github.com/marcusolsson/obsidian-projects) allows you to create projects from folders and Dataview queries. It offers a table, board, calendar, and gallery view for your data.

While Projects focuses on offering views for managing projects, DataLoom focuses on integrating different data sources.

Projects populates table rows based on existing markdown notes. DataLoom populates table rows based on the data that is entered by the user. All data for a table is stored within a `.loom` file. No markdown notes are required to get started with DataLoom.

### What is the difference between DataLoom and DB Folder?

[DB Folder](https://github.com/RafaelGB/obsidian-db-folder) allows you to create a Notion like database based on folders, links, tags, or dataview queries.

DB Folder is very similar to what DataLoom intends to accomplish.

One major different between DB Folder and DataLoom is that DataLoom does require a folder. You may create a loom file and enter text data to get started.

Another difference is that DataLoom does not depend on [Dataview](https://github.com/blacksmithgu/obsidian-dataview). It can be installed as a standalone plugin.

DataLoom also employs its own menu system rendered in React. This allows for more complicated UIs.

### What is the different between DataLoom and Make.MD?

[Make.MD](https://github.com/Make-md/makemd) contains rich features that enhance the native Obsidian UI to be more like Notion.so. While helpful for some users, not every user will want all of these features.

DataLoom intends to be a more simple application. It does not change the native UI of Obsidian. It is a simple React app that run in its own view. DataLoom also stores data in JSON format in its own `.loom` file.

### Why should I use this plugin?

You should use this plugin if you wish to sort and filter tabular data. I personally use the plugin as an alternative to making markdown lists. It allows me to add tags to my items and sort my ideas.

I recommend you try out the plugin and see if it can help you in organizing your second brain.

## Installation

### Installing the plugin

1. In Obsidian, open **Settings**
2. Go to **Community plugins**
3. Select **Browse**
4. Search for **DataLoom** by **Trey Wallis**
5. Select **Install**
6. Then select **Enable**

### Linking loom files

By default, Obsidian doesn't display `.loom` files in the modal that opens when you type double brackets `[[`. In order to allow this, you must enable detection of all file extensions.

1. In Obsidian, open **Settings**
2. Select **File & Links**
3. Toggle **Detect all file extensions**

![](/docusaurus/static/img/detect-all-extensions.png)

## Getting started

Start by creating a new loom. You can do this by clicking on the table icon on the sidebar.

<img src="./docusaurus/static/img/new-loom-sidebar.png"  width="350">

You can also right click on a folder and click **New loom**

<img src="./docusaurus/static/img/new-loom-folder.png" width="450">

## Roadmap

See our [project roadmap](https://github.com/users/trey-wallis/projects/2) for details on:

-   What is currently in progress
-   What will be worked on next
-   What is waiting to be released

## Issues

Please see [issues](https://github.com/trey-wallis/obsidian-dataloom/issues) for feature requests and bug reports.

If you are experiencing a problem with the plugin, please search the issues for any open bug reports related to your problem before opening a new issue.

## Contributing

DataLoom is a community plugin. Contributions are welcome.

Please see our [contribution guide](https://github.com/trey-wallis/obsidian-dataloom/blob/master/CONTRIBUTING.md) for details on how to contribute

## Network Usage

According to [Obsidian developer policies](https://docs.obsidian.md/Developer+policies), an Obsidian plugin must explain which network services are used and why.

DataLoom will make one `GET` request to `https://api.github.com/repos/trey-wallis/obsidian-dataloom/releases/latest` to pull the lastest release for the What's New Modal. Besides this, DataLoom does not making any network requests. DataLoom does not include client-side telemetry.

## License

DataLoom is distributed under the [GNU General Public License v3.0](https://github.com/trey-wallis/obsidian-dataloom/blob/master/LICENSE)

## Disclaimer

This plugin extends the functionality of Obsidian.md. Although tested during development, there may still be bugs in the software. I **strongly** recommend you to make frequent backup copies of your vault. I am not responsible for any data that is lost due to usage of this plugin.
