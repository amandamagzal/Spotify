function BarChart(id, data){

    //Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();

    var svg = d3.select(id)
                .append("svg")
                .attr("width", 500)
                .attr("height", 550)
                .append("g")
                .attr("transform", "translate(" + 70 + "," + 0 + ")");

    // Add X axis
    var x = d3.scaleLinear()
                .domain([0, 24000])
                .range([0, 380]);
        svg.append("g")
            .attr("transform", "translate(0," + 490 + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-family", 'Open Sans')
            .style("font-size", 11);

    // Y axis
    var y = d3.scaleBand()
                .range([0, 490])
                .domain(data.map(function(d) { return d.Genre; }))
                .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-family", 'Open Sans')
            .style("font-size", 12);

    //x label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", 230)
            .attr("y", 540)
            .text("Popularity")
            .style("font-size", 14)
            .style("font-weight", "bold");

    //y label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", -10)
            .attr("y", 20)
            .text("Genre")
            .style("font-size", 14)
            .style("font-weight", "bold");


    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    //Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function(d) { return y(d.Genre); })
            .attr("width", function(d) { return x(d.Popularity); })
            .attr("height", y.bandwidth() )
            .attr("fill", function(d){ return d.color;})
            .on("mousemove", function(d){
                tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 50 + "px")
                .style("display", "inline-block")
                .html(d.Popularity);
            })
            .on("mouseout", function(d){ tooltip.style("display", "none");});


}