

sleepless = require( "sleepless" );

AWS = require( "aws-sdk" );


exports.connect = function( opts ) {

	AWS.config.update( { region: opts.region, endpoint: opts.endpoint } );

	let ddb = new AWS.DynamoDB();

	let tables = function( params, okay, fail ) {
		ddb.listTables( params, ( error, data ) => {
			if( error ) {
				fail( error );
			}
			else {
				okay( data );
			}
		});
	};

	let insert = function( coll_name, obj, okay, fail ) {
	};

	let remove = function( coll_name, criteria, okay, fail ) {
	};

	let select = function( coll_name, criteria, okay, fail  ) {
	};

	let update = function( coll_name, obj, okay, fail ) {
	};

	return { tables, insert, select, update, remove, };

};



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



