var NodeHelper = require("node_helper");
var jsforce = require('jsforce');
var l_ = require('lodash');
var allActiveDEs;

module.exports = NodeHelper.create({

	start: function () {
		var self = this;
		console.log(this.name + " helper method started...");

	},
	subscribeToStream: function () {
		var node_self = this;
		var response_Obj = {};
		var conn = new jsforce.Connection();
		conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function (err, res) {
			if (err) { return console.error(err); }
			console.log('>>>>>>>>> DailyUpdate_Stream Updates Setup!');
			conn.streaming.topic("DailyUpdate_Stream").subscribe(function (message) {
				console.log('****************Got update');
				conn.query("SELECT Task_Name__c, Due_Date__c, Id, Name, Description__c FROM Daily_Task__c where (Due_Date__c!=null and task_type__c='Deal Assist' and createddate=Today) order by Due_Date__c desc", function (err, res) {
					if (err) { return console.error(err); }
					res = l_.sortBy(res, function (dateObj) {
						return new Date(dateObj.Due_Date__c);
					});
					console.log("Output");

					console.log(JSON.stringify(res))
					node_self.updateMessage(res);
				});
			});
		});
	},
	connectToSalesforce: function () {
		console.log("Innnnnnn");
		var node_self = this;
		var response_Obj = {};
		var conn = new jsforce.Connection();
		conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function (err, res) {
			if (err) { return console.error(err); }
			console.log('>>>>>>>>> DailyUpdate_Stream Updates Setup!');
			//	conn.streaming.topic("DailyUpdate_Stream").subscribe(function (message) {
			console.log('****************Got update');
			conn.query("SELECT Task_Name__c, Due_Date__c, Id, Name, Description__c FROM Daily_Task__c where (Due_Date__c!=null and task_type__c='Deal Assist' and createddate=Today) order by Due_Date__c desc", function (err, res) {
				if (err) { return console.error(err); }
				console.log(JSON.stringify(res));
				var newRes = l_.sortBy(res, function (dateObj) {
					return new Date(dateObj.Due_Date__c);
				});
				console.log("Output");
				console.log(JSON.stringify(newRes));
				node_self.updateMessage(res);
			});
		});
	},
	updateMessage: function (message) {
		console.log(message);
		this.sendSocketNotification("priorityAssists_updateNumbers", message)
	},
	socketNotificationReceived: function (notification, url) {
		console.log('socket salesforce priority');
		if (notification === "priorityAssists_initConnection") {
			this.connectToSalesforce();
			//this.subscribeToStream();
		}

	}

});