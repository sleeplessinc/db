
/*
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
*/

var fs = require("fs"),
	util = require("util"),
	insp = function(){},
	log = function(){}


var load = function(f) {
	var self = this
	f = f || self.file
	self.__proto__.file = f
	try {
		var ds = JSON.parse(fs.readFileSync(f))
	}
	catch(e) {
		self.clear()
	} 
	finally {
		for(k in ds) 
			self[k] = ds[k]
		log(self.file+" LOAD:\n"+insp(self))
	}
}

var save = function(f) {
	var self = this
	f = f || self.file
	self.__proto__.file = f
	try {
		fs.writeFileSync(f, JSON.stringify(self))
	}
	catch(e) {
	}
	finally {
		log(self.file+" SAVE:\n"+insp(self))
	}
}

var clear = function() {
	var self = this
	for(k in self) 
		delete self[k]
	log(self.file+" CLEAR:\n"+insp(self))
}

var LS = { load:load, save:save, clear:clear }

var F = function(file, opts) {
	var self = this
	self.file = file
	self.opts = opts || {}
}
F.prototype = LS


var D = function(f, opts) {
	var self = this
	self.__proto__ = new F("ds.json", opts)
	self.load(f)
	if(self.opts.autoSave > 0) {
		setInterval(function() {
			self.save()
		}, self.opts.autoSave * 1000)
	}
	if(self.opts.debug) {
		log = console.log
		insp = util.inspect
	}
	log(self.file+" NEW:\n"+insp(self))
}
D.prototype = new F()


exports.DS = D

// -----------------------------------------------



