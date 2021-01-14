

sleepless = require( "sleepless" );
sleepless.globalize();

AWS = require( "aws-sdk" );
AWS.config.loadFromPath('./aws_config.json');	// XXX


exports.connect = function( opts ) {

	let ddb = new AWS.DynamoDB( opts );
	let dc = new AWS.DynamoDB.DocumentClient();

	let tables = function( cb ) {
		ddb.listTables( cb );
	};

	let createTable = function( table_name, cb ) {
		var params = {
			AttributeDefinitions: [
				{ AttributeName: "id", AttributeType: "N" }, 
			], 
			KeySchema: [
				{ AttributeName: "id", KeyType: "HASH" }, 
			], 
			ProvisionedThroughput: {
				ReadCapacityUnits: 5,
				WriteCapacityUnits: 5,
			},
			TableName: table_name
		};
		ddb.createTable( params, cb );
	}

	let deleteTable = function( table_name, cb ) {
		var params = {
			TableName: table_name
		};
		ddb.deleteTable( params, cb );
	}

	let putItem = function( table_name, item, cb ) {
		var params = {
			Item: item,
			TableName: table_name
		};
		dc.put( params, cb );
	}

	let getItem = function( table_name, key, cb ) {
		let params  = {
			TableName: table_name,
			Key: key,
			//ProjectionExpression:"LastPostDateTime, Message, Tags",
			ConsistentRead: true,
			//ReturnConsumedCapacity: "TOTAL"
		}
		dc.get( params, cb );
	}

	let query = function( params, key, cb ) {
		ddb.query( params, cb );
	}

	return { 
		tables,
		createTable,
		deleteTable,
		putItem,
		getItem,
		query,
	};

};


if( require && require.main === module ) {

	// this module is being executed directly so run some tests

	function fin( err, data ) {
		if( err ) {
			log( "ERROR: " + o2j( data ) );
		}
		else {
			log( "OKAY: " + o2j( data ) );
		}
	}

	db = require( "./index.js" ).dynamodb.connect( );
	db.tables( fin );
	//db.createTable( "sessions", fin );
	//db.deleteTable( "foobs", fin );
	//db.putItem( "users", { id: 4, name: "Sally" }, fin );
	//db.getItem( "users", { id: 4 }, fin );


}


