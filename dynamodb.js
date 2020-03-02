

sleepless = require( "sleepless" );

AWS = require( "aws-sdk" );
AWS.config.loadFromPath('./aws_config.json');	// XXX


exports.connect = function( opts ) {

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

	/*
	let insert = function( coll_name, obj, okay, fail ) {
	};

	let remove = function( coll_name, criteria, okay, fail ) {
	};

	let select = function( coll_name, criteria, okay, fail  ) {
	};

	let update = function( coll_name, obj, okay, fail ) {
	};

	*/

	let createTable = function( table_name, okay, fail ) {
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
		ddb.createTable( params, function( err, data ) {
			if( err ) {
				fail( err );
			}
			else {
				okay( data );
			}
		});
	}

	let deleteTable = function( table_name, okay, fail ) {
		var params = {
			TableName: table_name
		};
		ddb.deleteTable( params, function( err, data ) {
			if( err ) {
				fail( err );
			}
			else {
				okay( data );
			}
		});
	}

	let putItem = function( table_name, data, okay, fail ) {

		let item = {};
		for( let k in data ) {
			let val = data[ k ];
			let type = typeof val;
			log( type + " " + val );
			switch( type ) {
			case "string":
				item[ k ] = { S: val }
				break;
			case "number":
				item[ k ] = { N: (""+val) }
				break;
			case "object":
				item[ k ] = { M: val }
				break;
			case "boolean":
				item[ k ] = { B: val }
				break;
			}
		}
		log( "item=" + o2j(key));
		var params = {
			Item: item,
			TableName: table_name
		};
		ddb.putItem( params, function( err, data ) {
			if( err ) {
				fail( err );
			}
			else {
				okay( data );
			}
		});
	}

	let getItem = function( table_name, data, okay, fail ) {
		let key = {};
		for( let k in data ) {
			let val = data[ k ];
			let type = typeof val;
			log( type + " " + val );
			switch( type ) {
			case "string":
				key[ k ] = { S: val }
				break;
			case "number":
				key[ k ] = { N: (""+val) }
				break;
			case "object":
				key[ k ] = { M: val }
				break;
			case "boolean":
				key[ k ] = { B: val }
				break;
			}
		}
		log( "key=" + o2j(key));
		let params  = {
			TableName: table_name,
			Key: key,
			//ProjectionExpression:"LastPostDateTime, Message, Tags",
			ConsistentRead: true,
			//ReturnConsumedCapacity: "TOTAL"
		}
		ddb.getItem( params, function( err, data ) {
			if( err ) {
				fail( err );
			}
			else {
				okay( data );
			}
		});
	}

	return { 
		tables,
		createTable,
		deleteTable,
		putItem,
		getItem,
	};

};


if( require && require.main === module ) {

	// this module is being executed directly so run some tests

	function okay( a ) {
		log( "OKAY: " + o2j(a) );
	}
	function fail( a ) {
		console.warn( "FAIL: " + o2j(a) );
	}

	db = require( "./index.js" ).dynamodb.connect( );
	//db.tables( okay, fail );
	//db.createTable( "foobs", okay, fail );
	//db.deleteTable( "foobs", okay, fail );
	//db.putItem( "users", { id: 3, name: "Briggs" }, okay, fail );
	db.getItem( "users", { id: 3 }, okay, fail );


}


