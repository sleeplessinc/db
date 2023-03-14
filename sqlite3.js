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


function connect(opts, okay, fail)
{
    const L = require("log5").mkLog("\tdb_sqlite3: ")(opts?.logLevel || 3);
    
    okay = okay || function(data)
    {
        L.D(sleepless.o2j(data));
        return data;
    }
    fail = fail || function(err)
    {
        L.E(sleepless.o2j(err));
        return err;
    }

    if(!opts?.databaseName?.length)
    {
        fail("options must include a databaseName property. For example: { databaseName: 'foobar.db' }");
        return;
    }

    let connection = require("better-sqlite3")(opts.databaseName || opts.name || "sqlite3_database.db", opts);

    if(!connection)
    {
        fail("could not connect to database");
        return;
    }
    
    connection.pragma('journal_mode = WAL');
    
    let db = {};

    db.end = function()
    {
        connection?.close();
        connection = null;
    };

    db.query = function(sql, args, _okay, _fail)
    {
        _okay = _okay || okay;
        _fail = _fail || fail;
        
        L.D(`--- QUERY ---
        sql: ${sleepless.o2j(sql)}
        args: ${sleepless.o2j(args)}`);

        if(!connection)
        {
            _fail("connection is closed");
            return null;
        }

        const result = connection?.prepare(sql).run(args);
        if(!result)
        {
            _fail("no rows found");
            return null;
        }

        _okay(result);
        return result;
    };

    db.get_recs = function( sql, args, _okay, _fail ) {

        _okay = _okay || okay;
        _fail = _fail || fail;

        L.V("GET_RECS");
        
        if(!connection)
        {
            _fail("connection is closed");
            return null;
        }

        const rows = connection?.prepare(sql).all(args);
        if(!rows)
        {
            _fail("no rows found");
            return null;
        }

        _okay(rows);
        return rows;
    }

    db.get_one_rec = function( sql, args, _okay, _fail ) {
        _okay = _okay || okay;
        _fail = _fail || fail;

        L.V("GET_ONE");

        if(!connection)
        {
            _fail("connection is closed");
            return null;
        }

        const rows = connection?.prepare(sql).get(args);
        if(!rows)
        {
            _fail("sqlite3.get_one_rec: no row found");
            return null;
        }

        _okay(rows);
        return rows;
    }

    db.get_one = db.get_one_rec;

    db.update = function(sql, args, _okay, _fail) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        L.V("UPDATE");
        return db.query( sql, args, res => {
            _okay( res["changes"] );
        }, _fail);
    }

    db.insert = function(sql, args, _okay, _fail) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        L.V("INSERT");
        return db.query( sql, args, res => {
            _okay( res["lastInsertRowid"] );
        }, _fail );
    }

    db.delete = function( sql, args, _okay, _fail ) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        L.V("DELETE");
        return db.query( sql, args, res => {
            _okay( res["changes"] );
        }, _fail );
    }

    okay(db);
    return db;
}

module.exports = {connect};



