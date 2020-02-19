
# DB

This module sponsored by Sleepless Inc. / sleepless.com

Intention is to practical, common interface for the
"least common denominator" functions of most common document based
data stores.

To support:

	AWS DynamoDB
	Google FireBase
	MongoDB
	MySQL/MariaDB
	JSON
	Filesystem
	FreeKey


## Interfaces

	authenticate( user, pass, callback() )

	create( data, callback( new_record_id ) )

	find( criteria, callback( records_matched[] )  )

	update( criteria, data, callback( num_updated ) )

	delete( criteria, callback( num_deleted ) )


## Example:

	db.authenticate( "joe", "foo", function( error, dbss ) {
		dbss.create( {name:"bob"}, function( error ) {
			dbss.find( { name: /^bob/ }, function( error, records ) {
				records.forEach( function( rec ) {
					print( rec.name )	// "barbara", "bob", "bosworth", etc.
					if( rec.name == "bob" ) {
						rec.name = "robert"
						dbss.update( {id:rec.id}, rec, function( error ) {
							dbss.delete( {id:rec.id}, function( error ) {
								print( "robert rec deleted" )
							})
						})
					}
				})
			})
		})
	})

