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
        if (message.img_array && message.img_array.length > 0) {
            let img_count = video_count = 0
            let img_array = message.img_array
            for (let i = 0; i < img_array.length; i++) {
                let url = img_array[i]
                if (!url.includes("https://")) {
                    url = "https://" + url
                }
                if (url.includes(".mp4")) {
                    video_count++
                    let elem = document.createElement("video");
                    elem.src = url
                    elem.autoplay = true
                    elem.muted = true
                    document.getElementById("list-photos").appendChild(elem)
                }
                else {
                    img_count++
                    let elem = document.createElement("img");
                    elem.src = url
                    document.getElementById("list-photos").appendChild(elem)
                }
            }
            downloadImg.disable = false
            downloadImg.innerText = "Download " + img_count + " image(s) and " + video_count + " video(s)" 
            downloadImg.addEventListener("click", () => {
                download_image(message.folder, img_array)
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
			img_url = "https://" + img_url
		}
        if (img_url.includes(".mp4")) {
            chrome.downloads.download({
                url: img_url,
                filename: outputFolder + '/' + "video_" + count + ".mp4"
            })
        } else {
            chrome.downloads.download({
                url: img_url,
                filename: outputFolder + '/' + "image_" + count + ".jpeg"
            })
        }
		count++
	}
}