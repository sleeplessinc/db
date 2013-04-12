
//var mongodb = require("mongodb")
//var redis = require("redis")
var aws = require("aws-sdk")

var log = require("log5").mkLog("db:")
log(5)


var dirty = false;

var DS = require("ds").DS
var ds = new DS()

function set(cb, k, v) {

	if( !k ) {
		cb( { error : "Bad key "+k } )
		return
	}

	if(v === undefined)
		v = null

	dirty = true
	ds[k] = v

	cb(null)
}
function get(cb, k) {
	var v = ds[k] || null
	cb( v )
}

function del(cb, k) {
	delete ds[k]
	dirty = true;
	cb(null)
}

var api = {
	 set: set,
	 get: get,
	 del: del,
}

var rpc = require("rpc")
rpc.createServer(api).listen(12345)
rpc.log(5)

setInterval(function tick() {
	if(dirty) {
		log(5, "((ds saving))")
		ds.save();
		dirty = false;
	}
}, 5*1000)


