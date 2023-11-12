const addHighlightTool = function () {
  const highLight = {
    plugin: "highlighjs",
    highlightCopy: true,
    highlightLang: true,
    highlightHeightLimit: 360,
  };
  if (!highLight) return;

  const { highlightCopy, highlightLang, highlightHeightLimit, plugin } =
    highLight;
  const isHighlightShrink = GLOBAL_CONFIG_SITE.isHighlightShrink;
  const isShowTool =
    highlightCopy || highlightLang || isHighlightShrink !== undefined;
  const $figureHighlight =
    plugin === "highlighjs"
      ? document.querySelectorAll("figure.highlight")
      : document.querySelectorAll('pre[class*="language-"]');

  if (!((isShowTool || highlightHeightLimit) && $figureHighlight.length))
    return;

  const isPrismjs = plugin === "prismjs";
  const highlightShrinkClass = isHighlightShrink === true ? "closed" : "";
  const highlightShrinkEle =
    isHighlightShrink !== undefined
      ? `<i class="fas fa-angle-down expand ${highlightShrinkClass}"></i>`
      : "";
  const highlightCopyEle = highlightCopy
    ? '<div class="copy-notice"></div><i class="fas fa-paste copy-button"></i>'
    : "";

  const copy = (text, ctx) => {
    if (
      document.queryCommandSupported &&
      document.queryCommandSupported("copy")
    ) {
      document.execCommand("copy");
      if (GLOBAL_CONFIG.Snackbar !== undefined) {
        btf.snackbarShow(GLOBAL_CONFIG.copy.success);
      } else {
        const prevEle = ctx.previousElementSibling;
        prevEle.textContent = GLOBAL_CONFIG.copy.success;
        prevEle.style.opacity = 1;
        setTimeout(() => {
          prevEle.style.opacity = 0;
        }, 700);
      }
    } else {
      if (GLOBAL_CONFIG.Snackbar !== undefined) {
        btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport);
      } else {
        ctx.previousElementSibling.textContent = GLOBAL_CONFIG.copy.noSupport;
      }
    }
  };

  // click events
  const highlightCopyFn = (ele) => {
    const $buttonParent = ele.parentNode;
    $buttonParent.classList.add("copy-true");
    const selection = window.getSelection();
    const range = document.createRange();
    const preCodeSelector = isPrismjs ? "pre code" : "table .code pre";
    range.selectNodeContents(
      $buttonParent.querySelectorAll(`${preCodeSelector}`)[0]
    );
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    copy(text, ele.lastChild);
    selection.removeAllRanges();
    $buttonParent.classList.remove("copy-true");
  };

  const highlightShrinkFn = (ele) => {
    const $nextEle = [...ele.parentNode.children].slice(1);
    ele.firstChild.classList.toggle("closed");
    if (btf.isHidden($nextEle[$nextEle.length - 1])) {
      $nextEle.forEach((e) => {
        e.style.display = "block";
      });
    } else {
      $nextEle.forEach((e) => {
        e.style.display = "none";
      });
    }
  };

  const highlightToolsFn = function (e) {
    const $target = e.target.classList;
    if ($target.contains("expand")) highlightShrinkFn(this);
    else if ($target.contains("copy-button")) highlightCopyFn(this);
  };

  const expandCode = function () {
    this.classList.toggle("expand-done");
  };

  function createEle(lang, item, service) {
    const fragment = document.createDocumentFragment();

    if (isShowTool) {
      const hlTools = document.createElement("div");
      hlTools.className = `highlight-tools ${highlightShrinkClass}`;
      hlTools.innerHTML = highlightShrinkEle + lang + highlightCopyEle;
      hlTools.addEventListener("click", highlightToolsFn);
      fragment.appendChild(hlTools);
    }

    if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
      const ele = document.createElement("div");
      ele.className = "code-expand-btn";
      ele.innerHTML = '<i class="fas fa-angle-double-down"></i>';
      ele.addEventListener("click", expandCode);
      fragment.appendChild(ele);
    }

    if (service === "hl") {
      item.insertBefore(fragment, item.firstChild);
    } else {
      item.parentNode.insertBefore(fragment, item);
    }
  }

  if (isPrismjs) {
    $figureHighlight.forEach((item) => {
      if (highlightLang) {
        const langName = item.getAttribute("data-language") || "Code";
        const highlightLangEle = `<div class="code-lang">${langName}</div>`;
        btf.wrap(item, "figure", { class: "highlight" });
        createEle(highlightLangEle, item);
      } else {
        btf.wrap(item, "figure", { class: "highlight" });
        createEle("", item);
      }
    });
  } else {
    $figureHighlight.forEach(function (item) {
      if (highlightLang) {
        let langName = item.getAttribute("class").split(" ")[1];
        if (langName === "plain" || langName === undefined) langName = "Code";
        const highlightLangEle = `<div class="code-lang">${langName}</div>`;
        createEle(highlightLangEle, item, "hl");
      } else {
        createEle("", item, "hl");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", addHighlightTool);
