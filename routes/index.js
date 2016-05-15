var express = require('express');
var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');
var csv = require("fast-csv");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query1', function(req, res, next) {
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    var package = req.query.package;
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    var go = true;
    var stream = fs.createReadStream('/Users/kaylab/Pictures/app/public/csv/wifi_info/wifi_info_all_november.csv');
    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){
            if(go)
            console.log(data);
            go = false;
        })
        .on("end", function(){
            console.log("done");
        });
    res.send(req.query.package);
});

module.exports = router;
