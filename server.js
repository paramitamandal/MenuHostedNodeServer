//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express(); 
const fs = require('fs');
const path = require('path');
const util = require('util');

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(express.static(__dirname + 'videos/'));

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
const pool = new sql.ConnectionPool({
    user: 'sa',
    password: 'Abcd1234',
    server: 'localhost',
    database: 'SambaPOS4',
//     options: {
//       encrypt: true   // use this for Azure databases
// }
  }
);

//Function to connect to database and execute query
var  executeQuery = function(res, query){             
    var conn = pool;

    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.query(query).then(function (recordset) {
            console.log(recordset);
            conn.close();
            res.send(recordset);
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
    .catch(function (err) {
        console.log(err);
    });
}

//GET API
app.get("/api/getRecords", function(req , res){
                var query = "select Id, GroupCode, Name from dbo.MenuItems";
                executeQuery (res, query);
});


//GET API
app.get("/api/getVideo", function(req , res){
    var id = req.param('id');
    // var query = "select videoPath from dbo.MenuItems where id = '" + id + "'";
    var query = "select Name from dbo.MenuItems where dbo.MenuItems.id = '" + id + "'";

    var conn = pool;
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.query(query).then(function (recordset) {
            console.log(recordset);
            conn.close();

            // var videoFile;
            // fs.readFile(path.resolve(__dirname,"1.mp4"), function (err, data) {
            //     if (err) {
            //         throw err;
            //     }
            //     videoFile = data;
            // });

            // var range = req.headers.range;
            // var positions = range.replace(/bytes=/, "").split("-");
            // var start = parseInt(positions[0], 10);
            // var end = partialend ? parseInt(partialend, 10) : total - 1;
            // var chunksize = (end-start)+1;
            // var total = videoFile.length;
            // console.log(total);

            // res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
            //                         "Accept-Ranges": "bytes",
            //                         "Content-Length": chunksize,
            //                         "Content-Type":"video/mp4"});
            // res.end(videoFile.slice(start, end+1), "binary");
            
            var path = 'videos/1.mp4';
            var stat = fs.statSync(path);
            var total = stat.size;
            // if (req.headers['range']) {
            //   var range = req.headers.range;
            //   var parts = range.replace(/bytes=/, "").split("-");
            //   var partialstart = parts[0];
            //   var partialend = parts[1];
          
            //   var start = parseInt(partialstart, 10);
            //   var end = partialend ? parseInt(partialend, 10) : total-1;
            //   var chunksize = (end-start)+1;
            //   console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
          
            //   var file = fs.createReadStream(path, {start: start, end: end});
            //   res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
            //   file.pipe(res);
            // } else {
              console.log('ALL: ' + total);
              res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
              fs.createReadStream(path).pipe(res);
            // }


        })
        .catch(function (err) {
            console.log(err);
            conn.close();
        });
    })
    .catch(function (err) {
        console.log(err);
    });
});


// //POST API
//  app.post("/api/user", function(req , res){
//                 var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password)";
//                 executeQuery (res, query);
// });

// //PUT API
//  app.put("/api/user/:id", function(req , res){
//                 var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//                 executeQuery (res, query);
// });

// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });