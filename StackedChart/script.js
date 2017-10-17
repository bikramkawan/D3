console.log(newdata)
const {lineData, bardata, lightGreenData, orangeData}  = formatData();


var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const bottomBarWidth = 10;
const topBarWidth = 10;
// set the ranges
var x = d3.scaleTime().range([0, width]);
var x2 = d3.scaleTime().range([0, width]);
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

const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);


// Scale the range of the data
x.domain(d3.extent(lineData, function (d) {
    return d.date;
}));
x2.domain(x.domain());
y.domain([0, d3.max(lineData, function (d) {
    return d.close;
})]);


// y.domain([0, 600]);

const xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

// Add the valueline path.
svg.append("path")
    .data([lineData])
    .attr("class", "line")
    .attr("d", valueline);

// Add the X Axis
svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

const limitsLine = svg.append("g").classed('limits', true)
const greenArea = d3.select('.limits')
    .append('rect')
    .classed('greenArea', true)
    .attr('width', width)
    .attr('height', y(greenAreaLimits[1].value) - y(greenAreaLimits[0].value))
    .attr('x', 0)
    .attr('y', y(greenAreaLimits[0].value))

//Zoom Rect
svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

var barY = d3.scaleLinear()
    .range([0, height / 3])
    .domain([0, d3.max(bardata, function (d) {
        return d.value;
    })]);


const bottomBarGraph = svg.append("g").classed('bottomBar', true)
// .attr("transform", "translate(0," + (height-barY.domain()[1]-50) + ")");


bottomBarGraph.selectAll('rect')
    .data(bardata)
    .enter()
    .append('rect')
    .attr('x', (d, i)=>x(d.date))
    .attr('width', bottomBarWidth)
    .attr('y', (d, i)=>height - bottomBarHeight(d.value, height))
    .attr('height', (d)=>bottomBarHeight(d.value, height))


const topBarGreen = svg.append("g").classed('topBarGreen', true)
const topBarOrange = svg.append("g").classed('topBarOrange', true)
// .attr("transform", "translate(0," + (height-barY.domain()[1]-50) + ")");


topBarGreen.selectAll('rect')
    .data(lightGreenData)
    .enter()
    .append('rect')
    .classed('topGreen', true)
    .attr('x', (d, i)=>x(d.date))
    .attr('width', topBarWidth)
    .attr('height', (d)=>calcGreenHeight(d, height))


console.log(lightGreenData, orangeData)

topBarOrange.selectAll('rect')
    .data(orangeData)
    .enter()
    .append('rect')
    .classed('topOrange', true)
    .attr('x', (d, i)=>x(d.date))
    .attr('width', 50)
    .attr('y', (d, i)=> (calcGreenHeight(lightGreenData[i])))
    .attr('height', (d)=> calcOrangeHeight(d.intensity, height))


var yPath = d3.scaleLinear().range([height, 0]).domain([0, 550]);


limitsLine.selectAll('path')
    .data(limits)
    .enter()
    .append('path')
    .attr('class', (d)=>d.label)
    .attr('d', (d)=>`M0 ${y(d.value)} L ${width} ${y(d.value)}`)
    .attr('stroke', 'steelblue')

console.log(height, y(greenAreaLimits[1].value), y(greenAreaLimits[0].value))


const circles = svg.append("g").classed('circle', true)

circles.selectAll('circle')
    .data(lineData)
    .enter()
    .append('circle')
    .attr('cx', (d)=>x(d.date))
    .attr('cy', (d)=>y(d.close))
    .attr('r', 4)
    .attr('fill', (d)=>fillCircle(d.close))

function zoomed() {
    const t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    svg.select(".line").attr("d", valueline);
    svg.select(".axis--x").call(xAxis);
    circles.selectAll('circle')
        .attr('cx', (d)=> t.applyX(x2(d.date)))
        .attr('cy', (d)=> y(d.close))
    // d3.select('.rectG')
    //     .attr("transform", `scale(${t.k})`)
    // .attr("transform", "translate(" + 100 + "," + 100 + ")")


}