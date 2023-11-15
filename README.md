# Hexo Shiki Plugin

<p align="left">
  <a href="https://www.npmjs.com/package/hexo-shiki-plugin"
    ><img
      src="https://img.shields.io/npm/v/hexo-shiki-plugin.svg?style=flat-square&colorB=51C838"
      alt="NPM Version"
  /></a>
  <a
    href="https://github.com/nova1751/hexo-shiki-plugin/actions/workflows/publish.yml"
    ><img
      src="https://img.shields.io/github/actions/workflow/status/nova1751/hexo-shiki-plugin/publish.yml?style=flat-square"
      alt="Build Status"
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

> A code highlight plugin based on shiki,built for hexo.You can go to my [blog](https://refrain.cf) for preview.

## Installation

1. Intall the plugin.
   ```bash
   yarn add hexo-shiki-plugin
   ```
2. Setup config.
   ```yml
   shiki:
     theme: one-dark-pro
   ```

> [!WARNING]
> To avoid conflicts with the native code highlight plugin,please disable the native plugins
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

> this plugin has four themes built in,you can choose one of theme to display.If you choose a theme other than one of the following theme,the plugin will use the `one-dark-pro` codeblock style,and load the specific theme code.
>
> - `one-dark-pro`
> - `material-theme-palenight`
> - `github-light`
> - `github-dark`

There are some other features ported from [hexp-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly.git)。The available settings are below:

> [!NOTE]
> If you want to enable the code block beautify config, please make sure your website has introduced the font-awesome icon set.

```yml
shiki:
  theme: github-light # highlight-theme
  line_number: true # whether to show the line_number
  beautify: false # whether to add highlight tool true or false
  highlight_copy: true # copy button
  highlight_lang: false # show the code language
  highlight_height_limit: 360 # code-block max height,unit: px
  is_highlight_shrink: false # true: shrink the code blocks / false: expand the code blocks | none: expand code blocks and hide the button
  copy: # copy message
    success: "Copy Success"
    error: "Copy Error"
    no_support: "Browser Not Support"
```

> [!NOTE]
> Since shiki support a lot of beautiful themes,you can add your own cutom css files to cusomize your codeblock style,here is a example:

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
