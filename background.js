chrome.runtime.onMessage.addListener(
    function(html, sender, sendResponse) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let full_url = tabs[0].url.toString()
			if (full_url.includes("shopee.vn")) {
				let arr = full_url.split('/')
				let raw_name = arr[arr.length - 1].split('.')[0]
				let raw_name_encode = decodeURI(raw_name)
				let folder = decodeURI(raw_name_encode)
				let result = []
				let re = new RegExp('background-image.+?(https.+?)&quot;', 'gi')
				let image_record
				let img_array=[]
				while (image_record = re.exec(html)) {
					let img_url=image_record[1].split("_")[0]
					img_array.push(img_url)
				}
				download_image(folder, img_array)
			} else if (full_url.includes("taobao.com")){
				let result = []
				let re = new RegExp('id="J_TbViewerThumb-.+?src="(.+?\.jpg)', 'gi')
				let image_record
				let img_array=[]
				while (image_record = re.exec(html)) {
					console.warn(image_record[1])
					img_array.push(image_record[1])
				}
				download_image("taobao", img_array)
			} else if (full_url.includes("1688.com")){
				let result = []
				// find all product image
				let re = new RegExp('class="tab-trigger.+?original.+?(https.+?)&quot', 'gi')
				let image_record
				let img_array=[]
				while (image_record = re.exec(html)) {
					console.log(image_record)
					console.warn(image_record[1])
					img_array.push(image_record[1])
				}
				download_image("1688", img_array)
			}
        })
    })

function download_image(outputFolder, img_array) {
	let currentdate = new Date()
	let datetime = currentdate.getDate() + "_"
		+ (currentdate.getMonth()+1) + "_"
		+ currentdate.getFullYear() + "-"
		+ currentdate.getHours() + "_"
		+ currentdate.getMinutes() + "_"
		+ currentdate.getSeconds()
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

function sendResponse(){}