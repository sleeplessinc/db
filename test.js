const sleepless = require( "sleepless" );

const inspect = function( o, d ) { return require( "util" ).inspect( o, d ) }
const dump = function( o, d ) { sleepless.log( inspect( o, d ) ); }

const testOkay = function( a ) {
	sleepless.log( "OKAY: " + inspect(a) );
}
const testFail = function( a ) {
	console.warn( "FAIL: " + inspect(a) );
}

stuff = "stuff";
db = require( "./index.js" ).ds.connect( { filename: "foo.json" } );
db.insert( stuff, { name: sha1(""+time()) }, new_id => {
	db.select( stuff, {}, testOkay, testFail );
	db.remove( stuff, { name: /4f/ }, testOkay, testFail );
	db.select( stuff, {}, testOkay, testFail );
}, testFail );


//
opts = {
	region: "us-west-2",
	accessKeyId: process.env[ "AWS_ACCESS_KEY_ID" ],
	secretAccessKey: process.env[ "AWS_SECRET_ACCESS_KEY" ],
};
dump( opts );
db = require( "./index.js" ).dynamodb?.connect( opts );
if(!db ) {
    testFail( "could not connect to dynamodb" );
}
else
{
    db.tables( testOkay, testFail );
}



opts = {
	"host": "localhost",
	"user": "bustle",
	"password": "password", 
	"database": "database_name"
}
dump( opts );
db = require( "./index.js" ).mysql.connect( opts, testOkay, testFail );
db?.get_one( "select ?", [ 7 ], ( e, r ) => {
	if( e ) {
		testFail( e );
	} else {
		testOkay( r );
	}
	db.end();
});

opts = {
    name: "foobar.db"
}
dump( opts );
db = require( "./index.js" ).sqlite3.connect( opts );
console.log(db);
if(!db) {
    testFail( "could not connect to sqlite3" );
}
else
{
    db.query( "select ?", [ 7 ], ( result ) => {
        if(!result)
        {
            testFail( "no result" );
            db.end();
            return;
        }

        testOkay( result );
        db.end();
    }, testFail);
}


