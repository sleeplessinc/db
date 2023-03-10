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
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
*/

const sqlite3 = require("better-sqlite3");
const sleepless = require("sleepless");
sleepless.globalize();

function connect(opts, okay, fail)
{
    if(!okay)
    {
        okay = function() {}; 
        fail = console.warn;
    }

    if(!opts?.name?.length)
    {
        fail("options must include a name property. For example: { name: 'foobar.db' }");
        return;
    }

    let cnx = require("better-sqlite3")(opts.name, opts);

    if(!cnx)
    {
        fail("could not connect to database");
        return;
    }

    let db = {};

    db.end = function()
    {
        cnx.close();
        cnx = null;
    };

    db.query = function(sql, args, okay, fail)
    {
        const row = cnx.prepare(sql).get(args);
        if(!row)
        {
            fail("no rows found");
            return db;
        }
        
        okay(row);
        return db;
    };

    okay(db);
    return db;
};

module.exports = {connect};



