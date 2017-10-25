/**
 * Created by bikramkawan on 10/22/17.
 */


const margin = {top: 30, right: 200, bottom: 50, left: 50},
    width = 1100 - margin.left - margin.right,
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
    y3 = d3.scaleLinear().range([height, 0]),
    x2 = d3.scaleLinear().range([0, width])

const legends = [{

    name: 'Line Press #1',
    className: 'lineY11',
    scale: y1,
    unit: 'Psi'
},
    {

        name: 'Line Press #2',
        className: 'lineY12',
        scale: y1,
        unit: 'Psi'


    },
    {

        name: 'Tubing Press',
        className: 'lineY13',
        scale: y1,
        unit: 'Psi'


    }, {

        name: 'Discharge Rate',
        className: 'lineY21',
        scale: y2,
        unit: 'bbl/min'


    }, {

        name: 'Tubing Rate',
        className: 'lineY22',
        scale: y2,
        unit: 'bbl/min'


    }, {

        name: 'Proppant Conc 40/70',
        className: 'lineY31',
        scale: y3,
        unit: 'ppa'


    }


]
const xAxis1 = d3.axisBottom(x),
    yAxis1 = d3.axisLeft(y1),
    yAxis2 = d3.axisLeft(y2),
    yAxis3 = d3.axisLeft(y3),
    xAxis2 = d3.axisBottom(x2)


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


    rawdata.forEach((item)=> {
        data.push({
            date: parseDate(`${item.date} ${item.time}`),
            time2: parseFloat(item.time2),
            y11: parseFloat(item.y1_lp1) < 0 ? 0 : parseFloat(item.y1_lp1),
            y12: parseFloat(item.y1_lp2) < 0 ? 0 : parseFloat(item.y1_lp2),
            y13: parseFloat(item.y1_tp) < 0 ? 0 : parseFloat(item.y1_tp),
            y21: parseFloat(item.y2_dr) < 0 ? 0 : parseFloat(item.y2_dr),
            y22: parseFloat(item.y2_tr) < 0 ? 0 : parseFloat(item.y2_tr),
            y31: parseFloat(item.y3_pc) < 0 ? 0 : parseFloat(item.y3_pc)
        })


    })


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
    x2.domain(d3.extent(data, function (d) {
        return d.time2;
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
    drawLine(data, lineY21, 'lineY21', yAxis2, width + 50);
    drawLine(data, lineY22, 'lineY22', yAxis2, width + 50);
    drawLine(data, lineY31, 'lineY31', yAxis3, width + 100);
    drawLegends();

    const submit = d3.select('.submit').on('click', function (d) {
        const date1 = d3.select('.date1').property("valueAsDate")
        const date2 = d3.select('.date2').property("valueAsDate")

        const formatYear = d3.timeFormat("%Y");

        const filterData1 = data.filter(d=>formatYear(d.date) > formatYear(date1) && formatYear(d.date) < formatYear(date2));
        console.log(filterData1, date1, date2)

        drawLine(filterData1, lineY11, 'lineY11', yAxis1, 0);
        drawLine(filterData1, lineY12, 'lineY12', yAxis1, 0);
        drawLine(filterData1, lineY13, 'lineY13', yAxis1, 0);
        drawLine(filterData1, lineY21, 'lineY21', yAxis2, -50);
        drawLine(filterData1, lineY22, 'lineY22', yAxis2, -50);
        drawLine(filterData1, lineY31, 'lineY31', yAxis3, -100);

    })


    d3.select('.mode').on('click', ()=> {

        const isDark = d3.select('.mode').attr('class') === 'mode';
        d3.select('.mode').classed('dark', isDark);
        d3.selectAll('.axis').classed('darkMode', isDark)
        d3.select('.chart').classed('darkChart', isDark);

    })


});


function drawLine(linedata, linefunc, lineclass, lineYAxis, yAxisOffset) {


    d3.selectAll(`.${lineclass}-grp`).remove()

    d3.selectAll('.xAxis').remove();


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
        .attr("class", "axis xAxis")
        .attr("transform", `translate(0,-${margin.top - 5})`)
        .call(xAxis1);

    line.append("g")
        .attr("class", "axis xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

    line.append("g")
        .attr("class", "axis yAxis")
        .attr("transform", `translate(${yAxisOffset},0 )`)
        .call(lineYAxis);

}


function drawLegends() {


    const el = d3.select('.legends')
        .selectAll('div')
        .data(legends)
        .enter()
        .append('div')
        .classed('row', true)
        .on('click', (d)=> {
            const hidden = d3.select(`path.${d.className}`).attr('visibility') !== 'hidden';
            d3.select(`path.${d.className}`).attr('visibility', hidden ? 'hidden' : 'visible');
            d3.select(`div.${d.className}`).style('opacity', hidden ? '0.5' : '1');

        })
    el.append('div').text(d=>d.name).classed('name', true)
    el.append('div').attr('class', d=>d.className)
    el.append('div').classed('unit', true).text((d)=> {
        const s = d.scale.domain();

        return `[${Math.floor(s[0])},${Math.floor(s[1])}] - ${d.unit}(unit)`

    })

}