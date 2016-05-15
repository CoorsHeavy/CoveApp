var express = require('express');
var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');
var csv = require("fast-csv");
var router = express.Router();
console.log("hi");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query1', function(req, res, next) {
    runIt(req);
});


//------------------------------------------------------------------------------------------------parse area and print test


// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
}; //needed function

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
}; //needed function


function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
} //needed function



var csvStreamBETA = csv() // ignore this one... AN EXAMPLE which prints out things from the csv file if you need a reference.
    .on("data", function(data) {
        //~~~~~~~~~~~~This code stores all variables of a certain key for CSV
        var dataLength = data.length;
        var uniqueID_key = "";
        var lat1 = 0;
        var lng1 = 0;
        var dateTimestampString = [];
        //Years-Month-Day
        var date = [];
        //Hours:Minutes:Seconds
        var time = [];
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        if (firstChecker) { //-----------------------------------------Just remember this only happens once of the csv file
            for (var J = 0; J < dataLength; J++) {
                if (data[J] == "longitude") {
                    longCountpos = J;
                }
                if (data[J] == "latitude") {
                    latCountpos = J;
                }
                if (data[J] == "timestamp") {
                    timeCountpos = J;
                }
                if(data[J] == "device_id"){
                    uniqueID_counter = J;
                }
            }
            firstChecker = false;
        } else {
            for (var K = 0; K < dataLength; K++) {
                if (longCountpos == K) {
                    lng1 = data[K];
                }

                if (latCountpos == K) {
                    lat1 = data[K];
                }
                if (timeCountpos == K) {
                    dateTimestampString = data[K].split(' ');
                    /*
                     DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER
                     assuming the ' ' spaces the time vs date, this can be dangerous because
                     it can break the code very easily.... if there's no space or if the date and time are swapped
                     */
                    date = dateTimestampString[0].split('-');
                    time = dateTimestampString[1].split(':');
                }
                if(uniqueID_counter == K){
                    uniqueID_key = data[K];
                }

            }
        }

        moveToTime = false;
        if (distance(lat1, lng1, latPOINT, lngPOINT, "M") < 0.5) { //means less then half a mile right now

            //---check for starts
            var startInputYear = 2014; // inputted by user
            var endInputYear = 2016; //inputted by user
            var startDataYear = date[0]; //data result
            var endDataYear = date[0];   //data result

            var startInputMonth = 11; // inputted by user ex: 2015:11
            var endInputMonth = 1; //inputted by user ex: 2016:1
            var startDataMonth = date[1]; //data result
            var endDataMonth = date[1];   //data result

            var startInputDay = 25; // inputted by user ex: 2015:11:25
            var endInputDay = 1; //inputted by user ex: 2016:1:1
            var startDataDay = date[2]; //data result
            var endDataDay = date[2];   //data result

            if (startInputYear <= endDataYear || endInputYear >= startDataYear) { //there's overlap
                if (startInputMonth <= endDataMonth || endInputMonth >= startDataMonth) { //there's overlap


                    if (startInputDay <= endDataDay || endInputDay >= startDataDay) { //there's overlap
                        //this date is on the day, selected. use it

                        moveToTime = true;
                    } else {// don't include

                    }
                } else {//don't include

                }
            } else {
                //don't include
            }


        } //end of checking for overlapping dates


        if (moveToTime) { //means time to compare date

            //---check for starts
            var startInputHour = 0; // inputted by user
            var endInputHour = 24; //inputted by user
            var startDataHour = date[0]; //data result
            var endDataHour = date[0];   //data result
            if (startInputHour <= endDataHour || endInputHour >= startDataHour) { //there's overlap
                if(!(finalList.indexOf(uniqueID_key) > -1)){
                    finalList.push(uniqueID_key);
                }
            }
        } //end of checking for overlapping date

        //-----------------------------------------Keep an eye for data that gets corrupted, this happens often in parsing.
    })
    .on("end", function(){
        console.log("done");
        fs.writeFile('datastuff.csv', finalList, function (err) { //produces a pure csv file, all things are seperated by comma's
            if (err) return console.log(err);
        });
    });


//stream.pipe(csvStreamBETA);

///----------------------------------------------------------------------------------------------------test area end

var stream = fs.createReadStream('/Users/jonathankumamoto/hackathon/CoveApp/public/csv/mobile_signal_info/mobile_signal_info_all_november.csv');
var longCountpos = 0;
var latCountpos = 0;
var timeCountpos= 0;
var uniqueID_counter = 0;
var firstChecker = true;
var latPOINT=41.0460643; //***ASSIGN***
var lngPOINT=-73.8044991; //***ASSIGN***
var finalList = [];

