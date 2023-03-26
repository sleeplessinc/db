
// Joe's test of the sqlite api
// 
// Usage: rm test.db ; node test2.js
// 

const { log, error, } = console;

const sl = require( "." ).sqlite3;

const fail = function( err ) {
    error( "FAIL" );
    error( err );
}

const databaseName = "test.db";
const table_name = "test";
const record_name = "Daffy Duck";

sl.connect( { databaseName, logLevel: 4 }, function( db ) {
    log( "connected to "+databaseName );

    let sql = "CREATE TABLE "+table_name+" ( id INTEGER PRIMARY KEY AUTOINCREMENT,  name VARCHAR(255) NOT NULL )";
    db.query( sql, [], function() {
        log( "created table "+table_name );

        let sql = "insert into test ( name ) values ( ? )";
        let args = [ record_name ];
        db.insert( sql, args, function( new_id ) {
            log( "inserted "+record_name+" into "+table_name+"; new_id="+new_id );

            db.get_recs( "select * from test where id = ?", [ new_id ], function( recs ) {
                log( "selected records from table:" );
                log( recs );

                db.delete( "delete from test where id = ?", [ new_id ], function( aff ) {
                    log( "deleted "+aff+" records from table" );

                    let sql = "DROP TABLE `test`";
                    db.query( sql, [], function() {
                        log( "dropped table "+table_name );

                        db.end( function() {
                            log( "closed "+databaseName );

                        }, fail );

                    }, fail );

                }, fail );

            }, fail );

        }, fail );

    }, fail );

}, error );


