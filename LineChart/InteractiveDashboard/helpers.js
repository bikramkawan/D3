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
let zoomTransform = null;
// The function for zoom operation method
function zoomed() {
    //a = mouseDate(x);
    //  gX2.call(xAxis2.scale(d3.event.transform.rescaleX(x)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    var t = d3.event.transform, xt = t.rescaleX(x), yt = t.rescaleY(y)
    zoomTransform = t;


    // Update the line
    svg.select(".line")
        .attr("d", topLineSeries
            .x((d)=>xt(d.p3))
            .y((d)=> yt(d.p1)));

    // Donot reset to score and other functional. Just zoom out
    //
    // if (t.x === 0 && t.y === 0) {
    //
    //     d3.selectAll('.newlines').remove();
    //     d3.selectAll('.clickedCircle').remove();
    //     updateScore(true)
    //     randomLines=[]
    //     lineDrawnDict.clear();
    //     return;
    // }


    updateLinesOnZoom(t);

    //
    // //a = mouseDate(x);
    gX2.call(xAxis2.scale(d3.event.transform.rescaleX(x2)));
    gY2.call(yAxis2.scale(d3.event.transform.rescaleY(y2)));
    var t1 = d3.event.transform, xt1 = t.rescaleX(x2), yt1 = t1.rescaleY(y2)

    svg2.select(".line2")
        .attr("d", bottomLineSeries
            .x((d)=>xt1(d.p3))
            .y((d)=> yt1(d.p4)));

    //Update the mouseover circle
    focusOverMouseMove.select("circle.y")
        .classed("zoomed", true)
        .attr("id", "one")
        .attr('cx', ()=>t.applyX(x(d.p3)))
        .attr('cy', ()=>t.applyY(y(d.p1)));

}


function updateLinesOnZoom(transform) {
    d3.selectAll('.newlines').remove();
    d3.selectAll('.clickedCircle').remove();

    lineDrawnDict.forEach((e,)=> {
        generateNewLine(e, transform, true);
    });

    if (plotCircle) {
        randomLines.forEach((d)=> {
            generateNewLine(data[d], transform, true);

        })
    }


}

