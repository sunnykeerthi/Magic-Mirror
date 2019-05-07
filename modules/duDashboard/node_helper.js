var NodeHelper = require("node_helper");
var jsforce = require('jsforce');
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
			console.log('>>>>>>>>> DailyUpdate_Stream Setup!');
			conn.streaming.topic("DailyUpdate_Stream").subscribe(function (message) {
				console.log('****************Got update');
				conn.query('SELECT day_only(createddate), SUM(Total_ETA_of_all_tasks__c), SUM(Total_ETA__C) from Daily_Update__c where createddate >= LAST_N_DAYS:4 group by day_only(createddate) order by day_only(createddate) desc', function (err, res) {
					if (err) { return console.error(err); }
					console.log(res);
					response_Obj.aggrRes = res;
					conn.query('SELECT count(Id), Task_Type__c FROM Daily_Task__c where createddate = Today group by Task_Type__c', function (err, res) {
						if (err) { return console.error(err); }
						console.log(res);

						response_Obj.groupRes = res;
						node_self.updateMessage(response_Obj);
					});
				});
			});
		});
	},
	connectToSalesforce: function () {
		var node_self = this;
		var response_Obj = {};
		var conn = new jsforce.Connection();
		conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function (err, res) {
			if (err) { return console.error(err); }
			console.log('Connected To Dashboard');
			conn.query('SELECT day_only(createddate), SUM(Total_ETA_of_all_tasks__c), SUM(Total_ETA__C) from Daily_Update__c where createddate >= LAST_N_DAYS:4 group by day_only(createddate) order by day_only(createddate) desc', function (err, res) {
				if (err) { return console.error(err); }
				console.log('*******');
				console.log(JSON.stringify(res));
				console.log('*******');
				response_Obj.aggrRes = res;
				conn.query('SELECT count(Id), Task_Type__c FROM Daily_Task__c where createddate = Today group by Task_Type__c', function (err, res) {
					if (err) { return console.error(err); }
					console.log(res);
					response_Obj.groupRes = res;
					node_self.updateMessage(response_Obj);
				});

			});
		});
	},
	updateMessage: function (message) {
		console.log(message);
		this.sendSocketNotification("duDash_updateNumbers", message)
	},
	socketNotificationReceived: function (notification, url) {
		console.log('socket salesforce rec');
		if (notification === "duDash_initConnection") {
			this.connectToSalesforce();
			this.subscribeToStream();
		}

	}

});