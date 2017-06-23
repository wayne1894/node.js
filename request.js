var request = require("request");
var cheerio = require("cheerio");
var http = require("http");


http.createServer(function(req,res){
	res.writeHead(200 ,{'Content-Type' : 'application/json;charset=utf-8'});
		var url=req.url.split("/?url=")[1];
		parser_html(url,function(url_info){
			res.end(JSON.stringify(url_info));
		})
}).listen(3000);


function parser_html(url,callback){
	request(url, function (error, response, html) {
		$ = cheerio.load(html);

		var url_info = {};
		var metas = $("meta");
		for (var i = 0; i < metas.length; i++) {
			if (metas.eq(i).attr("name") == "description") {
				url_info.description = metas.eq(i).attr("content");
			} else if (metas.eq(i).attr("property") == "og:description") {
				url_info.og_description = metas.eq(i).attr("content");
			} else if (metas.eq(i).attr("property") == "og:image") {
				url_info.og_image = metas.eq(i).attr("content").split(",")[0];
			} else if (metas.eq(i).attr("property") == "og:title") {
				url_info.og_title = metas.eq(i).attr("content");
			}
		}

		if (url_info.og_image == undefined) { //取fb images
			if (html.indexOf("og:image") > -1) {
				var og_html = html.split("og:image")[1].split(">")[0];
				og_html = og_html.replace(/\'/gi, "\"");
				og_html = og_html.split("content=\"")[1].split('"')[0];
				url_info.og_image = og_html;
			}
		}

		if (url_info.og_description == undefined) {
			if (html.indexOf("og:description") > -1) {
				var og_html = html.split("og:description")[1].split(">")[0];
				og_html = og_html.replace(/\'/gi, "\"");
				og_html = og_html.split("content=\"")[1].split('"')[0]
				url_info.og_description = og_html;
			}
		}

		if (url_info.og_title == undefined) {
			if (html.indexOf("og:title") > -1) {
				var og_html = html.split("og:title")[1].split(">")[0];
				og_html = og_html.replace(/\'/gi, "\"");
				og_html = og_html.split("content=\"")[1].split('"')[0]
				url_info.og_title = og_html;
			}
		}

		if (url_info.og_title) {
			url_info.title = url_info.og_title;
		} else {
			url_info.title = $("title").html()
			if (url_info.title == undefined) url_info.title = "";
		}
		if (url_info.og_description) {
			url_info.description = url_info.og_description;
		}
		if (url_info.og_image) {
			url_info.image = url_info.og_image;
		}

		delete url_info.og_title
		delete url_info.og_description
		delete url_info.og_image

		url_info.url = url; //這個url代表是連結的url
		url_info.url_parent = url.split("://")[1].split("/")[0];

		//判斷是不是youtube
		if (url.indexOf(".youtube.") > -1) {
			url_info.youtube = url.split("?v=")[1].split("&")[0];
		} else if (url.indexOf("youtu.be/") > -1) {
			url_info.youtube = url.split("be/")[1];
		}
		callback(url_info)		
	});	
}
