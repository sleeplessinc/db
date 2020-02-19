
# DB

Copyright 2020 Sleepless Software Inc. All Rights Reserved


# About

A practical, common interface for talking to most common databases.

To support:

	AWS DynamoDB
	Google FireBase
	MongoDB
	FreeKey
	DS (file-system based JSON)


## Interfaces

The form of criteria and matching records may vary depending on the database used.

	connect( options, callback() )

	insert( data, callback( new_record_id ) )

	select( criteria, callback( records_matched[] )  )

	update( criteria, data, callback( num_updated ) )

	remove( criteria, callback( num_removed ) )


## Example:

	require( "db" ).mysql.connect( { username: "joe", password: "foo" }, function( error, db ) {
		db.insert( {name:"bob"}, function( error, insert_id ) {
			db.select( { name: /^[Bb]/ }, function( error, records ) {
				records.forEach( function( rec ) {
					console.log( rec.name )	// "barbara", "bobby", "blaine", etc.
					if( rec.name == "bob" ) {
						rec.name = "robert"
						db.update( {id:rec.id}, rec, function( error ) {
							db.remove( {id:rec.id}, function( error ) {
								console.log( "robert rec remove" )
							})
						})
					}
				})
			})
		})
	})

