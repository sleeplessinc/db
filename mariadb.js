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


function create( opts ) {

    let pool = mariadb.createPool( opts );

    function connect( done, fail ) {

        pool.getConnection( ( err, cnx ) => {

            if( err ) {
                fail( err );
                return;
            }

            let db = {};
            
            function release() {
                cnx.end();  // back to pool
                cnx = null;
            }

            function query( sql, args, done, fail ) {
                cnx.query( sql, args, ( err, res ) => {
                    if( err ) {
                        fail( err );
                    } else {
                        done( res );
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
                return query( sql, args, ( res, meta ) => {
                    done( Number( res.insertId ) );
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
                    } else {
                        done( db );
                    }
                } );
                return db;
            }

            function commit( done, fail ) {
                cnx.commit( err => {
                    if( err ) {
                        fail( err );
                    } else {
                        done( db );
                    }
                } );
                return db;
            }

            function rollback( done, fail ) {
                cnx.rollback( err => {
                    if( err ) {
                        fail( err );
                    } else {
                        done( db );
                    }
                } );
                return db;
            }


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
                rollback,
            };

            done( db );
        } );

    }

    return { connect };

}


module.exports = { create };



