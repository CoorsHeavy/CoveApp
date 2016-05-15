var express = require('express');
var fs = require('fs');
var csv = require('csv');
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


    var parser = csv.parse({delimiter: ','}, function(err, data){
        console.log(data);
    });

    fs.createReadStream('/Users/kaylab/Pictures/app/public/csv/categories_google.csv').pipe(parser);
    res.send(req.query.package);
});

module.exports = router;
