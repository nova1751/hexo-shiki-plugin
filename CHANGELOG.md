# Changelog

## [1.0.31] - 2026-6-29

### Bug Fixes

- Move the copy notice away from the copy toolbar icon and vertically center it to avoid overlap.

## [1.0.30] - 2026-6-29

### Bug Fixes

- Add scoped Font Awesome 7 fallbacks for generated code block toolbar icons.
- Stabilize code block toolbar icon layout by centering fixed-size icon boxes and rotating only icon pseudo-elements.

## [1.0.29] - 2026-6-26

### New Features

- Add `skip_languages` to bypass shiki highlighting for configured fenced code languages.
- Convert skipped Mermaid fences into Butterfly-compatible `.mermaid-wrap` blocks.

### Bug Fixes

- Inject runtime scripts before the real `</body>` tag without matching `</body>` strings inside scripts.

## [1.0.28] - 2026-4-12

- Refractored to standard ts project.
- Update shiki to latest version to support more features.
- Support VSCode-style colorized brackets by using `@shikijs/colorized-brackets` plugin.

## [1.0.27] - 2024-6-15

### Style Update

- Ajust the text style. @noraj

## [1.0.26] - 2024-6-15

### Style Update

- Ajust the font style.

## [1.0.25] - 2024-1-25

### Bug Fixes

- Add cutom CDN url.

## [1.0.24] - 2023-12-14

### Bug Fixes

- Ajust the code font to adapt to the PC without consolas font.

## [1.0.23] - 2023-11-30

### Bug Fixes

- Remove the tabindex attribute in codeblock.
- Change dependency shiki to shiki-nova1751 to ajust the `vue` code highlight.

## [1.0.23] - 2023-11-30

### Bug Fixes

- Remove the tabindex attribute in codeblock.
- Change dependency shiki to shiki-nova1751 to ajust the `vue` code highlight.

## [1.0.22] - 2023-11-18

### Bug Fixes

- Ajust the github-light theme style.

## [1.0.21] - 2023-11-18

### Bug Fixes

- Fix the code block display problem in the blockquote.

## [1.0.20] - 2023-11-17

### New Features

- For the languages not supported by shiki,`hexo-shiki-plugin` will display it as plain text and print the `error` message in the console.
- Add `Clipboard` API to the copy function for better compatibility.

## [1.0.19] - 2023-11-16

### Chore

- Remove the box-shadow style to adapt the dark-mode

## [1.0.18] - 2023-11-15

### New Features

- Add line_number option to show or hide line_number.
- Add the code highlight theme,for themes not built in,load the theme code in the `one-dark-pro` codeblock style.

### Bug Fixes

- Change the table style to flex to avoid table wrap problems.
- Use `em` unit to unify the code font size.

## [1.0.17] - 2023-11-14

### Chore

- Simplify the code

## [1.0.16] - 2023-11-14

### Bug fixes

- Remove the css class conflicts with theme butterfly
- fix some style conflicts
- update github workflow
