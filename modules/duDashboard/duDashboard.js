Module.register("duDashboard", {
	// Default module config.
	defaults: {
		width: 300,
		height: 300,

	},
	total_info: "Hello World!",
	getScripts: function () {
		return [
			'jsforce.js',
			'moment.js',
			"modules/MMM-Chart/node_modules/chart.js/dist/Chart.bundle.min.js"

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
		var wrapperEl = document.createElement("div");

		if (this.total_info != 'Hello World!') {
			console.log(JSON.stringify(this.total_info));


			//Registering the charts
			Chart.plugins.register({
				afterDatasetsDraw: function (chart) {
					if (chart.config.options.plugin_one_attribute === 'pieChart') {
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
					else if (chart.config.options.plugin_one_attribute === 'barChart') {
						console.log("Entered Bar chart");
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
									ctx.fillText(dataString, position.x, position.y - 10);
								});
							}
						});
					}

				}
			});








			optionsUsingPluginForBarChart = {
				plugin_one_attribute: "barChart",// Your variable to be used in the plugin goes here!
				responsive: true,
				maintainAspectRatio: true,
				title: {
					display: true,
					text: 'Total Workload',
					fontStyle: 'bold',
					fontColor: 'white'
				},
				legend: {
					display: true,
					labels: {
						fontStyle: "bold",
						fontColor: 'white'
					}
				},

			}
			//Workload Data
			var agResp = this.total_info.aggrRes;
			var returnedDataForWorkloads = agResp.records.reduce((a, e) => {
				a.dates.push(e.expr0);
				a.expr1.push(e.expr1);
				a.expr2.push(e.expr2);
				return a;
			}, { dates: [], expr1: [], expr2: [] });
			chartConfigForWorkloads = {
				type: 'bar',
				data: {
					labels: returnedDataForWorkloads.dates,
					datasets: [
						{
							label: "Workload",
							backgroundColor: "#96FEEF",
							data: returnedDataForWorkloads.expr1,
						},
						{
							label: "Assist Workload",
							backgroundColor: "#6597A2",
							data: returnedDataForWorkloads.expr2,
						},
					],
					borderWidth: 1

				},
				options: optionsUsingPluginForBarChart
			}








			wrapperEl.id = "myChartForWorkloads";
			wrapperEl.setAttribute("style", "position: relative; display: inline-block; ");

			// Create chart canvas
			const chartElForWorkLoad = document.createElement("canvas");
			chartElForWorkLoad.width = this.config.width;
			chartElForWorkLoad.height = this.config.height;
			// chartEl.innerHTML = 'Hello world!';

			wrapperEl.appendChild(chartElForWorkLoad);



			this.chart = new Chart(chartElForWorkLoad.getContext("2d"), chartConfigForWorkloads);

			// Append chart
			wrapperEl.appendChild(chartElForWorkLoad);

			//Tasks Data
			var groupRes = this.total_info.groupRes;
			var returnedDataForTasks = groupRes.records.reduce((a, e) => {
				a.taskName.push(e.Task_Type__c);
				a.taskCount.push(e.expr0);
				return a;
			}, { taskName: [], taskCount: [] });
			console.log('returnedDataForTasks.taskCount');
			console.log(JSON.stringify(this.total_info.groupRes));

			console.log(returnedDataForTasks.taskCount);
			var backgroundColor = [];


			for (var j = 0; j < groupRes.records.length; j++) {
				backgroundColor.push(this.getRandomColor());
			}

			optionsUsingPluginForPieChart = {
				plugin_one_attribute: "pieChart",
				responsive: true,
				maintainAspectRatio: true,
				title: {
					display: true,
					text: 'Daily Tasks',
					fontStyle: "bold",
					fontColor: 'white'
				},

				legend: {
					display: true,
					labels: {
						fontStyle: "bold",
						fontColor: 'white'
					}
				},

			}


			chartConfigForTasks = {
				type: 'pie',
				data: {
					labels: returnedDataForTasks.taskName,
					datasets: [
						{
							backgroundColor: backgroundColor,
							data: returnedDataForTasks.taskCount,
						},
					],
					borderWidth: 1

				},
				options: optionsUsingPluginForPieChart
			}
			var br = document.createElement("BR");
			wrapperEl.appendChild(br);

			// var h = document.createElement("H7");
			// var t = document.createTextNode("Daily Tasks");
			// h.appendChild(t);
			// h.style.display = "flex";
			// wrapperEl.appendChild(h);

			wrapperEl.id = "myChartForTasks";
			wrapperEl.setAttribute("style", "position: relative; display: inline-block;");

			// Create chart canvas
			const chartElForTasks = document.createElement("canvas");
			chartElForTasks.width = this.config.width;
			chartElForTasks.height = this.config.height;
			// chartEl.innerHTML = 'Hello world!';

			wrapperEl.appendChild(chartElForTasks);


			this.chart = new Chart(chartElForTasks.getContext("2d"), chartConfigForTasks);

			// Append chart
			wrapperEl.appendChild(chartElForTasks);
		}
		return wrapperEl;
	},
	start: function () {
		this.sendSocketNotification('duDash_initConnection');
	},
	socketNotificationReceived: function (notification, payload) {
		if (notification === "duDash_updateNumbers") {
			this.total_info = payload;
			Log.log("payload >> " + payload);
			this.updateDom();
		}
	},



});