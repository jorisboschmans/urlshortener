var mongo = require("mongodb").MongoClient;
var app = require("express")();

function codeExists(code){
	mongo.connect("mongodb://127.0.0.1:27017/shorturl", function(err, db){
		if (err) throw err;
		db.collection("url").find({
			code: code
		}).toArray(function(err, docs){
			if (err) throw err;
			if (docs.length > 0)
				return true;
			else return false;
		});
	});
}

function getRandomNumber(){
	return (Math.floor(Math.random() * 10) * 1000)
		+ (Math.floor(Math.random() * 10) * 100)
		+ (Math.floor(Math.random() * 10) * 10)
		+ (Math.floor(Math.random() * 10));
}

app.get(/^\/new\/http:\/\/.*/, function(req, res){
	var link = req.params.link;
	if (false) // wrong format
	{
		res.end(JSON.stringify({
			error: "Your url is not in the correct format. Please make sure that the link and protocol are correct."
		}));
	} else {
		res.end("worked");
		/*
		var code = 0;
		while(true){
			code = getRandomNumber();
			if (!codeExists(code)) break;
		}
		mongo.connect("mongodb://127.0.0.1:27017/shorturl", function(err, db){
			if (err) throw err;
			db.collection("url").insert({
				code: code,
				url: link
			}, function(err, data){
				if (err) throw err;
				res.end(JSON.stringify({
					original_url: link,
					short_url: "http://127.0.0.1:3000/" + code.toString()
				}));
			});
		});*/
	}
});

app.get("/:code", function(req, res){
	var code = +req.params.code;
	mongo.connect("mongodb://127.0.0.1:27017/shorturl", function(err, db){
		if (err) throw err;
		db.collection("url").find({
			code: code
		}).toArray(function(err, docs){
			if (err) throw err;
			if (docs.length === 0){
				res.end("Doesn't exist");
			} else {
				res.end(docs[0].url);
			}
		});
	});
});

app.listen(3000, function(){
	console.log("Listening on port 3000...");
});
