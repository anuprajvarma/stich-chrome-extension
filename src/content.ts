let popup: HTMLDivElement | null = null;

document.addEventListener("mousedown", (e) => {
  // If the user clicks outside the popup, remove it
  if (popup && e.target instanceof Node && !popup.contains(e.target)) {
    popup.remove();
    popup = null;
  }
});

document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  const text = selection?.toString().trim();

  // ✅ Don't show popup if clicked inside existing popup
  if (popup && e.target instanceof Node && popup.contains(e.target)) {
    return;
  }

  if (popup) {
    popup.remove();
    popup = null;
  }

  if (text && text.length > 0 && selection?.rangeCount) {
    console.log("✅ Mouse up event detected, selection text:", text);
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    popup = document.createElement("div");
    popup.id = "selection-popup";

    const aiBtn = document.createElement("button");
    aiBtn.textContent = "AI";
    aiBtn.style.backgroundColor = "blue";
    aiBtn.onclick = () => {
      //   alert("AI button clicked with text: " + text);
      chrome.runtime.sendMessage({ type: "AI", payload: text }, (response) => {
        console.log("Background response:", response);
      });
    };

    const translateBtn = document.createElement("button");
    translateBtn.textContent = "Translate";
    translateBtn.onclick = () => {
      //   alert("Translate button clicked with text: " + text);
      chrome.runtime.sendMessage(
        { type: "TRANSLATE", payload: text },
        (response) => {
          console.log("Background response:", response);
        }
      );
    };

    popup.appendChild(aiBtn);
    popup.appendChild(translateBtn);

    Object.assign(popup.style, {
      position: "absolute",
      zIndex: "9999",
      background: "white",
      border: "1px solid #ccc",
      padding: "5px",
      width: "100px",
    });

    document.body.appendChild(popup);

    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  }
});
