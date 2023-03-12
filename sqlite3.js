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

const L = require("log5").mkLog("\tdb_sqlite3: ")(5);

function connect(opts, okay, fail)
{
    okay = okay || L.D; 
    fail = fail || L.E; 

    if(!opts?.name?.length)
    {
        fail("options must include a name property. For example: { name: 'foobar.db' }");
        return;
    }

    let connection = require("better-sqlite3")(opts.name, opts);

    if(!connection)
    {
        fail("could not connect to database");
        return;
    }

    let db = {};

    db.end = function()
    {
        connection.close();
        connection = null;
    };

    db.query = function(sql, args, _okay, _fail)
    {
        _okay = _okay || okay;
        _fail = _fail || fail; 
        
        if(!connection)
        {
            _fail("connection is closed");
            return null;
        }
        
        const result = connection?.prepare(sql).run(args);
        if(!result)
        {
            _fail("no rows found");
            return db;
        }
        
        _okay(result);
        return db;
    };

    db.get_recs = function( sql, args, _okay, _fail ) {
        
        _okay = _okay || okay; 
        _fail = _fail || fail; 
        
        if(!connection)
        {
            _fail("connection is closed");
            return null;
        }

        const rows = connection?.prepare(sql).all(args);
        if(!rows)
        {
            _fail("no rows found");
            return db;
        }
        
        _okay(rows);
        return db;
    }

    db.get_one_rec = function( sql, args, _okay, _fail ) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        
        if(!connection)
        {
            _fail("connection is closed");
            return null;
        }

        const rows = connection?.prepare(sql).get(args);
        if(!rows)
        {
            _fail("no rows found");
            return db;
        }

        _okay(rows);
        return db;
    }
    
    db.get_one = db.get_one_rec;

    db.update = function(sql, args, _okay, _fail) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        return db.query( sql, args, res => {
            _okay( res["changes"] );
        }, _fail);
    }

    db.insert = function(sql, args, _okay, _fail) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        return db.query( sql, args, res => {
            _okay( res["lastInsertRowid"] );
        }, _fail );
    }

    db.delete = function( sql, args, _okay, _fail ) {
        _okay = _okay || okay;
        _fail = _fail || fail;
        return db.query( sql, args, res => {
            _okay( res["changes"] );
        }, _fail );
    }
    
    okay(db);
    return db;
}

module.exports = {connect};



