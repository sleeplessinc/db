
const { j2o, log } = require( "sleepless" );

function connect( opts, okay, fail ) {

    const po
    

    const db = {};

    db.end = function() {
        cnx.end();
        cnx = null;
    }

    db.query = function( sql, args, okay, fail ) {
        cnx.query( sql, args, ( err, res ) => {
            if( err ) {
                if( fail ) {
                    fail( err );
                } else {
                    throw err;
                }
            } else {
                if( okay ) {
                    okay( res );
                }
            }
        });
        return db;
    };

    db.get_recs = function( sql, args, okay, fail ) {
        return db.query( sql, args, ( rows ) => {
            okay( rows );
        }, fail);
    }

    db.get_one_rec = function( sql, args, okay, fail ) {
        return db.get_recs( sql, args, ( rows ) => {
            okay( rows[ 0 ] );
        }, fail);
    }
    db.get_one = db.get_one_rec;

    db.update = function(sql, args, okay, fail) {
        return db.query( sql, args, res => {
            okay( res.affectedRows );
        }, fail);
    }

    db.insert_obj = function(obj, table, okay, fail) {
        throw new Error( "Do not use db.insert with objects ... it's broken" );
        let sql = "select distinct(column_name) as column_name, data_type as data_type from information_schema.columns where table_schema = ? and table_name = ?";
        return db.query( sql, [ opts.database, table ], res => {
            let fields = [];
            let qmarks = [];
            let vals = [];

            for( let i = 0 ; i < res.length ; i++ ) {
                let c = res[ i ].column_name;
                val = obj[ c ];
                if( val !== undefined ) {
                    fields.push( "`" + c + "`" );
                    qmarks.push( "?" );
                    let v = obj[ c ];
                    if( res[ i ].data_type == "timestamp" && typeof v == "number" ) {
                        v = ts2my( v );
                    }
                    else
                    if( typeof v === "object" ) {
                        v = o2j( v );
                    }
                    vals.push( v );
                }
            }

            let sql = "insert into " + table + " (" + fields.join( "," ) + ") values (" + qmarks.join( "," ) + ")";
            db.insert( sql, vals, okay, fail );
        }, fail);
    }

    db.insert = function(sql, args, okay, fail) {
        if( typeof sql === "object" && typeof args === "string" ) {
            return db.insert_obj( sql, args, okay, fail );
        }
        return db.query( sql, args, res => {
            okay( res.insertId );
        }, fail );
    }

    db.delete = function( sql, args, okay, fail ) {
        return db.query( sql, args, res => {
            okay( res.affectedRows );
        }, fail );
    }

    okay( db );

};

module.exports = { connect };

