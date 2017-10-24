/**
 * Created by bikramkawan on 10/22/17.
 */


const margin = {top: 20, right: 200, bottom: 50, left: 200},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select('.chart')
    .append("svg:svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'];
const parseDate = d3.timeParse("%m/%d/%y %H:%M:%S");
const pt = d3.timeParse("%Y");

const x = d3.scaleTime().range([0, width]),
    y1 = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height, 0]),
    y3 = d3.scaleLinear().range([height, 0])


const xAxis = d3.axisBottom(x),
    yAxis1 = d3.axisLeft(y1),
    yAxis2 = d3.axisLeft(y2),
    yAxis3 = d3.axisLeft(y3);


const lineY11 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=>y1(d.y11));


const lineY12 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=> y1(d.y12));

const lineY13 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=> y1(d.y13));

const lineY21 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=>y2(d.y21));


const lineY22 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=>y2(d.y22));


const lineY31 = d3.line()
    .x((d)=> x(d.date))
    .y((d)=>y3(d.y31));

const data = [];

d3.csv("newdata.csv", function (error, rawdata) {

    console.log(rawdata)

    rawdata.forEach((item)=> {
        data.push({
            date: parseDate(`${item.date} ${item.time}`),
            y11: parseFloat(item.y1_lp1),
            y12: parseFloat(item.y1_lp2),
            y13: parseFloat(item.y1_tp),
            y21: parseFloat(item.y2_dr),
            y22: parseFloat(item.y2_tr),
            y31: parseFloat(item.y3_pc)
        })


    })

    console.log(data)

    if (error) throw error;

    let y1Extent = [0, 0];
    let y2Extent = [0, 0];

    data.forEach((d)=> {
        const y1Values = d3.extent([d.y11, d.y12, d.y3])
        const y2Values = d3.extent([d.y21, d.y22])
        y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];
        y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

    })

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y1.domain(y1Extent);

    y2.domain(y2Extent);

    y3.domain(d3.extent(data, function (d) {
        return d.y31;
    }));

    console.log(y1.domain(), y2.domain(), y3.domain(), x.domain())
    drawLine(data, lineY11, 'lineY11', yAxis1, 0);
    drawLine(data, lineY12, 'lineY12', yAxis1, 0);
    drawLine(data, lineY13, 'lineY13', yAxis1, 0);
    drawLine(data, lineY21, 'lineY21', yAxis2, -50);
    drawLine(data, lineY22, 'lineY22', yAxis2, -50);
    drawLine(data, lineY31, 'lineY31', yAxis3, -100);

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
