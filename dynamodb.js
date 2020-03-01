

sleepless = require( "sleepless" );

AWS = require( "aws-sdk" );
AWS.config.loadFromPath('./aws_config.json');


exports.connect = function( opts ) {

	//AWS.config.update( opts );

	let ddb = new AWS.DynamoDB( opts );

	let tables = function( okay, fail ) {
		ddb.listTables( ( error, data ) => {
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


if(require && require.main === module) {
	// this module is being executed directly
	//require('./test.js')
	//
	//opts = {
	//	region: "us-west-2",
	//	accessKeyId: process.env[ "AWS_ACCESS_KEY_ID" ],
	//	secretAccessKey: process.env[ "AWS_SECRET_ACCESS_KEY" ],
	//};

	function okay( a ) {
		log( "OKAY: " + o2j(a) );
	}
	function fail( a ) {
		console.warn( "FAIL: " + o2j(a) );
	}

	opts = {
		region: "us-west-2",
		accessKeyId: process.env[ "AWS_ACCESS_KEY_ID" ],
		secretAccessKey: process.env[ "AWS_SECRET_ACCESS_KEY" ],
	};

	db = require( "./index.js" ).dynamodb.connect( );
	db.tables( okay, fail );

}


/*
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
*/


