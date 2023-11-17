const addHighlightTool = function () {
  const isHidden = (ele) => ele.offsetHeight === 0 && ele.offsetWidth === 0;
  if (!CODE_CONFIG || !CODE_CONFIG.beautify) return;

  const { highlightCopy, highlightLang, highlightHeightLimit } = CODE_CONFIG;
  const isHighlightShrink = CODE_CONFIG.isHighlightShrink;
  const isShowTool =
    highlightCopy || highlightLang || isHighlightShrink !== undefined;
  const $figureHighlight = document.querySelectorAll("figure.shiki");

  if (!((isShowTool || highlightHeightLimit) && $figureHighlight.length))
    return;

  const highlightShrinkClass = isHighlightShrink === true ? "closed" : "";
  const highlightShrinkEle =
    isHighlightShrink !== undefined
      ? `<i class="fas fa-angle-down expand ${highlightShrinkClass}"></i>`
      : "";
  const highlightCopyEle = highlightCopy
    ? '<div class="copy-notice"></div><i class="fas fa-paste copy-button" title="Copy Code"></i>'
    : "";

  const copy = async (text, ctx) => {
    const showMsg = (msg) => {
      const prevEle = ctx.previousElementSibling;
      prevEle.textContent = msg;
      prevEle.style.opacity = 1;
      setTimeout(() => {
        prevEle.style.opacity = 0;
      }, 700);
    };
    if (
      document.queryCommandSupported &&
      document.queryCommandSupported("copy")
    ) {
      document.execCommand("copy");
      showMsg(CODE_CONFIG.copy.success);
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        showMsg(CODE_CONFIG.copy.success);
      } catch {
        showMsg(CODE_CONFIG.copy.error);
      }
    } else {
      showMsg(CODE_CONFIG.copy.noSupport);
    }
  };

  // click events
  const highlightCopyFn = (ele) => {
    const $buttonParent = ele.parentNode;
    $buttonParent.classList.add("copy-true");
    const selection = window.getSelection();
    const range = document.createRange();
    const preCodeSelector = "div.codeblock .code pre";
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
    if (isHidden($nextEle[$nextEle.length - 1])) {
      $nextEle.forEach((e) => {
        e.style.display = "flex";
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
      hlTools.className = `shiki-tools ${highlightShrinkClass}`;
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

  $figureHighlight.forEach(function (item) {
    if (highlightLang) {
      let langName = item.getAttribute("class").split(" ")[1];
      if (langName === "plain" || langName === undefined)
        langName = "PlainText";
      const highlightLangEle = `<div class="code-lang">${langName}</div>`;
      createEle(highlightLangEle, item, "hl");
    } else {
      createEle("", item, "hl");
    }
  });
};

document.addEventListener("pjax:success", addHighlightTool);
document.addEventListener("DOMContentLoaded", addHighlightTool);
