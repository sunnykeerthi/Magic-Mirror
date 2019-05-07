Module.register("PriorityAssists", {
	// Default module config.
	defaults: {
		text: "Hello World!"
	},
	total_info: "Hello World!",
	getScripts: function () {
		return [
			'jsforce.js',
			'moment.js', 'jquery.js'
		]
	},
	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = ` <div class="thin bright"> Last Updated: ${moment().format('LLL')} </div> Updates Missed`;

		var now = moment().format("YYYY-MM-DD");
		var tomorrow = moment(new Date()).add(1, 'days');
		var slideshow_container = document.createElement("div");
		slideshow_container.className = "slideshow-container1";
		wrapper.appendChild(slideshow_container);
		console.log('Date is ' + now);
		console.log('Date is ' + tomorrow.format("YYYY-MM-DD"));

		if (this.total_info != 'Hello World!') {
			console.log('JSON.stringify(this.total_info.records)');
			console.log(JSON.stringify(this.total_info.records));


			for (var recs in this.total_info.records) {
				if (this.total_info.records[recs].Due_Date__c <= now || this.total_info.records[recs].Due_Date__c == tomorrow.format("YYYY-MM-DD")) {
					var divRed = document.createElement("div");
					divRed.className = "small";

					divRed.innerHTML = `${this.total_info.records[recs].Task_Name__c}`;
					slideshow_container.appendChild(divRed);

				}
				else {
					var divGreen = document.createElement("div");
					divGreen.className = "small";

					divGreen.innerHTML = `${this.total_info.records[recs].Task_Name__c}`;
					slideshow_container.appendChild(divGreen);

				}
				Log.log("payload >> ");
			}
		}
		return wrapper;
	},

	slideShow: function () {
		if (!this.prioritySlideIndex) {
			this.prioritySlideIndex = 0;
		}
		//console.log("prioritySlideIndex " + this.prioritySlideIndex + "\t sise is " + (prioritySlides.length - 1));
		//console.log(prioritySlides[0]);
		var i;
		var prioritySlides = document.getElementsByClassName("small");
		for (i = 0; i < prioritySlides.length; i++) {
			console.log(prioritySlides[i]);
			prioritySlides[i].style.display = "none";
		}

		this.prioritySlideIndex++;

		prioritySlides[this.prioritySlideIndex - 1].style.display = "block";
		if (this.prioritySlideIndex > (prioritySlides.length - 1)) { this.prioritySlideIndex = 0 }

		setInterval(this.slideShow, 2000);
	},








	start: function () {
		this.sendSocketNotification('priorityAssists_initConnection');
	},
	socketNotificationReceived: function (notification, payload) {
		if (notification === "priorityAssists_updateNumbers") {
			this.total_info = payload;
			Log.log("payload >> " + payload);
			this.updateDom();
			//setInterval(this.slideShow, 2000);
		}

	}
});