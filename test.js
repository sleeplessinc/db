
require( "sleepless" );
sleepless.globalize();

inspect = function( o, d ) { return require( "util" ).inspect( o, d ) }
dump = function( o, d ) { log( inspect( o, d ) ); }

function okay( a ) {
	log( "OKAY: " + inspect(a) );
}
function fail( a ) {
	console.warn( "FAIL: " + inspect(a) );
}

stuff = "stuff";
db = require( "./index.js" ).ds.connect( { filename: "foo.json" } );
db.insert( stuff, { name: sha1(""+time()) }, new_id => {
	db.select( stuff, {}, okay, fail );
	db.remove( stuff, { name: /4f/ }, okay, fail );
	db.select( stuff, {}, okay, fail );
}, fail );


//
opts = {
	region: "us-west-2",
	accessKeyId: process.env[ "AWS_ACCESS_KEY_ID" ],
	secretAccessKey: process.env[ "AWS_SECRET_ACCESS_KEY" ],
};
dump( opts );
db = require( "./index.js" ).dynamodb.connect( opts );
db.tables( okay, fail );



opts = {
	"host": "localhost",
	"user": "bustle",
	"password": "password", 
	"database": "database_name"
}
dump( opts );
db = require( "./index.js" ).mysql.connect( opts );
db.get_one( "select ?", [ 7 ], ( e, r ) => {
	if( e ) {
		fail( e );
	} else {
		okay( r );
	}
	db.end();
});




