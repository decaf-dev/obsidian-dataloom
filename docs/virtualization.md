# Virtualization

## Description

The rendering of rows in the table is virtualized, meaning that they are only rendered when you scroll to them. This allows the table to render thousands of rows with minimal lag.

The plugin uses [react-virtuoso](https://github.com/petyosi/react-virtuoso) for virtualization.

## Future development

-   There is a known issue where if you have many columns, that the table will lag.

-   When you scroll, it is normal to see some flashing. That is because the elements are being rendered to the screen
