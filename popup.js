// Initialize butotn with users's prefered color
let downloadImg = document.getElementById("download-img");

//chrome.storage.sync.get("color", ({ color }) => {
//  downloadImg.style.backgroundColor = color;
//);

// When the button is clicked, inject setPageBackgroundColor into current page
downloadImg.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['getPagesSource.js']
  });
});

