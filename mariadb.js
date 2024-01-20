/*
Copyright 2024 Sleepless Software Inc. All rights reserved.

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

const mariadb = require( "mariadb/callback" );

const { o2j, } = require( "sleepless" );
const { log, error, } = console;

let pool = null;


function connect( opts, done, fail ) {

    if( pool == null )
        pool = mariadb.createPool( opts );

    pool.getConnection( ( err, cnx ) => {
        
        if( err ) {
            log( "connect fail", err );
            fail( err );
            return;
        }

        log( "connect okay", cnx );

        let db = {};
        
        function release() {
            cnx.release();  // back to pool
            cnx = null;
        }

        function query( sql, args, done, fail ) {
            cnx.query( sql, args, ( err, res ) => {
                if( err ) {
                    if( fail ) {
                        fail( err );
                    } else {
                        throw err;
                    }
                } else {
                    if( done ) {
                        done( res );
                    }
                }
            });
            return db;
        };

        function select( sql, args, done, fail ) {
            return query( sql, args, done, fail );
        }

        function update(sql, args, done, fail) {
            return query( sql, args, res => {
                done( res.affectedRows );
            }, fail);
        }

        function insert(sql, args, done, fail) {
            return query( sql, args, res => {
                done( res.insertId );
            }, fail );
        }

        function delete_fn( sql, args, done, fail ) {
            return query( sql, args, res => {
                done( res.affectedRows );
            }, fail );
        }

        function transaction( done, fail ) {
            cnx.beginTransaction( err => {
                if( err ) {
                    fail( err );
                    return;
                }
                done( db );
            } );
            return db;
        }

        function commit( done, fail ) {
            cnx.commit( err => {
                if( err ) {
                    fail( err );
                    return;
                }
                done( db );
            } );
            return db;
        }

        // XXX rollback ?


        db = {
            // get_recs,       // deprecate
            // get_one,        // deprecate
            // get_one_rec,    // deprecate
            release,
            query,
            select,
            update,
            insert,
            delete: delete_fn,
            transaction,
            commit,
        };

        done( db );
    } );

};

module.exports = { connect };



