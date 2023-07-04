# Embedding dashboards

## Basic usage

> Please make sure that you have enabled [detection of all extensions](quickstart.md?id=linking-dashboard-files)

A dashboard may be embedded into a note by using the [embedded file syntax](https://help.obsidian.md/Linking+notes+and+files/Embedding+files).

Example dashboard

```markdown
![[my-dashboard.dashboard]]
```

An embedded dashboard will preform the same functions as a normal dashboard, the only limitation being a smaller window.

Changes that are made to an embedded dashboard will be saved to the dashboard file. Changes made to an embedded dashboard will also update any open tabs that contain a dashboard.

## Setting a width and height

An embedded dashboard has a default width of `100%` and a default height of `340px`. A height of `340px` will render exactly 4 body rows.

If you would like to modify the width or height of a dashboard, you can use the [embedded image syntax](https://help.obsidian.md/Linking+notes+and+files/Embedding+files#Embed+an+image+in+a+note).

> Note: setting a value of `1` will use the default value.

### Examples

An embedded dashboard with a width of `300px` and height of `300px`

```markdown
![[Untitled.dashboard|300x300]]
```

An embedded dashboard with a default with and height of `300px`

```markdown
![[Untitled.dashboard|1x300]]
```

An embedded dashboard with a width of `300px` and a default height

```markdown
![[Untitled.dashboard|300x1]]
```

## Bugs

There is currently a [bug](https://github.com/trey-wallis/obsidian-dashboards/issues/523) where if you rename a dashboard, any embedded references in open tabs will render a gray rectangle. The temporary solution is to close the markdown files that contain the embedded dashboard and reopen them.

## Future development

Currently there is no support for reading mode. This is part of the roadmap for future development.
