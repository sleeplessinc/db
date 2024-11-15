
// Copyright 2024 Sleepless Software Inc. All Rights Reserved

function connect_cb( options, done, fail ) {

    let cnx = require( "mariadb/callback" ).createConnection( options );

    cnx.connect( err => {

        if( err ) {
            fail( err );
            return;
        }

        let db = {};
        
        function end() {
            cnx.end();  // back to pool
            cnx = null;
        }

        function query_old( sql, args, done, fail ) {
            cnx.query( sql, args, ( err, res ) => {
                if( err ) {
                    fail( err );
                } else {
                    done( res );
                }
            });
            return db;
        };

        function query( sql, args, done, fail ) {
            if( done || fail ) {
                query_old( sql, args, done, fail );
            } else {
                return new Promise((resolve, reject) => {
                    query_old( sql, args, resolve, reject );
                });
            }
        }

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

        function transaction_old( done, fail ) {
            cnx.beginTransaction( err => {
                if( err ) {
                    fail( err );
                } else {
                    done( db );
                }
            } );
            return db;
        }

        function transaction( done, fail ) {
            if( done || fail ) {
                transaction_old( done, fail );
            } else {
                return new Promise((resolve, reject) => {
                    transaction_old( resolve, reject );
                });
            }
        }

        function commit_old( done, fail ) {
            cnx.commit( err => {
                if( err ) {
                    fail( err );
                } else {
                    done( db );
                }
            } );
            return db;
        }

        function commit( done, fail ) {
            if( done || fail ) {
                commit_old( done, fail );
            } else {
                return new Promise((resolve, reject) => {
                    commit_old( resolve, reject );
                });
            }
        }

        function rollback_old( done, fail ) {
            cnx.rollback( err => {
                if( err ) {
                    fail( err );
                } else {
                    done( db );
                }
            } );
            return db;
        }

        function rollback( done, fail ) {
            if( done || fail ) {
                rollback_old( done, fail );
            } else {
                return new Promise((resolve, reject) => {
                    rollback_old( resolve, reject );
                });
            }
        }

        db = {
            end,
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

async function connect( options, done = null, fail = null ) {
    if( done || fail ) {
        connect_cb( options, done, fail );
    } else {
        return new Promise((resolve, reject) => {
            connect_cb( options, resolve, reject );
        });
    }
}

module.exports = { connect };





