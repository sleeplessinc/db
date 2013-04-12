
var AWS = require('aws-sdk');

AWS.config.update({
	accessKeyId: process.env.AWS_KEY,
	secretAccessKey: process.env.AWS_SEC,
	region: 'us-west-1',
});


var db = new AWS.DynamoDB(); 


db.client.listTables(function(err, data) {
	if( err ) {
		console.log( err );
	}
	else {
		console.log( "list req ok");

		console.log(data.TableNames); 
	}
});



