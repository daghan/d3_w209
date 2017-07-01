function timeSeriesChart(){
  var margin = {top: 30, right: 70, bottom: 50, left: 50},
      width = 700 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };
      xScale = d3.time.scale().range([0, width]),
      yScale = d3.scale.linear().range([height, 0]),
      xAxis = d3.svg.axis().scale(xScale)
        .orient("bottom")
        .ticks(d3.time.months) // .ticks(10)
        .tickFormat(d3.time.format("%b")),
      yAxis = d3.svg.axis().scale(yScale)
        .orient("left")
        .ticks(5),
      // area = d3.svg.area().x(X).y1(Y),
      line = d3.svg.line().x(X).y(Y),
      xAxisLabelTextPosition = Math.round((width - margin.left - margin.right)/2)+margin.left,
      bisectDate = d3.bisector(function(d) { return d[0]; }).right,
      zoom_in = true;
      // lineLabelYPosition = yScale(yValue(data[data.length-1]))


  function chart(selection){
    selection.each(function(data) {

      // Convert data to standard representation greedily;
     // this is needed for nondeterministic accessors.
     data = data.map(function(d, i) {
       return [xValue.call(data, d, i), yValue.call(data, d, i)];

     });

     // Update the x-scale.
     xScale
      .domain(d3.extent(data, function(d) { return d[0]; }))
      .range([0, width - margin.left - margin.right]);

     // Update the y-scale.
     yScale
      .domain([0, d3.max(data, function(d) { return d[1]; })])
      .range([height - margin.top - margin.bottom, 0]);

      // generate chart here; `d` is the data and `this` is the element
      var svg = d3.select(this).selectAll("svg").data([data]);



      // Otherwise, create the skeletal chart.
       var gEnter = svg.enter().append("svg").append("g");
       gEnter.append("path").attr("class", "line");
       gEnter.append("g").attr("class", "x axis");
       gEnter.append("g").attr("class", "y axis");
       gEnter.append("g").attr("class", "y axis");
       // gEnter.append("g").attr("class", "text xaxis label");

       // Update the outer dimensions
       svg.attr("width", width)
          .attr("height", height);

        // Update the inner dimensions.
       var g = svg.select("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       // Update the line path.
       g.select(".line")
        .attr("d", line);

      // Update the x-axis.
      g.select(".x.axis")
        .attr("transform", "translate(0," + yScale.range()[0] + ")")
        .call(xAxis);

      // Update the y-axis.
      g.select(".y.axis")
        .call(yAxis);


      // text label for the x axis
      svg.append("text")
          .attr("x", xAxisLabelTextPosition)
          .attr("y", height - 5 )
          .style("text-anchor", "middle")
          .text("Months (2016 - 2017)");

      // text label for the y axis
      svg.append("text")
          .attr("x", margin.left )
          .attr("y", margin.top - 15)
          .style("text-anchor", "middle")
          .text("Weight (lbs.)");

      // add line label
      svg.append("text")
      		.attr("transform", "translate(" + (X(data[data.length-1]) + margin.left + 5) + "," + (Y(data[data.length-1]) + margin.top) + ")")
      		.attr("dy", ".35em")
      		.attr("text-anchor", "start")
      		.style("fill", "steelblue")
      		.text("My weight");

      var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

      focus.append("circle")
          .attr("r", 4.5);

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width - margin.left - margin.right)
          .attr("height", height - margin.top - margin.bottom)
          .attr("x", margin.left )
          .attr("y", margin.top)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

      function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]);
            i = bisectDate(data, x0, 1);
            if (i < data.length) {
              // d0 = data[i - 1][0];
              xd = data[i][0];
              yd = data[i][1]
              //d = x0 - d0 > d1 - x0 ? d1 : d0;
              focus.attr("transform", "translate(" + xScale(xd) + "," + (yScale(yd)+margin.top - 10) + ")");
              focus.select("text").text(yd);
            }
      }

      d3.select("#updateButton")
          .append("button")
          .attr("transform", "translate(" + (X(data[data.length-1]) + margin.left + 5) + "," + (height - margin.bottom - 15) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .text("Zoom in")
          .on("click", function() {
            var text = "";
            if (zoom_in) {
              text = "Zoom out"
              yScale
                .domain([210, 240])
                .range([height - margin.top - margin.bottom, 0]);
            } else {
              text = "Zoom in"
              yScale
               .domain([0, d3.max(data, function(d) { return d[1]; })])
               .range([height - margin.top - margin.bottom, 0]);
            }
            d3.select(this).text(text)
            g.select(".y.axis")
              .call(yAxis);
            g.select(".line")
              .attr("d", line);
            zoom_in = !(zoom_in);
          });
    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(d[0]);
  };

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(d[1]);
  };

  chart.margin = function(value) {
    if (!arguments.length) return margin;
    margin = value;
    return chart;
  };

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.x = function(value) {
    if (!arguments.length) return xValue;
    xValue = value;
    return chart;
  };

  chart.y = function(value) {
    if (!arguments.length) return yValue;
    yValue = value;
    return chart;
  };

  return chart;
}
