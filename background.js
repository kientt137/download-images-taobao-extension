chrome.runtime.onMessage.addListener(
    function(html, sender, sendResponse) {
		console.log("this is background.js")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let full_url = tabs[0].url.toString()
			if (full_url.includes("shopee.vn")) {
				let arr = full_url.split('/')
				let raw_name = arr[arr.length - 1].split('.')[0]
				let raw_name_encode = decodeURI(raw_name)
				let folder = decodeURI(raw_name_encode)
				let re = new RegExp('background-image.+?(https.+?)&quot;', 'gi')
				let image_record
				let img_array=[]
				while (image_record = re.exec(html)) {
					let img_url=image_record[1].split("_")[0]
					img_array.push(img_url)
				}
				chrome.runtime.sendMessage({
					img_array: img_array,
					folder: "shopee_" + folder
				})
			} else if (full_url.includes("taobao.com")){
				let re = new RegExp('id="J_TbViewerThumb-.+?src="(.+?\.jpg)', 'gi')
				let image_record
				let img_array=[]
				while (image_record = re.exec(html)) {
					img_array.push(image_record[1])
				}
				chrome.runtime.sendMessage({
					img_array: img_array,
					folder: "taobao"
				})
			} else if (full_url.includes("1688.com")){
				/** find all product image */
				let re = new RegExp('class="tab-trigger.+?original.+?(https.+?)&quot', 'gi')
				let image_record
				let img_array=[]
				while (image_record = re.exec(html)) {
					img_array.push(image_record[1])
				}
				/** find all image on description */
				let re_des = new RegExp('id="de-description-detail">.+?class="price-explain"', 'gis')
				// find DOM description
				let html_description = re_des.exec(html)
				if (html_description.length > 0) {
					let re_img_des = new RegExp('\/\/([^"]+?jpg)', 'gi')
					while (image_record = re_img_des.exec(html_description[0])) {
						img_array.push(image_record[1])
					}
				}
				chrome.runtime.sendMessage({
					img_array: img_array,
					folder: "1688.com"
				})
			}
        })
    })


function sendResponse(){}