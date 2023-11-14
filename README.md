# Hexo Shiki Plugin

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
> for `hexo>=7.0.0` versions,please add a additional rule.
>
> ```yml
> syntax_highlighter: none
> ```

## Usage

> this plugin has four themes built in,you can choose one of theme to display.
>
> - `one-dark-pro`
> - `material-theme-palenight`
> - `github-light`
> - `github-dark`

There are some other features ported from [hexp-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly.git)。The settings are below.

```yml
shiki:
  theme: github-light # highlight-theme
  beautify: false # whether to add highlight tool true or false
  highlight_copy: true # copy button
  highlight_lang: false # show the code language
  highlight_height_limit: 0 # code-block max height,unit: px
  is_highlight_shrink: false # true: shrink the code blocks / false: expand the code blocks | none: expand code blocks and hide the button
  copy: # copy message
    success: "Copy Success"
    error: "Copy Error"
    no_support: "Browser Not Support"
```
