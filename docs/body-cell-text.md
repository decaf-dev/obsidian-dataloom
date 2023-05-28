# Text cell

## Description

This cell renders text.

## Usage

It uses the `MarkdownRenderer.renderMarkdown` function from Obsidian to render. This means that any markdown syntax that Obsidian can render is also renderable by this cell.

```markdown
**Bold**

_Italics_

===Highlight===

<img src="https://placehold.co/300x200">

😃
```

### Links to Notes

Currently there is no popup to automatically select a note when you type `[[`. However, you may still make a direct link to a note using the normal Obsidian syntax

```markdown
[[My note]]
```

```markdown
[[My note|My note with alias]]
```

### Insert a new line

While the edit menu is open, press `shift` + `enter` to insert a new line
