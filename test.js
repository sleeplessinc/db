
require( "sleepless" );

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
	db.select( stuff, { name: /./ }, okay, fail );
	db.remove( stuff, 3, okay, fail );
	db.select( stuff, { name: /./ }, okay, fail );
	db.update( stuff, { id: 1, name: "bob" }, okay, fail ); 
	db.select( stuff, { name: /./ }, okay, fail );
}, fail );


