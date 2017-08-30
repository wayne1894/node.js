const express = require('express')
const app = express()

app.get('/', function (request, response) {
  response.send("testff")
})

app.listen(3000,function(){
	console.log("ttt2vvv")
})