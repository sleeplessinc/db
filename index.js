
//var mongodb = require("mongodb")
//var redis = require("redis")
var log = require("log5").mkLog("db:")
log(5)


var dirty = false;

var ds = new require("ds").DS()

function set(cb, k, v, ttl) {
	ttl = ttl || 0
	ds[k] = v
	dirty = true
	cb( null )
}
function get(cb, k) {
	var v = ds[k]
	cb( ds[k] );
}

function del(cb, k) {
	delete ds[k]
	dirty = true;
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
		ds.save();
		dirty = false;
	}
}, 5*1000)




