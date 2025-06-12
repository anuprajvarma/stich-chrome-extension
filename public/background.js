chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TEXT_SELECTED") {
    console.log("Text selected:", message.text);
    // const urlWithQuery = chrome.runtime.getURL(
    //   `index.html?text=${encodeURIComponent(message.text)}`
    // );
    // chrome.windows.create({
    //   url: urlWithQuery,
    //   type: "popup",
    //   width: 400,
    //   height: 600,
    // });
  }
});

// background.js or service_worker.js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleChatbot,
  });
});

function toggleChatbot() {
  const existing = document.getElementById("chatbot-popup");
  if (existing) {
    console.log("Chatbot popup already exists, removing it...");
    existing.remove(); // 👈 Closes the iframe popup
  } else {
    console.log("Injecting chatbot popup...");
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("index.html");
    iframe.id = "chatbot-popup";
    Object.assign(iframe.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "30rem",
      height: "20rem",
      border: "none",
      zIndex: "999999",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      borderRadius: "12px",
    });
    document.body.appendChild(iframe);
  }
}

console.log("Background script loaded");
