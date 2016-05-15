var express = require('express');
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

    res.send(req.query.package);
});

module.exports = router;
