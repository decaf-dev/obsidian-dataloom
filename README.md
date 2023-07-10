![](/docusaurus/static/img/cover.png)

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22notion-like-tables%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

Find detailed documentation at [dataloom.xyz](https://dataloom.xyz)

Dashboards is an [Obsidian.md](https://obsidian.md/) plugin for desktop and mobile. A dashboard is a higher-level view that allows you to tag, sort, and display feeds from your notes. Dashboards is inspired by [Notion.so](https://www.notion.so/).

Support development

<a href="https://buymeacoffee.com/treywallis" target="_blank" rel="noopener">
<img width="180px" src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&amp;emoji=&amp;slug=treywallis&amp;button_colour=6a8695&amp;font_colour=ffffff&amp;font_family=Poppins&amp;outline_colour=000000&amp;coffee_colour=FFDD00" referrerpolicy="no-referrer" alt="?text=Buy me a coffee&amp;emoji=&amp;slug=treywallis&amp;button_colour=6a8695&amp;font_colour=ffffff&amp;font_family=Poppins&amp;outline_colour=000000&amp;coffee_colour=FFDD00"></a>

## About

-   [Screenshots](#screenshots)
-   [Installation](#installation)
-   [Getting started](#getting-started)
-   [Issues](#issues)
-   [Contributing](#contributing)
-   [Network Usage](#network-usage)
-   [License](#license)
-   [Disclaimer](#disclaimer)

## Screenshots

Dashboards support both light and dark modes and a majority of Obsidian themes.

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

## Installation

### Installing the plugin

1. In Obsidian, open **Settings**
2. Go to **Community plugins**
3. Select **Browse**
4. Search for **Dashboards** by **Trey Wallis**
5. Select **Install**
6. Then select **Enable**

### Linking dashboard files

By default, Obsidian doesn't display `.dashboard` files in the modal that opens when you type double brackets `[[`. In order to allow this, you must enable detection of all file extensions.

1. In Obsidian, open **Settings**
2. Select **File & Links**
3. Toggle **Detect all file extensions**

![](/docusaurus/static/img/detect-all-extensions.png)

## Getting started

Start by creating a new dashboard. You can do this by clicking on the dashboard icon on the sidebar.

<img src="./docusaurus/static/img/new-dashboard-sidebar.png"  width="350">

You can also right click on a folder and click **New dashboard**

<img src="./docusaurus/static/img/new-dashboard-folder.png" width="450">

## Roadmap

See our [project roadmap](https://github.com/users/trey-wallis/projects/2) for details on:

-   What is currently in progress
-   What will be worked on next
-   What is waiting to be released

## Issues

Please see [issues](https://github.com/trey-wallis/obsidian-dataloom/issues) for feature requests and bug reports.

If you are experiencing a problem with the plugin, please search the issues for any open bug reports related to your problem before opening a new issue.

## Contributing

Dashboards is a community plugin. Contributions are welcome.

Please see our [contribution guide](https://github.com/trey-wallis/obsidian-dataloom/blob/master/CONTRIBUTING.md) for details on how to contribute

## Network Usage

According to Obsidian developer policies, an Obsidian plugin must explain which network services are used and why.

Dashboards will make one `GET` request to `https://api.github.com/repos/trey-wallis/obsidian-dataloom/releases/latest` to pull the lastest release for the What's New Modal. Besides this, Dashboards does not making any network requests. Dashboards does not include client-side telemetry.

## License

Dashboards is distributed under the [GNU General Public License v3.0](https://github.com/trey-wallis/obsidian-dataloom/blob/master/LICENSE)

## Disclaimer

This plugin extends the functionality of Obsidian.md. Although tested during development, there may still be bugs in the software. I **strongly** recommend you to make frequent backup copies of your vault. I am not responsible for any data that is lost due to usage of this plugin.
