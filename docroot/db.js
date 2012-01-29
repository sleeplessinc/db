

db = {}

db.set = function(k, v, cb) {
	RPC.send([
		{ cmd : "set", key : k, value : v },
	] , function(response) {
		alert(JSON.stringify(response))
	})
}

db.get = function(k, cb) {
	RPC.send([
		{ cmd : "get", key : k },
	] , function(response) {
		alert(JSON.stringify(response))
	})
}

db.del = function(k, cb) {
	RPC.send([
		{ cmd : "del", key : k },
	] , function(response) {
		alert(JSON.stringify(response))
	})
}

