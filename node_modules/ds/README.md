
# DS (data store)

This is a simple data store intended for prototyping.
It will let you persist JS objects to disk with very little effort in JSON form.

DS is:

* Easy to install
* Easy to use
* Free!

DS is NOT:

* Secure.
* Scaleable
* Flexible.
* Featureful.

*** Do not use this in production. ***

## Install

	npm install ds

## Example

	var DS = require("ds").DS

	var ds = new DS("./ds.json")

	ds.one = 1
	ds.a = [1,2,"foo"]
	ds.o = {bar:"baz", qux:42}
	ds.save()		// data (all of it) written to ./ds.json
	ds.clear()		// all data erased

## API

	load(path)		// load JSON data from file into memory
	save(path)		// save JSON data to a file
	save()			// save JSON data to same file as last time
	clear()			// clear the in-memory data store
	

## License

	Copyright 2011 Sleepless Software Inc. All rights reserved.

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

