console.log(glucoses)

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.close);
    });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// format the data
const data = glucoses.map(function (d) {
    return {
        date: parseTime(d.date),
        close: parseFloat(d.value)
    }

});

const bardata = meals.map((d)=> {
    return {
        date: parseTime(d.date),
        value: parseFloat(d.value)
    }

});
console.log(data, bardata)

// Scale the range of the data
x.domain(d3.extent(data, function (d) {
    return d.date;
}));
// y.domain([0, d3.max(data, function (d) {
//     return d.close;
// })]);


y.domain([0, 600]);

// Add the valueline path.
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

// Add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));
var barY = d3.scaleLinear().range([0, height / 3]).domain([0, d3.max(bardata, function (d) {
    return d.value;
})]);

console.log(barY(bardata[4].value))
const barRect = svg.append("g").classed('bar', true)
// .attr("transform", "translate(0," + (height-barY.domain()[1]-50) + ")");

barRect.selectAll('rect')
    .data(bardata)
    .enter()
    .append('rect')
    .attr('x', (d, i)=>(i + 1) * 100)
    .attr('width', 50)
    .attr('y', (d)=>height - barY(d.value))
    .attr('height', (d)=>barY(d.value))
    .attr('fill', 'grey')


const lightGreenData = medications.map((d)=> {
    return {
        date: parseTime(d.date),
        value: parseFloat(d.value)
    }

});

const orangeData = activities.map((d)=> {
    return {
        date: parseTime(d.date),
        value: parseFloat(d.value)
    }

});


var yTop = d3.scaleLinear().range([0, height / 3]).domain([0, 120]);

console.log(barY(bardata[4].value))
const barTop = svg.append("g").classed('barTop', true)
// .attr("transform", "translate(0," + (height-barY.domain()[1]-50) + ")");

// <10  : 1/27 of graph height
// 10-19: 2/27 of graph height
// >20  : 3/27 of graph height

function calcGreen(data) {

    if (data.value < 10) return (120 / 4)
    if (data.value > 10 && data.value < 20) return (120 / 3)
    if (data.value > 20) return (120 / 2)


}
barTop.selectAll('rect')
    .data(lightGreenData)
    .enter()
    .append('rect')
    .attr('x', (d, i)=>(i + 1) * 100)
    .attr('width', 50)
    .attr('height', calcGreen)
    .attr('fill', 'lightgreen')

const barOrange = svg.append("g").classed('barTop2', true)
// 1: 1/27 of graph height
// 2: 2/27 of graph height
// 3: 3/27 of graph height
barOrange.selectAll('rect')
    .data(orangeData)
    .enter()
    .append('rect')
    .attr('x', (d, i)=>(i + 1) * 100)
    .attr('width', 50)
    .attr('y', (d, i)=> (calcGreen(lightGreenData[i])))
    .attr('height', (d)=> {
        if (d.value === 1) return (120 / 4)
        if (d.value === 2) return (120 / 3)
        if (d.value === 3) return (120 / 2)

    })
    .attr('fill', 'orange')


var limits = [{
    label: 'hyper',
    value: 550
},
    {
        label: 'upper',
        value: 490
    }, {
        label: 'target',
        value: 250
    },
    {
        label: 'lower',
        value: 120
    }, {
        label: 'hypo',
        value: 50
    }

];

var yPath = d3.scaleLinear().range([height, 0]).domain([0, 550]);

const limitsLine = svg.append("g").classed('limits', true)

limitsLine.selectAll('path')
    .data(limits)
    .enter()
    .append('path')
    .attr('class', (d)=>d.label)
    .attr('d', (d)=>`M0 ${y(d.value)} L ${width} ${y(d.value)}`)
    .attr('stroke', 'steelblue')


// const circles = svg.append("g").classed('circle', true)
//
//
// circles.selectAll('circle')
//     .data(data)
//     .enter()
//     .append('circle')
//     .attr('cx',(d)=>(d.close))
//     .attr('cy',(d)=>y(d.close))
//     .attr('r',4)
//     .attr('stroke','red')
