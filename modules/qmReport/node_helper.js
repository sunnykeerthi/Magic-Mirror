var NodeHelper = require("node_helper");
var jsforce = require('jsforce');

module.exports = NodeHelper.create({

	start: function () {
		var self = this;
		console.log(this.name + " helper method started...");

	},
	subscribeToStream: function () {
		var node_self = this;
		var conn = new jsforce.Connection();
		conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function (err, res) {
			if (err) { return console.error(err); }
			console.log('>>>>>>>>> QM_Report_Stream Got Update!');
			conn.streaming.topic("QM_Report_Stream").subscribe(function (message) {
				conn.query('Select Id, Name, APAC__c, AMER__c, EMEA__c, APAC_hrs__c, AMER_hrs__c, EMEA_hrs__c, SYD_hrs__c, APAC_ANZ_usd__c, APAC_IND_usd__c, AMER_SF_usd__c, AMER_CHI_usd__c, EMEA_usd__c, CreatedDate from QM_Task__c order by createddate desc limit 1', function (err, res) {
					if (err) { return console.error(err); }
					console.log(res);
					node_self.updateMessage(res);
				});
			});
		});
	},
	connectToSalesforce: function () {
		var node_self = this;
		var conn = new jsforce.Connection();
		conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function (err, res) {
			if (err) { return console.error(err); }
			console.log('Connected To QM Report');
			conn.query('Select Id, Name, APAC__c, AMER__c, EMEA__c, APAC_hrs__c, AMER_hrs__c, EMEA_hrs__c, SYD_hrs__c, APAC_ANZ_usd__c, APAC_IND_usd__c, AMER_SF_usd__c, AMER_CHI_usd__c, EMEA_usd__c, CreatedDate from QM_Task__c order by createddate desc limit 1', function (err, res) {
				if (err) { return console.error(err); }
				console.log(res);
				node_self.updateMessage(res);
			});
		});
	},
	updateMessage: function (message) {
		console.log(message);
		this.sendSocketNotification("qmReport_updateNumbers", message)
	},
	socketNotificationReceived: function (notification, url) {
		console.log('socket salesforce rec');
		if (notification === "qmReport_initConnection") {
			this.connectToSalesforce();
			this.subscribeToStream();
		}

	}

});