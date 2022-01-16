function BoxPlot(id, data){

    //Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();

    // set the dimensions and margins of the graph
    var margin = {top: 25, right: 30, bottom: 40, left: 50},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select(id)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["Anger", "Anticipation", "Joy", "Trust", "Fear", "Surprise", "Sadness", "Disgust"])
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-family", 'Open Sans')
        .style("font-size", 12);
    
    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([-0.2, 0.45])
        .range([height, 0])
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-family", 'Open Sans')
        .style("font-size", 12);
    
    // Show the main vertical line
    svg.selectAll("vertLines")
        .data(data)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key))})
          .attr("x2", function(d){return(x(d.key))})
          .attr("y1", function(d){return(y(d.lower))})
          .attr("y2", function(d){return(y(d.upper))})
          .attr("stroke", "black")
          .style("width", 40);
    

    var tooltip2 = d3.select("body").append("div").attr("class", "toolTip").attr("id", "toolTip2");

    // rectangle for the main box
    var boxWidth = 40;
    svg.selectAll("boxes")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.q3))})
            .attr("height", function(d){return(y(d.q1)-y(d.q3))})
            .attr("width", boxWidth)
            .attr("stroke", "black")
            .style("fill", "#BDC3C7")
            .on("click", function(d){
                tooltip2
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 100 + "px")
                .style("display", "inline-block")
                .html("Emotion: " + d.key + "<br\>Max: " + d.upper + "<br\> Q1: " + d.q1 + 
                "<br\> Median: " + d.median + "<br\> Q3: " + d.q3 + "<br\> Min: " + d.lower);
            })
            .on("mouseout", function(d){ tooltip2.style("display", "none");});

    
    // Show the median
    svg.selectAll("medianLines")
        .data(data)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
          .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
          .attr("y1", function(d){return(y(d.median))})
          .attr("y2", function(d){return(y(d.median))})
          .attr("stroke", "black")
          .style("width", 80);


    //x label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 240)
        .attr("y", 370)
        .text("Emotion")
        .style("font-size", 14)
        .style("font-weight", "bold");

    //y label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -10)
        .attr("y", -15)
        .text("Score")
        .style("font-size", 14)
        .style("font-weight", "bold");
    
}