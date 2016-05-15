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
var Map = require("collections/map");
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
    var longitude = -73.815129;
    var latitude = 40.9769753;
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
    var hours = [1441177200000,1441177260000,1441177320000,1441177380000,1441177440000,1441177500000,1441177560000,1441177620000,1441177680000,1441177740000,1441177800000,1441177860000,1441177920000,1441177980000,1441178040000,1441178100000,1441178160000,1441178220000,1441178280000,1441178340000,1441178400000,1441178460000,1441178520000,1441178580000];
    var set = new Set([]);
    for (i = 0; i < hours.length; i++) {
        var d = new Date(hours[i]);
        var n = month[d.getMonth()];
        set.add(n);
    }
    var stream = CombinedStream.create();

    set.forEach(function(item, item2) {
        stream.append(fs.createReadStream('/Users/jonathankumamoto/hackathon/CoveApp/public/csv/mobile_signal_info/mobile_signal_info_all_' + item + '.csv'));
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
                    console.log(data);
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
            });
            req.ids = ids.toArray();
            req.hours = hours;
            runIt22(req);
        });
}

function runIt2(req){
    var map = {};
    var stream = CombinedStream.create();
    var dates = new Set([]);
    var list = req.ids;
    //for (var u = 0; u < dates.length; u++)
    //{
        stream.append(fs.createReadStream('/Users/jonathankumamoto/hackathon/CoveApp/public/csv/app_usage_events/app_usage_events_' + '2015_09_02' + '.csv'));
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

function runIt21(req){
    var map = {};
    var stream = CombinedStream.create();
    var dates = new Set([]);
    var list = req.ids;
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
                new Date('2015-09-02 19:25:34').getTime();
                var run = 0;
                for (var u = 0; u < req.hours.length; u++){
                    run += interval(new Date(data.start_date), new Date(data.end_date), req.hours[u], req.hours[u] + 3599400);
                }
                map[data.device_id] += run;
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

function runIt22(req){
    var map = {};
    var dates = new Set();
    var stream = CombinedStream.create();
    var apps = new Set(["air.WatchESPN","com.abclocal.wpvi.news","com.airbnb.android","Com.amazon.fv","Com.amazon.kindle","Com.amazon.mp3","com.amazon.mShop.android","com.amazon.mShop.android.shopping","com.amazon.venezia","Com.amctv.mobile","Com.andrewshu.android.reddit","Com.bestbuy.android","Com.cbs.sportsapp.android.mich","com.chess","Com.clearchannel.iheartradio.controller","com.cnn.mobile.android.phone","com.devhd.feedly","com.disney.mdx.wdw.google","Com.dominospizza","Com.ebay.mobile","Com.espn.radio","Com.espn.score_center","Com.espn.streakforcash","Com.etsy.android","Com.facebook.katana","com.facebook.pages.app","com.fandango","com.foursquare.robin","com.glu.baseball15","Com.google.android.apps.magazines","Com.google.android.youtube","Com.gotv.nflgamecenter.us.lite","Com.groupon","com.HBO","Com.icenta.sudoku.ui","Com.instagram.android","com.joelapenna.foursquared","com.king.candycrushsaga","com.king.farmheroessaga","Com.lumoslabs.lumosity","com.miniclip.eightballpool","com.mobitv.client.tmobiletvhd","com.myfitnesspal.android","com.newegg.app","Com.nfl.now","com.platypus.mp3download.freemusic","com.playstudios.myvegas.blackjack","com.rovio.angrybirds","com.sec.android.app.videoplayer","Com.sec.android.daemonapp.ap.yahoostock.stockclock","com.sec.chaton","com.shazam.android","com.skava.toysrus.babiesrusUS","Com.skgames.trafficracer","com.slashpadmobile.crossword","Com.snapchat.android","com.spacegame.solitaire1","com.SpaceInch.DiscoBees","com.supercell.boombeach","Com.supercell.clashofclans","com.target.socsav","Com.ticketmaster.mobile.android.na","com.tinder","com.tour.pgatour","Com.tripadvisor.tripadvisor","Com.tumblr","Com.twitter.android","com.unicell.pagoandroid","Com.walmart.android","com.whatsapp","Com.withbuddies.yahtzee","Com.yahoo.mobile.client.android.fantasyfootball","com.yodo1.crossyroad","com.zyga.words","com.zynga.wwf2.free","flipboard.app","it.junglestudios.splashyfish","Javax.microedition.gba.android","net.flixster.android","Tv.peel.samsung.app","uk.co.aifactory.backgammonfree"]);
    var list = req.ids;
    var mp = new Map({});
    //for (var u = 0; u < dates.length; u++)
    //{
    stream.append(fs.createReadStream('/Users/kaylab/Pictures/app/public/csv/app_usage_events/app_usage_events_' + '2015_09_02' + '.csv'));
    //}
    for (var u = 0; u < list.length; u++)
    {
        map[list[u]] = Number(0);
    }
    for (var u = 0; u < req.hours.length; u++)
    {
        mp.set(req.hours[u], new Set({}));
    }
    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){

            if(Number(data.device_id) > Number(list[-1])){

            }
            else if(data.type == "5" && list.indexOf(data.device_id) != -1 && apps.has(data.package_name)){
                console.log(data);
                new Date('2015-09-02 19:25:34').getTime();
                var run = 0;
                for (var u = 0; u < req.hours.length; u++){
                    var j = interval(new Date(data.start_date), new Date(data.end_date), req.hours[u], req.hours[u] + 3599400);
                    run += j;
                    if(j != 0){
                        var st = mp.get(req.hours[u]);
                        st.add(data.device_id);
                        mp.set(req.hours[u], st);
                    }
                }
                map[data.device_id] += run;
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
            for (var u = 0; u < req.hours.length; u++)
            {
                mp.set(req.hours[u], mp.get(req.hours[u]).toArray());
            }
            average = Math.round(total / list.length);
            console.log(total);
            console.log(average);
            console.log(map);
            console.log(mp.toArray());
            mp.forEach(function(item, item2) {
                console.log(item);
                console.log(item2);
            });
            var result = {};
            var histogram = {};
            mp.forEach(function(item, item2) {
                histogram[item1] = item2.length
            });
            result["total"] = total;
            result["average"] = average;
            result["map"] = map;
            result["histogram"] = histogram;
            result["lists"] = ;
        });
}

function runIt23(req){
    var map = {};
    var dates = new Set();
    var stream = CombinedStream.create();
    var apps = new Set([req.package]);
    var list = req.ids;
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
            else if(data.type == "5" && list.indexOf(data.device_id) != -1 && apps.has(data.package_name)){
                new Date('2015-09-02 19:25:34').getTime();
                var run = 0;
                for (var u = 0; u < req.hours.length; u++){
                    run += interval(new Date(data.start_date), new Date(data.end_date), req.hours[u], req.hours[u] + 3599400);
                }
                map[data.device_id] += run;
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

function interval(as, ae, bs, be){
    if(as < bs && ae < be && bs < ae) return ae - bs;
    if(as < bs && be < ae && bs < be) return be - bs;
    if(bs < as && ae < be && as < ae) return ae - as;
    if(bs < as && be < ae && as < be) return be - as;
    return 0;
}

module.exports = router;



