


// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 70, bottom: 50, left: 50},
    width = 700 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;


// Parse the date / time
// Date,Weight
// 8/24/16,226
// 8/25/16,0
var parseDate = d3.time.format("%m/%d/%y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .ticks(d3.time.months) // .ticks(10)
    .tickFormat(d3.time.format("%b"));

    //.ticks(d3.time.months);
    // .tickSize(16, 0)

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Weight); });

var header = d3.select("#header")
    .append("h1")
    .text(" My \"healthy\" year at MIDS");

    d3.select("#mytext")
    .append("p").text("The graph above clearly shows my struggle to juggle work, family, UC Berkeley and personal health.")
    .append("p").text("Specifically in the last 3 months (overlapping with the last term's final projects), my weight \
                        steadily increased from 225 lbs. to 234 lbs.");

// Adds the svg canvas
var svg = d3.select("#mytable")
    .append("svg:svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/weight1.csv", function(error, data) {
    // console.log(data);
    data.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Weight = +d.Weight;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    // y.domain([0, d3.max(data, function(d) { return d.Weight; })]);
    y.domain([210, 240]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // text label for the x axis
    svg.append("text")
        .attr("x", 265 )
        .attr("y", 240 )
        .style("text-anchor", "middle")
        .text("Months (2016 - 2017)");

    // text label for the y axis
    svg.append("text")
        .attr("x", -5 )
        .attr("y", -20 )
        .style("text-anchor", "middle")
        .text("Weight (lbs.)");

    // add line label
    svg.append("text")
    		.attr("transform", "translate(" + (width+3) + "," + y(data[114].Weight) + ")")
    		.attr("dy", ".35em")
    		.attr("text-anchor", "start")
    		.style("fill", "steelblue")
    		.text("My weight");

});

// Creadit: I have used the following tutorial to construct the line graph
// http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5

