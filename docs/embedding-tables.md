# Embedding tables

## Basic usage

A table may be embedded into a note by using the [embedded file syntax](https://help.obsidian.md/Linking+notes+and+files/Embedding+files).

Embedded table example

```markdown
![[my-table.table]]
```

An embedded table will preform the same functions as a normal table, the only limitation being a smaller window.

Changes that are made to an embedded table will be saved to the table file. Changes made to an embedded table will also update any open tabs that contain a Notion-Like table.

## Setting a width or height

An embedded table has a default width of `100%` and a default height of `340px`. A height of `340px` will render exactly 4 body rows.

If you would like to modify the width or height of a table, you can use the [embedded image syntax](https://help.obsidian.md/Linking+notes+and+files/Embedding+files#Embed+an+image+in+a+note).

> Note: setting a value of `1` will use the default value.

### Examples

An embedded table with a width of `300px` and height of `300px`

```markdown
![[Untitled.table|300x300]]
```

An embedded table with a default with and height of `300px`

```markdown
![[Untitled.table|1x300]]
```

An embedded table with a width of `300px` and a default height

```markdown
![[Untitled.table|300x1]]
```

## Bugs

There is currently a [bug](https://github.com/trey-wallis/obsidian-notion-like-tables/issues/523) where if you rename a table, any embedded references in open tabs will render a gray rectangle. The temporary solution is to close the markdown files that contain the embedded table and reopen them.

## Future development

Currently there is no support for `preview` mode. This is part of the roadmap for future development.
