function timeSeriesChart(){
  var margin = {top: 30, right: 70, bottom: 50, left: 50},
      width = 700 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

  // Parse the date / time
  // Date,Weight
  // 8/24/16,226
  // 8/25/16,0
  var parseDate = d3.time.format("%m/%d/%y").parse;

  // set the ranges
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

      d3.select("#mytext2")
      .append("p").text("The graph above clearly shows my struggle to juggle work, family, UC Berkeley and personal health.")
      .append("p").text("Specifically in the last 3 months (overlapping with the last term's final projects), my weight \
                          steadily increased from 225 lbs. to 234 lbs.");


  function my(){
        // generate a chart here
  }

  // function for overriding width value
  my.width = function(value){
    if (!arguments.length) return width;
    width = value;
    return my;
  }

  // function for overriding height value
  my.height = function(value){
    if (!arguments.length) return height;
    height = value;
    return my;
  }

  return my;

}

