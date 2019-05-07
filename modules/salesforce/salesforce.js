Module.register("salesforce",{
	// Default module config.
	defaults: {
		text: "Hello World!"
	},
	message : "Hello World!",
	getScripts: function() {
	return [
		'jsforce.js',
		'moment.js'
		]
	},	
	// Override dom generator.
	getDom: function() {
		/*var qImg = document.createElement("IMG");
		qImg.src = 'https://sdo-demo-main-158a9a6cc49.force.com/du/resource/1483162251000/qbranch_logo';*/
		var wrapper = document.createElement("div");
		wrapper.className = "medium bright";
		wrapper.innerHTML = this.message;
		Log.log("payload >> ");
		return wrapper;	
	},
	start : function() {
		this.sendSocketNotification('ConnectToSalesforce');
	},
	socketNotificationReceived: function(notification, payload) {
		if (notification === "Salesforce") {
			this.message = payload;
			Log.log("payload >> "+ payload);
			this.updateDom()
		}
	}
});