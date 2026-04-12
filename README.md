# Hexo Shiki Plugin

<p align="left">
  <a href="https://www.npmjs.com/package/hexo-shiki-plugin"
    ><img
      src="https://img.shields.io/npm/v/hexo-shiki-plugin.svg?style=flat-square&colorB=51C838"
      alt="NPM Version"
  /></a>
  <a
    href="https://github.com/nova1751/hexo-shiki-plugin/actions/workflows/ci.yml"
    ><img
      src="https://img.shields.io/github/actions/workflow/status/nova1751/hexo-shiki-plugin/ci.yml?style=flat-square"
      alt="CI Status"
  /></a>
  <a
    href="https://github.com/hexojs/hexo/releases"
    ><img
      src="https://img.shields.io/badge/hexo-5.3.0+-0e83c"
      alt="Hexo Version"
  /></a>
  <a href="https://github.com/nova1751/hexo-shiki-plugin/blob/main/LICENSE"
    ><img
      src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"
      alt="License"
  /></a>
</p>

> A code highlight plugin based on shiki,built for hexo.You can go to my [blog](https://blog.refrain.site) for preview.

## Development

This repository now follows a standard Vite-based TypeScript library layout:

- `src/`: plugin source, browser runtime, theme definitions and shared helpers
- `tests/`: Vitest unit tests
- `vite.config.ts`: Vite library mode build for both the Hexo entry and browser assets
- `vitest.config.ts`: Vitest configuration

### Scripts

```bash
pnpm install
pnpm typecheck
pnpm test:run
pnpm build
```

## Installation

1. Intall the plugin.
   ```bash
   pnpm add hexo-shiki-plugin
   ```
2. Setup config.
   ```yml
   shiki:
     theme: one-dark-pro
   ```

> [!WARNING]
> To avoid conflicts with the native code highlight plugin,please disable the native plugins.
>
> ```yml
> highlight:
>   enable: false
> prismjs:
>   enable: false
> ```
>
> for `hexo>=7.0.0` versions,please add a additional line,leave `syntax_highlighter` to empty,just like below.
>
> ```yml
> syntax_highlighter:
> ```

## Usage

> this plugin has four themes built in,you can choose one of theme to display:
>
> - `one-dark-pro`
> - `material-theme-palenight`
> - `github-light`
> - `github-dark`

If you choose a theme other than one of the built-in themes,the plugin will use the `one-dark-pro` codeblock style,and load the specific theme code.You can load more code highlight themes in [Themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md).

There are some other features ported from [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly.git).The available settings are below:

> [!NOTE]
> If you want to enable the code block beautify config, please make sure your website has introduced the font-awesome icon set.

```yml
shiki:
  theme: github-light # highlight-theme
  line_number: true # whether to show the line_number
  beautify: false # whether to add highlight tool true or false
  colorized_brackets: true # colorize nested brackets via @shikijs/colorized-brackets
  highlight_copy: true # copy button
  highlight_lang: false # show the code language
  highlight_height_limit: 360 # code-block max height,unit: px
  is_highlight_shrink: false # true: shrink the code blocks / false: expand the code blocks | none: expand code blocks and hide the button
  copy: # copy message
    success: 'Copy Success'
    error: 'Copy Error'
    no_support: 'Browser Not Support'
```

If you need custom bracket settings, `colorized_brackets` also accepts the transformer options object directly:

```yml
shiki:
  theme: dark-plus
  colorized_brackets:
    explicitTrigger: false
```

> [!NOTE]
> Since shiki support a lot of beautiful themes,you can add your own cutom css files to cusomize your codeblock style,here is an example:

```css
:root {
  --hl-color: #e1e4e8;
  --hl-bg: #24292e;
  --hltools-bg: #1f2428;
  --hltools-color: #c5c5c5;
  --hlnumber-bg: #24292e;
  --hlnumber-color: #444d56;
  --hlscrollbar-bg: #32383e;
  --hlexpand-bg: linear-gradient(
    180deg,
    rgba(36, 41, 46, 0.6),
    rgba(36, 41, 46, 0.9)
  );
}
```

## Build Output

The published package keeps the legacy runtime asset paths while building everything through Vite:

- `dist/index.js`
- `dist/index.cjs`
- `dist/index.d.ts`
- `dist/lib/codeblock.js`
- `dist/lib/codeblock.css`
