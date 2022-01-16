function WordCloud(id, data){

    //Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();

    // set the dimensions and margins of the graph
    var width = 1000;
    var height = 580;
    
    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
                        .size([width, height])
                        .words(data.map(function(d) {return {
                            text: d.word, size: d.size, artist: d.artist, genre: d.genre, color: d.color, uri: d.uri}; 
                        }))
                        .padding(5)        //space between words
                        .rotate(function() { return ~~(Math.random() * 2) * 90; })
                        .fontSize(function(d) { return d.size; })      // font size of words
                        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {

        var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        d3.select(id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("font-family", "Impact")
            .style("fill", function(d) { return d.color; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; })
            .on("mousemove", function(d){
                tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 100 + "px")
                .style("display", "inline-block")
                .html("Song: " + d.text + "<br\> Artist: " + d.artist + "<br\> Genre: " + d.genre);
            })
            .on("mouseout", function(d){ tooltip.style("display", "none");})
            .on("click",function(d,i) {
                location=d.uri
                });
        }

    d3.layout.cloud().stop();

}

