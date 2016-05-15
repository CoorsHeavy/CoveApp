/**
 * Created by jonathankumamoto on 5/15/16.
 */

var SeptemberDataSheet1 = [];
var finalDataSheet1 = [];

console.log("hello");


d3.text("../public/csv/app_usage_events/app_usage_events_2015_09_02.csv",
    function(d){
        SeptemberDataSheet1 = d3.csv.parseRows(d);
        console.log(SeptemberDataSheet1);

        //so beginning here, the parsed rows of text turns into an array, and the collegeDataSheet1 is assigned as the array. Please pay attention to this portion of coding...

        var arrayLength = SeptemberDataSheet1.length; //getting the number of arrays in the array

        for (var J = 0; J < arrayLength; J++) { //loop through each array
            var nestedArrayLength = SeptemberDataSheet1[J].length; //getting the number of strings (variables) in the array

            //below initiates the "college" to store all number data
            var objectCollege = {
                'name': '', //name is an empty string
                'score' : 0, //score is 0 just in case a college has no score
                'average': 0
            };

            for (var K = 0; K < nestedArrayLength; K++) { //loop through each specific college
                if(K == 0){ // if its [0] its a 'name', set the name
                    objectCollege.name = SeptemberDataSheet1[J][K];
                }else{ // means its a score, add it to the 'score'
                    objectCollege.score += parseInt(SeptemberDataSheet1[J][K]);
                    objectCollege.average += 1;
                }
            }
            //nearing end of loop through a SINGLE college
            objectCollege.score = (objectCollege.score/objectCollege.average);
            finalDataSheet1.push(objectCollege);

        } //end of looping through all colleges

        console.log(finalDataSheet1); //FINAL output, set the array with all colleges and scores added up.

        //below is basic J.SVG to produce proper d3 output.
        var svg = dimple.newSvg("#BarGraph1", 600, 500);
        var chart = new dimple.chart(svg, finalDataSheet1); // You can use #K.RGB here
        chart.defaultColors = [
            new dimple.color("A0F9A0")
        ];

        chart.addCategoryAxis("x", "name");
        chart.addMeasureAxis("y", "score");
        chart.addSeries(null, dimple.plot.bar);
        chart.draw();
    });
