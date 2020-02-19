
sleepless = require( "sleepless" );

DS = require( "ds" ).DS;

exports.connect = function( opts, cb ) {

	let fname = opts.filename;

	let data = new DS( fname );
	if( ! data.auto_increment ) {
		data.auto_increment = 0;
		data.collections = {};
	}

	let insert = function( coll_name, obj, okay, fail ) {
		try {

			// Clone the data object
			let json = JSON.stringify( obj );	// may throw
			obj = JSON.parse( json );	

			// Grab id, make sure it's a valid integer, create a new, unique one if needed.
			let id = toInt( obj.id ) || ++data.auto_increment;
			obj.id = id;

			// Grab the collection object, creating it if needed.
			let coll = data.collections[ coll_name ];
			if( coll === undefined ) {
				coll = data.collections[ coll_name ] = {};
			}

			coll[ id ] = obj;	// Put it in the data store.

			if( fname ) {
				data.save();	// Save to disk.
			}

			okay( id );

		}
		catch( error ) {
			fail( error );
		}
	};

	let remove = function( coll_name, id, okay, fail ) {
		try {

			id = toInt( id );
			if( id === 0 ) {
				return okay( 0 );
			}

			// Grab the collection object, creating it if needed.
			let coll = data.collections[ coll_name ];
			if( coll === undefined ) {
				throw new Error( "No such collection: " + coll_name );
			}

			let affected = coll[ id ] !== undefined ? 1 : 0;
			delete coll[ id ];

			if( affected > 0 ) {
				if( fname )  {
					data.save();	// Save to disk.
				}
			}

			okay( affected );

		}
		catch( error ) {
			fail( error );
		}
	};

	let select = function( coll_name, criteria, okay, fail  ) {

		// Grab the collection object, creating it if needed.
		let coll = data.collections[ coll_name ];
		if( coll === undefined ) {
			throw new Error( "No such collection: " + coll_name );
		}

		let found = {};
		for( let id in coll ) {
			let rec = coll[ id ];
			let match = true;
			for( let k in criteria ) {
				if( ! criteria[ k ].test( rec[ k ] ) ) {
					match = false;
					break;
				}
			}
			if( match ) {
				found[ id ] = rec;
			}
		}

		okay( found );

	};

	let update = function( coll_name, obj, okay, fail ) {
		remove( coll_name, obj.id, aff => {
			insert( coll_name, obj, okay, fail );
		}, fail );
	};

	return { insert, select, update, remove, };

};

