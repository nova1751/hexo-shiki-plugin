const themes = new Map();
themes.set(
  "one-dark-pro",
  `<style>:root{--hl-color:#abb2bf;--hl-bg:#282c34;--hltools-bg:#21252b;--hltools-color:#bbbbbc;--hlnumber-bg:#282c34;--hlnumber-color:#495162;--hlscrollbar-bg:#373c47;--hlexpand-bg:linear-gradient(180deg,rgba(40,44,52,0.1),rgba(40,44,52,0.9))}</style>`
);
themes.set(
  "material-theme-palenight",
  `<style>:root{--hl-color:#babed8;--hl-bg:#292d3e;--hltools-bg:#292d3e;--hltools-color:#676e95;--hlnumber-bg:#292d3e;--hlnumber-color:#3a3f58;--hlscrollbar-bg:#393d51;--hlexpand-bg:linear-gradient(180deg,rgba(41,45,62,0.1),rgba(41,45,62,0.9))}</style>`
);
themes.set(
  "github-light",
  `<style>:root{--hl-color:#90a4ae;--hl-bg:#f6f8fa;--hltools-bg:#e6ebf1;--hltools-color:#90a4ae;--hlnumber-bg:#f6f8fa;--hlnumber-color:rgba(144,164,174,0.5);--hlscrollbar-bg:#dce4eb;--hlexpand-bg:linear-gradient(180deg,rgba(246,248,250,0.1),rgba(246,248,250,0.9))}</style>`
);
themes.set(
  "github-dark",
  `<style>:root{--hl-color:#e1e4e8;--hl-bg:#24292e;--hltools-bg:#1f2428;--hltools-color:#c5c5c5;--hlnumber-bg:#24292e;--hlnumber-color:#444d56;--hlscrollbar-bg:#32383e;--hlexpand-bg:linear-gradient(180deg,rgba(36,41,46,0.1),rgba(36,41,46,0.9))}</style>`
);
module.exports = themes;
