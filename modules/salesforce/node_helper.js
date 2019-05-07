var NodeHelper = require("node_helper");
var jsforce = require('jsforce');

module.exports = NodeHelper.create({

	start: function () {
		var self = this;
		console.log(this.name + " helper method started...");

	},

	connectToSalesforce : function(){
		var node_self = this;
		
		var conn = new jsforce.Connection();
			conn.login('magicmirror@demoengg.sdo', 'Salesforce1', function(err, res) {
			  if (err) { return console.error(err); }
				console.log('Connected To Salesforce');
			conn.query("SELECT Id, Name, Message__c FROM Magic_Mirror_Announcements__c order by createdDate desc limit 1", function(err, result) {
  				if (err) { return console.error(err); }
  				console.log("total : " + result.totalSize);
  				console.log("fetched : " + result.records.length);
				node_self.updateMessage(result.records[0].Message__c);

				  conn.streaming.topic("MagicMirror_Messages").subscribe(function(message) {
		  			console.log('Event Type : ' + message.event.type);
		  			console.log('Event Created : ' + message.event.createdDate);
		  			console.log('Object Id : ' + message.sobject.Id);
					console.log('Object Id : ' + message.sobject.Message__c);
					node_self.updateMessage(message.sobject.Message__c);
				});
			});
		});
	},
	updateMessage : function(message){
		console.log(message);
		this.sendSocketNotification("Salesforce", message)
	},
	socketNotificationReceived : function(notification, url) {
	console.log('socket salesforce rec');
		if (notification === "ConnectToSalesforce") {
			this.connectToSalesforce();
		}
		
	}

});