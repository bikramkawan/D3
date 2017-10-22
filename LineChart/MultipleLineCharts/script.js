/**
 * Created by bikramkawan on 10/22/17.
 */


const margin = {top: 20, right: 200, bottom: 50, left: 200},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select('.chart')
    .append("svg:svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)


const parseDate = d3.timeParse("%b %Y");
const pt = d3.timeParse("%Y");

const x = d3.scaleTime().range([0, width]),
    y1 = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height, 0]),
    y3 = d3.scaleLinear().range([height, 0])


const xAxis = d3.axisBottom(x),
    yAxis1 = d3.axisLeft(y1),
    yAxis2 = d3.axisLeft(y2),
    yAxis3 = d3.axisLeft(y3);


const line1 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=>y1(d.price));


const line2 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=> y2(d.price));


const line3 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=>y3(d.price));


const data = [];

d3.csv("data.csv", function (error, rawdata) {

    rawdata.forEach((item)=> {

        data.push({

            date: parseDate(item.date),
            price: parseFloat(item.price)
        })


    })


    const line2Data = data.map(d=> {
        return {
            date: d.date,
            price: d.price * Math.random()
        }
    });

    const line3Data = data.map(d=> {
        return {
            date: d.date,
            price: d.price * Math.random()
        }
    });


    if (error) throw error;

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y1.domain([0, d3.max(data, function (d) {
        return d.price;
    })]);

    y2.domain([0, d3.max(line2Data, function (d) {
        return d.price;
    })]);

    y3.domain([0, d3.max(line3Data, function (d) {
        return d.price;
    })]);

    drawLine(data, line1, 'line1', yAxis1, 0);
    drawLine(line2Data, line2, 'line2', yAxis2, -50);
    drawLine(line3Data, line3, 'line3', yAxis3, -100);


    const submit = d3.select('.submit').on('click', function (d) {

        const date1 = d3.select('.date1').property("valueAsDate")
        const date2 = d3.select('.date2').property("valueAsDate")

        const formatYear = d3.timeFormat("%Y");

        const filterData1 = data.filter(d=>formatYear(d.date) > formatYear(date1) && formatYear(d.date) < formatYear(date2));

        const filterData2 = line2Data.filter(d=>formatYear(d.date) > formatYear(date1) && formatYear(d.date) < formatYear(date2));

        const filterData3 = line3Data.filter(d=>formatYear(d.date) > formatYear(date1) && formatYear(d.date) < formatYear(date2));

        drawLine(filterData1, line1, 'line1', yAxis1, 0);
        drawLine(filterData2, line2, 'line2', yAxis2, -50);
        drawLine(filterData3, line3, 'line3', yAxis3, -100);


    })


});


function drawLine(linedata, linefunc, lineclass, lineYAxis, yAxisOffset) {


    d3.selectAll(`.${lineclass}-grp`).remove()

    x.domain(d3.extent(linedata, function (d) {
        return d.date;
    }));

    const line = svg.append("g")
        .classed(`${lineclass}-grp`, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    line.append("path")
        .data([linedata])
        .attr("class", lineclass)
        .attr("d", linefunc);


    line.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    line.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", `translate(${yAxisOffset},0 )`)
        .call(lineYAxis);

}
