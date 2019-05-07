Module.register("deImages", {
	// Default module config.
	defaults: {
		width: 200,
		height: 300,
		text: "Hello World!",
		slideIndex: -1,
		rotateInterval: 30 * 1000,
		animationSpeed: 3000, // fade in and out speed
		initialLoadDelay: 4250,
		retryDelay: 2500,
		updateInterval: 60 * 60 * 1000,
	},
	total_info: "Hello World!",
	getScripts: function () {
		return [
			'jsforce.js',
			'moment.js',
			"modules/MMM-Chart/node_modules/chart.js/dist/Chart.bundle.min.js"
		]
	},

	getStyles: function () {
		return [
			'deImagesStyle2.css'
		]
	},
	//https://dailyupdate--c.na96.content.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=0682M00000Ma0WaQAJ
	// Override dom generator.
	getDom: function () {
		console.log('get dom');
		if (this.total_info != 'Hello World!') {
			console.log("JSON.stringify(this.total_info)");
			console.log(JSON.stringify(this.total_info));

		}
		var wrapperEl = document.createElement("div");
		var container = document.createElement("div");
		container.className = "slideshow-container2";
		wrapperEl.appendChild(container);

		for (var i = 0; i < this.total_info.totalSize; i++) {
			var div1 = document.createElement("div");
			div1.className = "mySlides2 fade";
			var cntId = this.total_info.records[i].ContentDocument.LatestPublishedVersionId;
			console.log(cntId + '******');
			var img1 = document.createElement("img");
			img1.src = "https://dailyupdate--c.na96.content.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" + cntId;
			div1.appendChild(img1);
			container.appendChild(div1);
		}

		wrapperEl.appendChild(container);



		// var div1 = document.createElement("div");
		// div1.className = "mySlides2 fade";

		// var img1 = document.createElement("img");
		// img1.src = "https://www.w3schools.com/howto/img_nature_wide.jpg";
		// div1.appendChild(img1);
		// container.appendChild(div1);

		// var div2 = document.createElement("div");
		// div2.className = "mySlides2 fade";

		// var img2 = document.createElement("img");
		// img2.src = "https://www.w3schools.com/howto/img_mountains_wide.jpg";
		// div2.appendChild(img2);
		// container.appendChild(div2);

		// var div3 = document.createElement("div");
		// div3.className = "mySlides2 fade";

		// var img3 = document.createElement("img");
		// img3.src = "https://www.w3schools.com/howto/img_snow_wide.jpg";
		// div3.appendChild(img3);
		// container.appendChild(div3);
		// wrapperEl.appendChild(container);


		Log.log("slide payload >> ");
		return wrapperEl;
	},



	showSlides2: function () {
		if (!this.slideIndex2) {
			this.slideIndex2 = 0;
		}
		var i;
		var slides2 = document.getElementsByClassName("mySlides2");
		for (i = 0; i < slides2.length; i++) {
			console.log(slides2[i]);
			slides2[i].style.display = "none";
		}

		this.slideIndex2++;
		console.log("slideIndex " + this.slideIndex2 + "\t sise is " + (slides2.length - 1) + "\t actual size is " + slides2.length);

		slides2[this.slideIndex2 - 1].style.display = "block";
		if (this.slideIndex2 > (slides2.length - 1)) { this.slideIndex2 = 0 }

		setInterval(this.showSlides2, 2000);
	},

	start: function () {
		this.sendSocketNotification('qmReport_initConnection2');
	},





	socketNotificationReceived: function (notification, payload) {
		if (notification === "qmReport_updateNumbers2") {
			Log.log("payload >> " + payload);
			this.total_info = payload;
			this.updateDom();
			this.showSlides2();
		}
	}
});