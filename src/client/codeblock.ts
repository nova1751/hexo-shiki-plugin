import "../styles/codeblock.css";

declare global {
  interface Window {
    CODE_CONFIG?: {
      beautify?: boolean;
      highlightCopy?: boolean;
      highlightLang?: boolean;
      highlightHeightLimit?: number;
      isHighlightShrink?: boolean;
      copy: {
        success: string;
        error: string;
        noSupport: string;
      };
    };
  }
}

function addHighlightTool(): void {
  const runtimeConfig = window.CODE_CONFIG;

  if (!runtimeConfig?.beautify) {
    return;
  }

  const isHidden = (element: HTMLElement): boolean =>
    element.offsetHeight === 0 && element.offsetWidth === 0;
  const { highlightCopy, highlightLang, highlightHeightLimit } = runtimeConfig;
  const isHighlightShrink = runtimeConfig.isHighlightShrink;
  const isShowTool =
    highlightCopy || highlightLang || isHighlightShrink !== undefined;
  const highlightedFigures =
    document.querySelectorAll<HTMLElement>("figure.shiki");

  if (!((isShowTool || highlightHeightLimit) && highlightedFigures.length)) {
    return;
  }

  const highlightShrinkClass = isHighlightShrink === true ? "closed" : "";
  const highlightShrinkElement =
    isHighlightShrink !== undefined
      ? `<i class="fas fa-angle-down expand ${highlightShrinkClass}"></i>`
      : "";
  const highlightCopyElement = highlightCopy
    ? '<div class="copy-notice"></div><i class="fas fa-paste copy-button" title="Copy Code"></i>'
    : "";

  const copy = async (text: string, context: HTMLElement): Promise<void> => {
    const showMessage = (message: string): void => {
      const previousElement =
        context.previousElementSibling as HTMLElement | null;

      if (!previousElement) {
        return;
      }

      previousElement.textContent = message;
      previousElement.style.opacity = "1";
      window.setTimeout(() => {
        previousElement.style.opacity = "0";
      }, 700);
    };

    if (
      document.queryCommandSupported &&
      document.queryCommandSupported("copy")
    ) {
      document.execCommand("copy");
      showMessage(runtimeConfig.copy.success);
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        showMessage(runtimeConfig.copy.success);
      } catch {
        showMessage(runtimeConfig.copy.error);
      }
      return;
    }

    showMessage(runtimeConfig.copy.noSupport);
  };

  const highlightCopyHandler = (element: HTMLElement): void => {
    const buttonParent = element.parentNode as HTMLElement | null;

    if (!buttonParent) {
      return;
    }

    buttonParent.classList.add("copy-true");
    const selection = window.getSelection();
    const range = document.createRange();
    const codeElement = buttonParent.querySelector("div.codeblock .code pre");

    if (!selection || !codeElement) {
      buttonParent.classList.remove("copy-true");
      return;
    }

    range.selectNodeContents(codeElement);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    const lastChild = element.lastElementChild as HTMLElement | null;

    if (lastChild) {
      void copy(text, lastChild);
    }

    selection.removeAllRanges();
    buttonParent.classList.remove("copy-true");
  };

  const highlightShrinkHandler = (element: HTMLElement): void => {
    const parent = element.parentNode as HTMLElement | null;

    if (!parent) {
      return;
    }

    const nextElements = Array.from(parent.children).slice(1) as HTMLElement[];
    element.firstElementChild?.classList.toggle("closed");

    if (nextElements.length === 0) {
      return;
    }

    const shouldExpand = isHidden(nextElements[nextElements.length - 1]);

    nextElements.forEach((nextElement) => {
      nextElement.style.display = shouldExpand ? "flex" : "none";
    });
  };

  const highlightToolsHandler = function (
    this: HTMLElement,
    event: Event,
  ): void {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    if (target.classList.contains("expand")) {
      highlightShrinkHandler(this);
      return;
    }

    if (target.classList.contains("copy-button")) {
      highlightCopyHandler(this);
    }
  };

  const expandCode = function (this: HTMLElement): void {
    this.classList.toggle("expand-done");
  };

  function createElements(languageMarkup: string, item: HTMLElement): void {
    const fragment = document.createDocumentFragment();

    if (isShowTool) {
      const highlightTools = document.createElement("div");
      highlightTools.className = `shiki-tools ${highlightShrinkClass}`;
      highlightTools.innerHTML =
        highlightShrinkElement + languageMarkup + highlightCopyElement;
      highlightTools.addEventListener("click", highlightToolsHandler);
      fragment.appendChild(highlightTools);
    }

    if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
      const expandButton = document.createElement("div");
      expandButton.className = "code-expand-btn";
      expandButton.innerHTML = '<i class="fas fa-angle-double-down"></i>';
      expandButton.addEventListener("click", expandCode);
      fragment.appendChild(expandButton);
    }

    item.insertBefore(fragment, item.firstChild);
  }

  highlightedFigures.forEach((item) => {
    if (highlightLang) {
      let languageName = item.className.split(" ")[1];

      if (languageName === "plain" || languageName === undefined) {
        languageName = "PlainText";
      }

      createElements(`<div class="code-lang">${languageName}</div>`, item);
      return;
    }

    createElements("", item);
  });
}

document.addEventListener("pjax:success", addHighlightTool);
document.addEventListener("DOMContentLoaded", addHighlightTool);
