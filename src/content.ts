// document.addEventListener("mouseup", () => {
//   const selectedText = window.getSelection()?.toString().trim();

//   if (selectedText) {
//     const popupUrl = chrome.runtime.getURL("index.html");

//     const popup = document.createElement("iframe");
//     popup.src = popupUrl;
//     popup.style.position = "fixed";
//     popup.style.top = "100px";
//     popup.style.right = "20px";
//     popup.style.width = "400px";
//     popup.style.height = "300px";
//     popup.style.zIndex = "999999";
//     popup.style.border = "1px solid #ccc";
//     popup.style.background = "#fff";
//     popup.id = "react-extension-popup";

//     // Remove old popup if any
//     const old = document.getElementById("react-extension-popup");
//     if (old) old.remove();

//     document.body.appendChild(popup);

//     // Optional: pass the selected text to the popup via postMessage
//     setTimeout(() => {
//       popup.contentWindow?.postMessage(
//         { selectedText },
//         chrome.runtime.getURL("index.html")
//       );
//     }, 300);
//   }
// });

// document.addEventListener("mouseup", function () {
//   const selectedText = window.getSelection()?.toString().trim();
//   if (selectedText) {
//     chrome.runtime.sendMessage({ type: "TEXT_SELECTED", text: selectedText });
//   }
// });