function runIt(req){

    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    var package = req.query.package;
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    ////////------------------------------------------------------Start parsing
    var csvStream = csv()
        .on("data", function(data) {
            //~~~~~~~~~~~~This code stores all variables of a certain key for CSV
            var dataLength = data.length;
            var uniqueID_key = "";
            var lat1 = 0;
            var lng1 = 0;
            var dateTimestampString = [];
            //Years-Month-Day
            var date = [];
            //Hours:Minutes:Seconds
            var time = [];
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            if (firstChecker) { //-----------------------------------------Just remember this only happens once of the csv file
                for (var J = 0; J < dataLength; J++) {
                    if (data[J] == "longitude") {
                        longCountpos = J;
                    }
                    if (data[J] == "latitude") {
                        latCountpos = J;
                    }
                    if (data[J] == "timestamp") {
                        timeCountpos = J;
                    }
                    if(data[J] == "device_id"){
                        uniqueID_counter = J;
                    }
                }
                firstChecker = false;
            } else {
                for (var K = 0; K < dataLength; K++) {
                    if (longCountpos == K) {
                        lng1 = data[K];
                    }

                    if (latCountpos == K) {
                        lat1 = data[K];
                    }
                    if (timeCountpos == K) {
                        dateTimestampString = data[K].split(' ');
                        /*
                         DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER DANGER
                         assuming the ' ' spaces the time vs date, this can be dangerous because
                         it can break the code very easily.... if there's no space or if the date and time are swapped
                         */
                        date = dateTimestampString[0].split('-');
                        time = dateTimestampString[1].split(':');
                    }
                    if(uniqueID_counter == K){
                        uniqueID_key = data[K];
                    }

                }
            }

            moveToTime = false;
            if (distance(lat1, lng1, latPOINT, lngPOINT, "M") < 0.5) { //means less then half a mile right now

                //---check for starts
                var startInputYear = 2014; // inputted by user ***ASSIGN***
                var endInputYear = 2016; //inputted by user ***ASSIGN***
                var startDataYear = date[0]; //data result
                var endDataYear = date[0];   //data result

                var startInputMonth = 11; // inputted by user ex: 2015:11 ***ASSIGN***
                var endInputMonth = 1; //inputted by user ex: 2016:1 ***ASSIGN***
                var startDataMonth = date[1]; //data result
                var endDataMonth = date[1];   //data result

                var startInputDay = 25; // inputted by user ex: 2015:11:25 ***ASSIGN***
                var endInputDay = 1; //inputted by user ex: 2016:1:1 ***ASSIGN***
                var startDataDay = date[2]; //data result
                var endDataDay = date[2];   //data result

                if (startInputYear <= endDataYear || endInputYear >= startDataYear) { //there's overlap
                    if (startInputMonth <= endDataMonth || endInputMonth >= startDataMonth) { //there's overlap


                        if (startInputDay <= endDataDay || endInputDay >= startDataDay) { //there's overlap
                            //this date is on the day, selected. use it

                            moveToTime = true;
                        } else {// don't include

                        }
                    } else {//don't include

                    }
                } else {
                    //don't include
                }


            } //end of checking for overlapping dates


            if (moveToTime) { //means time to compare date

                //---check for starts
                var startInputHour = 0; // inputted by user
                var endInputHour = 24; //inputted by user
                var startDataHour = date[0]; //data result
                var endDataHour = date[0];   //data result
                if (startInputHour <= endDataHour || endInputHour >= startDataHour) { //there's overlap
                    if(!(finalList.indexOf(uniqueID_key) > -1)){
                        finalList.push(uniqueID_key);
                    }
                }
            } //end of checking for overlapping date

            //-----------------------------------------Keep an eye for data that gets corrupted, this happens often in parsing.
        })
        .on("end", function(){
            console.log("done");
            fs.writeFile('datastuff.csv', finalList, function (err) { //produces a pure csv file, all things are seperated by comma's. IT WORKS.
                if (err) return console.log(err);
            });
        });

    res.send(req.query.package);

    /*
     Keynote: This data parser is almost a 'hard-coded' style of parser in terms of parsing query requests
     For future, change it to handle general CSV files without getting into trouble.
     */
}

module.exports = router;



