

db = {}

db.set = function(k, v, cb) {
	RPC.send("set", k, v, function(response) {
		alert(JSON.stringify(response))
	})
}

db.get = function(k, cb) {
	RPC.send("get", k, function(response) {
		alert(JSON.stringify(response))
	})
}

db.del = function(k, cb) {
	RPC.send("del", k, function(response) {
		alert(JSON.stringify(response))
	})
}

