let downloadImg = document.getElementById("download-img");
downloadImg.disable = true
loadHtml()

async function loadHtml() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['getPagesSource.js']
    });
    
}
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.img_array) {
            for (let i = 0; i < message.img_array.length; i++) {
                let elem = document.createElement("img");
                elem.src = message.img_array[i]
                document.getElementById("list-photos").appendChild(elem)
            }
            downloadImg.disable = false
            downloadImg.innerText = "Download " + message.img_array.length + " images"
            downloadImg.addEventListener("click", () => {
                download_image(message.folder, message.img_array)
            });
        }
    });

function download_image(outputFolder, img_array) {
	let current_date = new Date()
	let datetime = current_date.getDate() + "_"
		+ (current_date.getMonth()+1) + "_"
		+ current_date.getFullYear() + "-"
		+ current_date.getHours() + "_"
		+ current_date.getMinutes() + "_"
		+ current_date.getSeconds()
	outputFolder += "_" + datetime
	let count = 1
	let i
	for (i in img_array){
		let img_url = img_array[i]
		if (!img_url.includes("https://")) {
			img_url = "https:" + img_url
		}
		chrome.downloads.download({
			url: img_url,
			filename: outputFolder + '/' + "image_" + count + ".jpeg"
		})
		count++
	}
}