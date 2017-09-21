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
    //a = mouseDate(x);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    var t = d3.event.transform, xt = t.rescaleX(x), yt = t.rescaleY(y)

    transform2 = t;
    var xt2 = t.rescaleX(x2), yt2 = t.rescaleY(y2)

    d3.selectAll('.clickedCircle').remove()

    // Update the line
    svg.select(".line")
        .attr("d", topLineSeries
            .x((d)=>xt(d.p3))
            .y((d)=> yt(d.p1)));

    //
    // //a = mouseDate(x);
    // gX2.call(xAxis2.scale(d3.event.transform.rescaleX(x2)));
    // gY2.call(yAxis2.scale(d3.event.transform.rescaleY(y2)));
    // var t1 = d3.event.transform, xt1 = t.rescaleX(x2), yt1 = t1.rescaleY(y2)
    // console.log(t)
    // svg2.select(".line2")
    //     .attr("d", bottomLineSeries
    //         .x((d)=>xt1(d.p3))
    //         .y((d)=> yt1(d.p4)));

    //Update the mouseover circle
    focusOverMouseMove.select("circle.y")
        .classed("zoomed", true)
        .attr("id", "one")
        .attr('cx', ()=>t.applyX(x(d.p3)))
        .attr('cy', ()=>t.applyY(y(d.p1)));
}


function zoomed2() {
    //a = mouseDate(x);
    console.log('test')
    gX2.call(xAxis2.scale(d3.event.transform.rescaleX(x2)));
    gY2.call(yAxis2.scale(d3.event.transform.rescaleY(y2)));
    console.log(d3.event.transform)
    var t = d3.event.transform;
    console.log(t, transform2.k);
    t.k = transform2.k + t.k;
    t.x = transform2.x - t.x;
    t.y = transform2.y - t.y;

    console.log(t)
    var xt = t.rescaleX(x2), yt = t.rescaleY(y2)


    svg2.select(".line2")
        .attr("d", bottomLineSeries
            .x((d)=>xt(d.p3))
            .y((d)=> yt(d.p4)));
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
    dateScore.text(`Date:${d.date}`)
    priceScore.text(`C1:${d.p1}`)


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

                console.log(circleDrawnDict, 'Circle is added successfully!')

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


function calcNewLines(clickedData) {


    const currentIndex = data.findIndex((d)=>d.date === clickedData.date)
    const slicedData = data.slice(currentIndex, data.length);

    const calcData = slicedData.map((d, i)=> {
        return {dt: (d.p2 - data[currentIndex - 1]['p2']) / (d.p3 - data[currentIndex - 1]['p3']), p3: d.p3};

    })


    return calcData;

}


function calcScale(newLineData, d) {
    const xScale = d3.scaleLinear()
        .range([x(d.p3), width]);

//initial y-scale
    const yScale = d3.scaleLinear()
        .range([svgHeight1, 0]);
    xScale.domain(d3.extent(newLineData, (d) => d.p3));
    yScale.domain(d3.extent(newLineData, (d)=> d.dt));

    return {xScale, yScale};


}
function generateNewLine(clickedData) {


    const newLineData = calcNewLines(clickedData);
    const result = calcScale(newLineData, clickedData);
    let xScaling = result.xScale;
    let yScaling = result.yScale;

    console.log(xScaling(d.p3))
    const newLineSeries = d3.line()
        .x((d)=> xScaling(d.p3))
        .y((d)=>yScaling(d.dt))

    const color = checkLineColor(newLineData);


    const countLines = newLines.selectAll('path').size()

    newLines.append("path")
        .attr("class", `newline-${countLines}`)
        .attr("d", newLineSeries(newLineData))
        .attr('fill', 'none')
        .attr('stroke', color);

    let lastCoord = newLineData[0];

    newLines.append("circle")
        .attr("class", `tailCircle-${countLines}`)
        .attr('fill', 'red')
        .attr('r', 8)
        .attr('data-attr', `c-${countLines}`)
        .attr('cx', xScaling(lastCoord.p3))
        .attr('cy', yScaling(lastCoord.dt))
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    function dragstarted(d) {
        console.log('start')
        d3.select(this).raise().classed("active", true);
    }

    function dragged() {

        const transform = d3.zoomTransform(this);
        const xt = transform.rescaleX(x), yt = transform.rescaleY(y);
        d = mouseDate(xt);

        const tempNewLines = calcNewLines(d);

        const {xScale, yScale} = calcScale(tempNewLines, d);
        xScaling = xScale;
        yScaling = yScale;

        const tempLineSeries = d3.line()
            .x((d)=> xScale(d.p3))
            .y((d)=>yScale(d.dt))

        const color = checkLineColor(tempNewLines);


        let attId = null;
        d3.select(this).datum(function () {
            attId = this.dataset.attr[2];
            return this.dataset;
        })

        const select = d3.select(`.newline-${attId}`);

        select.attr("d", tempLineSeries(tempNewLines))
            .attr('fill', 'none')
            .attr('stroke', color);
        lastCoord = tempNewLines[0];
        d3.select(this).attr('cx', d3.event.x)
            .attr('cy', d3.event.y)
    }

    function dragended(d) {
        d3.select(this).attr('cx', xScaling(lastCoord.p3))
            .attr('cy', yScaling(lastCoord.dt))

    }


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
