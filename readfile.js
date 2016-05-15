/**
 * Created by jonathankumamoto on 5/14/16.
 */

//5:46
var stream = fs.createReadStream("/public/app_usage_events_2015_11_01.csv");

console.log("HELLO");

var csvStream = csv()
    .on("data", function(data){
        console.log(data);
    })
    .on("end", function(){
        console.log("done");
    });

stream.pipe(csvStream);

//or

var csvStream = csv
    .parse()
    .on("data", function(data){
        console.log(data);
    })
    .on("end", function(){
        console.log("done");
    });

stream.pipe(csvStream);


//test
