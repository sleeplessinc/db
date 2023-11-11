
const { log, o2j, } = require( "sleepless" );

const test = require("test");
const assert = require("node:assert");


function fail( error ) {
    console.error( error );
} 
function testOkay( a ) {
	log( "OKAY: " + o2j(a) );
}

const db = require( "." );
log( Object.keys( db ) );
log( Object.keys( db.mysql ) );
log( Object.keys( db.mysql8 ) );

/*

const mysql_opts = {
	"host": process.env["MYSQL_HOST"],
	"user": process.env["MYSQL_USER"],
	"password": process.env["MYSQL_PASSWORD"], 
	"database": process.env["MYSQL_DATABASE"],
}

db.mysql.connect( mysql_db => {
}, fail );


const stuff = "stuff";
const ds_config = {filename: "foo.json"};
const ds_db = require( "./index.js" ).ds.connect( ds_config );

test("ds - connection valid", function() {
    L.D( "ds_db: " + inspect( ds_db ) );
    assert(ds_db?.insert);
});

test("ds - insert", SKIP_IF_NO_DB(ds_db), function()
{
    ds_db.insert(stuff, {name: sleepless.sha1("" + sleepless.time())}, new_id =>
    {
        assert(new_id);
    });
});

test("ds - select", SKIP_IF_NO_DB(ds_db), function()
{
    ds_db.select(stuff, {}, function(result)
    {
        assert(result);
    });
});

test("ds - remove", SKIP_IF_NO_DB(ds_db), function()
{
    ds_db.remove(stuff, {}, function(result)
    {
        assert(result);
    });
});

test("ds - end", SKIP_IF_NO_DB(ds_db), function()
{
    // ds_db.end();
    assert(true);
});

//
const dynamo_opts = {
	region: "us-west-2",
	accessKeyId: process.env[ "AWS_ACCESS_KEY_ID" ],
	secretAccessKey: process.env[ "AWS_SECRET_ACCESS_KEY" ],
};
if( !dynamo_opts.accessKeyId === undefined ) {
    const dynamo_db = require( "./index.js" ).dynamodb?.connect( dynamo_opts );

    test("dynamodb - connection valid", function()
    {
        L.D( "dynamo_db: " + inspect( dynamo_db ) );
        assert(dynamo_db?.query);
    });

    test("dynamodb - get tables", SKIP_IF_NO_DB(dynamo_db), function()
    {
        dynamo_db.tables( testOkay );
        dynamo_db.end();
        assert(!dynamo_db.db);
    });
}
else
{
    L.D( "dynamodb - no connection");
}
*/

/*
const sqlite3_opts = {databaseName: "foobar.db", logLevel: 4}
const sqlite3_db = require( "./index.js" ).sqlite3.connect( sqlite3_opts );

const sqlite3_time_val = new Date().getTime();
const sqlite3_time_val_updated = sqlite3_time_val + 1000;

test("sqlite3 - connection valid", function()
{
    L.D( "sqlite3_opts: " + inspect( sqlite3_opts ) );
    assert(sqlite3_db?.query);
});

test("sqlite3 - create table foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.query( "create table if not exists foo (bar integer)", []);
    assert(result?.changes === 1 || result?.changes === 0);
});

test("sqlite3 - insert into foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.insert( "insert into foo (bar) values (?)", [ sqlite3_time_val ]);
    assert(result?.changes === 1);
});

test("sqlite3 - select ONE from foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.get_one( "select * from foo", []);
    assert(result?.bar);
});

test("sqlite3 - select ALL from foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.get_recs( "select * from foo", []);
    assert(result?.length > 0);
});

test("sqlite3 - update foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.update( "update foo set bar=? where bar=?", [ sqlite3_time_val_updated, sqlite3_time_val ]);
    assert(result?.changes === 1);
});

test("sqlite3 - delete from foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.delete( "delete from foo where bar = ?", [ sqlite3_time_val_updated ]);
    assert(result?.changes === 1);
});

test("sqlite3 - drop table foo", SKIP_IF_NO_DB(sqlite3_db), function()
{
    const result = sqlite3_db.query("DROP TABLE `foo`", []);
    assert(result?.lastInsertRowid === 1);
});

test("sqlite3 - close connection", SKIP_IF_NO_DB(sqlite3_db), function()
{
    sqlite3_db.end();
    
    // testing for a fail here is a success
    const result = sqlite3_db.query( "select * from foo", []);
    assert(!result);
});
*/


