/*
Copyright 2020 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/

const L = require("log5").mkLog("\tdb_sqlite3: ")(3);

const _okay = function( data ) {};
const _fail = function( err ) {};


function connect(opts, okay = _okay, fail = _fail )
{
    if( typeof opts.logLevel === "number" ) {
        L( opts.logLevel );
    }
    
    if(!opts.databaseName)
    {
        fail("Options must include a databaseName property. For example: { databaseName: 'foobar.db' }");
        return;
    }

    const sqlite3 = require("sqlite3")

    if( opts.logLevel >= 4 ) 
        sqlite3.verbose();

    let db = {};

    db.end = function( okay = _okay, fail = _fail )
    {
        connection.close( function( err ) {
            if( err ) {
                fail( err );
            } else {
                okay();
            }
        } );
    };

    db.query = function(sql, args, okay = _okay, fail = _fail )
    {
        L.D("query: "+o2j(sql)+" "+o2j(args));
        connection.run(sql, args, function( err ) {
            if( err ) {
                fail( err );
            } else {
                okay( null );
            }
        } );
    };

    db.get_recs = function(sql, args, okay = _okay, fail = _fail )
    {
        L.D("get_recs: "+o2j(sql)+" "+o2j(args));
        connection.all(sql, args, function( err, recs ) {
            if( err ) {
                fail( err );
            } else {
                okay( recs );
            }
        } );
        return db;
    };

    db.get_one_rec = function(sql, args, okay = _okay, fail = _fail )
    {
        L.D("get_one_rec: "+o2j(sql)+" "+o2j(args));
        connection.get( sql, args, function( err, rec ) {
            if( err ) {
                fail( err );
            } else {
                okay( rec );
            }
        } );
        return db;
    };

    db.get_one = db.get_one_rec;

    db.update = function(sql, args, okay = _okay, fail = _fail )
    {
        L.D("update: "+o2j(sql)+" "+o2j(args));
        connection.run( sql, args, function( err ) {
            if( err ) {
                fail( err );
            } else {
                okay( this.changes );
            }
        } );
        return db;
    };

    db.insert = function(sql, args, okay = _okay, fail = _fail )
    {
        L.D("insert: "+o2j(sql)+" "+o2j(args));
        connection.run( sql, args, function( err ) {
            if( err ) {
                fail( err );
            } else {
                okay( this.lastID );
            }
        } );
        return db;
    };

    db.delete = function(sql, args, okay = _okay, fail = _fail )
    {
        L.D("delete: "+o2j(sql)+" "+o2j(args));
        connection.run( sql, args, function( err ) {
            if( err ) {
                fail( err );
            } else {
                okay( this.changes );
            }
        } );
        return db;
    };

    let connection = new sqlite3.Database( opts.databaseName, function( err )
    {
        if( err ) {
            fail( err );
        } else {
            okay( db );
        }
    } );

    return db;
}

module.exports = {connect};


