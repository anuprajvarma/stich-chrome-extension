let popup: HTMLDivElement | null = null;

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const text = selection?.toString().trim();

  if (popup) {
    popup.remove();
    popup = null;
  }

  if (text && text.length > 0 && selection?.rangeCount) {
    console.log(`Selected text: "${text}"`);
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    popup = document.createElement("div");
    popup.id = "selection-popup";

    const aiBtn = document.createElement("button");
    aiBtn.textContent = "AI";
    aiBtn.onclick = () => {
      chrome.runtime.sendMessage({
        type: "AI",
        payload: text,
      });
    };

    const translateBtn = document.createElement("button");
    translateBtn.textContent = "Translate";
    translateBtn.onclick = () => {
      chrome.runtime.sendMessage({
        type: "TRANSLATE",
        payload: text,
      });
    };

    popup.appendChild(aiBtn);
    popup.appendChild(translateBtn);

    popup.style.position = "absolute";
    popup.style.zIndex = "9999"; // Optional styling
    popup.style.background = "white";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "5px";
    popup.style.width = "100px";

    document.body.appendChild(popup);

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    popup.style.top = `${rect.bottom + scrollTop + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  }
});

document.addEventListener("mousedown", (e: MouseEvent) => {
  if (popup && e.target instanceof Node && !popup.contains(e.target)) {
    popup.remove();
  }
});
