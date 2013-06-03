var http = require("http");

var Tincan = function(appName, appID, appKey){

	// Make sure all our inputs are correct
	if(!appName || !appID || !appKey)
		throw new Error("Application name, ID, and key are all required.");
	else if(typeof appName != "string" || typeof appID != "string" || typeof appKey != "string")
		throw new Error("Application name, ID, and key must all be strings.");
	else{
		this.appName = appName.toLowerCase();
		this.appID = appID;
		this.appKey = appKey;
	}

	this.makeRequest = function(type, data, callback){
		// Don't try sending a request unless we have credentials
		if(!this.appName || !this.appID || !this.appKey){
			if(callback)
				callback("NO_CREDENTIALS", null);
			return;
		}

		var options = {
			hostname: 'apps.tincan.me',
			port: 80,
			path: '/' + appName + '/' + type,
			auth: this.appID + ':' + this.appKey,
			method: 'POST'
		};

		var req = http.request(options, function(res){
			var data = "";
			res.setEncoding('utf8');

			res.on('data', function(chunk){
				data += chunk;
			});

			res.on('end', function(){
				try{
					var obj = JSON.parse(data);
					if(callback)
						callback(null, obj);
				}catch(e){
					console.log(data);
					if(callback)
						callback("SERVER_ERROR", null);
				}
			});
		});

		req.on('error', function(err){
			callback.call(err, null);
		});

		if(data)
			req.write(data);
		req.end();
	}

	// Check the given credentials. If they fail, throw an error and uninitialize
	this.makeRequest("authorized", null, function(err, res){
		if(!err && res){
			if(res.success !== true){
				this.appName = null;
				this.appID = null;
				this.appKey = null;

				if(res.error)
					throw new Error(res.error);
				else
					throw new Error("SERVER_ERROR");
			}
		}else
			throw new Error(err);
	});

	this.find = function(query, callback){
		if(query){
			if(typeof query == "function"){
				callback = query;
				query = null;
			}else if(typeof query != "string")
				query = JSON.stringify(query);
		}else
			query = null;

		this.makeRequest("find", query, function(err, res){
			if(!err && res){
				if(callback)
					callback(res.error, res.data);
			}else if(callback)
				callback(err, null);
		});
	}

	this.insert = function(query, callback){
		if(query){
			if(typeof query != "string")
				query = JSON.stringify(query);
		}else{
			if(callback)
				callback("NO_DATA", null);
			return;
		}

		this.makeRequest("insert", query, function(err, res){
			if(!err && res){
				if(callback)
					callback(res.error);
			}else if(callback)
				callback(err, null);
		});
	}

	this.remove = function(query, callback){
		if(query){
			if(typeof query != "string")
				query = JSON.stringify(query);
		}else{
			if(callback)
				callback("NO_DATA", null);
			return;
		}

		this.makeRequest("remove", query, function(err, res){
			if(!err && res){
				if(callback)
					callback(res.error);
			}else if(callback)
				callback(err, null);
		});
	}

	this.update = function(search, query, callback){
		if(search){
			if(typeof search != "string")
				query = JSON.stringify(query);
		}else{
			if(callback)
				callback("NO_DATA", null);
			return;
		}if(query){
			if(typeof query != "string")
				query = JSON.stringify(query);
		}else{
			if(callback)
				callback("NO_DATA", null);
			return;
		}

		// Assembling this JSON by hand should be safe, since it's already been encoded
		var queryString = "[" + search + "," + query + "]";
		this.makeRequest("update", queryString, function(err, res){
			if(!err && res){
				if(callback)
					callback(res.error);
			}else if(callback)
				callback(err, null);
		});
	}
}

module.exports = Tincan;
