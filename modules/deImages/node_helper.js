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
			console.log('>>>>>>>>> dom dom dom');
			//conn.streaming.topic("QM_Report_Stream").subscribe(function (message) {
			conn.query("Select id, ContentDocumentId, ContentDocument.LatestPublishedVersionId from ContentDocumentLink where LinkedEntityId ='a3z2M000001KtUVQA0'", function (err, res) {
				if (err) { return console.error(err); }
				console.log(res);
				node_self.updateMessage(res);
				//	});
			});
		});
	},
	connectToSalesforce: function () {
		var node_self = this;
		var conn = new jsforce.Connection();
		conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function (err, res) {
			if (err) { return console.error(err); }
			console.log('Connected To QM Report');
			//conn.streaming.topic("QM_Report_Stream").subscribe(function (message) {
			conn.query("Select id, ContentDocumentId, ContentDocument.LatestPublishedVersionId from ContentDocumentLink where LinkedEntityId ='a3z2M000001KtUVQA0'", function (err, res) {
				if (err) { return console.error(err); }
				console.log(res);
				node_self.updateMessage(res);
				//	});
			});
		});
	},
	updateMessage: function (message) {
		console.log(message);
		this.sendSocketNotification("qmReport_updateNumbers2", message)
	},
	socketNotificationReceived: function (notification, url) {
		console.log('socket salesforce rec****');
		if (notification === "qmReport_initConnection2") {
			this.connectToSalesforce();
			this.subscribeToStream();
		}

	}

});