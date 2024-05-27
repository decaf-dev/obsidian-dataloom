![](/docusaurus/static/img/cover.png)

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22notion-like-tables%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

Find detailed documentation at [dataloom.xyz](https://dataloom.xyz)

DataLoom is an [Obsidian.md](https://obsidian.md/) plugin for desktop and mobile. It allows you to create databases similar to [Notion.so](https://notion.so).

With DataLoom, you can weave together data from diverse sources and display them in different views. Use this plugin if you want a straightforward way to create and manage databases and enhance the organization of your Obsidian vault.

Join the [Discord](https://discord.gg/QaFbepMdN4) community

## About

-   [Screenshots](#screenshots)
-   [Features](#features)
-   [Issues](#issues)
-   [Contributing](#contributing)
-   [Network Usage](#network-usage)
-   [License](#license)
-   [Disclaimer](#disclaimer)

## Screenshots

![](/readme/app.png)

## Features

-   View types

    -   [x] Table

-   Cell types

    -   [x] Text
    -   [x] Number
        -   [x] Currency
    -   [x] Checkbox
    -   [x] Embed
    -   [x] File
    -   [x] Date
    -   [x] Tag
    -   [x] Multi-tag
    -   [x] Last edited time
    -   [x] Creation time
    -   [x] Source
    -   [x] Source file

-   Columns

    -   [x] Toggle visibility
    -   [x] Change name
    -   [x] Change type
    -   [x] Sort ascending or descending
    -   [x] Reorder columns
    -   [ ] Insert left
    -   [ ] Insert right

-   Rows

    -   [x] Filter by conditions
    -   [x] Search by text
    -   [x] Insert above
    -   [x] Insert below
    -   [x] Reorder rows

-   Import

    -   [x] CSV
    -   [x] Markdown

-   Export

    -   [x] CSV
    -   [x] Markdown
    -   [ ] PDF

-   Color scheme

    -   [x] Light
    -   [x] Dark

-   Sources

    -   [x] Folder
    -   [x] Frontmatter

-   [x] Undo/redo

-   [x] Embed loom files into an Obsidian note

-   [x] Mobile support

## Roadmap

See our [project roadmap](https://github.com/users/trey-wallis/projects/2) for details on

-   What is currently in progress
-   What will be worked on next
-   What is waiting to be released

## Issues

Please see [issues](https://github.com/trey-wallis/obsidian-dataloom/issues) for feature requests and bug reports.

If you are experiencing a problem with the plugin, please search the issues for any open bug reports related to your problem before opening a new issue.

## Contributing

Please see our [contribution guide](https://github.com/trey-wallis/obsidian-dataloom/blob/master/CONTRIBUTING.md) for details on how to contribute

## Network Usage

According to [Obsidian developer policies](https://docs.obsidian.md/Developer+policies), an Obsidian plugin must explain which network services are used and why.

DataLoom will make one `GET` request to `https://api.github.com/repos/trey-wallis/obsidian-dataloom/releases/latest` to pull the latest release for the What's New Modal. Besides this, DataLoom does not make any network requests. DataLoom does not include client-side telemetry.

## License

DataLoom is distributed under the [MIT License](https://github.com/trey-wallis/obsidian-dataloom/blob/master/LICENSE)

## Disclaimer

This plugin extends the functionality of Obsidian.md. Although tested during development, there may still be bugs in the software. I **strongly** recommend you to make frequent backup copies of your vault. I am not responsible for any data that is lost due to the usage of this plugin.
