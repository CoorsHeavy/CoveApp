var express = require('express');
var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');
var csv = require("fast-csv");
var Set = require("collections/set");
var CombinedStream = require('combined-stream');
var geolib = require('geolib');
var mkdirp = require('mkdirp');
var router = express.Router();
console.log("hi");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query1', function(req, res, next) {
    req.start = Date.now();
    console.log(req.start);
    runIt(req);

});


//------------------------------------------------------------------------------------------------parse area and print test



function runIt(req){
    var dir = '/Users/kaylab/Pictures/app/tmp/'+req.start+'/';
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    var longitude = '-73.815129';
    var latitude = '40.9769753';
    var package = req.query.package;
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    //var radius = req.query.radius;
    var radius = 60000;
    var month = new Array();
    month[0] = "january";
    month[1] = "february";
    month[2] = "march";
    month[3] = "april";
    month[4] = "may";
    month[5] = "june";
    month[6] = "july";
    month[7] = "august";
    month[8] = "september";
    month[9] = "october";
    month[10] = "november";
    month[11] = "december";
    var hours = [1441090800000,1441090860000,1441090920000,1441090980000,1441091040000,1441091100000,1441091160000,1441091220000,1441091280000,1441091340000,1441091400000,1441091460000,1441091520000,1441091580000,1441091640000,1441091700000,1441091760000,1441091820000,1441091880000,1441091940000,1441092000000,1441092060000,1441092120000,1441092180000];
    var set = new Set([]);
    for (i = 0; i < hours.length; i++) {
        var d = new Date(hours[i]);
        var n = month[d.getMonth()];
        set.add(n);
    }
    var stream = CombinedStream.create();

    set.forEach(function(item, item2) {
        stream.append(fs.createReadStream('/Users/kaylab/Pictures/app/public/csv/mobile_signal_info/mobile_signal_info_all_' + item + '.csv'));
    });
    var ids = new Set([]);
    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){
            //console.log(data);

            if(!ids.has(data.device_id)) {
                var interesting = true;
                //is device interesting algorithm
                if(geolib.getDistance({latitude: Number(latitude), longitude: Number(longitude)},
                        {latitude: Number(data.latitude), longitude: Number(data.longitude)}) > radius)interesting = false;
                //end is device interesting algorithm
                if (interesting == true) {
                    ids.add(data.device_id);
                }
            }
        })
        .on("end", function(){
            var dir = '/Users/kaylab/Pictures/app/tmp/'+req.start+'/';
            mkdirp(dir, function(err) {
                // path exists unless there was an error

            });
            fs.appendFile(dir + 'device_ids.csv', ids, function (err,data) {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
            });
            req.hudson.ids = ids;
            req.hudson.hours = hours;
        });
}

function runIt2(req){
    var map = {};
    var stream = CombinedStream.create();
    var dates = new Set([]);
    // for (var u = 0; u < req.hudson.hours.length; u++)
    // {
    //     var str = "";
    //     var d = new Date(hours[u]);
    //     var year = d.getFullYear();
    //     var month = d.getMonth();
    //     var n = date.format("YYYY_MM_dd");
    // }
    //for (var u = 0; u < dates.length; u++)
    //{
        stream.append(fs.createReadStream('/Users/kaylab/Pictures/app/public/csv/app_usage_events/app_usage_events_' + '2015_09_02' + '.csv'));
    //}
    for (var u = 0; u < list.length; u++)
    {
        map[list[u]] = Number(0);
    }
    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){
            if(Number(data.device_id) > Number(list[-1])){

            }
            else if(data.type == "5" && list.indexOf(data.device_id) != -1){
                map[data.device_id] += Number(data.run_time);
                console.log(map);
            }

        })
        .on("end", function(){
            console.log("done");
            var total = 0;
            for (var u = 0; u < list.length; u++)
            {
                map[list[u]] /= (1000 * 60);
                map[list[u]] = Math.round(map[list[u]]);
                total += map[list[u]];
            }
            average = Math.round(total / list.length);
            console.log(total);
            console.log(average);
            console.log(map);
        });
}

module.exports = router;



