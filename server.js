var mongo = require("mongodb").MongoClient;
var app = require("express")();
var url = "mongodb://jorisboschmans:ITrules4565@ds029635.mlab.com:29635/jorisboschmans-mydb";
var col = "shorturl";

function codeExists(code){
	mongo.connect(url, function(err, db){
		if (err) throw err;
		db.collection(col).find({
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

app.get("/new/:link(*)", function(req, res){
	var link = req.params.link;
	if (!link.match(/^https?:\/\/.+\..+/)) // wrong format
	{
		res.send(JSON.stringify({
			error: "Your url is not in the correct format. Please make sure that the link and protocol are correct."
		}));
	} else {
		var code = 0;
		while(true){
			code = getRandomNumber();
			if (!codeExists(code)) break;
		}
		mongo.connect(url, function(err, db){
			if (err) throw err;
			db.collection(col).insert({
				code: code,
				url: link
			}, function(err, data){
				if (err) throw err;
				res.send(JSON.stringify({
					original_url: link,
					short_url: "https://jorisboschmans-urlshortener.herokuapp.com/" + code.toString()
				}));
			});
		});
	}
});

app.get("/:code", function(req, res){
	var code = +req.params.code;
	mongo.connect(url, function(err, db){
		if (err) throw err;
		db.collection(col).find({
			code: code
		}).toArray(function(err, docs){
			if (err) throw err;
			if (docs.length === 0){
				res.send(JSON.stringify({
					error: "This link doesn't exist."
				}));
			} else {
				res.redirect(docs[0].url);
			}
		});
	});
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Listening...");
});
