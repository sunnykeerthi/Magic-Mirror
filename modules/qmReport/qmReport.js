Module.register("qmReport", {
	// Default module config.
	defaults: {
		width: 600,
		height: 400,
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
			"Chart.bundle.min.js"
		]
	},

	getStyles: function () {
		return [
			'qmReportStyles.css'
		]
	},

	getRandomColor: function () {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	},

	// Override dom generator.
	getDom: function () {
		console.log('get dom');
		var wrapperEl = document.createElement("div");
		var slideshow_container = document.createElement("div");
		slideshow_container.className = "slideshow-container";
		wrapperEl.appendChild(slideshow_container);

		if (this.total_info != 'Hello World!') {
			console.log('JSON.stringify(this.total_info)');
			console.log(JSON.stringify(this.total_info));
			console.log('JSON.stringify(this.total_info)');


			//Registering the charts
			Chart.plugins.register({
				afterDatasetsDraw: function (chart) {
					if (chart.config.options.plugin_one_attribute === 'pieChart1') {
						var ctx = chart.ctx;

						chart.data.datasets.forEach(function (dataset, i) {
							var meta = chart.getDatasetMeta(i);
							if (!meta.hidden) {

								meta.data.forEach(function (element, index) {
									// Draw the text in black, with the specified font
									ctx.fillStyle = 'rgb(255, 255, 255)';

									var fontSize = 14;
									var fontStyle = 'bold';
									var fontFamily = 'Helvetica Neue';
									ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

									// Just naively convert to string for now
									var dataString = dataset.data[index].toString();
									// Make sure alignment settings are correct
									ctx.textAlign = 'center';
									ctx.textBaseline = 'middle';
									ctx.color = 'white';
									var padding = 1;
									var position = element.tooltipPosition();
									ctx.fillText(dataString, position.x, position.y);
								});
							}
						});
					}
					else if (chart.config.options.plugin_one_attribute === 'barChart1') {
						console.log("Entered Bar chart1");
						//console.log(JSON.stringify(chart.data.datasets));
						var ctx = chart.ctx;

						chart.data.datasets.forEach(function (dataset, i) {
							var meta = chart.getDatasetMeta(i);
							if (!meta.hidden) {

								meta.data.forEach(function (element, index) {
									// Draw the text in black, with the specified font
									//ctx.fillStyle = 'rgb(255, 255, 255)';

									var fontSize = 14;
									var fontStyle = 'bold';
									var fontFamily = 'Helvetica Neue';
									ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

									// Just naively convert to string for now
									var dataString = dataset.data[index].toString();
									// Make sure alignment settings are correct
									ctx.textAlign = 'center';
									ctx.textBaseline = 'middle';
									ctx.color = 'black';
									var padding = 1;
									var position = element.tooltipPosition();
									ctx.fillText(dataString, position.x, position.y - 10);
								});
							}
						});
					}

				}
			});

			var currentReport = this.total_info.records[0];

			var returnedDataForTasks = this.total_info.records.reduce(function (keys, element) {
				console.log(keys);
				console.log(element);
				console.log(Object.keys(element));

				for (key in element) {
					console.log('inside');
					console.log(key)
					if (key.includes('hrs')) {
						keys.workloadRegion[key] = element[key];

					} else if (key.includes('usd')) {
						keys.pipeLineInfluencedRegion[key] = element[key];


					} else if (key.includes('__c')) {
						keys.assistInQueueRegion[key] = element[key];
					}

				}
				return keys;
			}, { workloadRegion: {}, pipeLineInfluencedRegion: {}, assistInQueueRegion: {} });
			console.log('Keys are ' + JSON.stringify(returnedDataForTasks.pipeLineInfluencedRegion));
			console.log('Keys are ' + JSON.stringify(returnedDataForTasks.workloadRegion));
			console.log('Keys are ' + JSON.stringify(returnedDataForTasks.assistInQueueRegion));
			wrapperEl.id = "myChartForWorkloads";
			wrapperEl.setAttribute("style", "position: relative; background:white");


			/*Pipeline Influence Data Start*/
			var regionPipelineKeys = returnedDataForTasks.pipeLineInfluencedRegion;

			var regionPipelineData = {};
			var labels = [];
			var datasets = [];
			var nextKey = "";
			var i = 0;
			for (var newKey in regionPipelineKeys) {
				var label = [];
				var data = [0, 0, 0];
				var indOutput = {};
				var currKey = newKey;
				var spaceCount = (currKey.split("_").length - 1);
				console.log(currKey + "\t" + nextKey);
				if (nextKey.length > 0) {
					if (spaceCount > 3) {
						if (!(currKey.split('_')[0] == nextKey.split('_')[0])) {
							labels.push(currKey.split('_')[0]);
						}

						data[i] = parseFloat(regionPipelineKeys[currKey]);
						label.push((currKey.split('_')[1]).split('_')[0]);
						if ((currKey.split('_')[0] == nextKey.split('_')[0])) {
							i++;
						}
					} else {
						labels.push(currKey.split('_')[0]);
						data[i] = parseFloat(regionPipelineKeys[currKey]);
						label.push(currKey.split('_')[0]);
						i++;
					}
				} else {
					labels.push(currKey.split('_')[0]);
					data[i] = parseFloat(regionPipelineKeys[currKey]);
					label.push((currKey.split('_')[1]).split('_')[0]);

				}
				nextKey = currKey;
				indOutput["label"] = label;
				indOutput["data"] = data;
				indOutput["backgroundColor"] = this.getRandomColor();


				datasets.push(indOutput);
			}
			regionPipelineData["labels"] = labels;
			regionPipelineData["datasets"] = datasets;


			chartConfigPipelineInfluences = {
				type: 'horizontalBar',
				data: regionPipelineData,
				options: {
					title: {
						display: true,
						text: 'Pipeline Influenced (in $Mn)'
					},
					responsive: true,
					scales: {
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: 'Pipeline Influenced ($MN)',
								fontStyle: 'bold'
							},
							stacked: true,
						}],
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: 'Region',
								fontStyle: 'bold'
							},
							stacked: true,
						}]
					}
				}
			}



			// Create chart canvas
			const chartElPipelineInfluence = document.createElement("canvas");
			chartElPipelineInfluence.className = "mySlides";
			chartElPipelineInfluence.width = this.config.width;
			chartElPipelineInfluence.height = this.config.height;

			slideshow_container.appendChild(chartElPipelineInfluence);



			this.chart = new Chart(chartElPipelineInfluence.getContext("2d"), chartConfigPipelineInfluences);

			// Append chart
			//slideshow_container.appendChild(chartElPipelineInfluence);
			/*Pipeline Influence Data End*/

			/*Workload by Region in Hours Start*/
			var regionWorkloadKeys = returnedDataForTasks.workloadRegion;

			var labels = Object.values(regionWorkloadKeys);
			console.log("Region workload keys " + labels);

			optionsUsingPluginForPieChart = {
				plugin_one_attribute: "pieChart1",
				responsive: true,
				maintainAspectRatio: true,
				title: {
					display: true,
					text: 'Workload In hours'
				},

				legend: {
					display: true,
					labels: {
						fontStyle: "bold",
						//fontColor: 'white'
					}
				},
				cutoutPercentage: 50

			}

			optionsUsingPluginForBarChart = {
				plugin_one_attribute: "barChart1",// Your variable to be used in the plugin goes here!
				responsive: true,
				maintainAspectRatio: true,
				title: {
					display: true,
					text: 'Number of Assists'
				},
				legend: {
					display: false,
					labels: {
						fontStyle: "bold",
						fontColor: 'white'
					}
				},
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'No.Of Assists',
							fontStyle: 'bold'
						},
						ticks: {
							beginAtZero: true
						}
					}],
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Region',
							fontStyle: 'bold'
						},
						ticks: {

							autoSkip: false
						}
					}]

				}
			},



				chartConfigWorkload = {
					type: 'pie',
					data: {
						labels: Object.keys(regionWorkloadKeys),
						datasets: [{
							backgroundColor: ["#7ECFA2", "#866B42", "#77FF81", "#F127F8", "#9647BC", "#74CB15"],
							data: Object.values(regionWorkloadKeys)
						}],
						borderWidth: 1

					},
					options: optionsUsingPluginForPieChart

				}


			console.log('^^^^^' + JSON.stringify(chartConfigWorkload));
			//Create chart canvas
			const chartElWorkload = document.createElement("canvas");
			chartElWorkload.className = "mySlides";
			chartElWorkload.width = this.config.width;
			chartElWorkload.height = this.config.height;

			slideshow_container.appendChild(chartElWorkload);



			this.chart = new Chart(chartElWorkload.getContext("2d"), chartConfigWorkload);

			// Append chart
			//slideshow_container.appendChild(chartElWorkload);
			/*Workload by Region in Hours End*/

			/*Assists In Queue Start*/

			var regionassistInQueueRegionKeys = returnedDataForTasks.assistInQueueRegion;

			var labels = Object.values(regionassistInQueueRegionKeys);
			console.log("Region workload keys " + Object.keys(regionassistInQueueRegionKeys));


			chartConfigAssists = {
				type: 'bar',
				data: {
					labels: Object.keys(regionassistInQueueRegionKeys),
					datasets: [{
						backgroundColor: ["#7ECFA2", "#866B42", "#77FF81", "#F127F8", "#9647BC", "#74CB15"],
						data: Object.values(regionassistInQueueRegionKeys)
					}]
				},

				options: optionsUsingPluginForBarChart

			}


			// Create chart canvas
			const chartElAssists = document.createElement("canvas");
			chartElAssists.className = "mySlides";
			chartElAssists.width = this.config.width;
			chartElAssists.height = this.config.height;

			slideshow_container.appendChild(chartElAssists);



			this.chart = new Chart(chartElAssists.getContext("2d"), chartConfigAssists);

			// Append chart
			//slideshow_container.appendChild(chartElAssists);
			Log.log("slide payload >> ");

		}
		return wrapperEl;
	},



	showSlides: function () {
		if (!this.slideIndex) {
			this.slideIndex = 0;
		}
		var i;
		var slides = document.getElementsByClassName("mySlides");
		for (i = 0; i < slides.length; i++) {
			console.log(slides[i]);
			slides[i].style.display = "none";
		}
		console.log("slideIndex " + this.slideIndex + "\t sise is " + (slides.length - 1));
		console.log(slides[0]);
		this.slideIndex++;

		slides[this.slideIndex - 1].style.display = "block";
		if (this.slideIndex > (slides.length - 1)) { this.slideIndex = 0 }

		setInterval(this.showSlides, 2000);
	},

	start: function () {
		this.sendSocketNotification('qmReport_initConnection');
	},






	socketNotificationReceived: function (notification, payload) {
		if (notification === "qmReport_updateNumbers") {
			Log.log("payload >> " + payload);
			this.total_info = payload;
			this.updateDom();
			setInterval(this.showSlides, 2000);
		}
	}
});