/**
 * Created by bikramkawan on 10/26/17.
 */
function prepareData(results) {

    const usmaps = results[0];
    const states = results[1];
    const countryExport = results[2].map((d, i)=> {
        return {
            change: parseFloat(d.change),
            countryd: d.countryd,
            share13: parseFloat(d.share13),
            share14: parseFloat(d.share14),
            share15: parseFloat(d.share15),
            share16: parseFloat(d.share16),
            statename: d.statename,
            val2013: parseFloat(d.val2013),
            val2014: parseFloat(d.val2014),
            val2015: parseFloat(d.val2015),
            val2016: parseFloat(d.val2016),
            i
        }
    });
    const countryImport = results[3].map((d)=> {
        return {
            change: parseFloat(d.change),
            countryd: d.countryd,
            share13: parseFloat(d.share13),
            share14: parseFloat(d.share14),
            share15: parseFloat(d.share15),
            share16: parseFloat(d.share16),
            statename: d.statename,
            val2013: parseFloat(d.val2013),
            val2014: parseFloat(d.val2014),
            val2015: parseFloat(d.val2015),
            val2016: parseFloat(d.val2016)


        }

    });
    const stateExport = results[4].map((d)=> {

        return {
            change: parseFloat(d.change),
            hs6: parseFloat(d.hs6),
            share13: parseFloat(d.share13),
            share14: parseFloat(d.share14),
            share15: parseFloat(d.share15),
            share16: parseFloat(d.share16),
            statename: d.statename,
            val2013: parseFloat(d.val2013),
            val2014: parseFloat(d.val2014),
            val2015: parseFloat(d.val2015),
            val2016: parseFloat(d.val2016)
        }


    });
    const stateImport = results[5].map((d)=> {

        return {
            change: parseFloat(d.change),
            hs6: parseFloat(d.hs6),
            share13: parseFloat(d.share13),
            share14: parseFloat(d.share14),
            share15: parseFloat(d.share15),
            share16: parseFloat(d.share16),
            statename: d.statename,
            val2013: parseFloat(d.val2013),
            val2014: parseFloat(d.val2014),
            val2015: parseFloat(d.val2015),
            val2016: parseFloat(d.val2016)
        }

    });


    return {usmaps, states, countryExport, countryImport, stateExport, stateImport}

}


function drawBarChart(bardata, svgBar, barMargin, barWidth, barHeight, xVal, yVal, grpClass) {


    const x = d3.scaleBand().rangeRound([0, barWidth]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([barHeight, 0]);

    x.domain(bardata.map(d=>d[xVal]))
    y.domain([0, d3.max(bardata, d=> d[yVal])])

    const gEl = svgBar.append("g").classed(grpClass, true)
        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

    gEl.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (barHeight) + ")")
        .call(d3.axisBottom(x))

    gEl.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5))

    gEl.selectAll(".bar")
        .data(bardata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d=> x(d.i))
        .attr("y", d=>y(d[yVal]))
        .attr("width", x.bandwidth())
        .attr("height", d=> barHeight - y(d[yVal]));


}
