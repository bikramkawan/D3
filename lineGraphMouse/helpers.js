/**
 * Created by bikramkawan on 9/19/17.
 */


// mouseDate function. Returns the data for
// the corresponding point over which the cursor
// is currently placed.
function mouseDate(scale) {
    var g = d3.select("#group")._groups[0][0]
    var x0 = scale.invert(d3.mouse(g)[0])
    i = bisectDate(data, x0, 1)
    d0 = data[i - 1];
    if (d0.p3 === date_max) {
        d = d0;
    }
    else {
        var d1 = data[i]
        d = x0 - d0.p3 > d1.p3 - x0 ? d1 : d0;
    }
    return d;
}

// The function for zoom operation method
function zoomed() {
    a = mouseDate(x);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    var t = d3.event.transform, xt = t.rescaleX(x), yt = t.rescaleY(y)
    d3.selectAll('.clickedCircle').remove()

    // Update all the circles which are in dict
    circleDrawnDict.forEach(e=> {
        focusedCircleGroup.append("circle")
            .attr("class", "clickedCircle")
            .attr('data-attr', ()=>e.date)
            .attr('cx', ()=> t.applyX(x(e.p3)))
            .attr('cy', ()=> t.applyY(y(e.p1)))

    });


    // dummyDateToPlot.forEach((e, i)=> {
    //     focusedCircleGroup.append("circle")
    //         .attr("class", "clickedCircle")
    //         .attr('data-attr', ()=>e.date)
    //         .attr('cx', ()=> t.applyX(x(e.p3)))
    //         .attr('cy', ()=> t.applyY(y(e.p1)))
    //
    // });


    // Update the line
    svg.select(".line")
        .attr("d", topLineSeries
            .x((d)=>xt(d.p3))
            .y((d)=> yt(d.p1)));

    //Update the mouseover circle
    focusOverMouseMove.select("circle.y")
        .classed("zoomed", true)
        .attr("id", "one")
        .attr('cx', ()=>t.applyX(x(d.p3)))
        .attr('cy', ()=>t.applyY(y(d.p1)));
}

// function defining behaviour on click of the reset button
function resetted() {
    d3.select("#rect").transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
}


function mouseMove() {

    const transform = d3.zoomTransform(this);

    const xt = transform.rescaleX(x), yt = transform.rescaleY(y);
    d = mouseDate(xt);

    // Update the score on the board with latest date and price
    dateScore.text(`p3:${d.p3.toExponential()}`)
    priceScore.text(` P1:${d.p1}`)


    focusOverMouseMove.select("circle.circleFocus")
        .attr('cx', ()=> transform.applyX(x(d.p3)))
        .attr('cy', ()=>transform.applyY(y(d.p1)));


    // This is the method for detecting single click and double and do the action accordingly;
    d3.select(this).on('click', function () {
        generateNewLine(d);
        // If Draw circle is false nothing will be drawn
        if (!toogleDrawCircle) return;

        clicks++;  //count clicks
        if (clicks === 1) {
            timer = setTimeout(function () {
                clicks = 0;

                circleDrawnDict.set(d.date, d); // Store the information of circle drawn to the dict;
                console.log(circleDrawnDict, 'Circle is added successfully!')

                const temp = localStorage.getItem(circleDrawnDict);
                d3.select('.circleDrawn')
                    .text(`Count Circles: ${circleDrawnDict.size}`);  // Update the number of circles drawn on the board

                //Add red small circle after user perfom single click action
                focusedCircleGroup.append("circle")
                    .attr("class", "clickedCircle")
                    .attr('data-attr', (e)=>d.date)
                    .attr('cx', ()=>transform.applyX(x(d.p3)))
                    .attr('cy', ()=>transform.applyY(y(d.p1)))
            }, DELAY);

        } else {
            // This is the block for double click event

            clearTimeout(timer);    //prevent single-click action
            const findSelect = d3.selectAll(`[data-attr="${d.date}"]`).node(); // Gives the currenct selection DOM

            //If there is no circle drawn on this price value the dialog will not appear
            if (findSelect !== null) {
                deleteMeDialog.style('display', 'flex')
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }
            currentSelect = d.date;
            clicks = 0;         //after action performed, reset counter
        }


    });

    // Stop default event triggering of double click
    d3.select(this).on("dblclick", (e)=> d3.event.stopPropagation());


}

function generateNewLine(clickedData) {

    const currentIndex = data.findIndex((d)=>d.date === clickedData.date)
    const slicedData = data.slice(currentIndex, data.length);

    const newLineData = slicedData.map((d, i)=> {
        return {dt: (d.p2 - data[currentIndex - 1]['p2']) / (d.p3 - data[currentIndex - 1]['p3']), p3: d.p3};

    })
    const xScale = d3.scaleLinear()
        .range([0, width]);

//initial y-scale
    const yScale = d3.scaleLinear()
        .range([svgHeight1, 0]);
    xScale.domain(d3.extent(newLineData, (d) => d.p3));
    yScale.domain(d3.extent(newLineData, (d)=> d.dt));

    const newLineSeries = d3.line()
        .x((d)=> xScale(d.p3))
        .y((d)=>yScale(d.dt))

    const color = checkLineColor(newLineData);
console.log(color)
    newLines.append("path")
        .attr("class", "newline")
        .attr("d", newLineSeries(newLineData))
        .attr('fill','none')
        .attr('stroke', color);

    // return computedLineData.slice(1, computedLineData.length);
    // console.log(computedLineData.slice(1, computedLineData.length))


}

function checkLineColor(data) {


    if (data[1].dt - data[0].dt > 0) {

        return 'green';
    } else if (data[1].dt - data[0].dt < 0) {

        return 'red';
    } else {

        return 'steelblue';
    }


}
