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

let sleepless = require( "sleepless" );

let m = {};

m.connect = function( opts ) {

	let cnx = m._cnx;	// look for an already created pool
	if( ! cnx ) {		// if not present ... 
		cnx = require( "mysql" ).createPool( opts );	// create one
		m._cnx = cnx;	// and store it for future calls into this function
	}

	let db = {};

	db.query = function( sql, args, cb ) {
		cnx.query( sql, args, ( err, rs ) => {
			if( err && opts.cb_err ) { opts.cb_err( err ); }	// XXX DEPRECATE this
			cb( err, rs );
		});
		return db;
	};

	db.end = function() {
		cnx.end();
	}

	db.get_recs = function( sql, args, cb ) {
		return db.query( sql, args, ( err, rows ) => {
			cb( err, err ? [] : rows );
		});
	}

	db.get_one_rec = function( sql, args, cb ) {
		return db.get_recs( sql, args, ( err, rows ) => {
			cb( err, rows[ 0 ] );
		});
	}
	db.get_one = db.get_one_rec;

	db.update = function(sql, args, cb) {
		return db.query( sql, args, ( err, res ) => {
			cb( err, err ? 0 : res.affectedRows, res );
		});
	}

	db.insert_obj = function(obj, table, cb) {
		let sql = "select distinct(column_name), data_type from information_schema.columns where table_schema = ? and table_name = ?";
		return db.query( sql, [ opts.database, table ], ( err, res ) => {
			if( err ) {
				cb( err, null );
				return;
			}

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
			db.insert( sql, vals, cb );
		});
	}

	db.insert = function(sql, args, cb) {
		if( typeof sql === "object" && typeof args === "string" ) {
			return db.insert_obj( sql, args, cb );
		}
		return db.query( sql, args, ( err, res ) => {
			cb( err, err ? null : res.insertId, res );
		});
	}

	db.delete = function( sql, args, cb ) {
		return db.query( sql, args, ( err, res ) => {
			cb( err, err ? null : res.affectedRows, res );
		});
	}

	db.start = function( cb ) {
		return db.query( "start transaction", [], cb );
	}

	db.commit = function( cb ) {
		return db.query( "commit", [], cb );
	}

	db.rollback = function( cb ) {
		return db.query("rollback", [], cb);
	}

	return db;
};

module.exports = m;


