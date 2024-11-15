
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

require("./").mysql.connect({
	host:"db.sleepless.com",
	user:"socrabot",
	password:"NqCQf7xtMm8v7SKd",
	database:"socrabot"
}, db => {
	log("connected");
	db.start( (x) => {
		log(x);
		log('started');
		db.update( "update audit_log set msg='foo' where id=4362 limit 1", [], n => {
			log(n);
			if( toInt(Math.random() * 2) % 2 == 0 ) {
				db.commit( () => {
					log('committed');
					db.end();
				}, fail );
			} else {
				db.rollback( () => {
					log('rolled back');
					db.end();
				}, fail );
			}
		}, fail );
	}, fail);

}, fail);