function zoomed2() {
    //a = mouseDate(x);

    gX2.call(xAxis2.scale(d3.event.transform.rescaleX(x2)));
    gY2.call(yAxis2.scale(d3.event.transform.rescaleY(y2)));

    var t = d3.event.transform;

    var xt = t.rescaleX(x2), yt = t.rescaleY(y2)

    svg2.select(".line2")
        .attr("d", bottomLineSeries
            .x((d)=>xt(d.p3))
            .y((d)=> yt(d.p4)));


    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    var t1 = d3.event.transform, xt1 = t.rescaleX(x), yt1 = t1.rescaleY(y)

    // Update the line
    svg.select(".line")
        .attr("d", topLineSeries
            .x((d)=>xt1(d.p3))
            .y((d)=> yt1(d.p1)));

    updateLinesOnZoom(t);


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

        if (!toogleDrawCircle) return;

             clicks++;  //count clicks
        if (clicks === 1) {
            timer = setTimeout(function () {
                clicks = 0;
                generateNewLine(d, transform);
                lineDrawnDict.set(d.date, {...d, index: lineDrawnDict.size})
                console.log(lineDrawnDict, 'Circle is added successfully!')

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

    // const currentIndex = 1058
    const slicedData = data.slice(currentIndex, data.length);
        const calcData = slicedData.map((d, i)=> {
        return {dt: (d.p2 - data[currentIndex - 1]['p2']) / (d.p3 - data[currentIndex - 1]['p3']), p3: d.p3};

    })

    //   console.log(data[currentIndex],calcData)

    return calcData;

}


function calcScale(newLineData, d) {
    const xScale = d3.scaleLinear()
        .range([x(d.p3), width]);

//initial y-scale
    const yScale = y;

    xScale.domain(d3.extent(newLineData, (d) => d.p3));


    return {xScale, yScale};


}

function generateNewLine(clickedData, transform, select) {
    const newLineData = calcNewLines(clickedData);
    const result = calcScale(newLineData, clickedData);
    let xScaling = result.xScale;
    let yScaling = result.yScale;
    var xt = transform.rescaleX(xScaling), yt = transform.rescaleY(yScaling)
    let newLineSeries = null;

    if (select || (transform.x!==0 && transform.y!==0)) {
        newLineSeries = d3.line()
            .x((d)=>xt(d.p3))
            .y((d)=> yt(d.dt))

     }

    else {

        newLineSeries = d3.line()
            .x((d)=> xScaling(d.p3))
            .y((d)=>yScaling(d.dt))
    }

    const getClass = getClassName(newLineData);

    newLines.append("path")
        .attr("class", `newlines ${getClass}`)
        .attr('data-attr', clickedData.date)
        .attr("d", newLineSeries(newLineData))

    generateCirlce(clickedData, transform, getClass, xt, yt, select);


}


function generateCirlce(clickedData, transform, getClass) {
//console.log(clickedData)

    newCircles.append("circle")
        .attr("class", `clickedCircle ${getClass}`)
        .attr('data-attr', clickedData.date)
        .on('click', function () {

            d3.select(this).datum(function () {
                currentSelect = this.dataset.attr;

            })
            deleteMeDialog.style('display', 'flex')
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .attr('cx', ()=> transform.applyX(x(clickedData.p3)))
        .attr('cy', ()=>transform.applyY(y(clickedData.p1)))

        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


}

function dragstarted(d) {
    console.log('circle is dragging');

}

let dragXScale = null;
let dragYScale = null;
let dragData = null;
function dragged() {

    if (!toogleDrawCircle) return;
    let transform = d3.zoomTransform(this);
    if(zoomTransform!==null){
        transform =zoomTransform;
    }

    console.log(transform,'drag')
    const xt = transform.rescaleX(x), yt = transform.rescaleY(y);
    d = mouseDate(xt);

    const tempNewLines = calcNewLines(d);

    const {xScale, yScale} = calcScale(tempNewLines, d);
    dragXScale = xScale;
    dragYScale = yScale;
    dragData = tempNewLines;

    var xtChanged = transform.rescaleX(xScale), ytChanged = transform.rescaleY(yScale)
    const tempLineSeries = d3.line()
        .x((d)=> xtChanged(d.p3))
        .y((d)=>ytChanged(d.dt))


    const getClass = d3.select(this).attr('class');
    let attr = null;
    d3.select(this).datum(function () {
        attr = this.dataset.attr;
        return this.dataset;
    })

    const select = d3.select(`[data-attr="${attr}"]`)
    select.attr("d", tempLineSeries(tempNewLines))
    console.log(attr)

    lineDrawnDict.set(attr,d)
    d3.select(this).attr('cx', ()=> transform.applyX(x(d.p3)))
        .attr('cy', ()=>transform.applyY(y(d.p1)))
}

function dragended(d) {

    // const transform = d3.zoomTransform(this);
    // const xt = transform.rescaleX(x), yt = transform.rescaleY(y);
    // d = mouseDate(xt);
    //
    // d3.select(this).attr('cx', ()=> transform.applyX(x(d.p3)))
    //     .attr('cy', ()=>transform.applyY(y(d.p1)))

}

let countPositive=0, countNegative=0;
function getClassName(data) {

    const countPos = newLines.selectAll('path.pos').size()
    const countNeg = newLines.selectAll('path.neg').size()


    if (data[1].dt - data[0].dt > 0) {
        countNegative = countNeg + 1;
        updateScore();
        return `l-${countNeg} neg`;

    } else if (data[1].dt - data[0].dt < 0) {

        countPositive = countPos + 1;
        updateScore();

        return `l-${countPos} pos`;

    } else {

        return 'steelblue';
    }


}


function updateScore(clear) {

    if (clear) {
        console.log('cle')
        d3.select('.negative').text(`Neg: 0 `);
        d3.select('.positive').text(`Pos: 0`);
        return;

    }

    d3.select('.negative').text(`Neg:${countNegative}`);
    d3.select('.positive').text(`Pos:${countPositive}`)


}