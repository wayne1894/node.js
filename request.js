var http = require('http');
var request = require('request');
var cheerio = require("cheerio");
var scrape = require('html-metadata');

var webshot = require('webshot');
var fs      = require('fs');



http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  try {
    var url=req.url.split("?url=")[1];
    
//    parser2_img(url,function(base64){
//       res.end("base64");
//    })
    
    parser_html(url,function(url_info){
      res.end(JSON.stringify(url_info));
    })
    
//    parser_img(url,function(base64){
//       res.end(base64);
//    })
  } catch(err) {
    res.end("error1");
  }
}).listen(3000);

function parser2_img(url,callback){
  //https://www.npmjs.com/package/pageres
  const Pageres = require('pageres');

  const pageres = new Pageres()
	.src('https://infometro.cc', ['1280x1024'])
	.dest(__dirname)
	.run()
	.then(() => callback("base64"));
}

function parser_img(url,callback){
  //https://github.com/brenden/node-webshot
  
  var options = {
  screenSize: {
    width: 1024
  , height: 768
  }
  , shotSize: {
    width: 1024/2
  , height: 768/2
  }
  };
  var renderStream = webshot('https://infometro.cc',options);

  renderStream.on('data', function(data) {
    var base64=data.toString('base64')
    callback(base64);
  });
}
function parser_html(url,callback){
  request(url, function (error,response,html) {
      var url_info = {}
      scrape(url,function(error, metadata){
        if(error){
          callback(error);
        }else{
          var url_info = {}
          if(metadata.openGraph && metadata.openGraph.description){
            url_info.description=metadata.openGraph.description;
          }else if(metadata.general){
            url_info.description=metadata.general.description;
          }

          if(metadata.openGraph && metadata.openGraph.title){
            url_info.title=metadata.openGraph.title;
          }else if(metadata.general){
            url_info.title=metadata.general.title;
          }
          
          
          callback(url_info)
        }
      })
  });
}



function print(a){
  console.log(a)
}