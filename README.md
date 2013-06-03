tincan-nodejs
=============

A thin wrapper for reading and writing data using the tincan.me API using Node.JS

Installation
------------

To install from NPM, use `npm install tincan`

Setup
-----

To use this package, you'll need a TinCan developer account (currently invite-only). Once you've got one, supply your credentials like so:

    var tincan = require("tincan");
    var exampleDB = new tincan("example", "5e6a7e38c97b", "81aca0b3a200dd52bda8bca268ee68a8");

In this case, the application is named `"example"`, the app ID is `5e6a7e38c97b`, and its key is `81aca0b3a200dd52bda8bca268ee68a8`.

Once you've done that, a request will be made asynchronously to validate your credentials with the server. If anything goes wrong, an error will be thrown.

Usage
-----

For a more in-depth description of these functions, check the official documentation at http://apps.tincan.me/

Their syntax is as follows:

- `tincan.find([query], [callback])`
- `tincan.insert(query, [callback])`
- `tincan.remove(query, [callback])`
- `tincan.update(search, query, [callback])`

All queries can be either objects or JSON-encoded strings. Callbacks follow the standard format of `(err, data)`.

Example
-------

    // Initialize the API
    var tincan = require("tincan");
    var exampleDB = new tincan("example", "5e6a7e38c97b", "81aca0b3a200dd52bda8bca268ee68a8");
    
    // Insert some data
    exampleDB.insert({name: "John Mitchell", image: "http://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50", age: 37, online: true});
    
    // Fetch all online users
    exampleDB.find({online: true}, function(err, users){
    	if(!err && users){
    		for(var i in users)
    			console.log(users[i].name);
    	}else
    		throw new Error(err);
    });
    
    // Change some data
    exampleDB.update({name: "John Mitchell"}, {$set: {online: false}});
    
    // Remove a document
    exampleDB.remove({name: "John Mitchell"});
