/**
 * Created by bikramkawan on 9/19/17.
 */


const chart1Height = document.getElementById('chartTop').clientHeight;

const chart2Height = document.getElementById('chartBottom').clientHeight
//Set up some space for SVG
const margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right;

const svgHeight1 = chart1Height - margin.top - margin.bottom;

const svgHeight2 = chart2Height - margin.top - margin.bottom;

let toogleDrawCircle = false;
let plotCircle = false;
const lineDrawnDict = new Map(); // Will store the information of circles drawn after clicked with date and price

const bisectDate = d3.bisector((d) =>d.p3).left;

const randomLines = [1062, 2060, 400];
const xAxixText = "C3";
const yAxixText = "C1";
// initial x-scale
const x = d3.scaleLinear()
    .range([0, width]);

//initial y-scale
const y = d3.scaleLinear()
    .range([svgHeight1, 0]);


const x2 = d3.scaleLinear()
    .range([0, width]);

//initial y-scale
const y2 = d3.scaleLinear()
    .range([svgHeight2, 0]);


// initial d3.line() object
const topLineSeries = d3.line()
    .defined((d) =>d.p1 != 0)
    .x((d)=> x(d.p3))
    .y((d)=>y(d.p1));


// initial d3.line() object
const bottomLineSeries = d3.line()
    .x((d)=> x2(d.p3))
    .y((d)=>y2(d.p4))


// Main SVG Selector
const svg = d3.select('#chartTop')
    .append("svg:svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', svgHeight1 + margin.top + margin.bottom)
    .append("svg:g")
    .attr("id", "group")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


const svg2 = d3.select('#chartBottom')
    .append("svg:svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', svgHeight2 + margin.top + margin.bottom)
    .append("svg:g")
    .attr("id", "group2")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


const deleteMeDialog = d3.select('.delete');  // Selector for delete dialog

const focusOverMouseMove = svg.append("g")    // Selector for mouseover small circle which runs over the line
    .style("display", "block")

const dateScore = d3.select('.dataScore');   // Selector for the date value on the panel
const priceScore = d3.select('.priceScore');  // Selector for price text on the panel


svg.append("defs").append("clipPath")
    .attr("id", "clip1")
    .append("rect")
    .attr("width", width)
    .attr("height", svgHeight1);
let newLines = svg.append("g")
    .attr("class", "newLineGroup")
    .attr("clip-path", "url(#clip1)");

let newCircles = null;

let data = [], date_max, gX, gY, xAxis, yAxis;
let gX2, gY2, xAxis2, yAxis2;
const DELAY = 700;
let clicks = 0, timer = null;
let currentSelect = null;

let zoomToggle = false;
let zoom = null;
let zoom2 = null;
let transform2 = null;


//
// Load CSV
d3.csv("newdata.csv", function (error, rawdata) {
    if (error) throw error;
    // format the data
    console.log(rawdata)
    rawdata.forEach((d, i) => {
        data.push(
            {
                date: d.Date,
                p1: parseFloat(d.Col1),
                p2: parseFloat(d.Col2),
                p3: parseFloat(d.Col3),
                p4: parseFloat(d.Col4)
            }
        )

    });
    console.log(data)

    // Scale the range of the data  to find max and min range to map when zoom in and zoom out
    date_max = d3.max(data, (d)=>d.p3);
    x.domain(d3.extent(data, (d) => d.p3));
    y.domain(d3.extent(data, (d)=> d.p1));


    x2.domain(d3.extent(data, (d) => d.p3));
    y2.domain(d3.extent(data, (d)=> d.p4));

    // Zoom variable [defines how far you can zoom (scaleExtent) and pan (translateExtent)]
    zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[-1000, -1000], [1000, 1000]])
        .on("zoom", zoomed)

    //
    // // x-axis variable
    // xAxis = d3.axisBottom(x)
    //     .ticks(8, 's')
    //     .tickSize(-svgHeight1)
    //     .tickPadding(10);

    // y-axis variable
    yAxis = d3.axisRight(y)
        .ticks(5)
        .tickSize(width)
        .tickPadding(-20 - width)

    // g-element for storing x-axis gridlines
    // gX = svg.append("g")
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate(0," + svgHeight1 + ")")
    //  .call(xAxis);

    // y-element for storing y-axis gridlines
    gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);


    //For chart 2


    // Clip path to prevent shapes 'leaking' outside chartTop body
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", svgHeight1);

    const chartBody = svg.append("g")
        .attr("class", "chartTopBody")
        .attr("clip-path", "url(#clip)");

    // mapping of data to line using the topLineSeries function
    chartBody.append("svg:path")
        .data([data])
        .attr("class", "line")
        .attr("d", topLineSeries);

    // draw small circle which runs over the line for mouseover
    focusOverMouseMove.append("circle")
        .attr("class", "circleFocus");

    // this is the constant define to differentiate between single click and double click.
    // It was little bit tricky to add two events on the same DOM element. so the cirle will be drawn after 300ms
    //If you minimize the time it will be impossible to differentiate between single click and double click.


    // appending of rect to svg on which to call zoom method
    svg.append("rect")
        .attr("id", "rect")
        .attr("width", width)
        .attr("height", svgHeight1)
        .on("mouseover", () => focusOverMouseMove.style("display", null))
        .on("mouseout", () => focusOverMouseMove.style("display", "none"))
        .on("mousemove", mouseMove)

    svg.append("g")
        .attr("transform", "translate(0," + svgHeight1 + ")")
        .call(d3.axisBottom(x).ticks(0));

    svg.append("g")
        .call(d3.axisLeft(y).ticks(0));

    // svg.append("text")
    //     .attr("transform", "translate(" + (width / 2) + " ," + (svgHeight1 + margin.top + 20) + ")")
    //     .text(xAxixText);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 1.2)
        .attr("x", 0 - (svgHeight1 / 2))
        .text(yAxixText);

    newCircles = svg.append("g")
        .classed("newCircles", true);


    // call zoom function on #rect
    d3.select("#rect").call(zoom)
    d3.select("#rect").call(zoom).on("dblclick.zoom", null);

    // assign zoom reset on click of button
    d3.select(".reset").on("click", resetted);


    // x-axis variable
    xAxis2 = d3.axisBottom(x2)
        .ticks(8, 's')
        .tickSize(-svgHeight2)
        .tickPadding(10);

    // y-axis variable
    yAxis2 = d3.axisRight(y2)
        .ticks(5, 's')
        .tickSize(width)
        .tickPadding(-20 - width);

    // g-element for storing x-axis gridlines
    gX2 = svg2.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + svgHeight2 + ")")
        .call(xAxis2);

    // y-element for storing y-axis gridlines
    gY2 = svg2.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis2);

    //


    svg2.append("defs").append("clipPath")
        .attr("id", "clip2")
        .append("rect")
        .attr("width", width)
        .attr("height", svgHeight2);

    const chartBody2 = svg2.append("g")
        .attr("class", "chartTopBody2")
        .attr("clip-path", "url(#clip2)");

    // mapping of data to line using the topLineSeries function
    chartBody2.append("svg:path")
        .data([data])
        .attr("class", "line2")
        .attr("d", bottomLineSeries);


    zoom2 = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[-1000, -1000], [1000, 1000]])
        .on("zoom", zoomed2)


    //  appending of rect to svg on which to call zoom method
    svg2.append("rect")
        .attr("id", "rect2")
        .attr("width", width)
        .attr("height", svgHeight2)

    // call zoom function on #rect
    d3.select("#rect2").call(zoom2)
    d3.select("#rect2").call(zoom2).on("dblclick.zoom", null);


    //Action when user click on save button to download the data
    d3.select('.saveData').on('click', ()=> {


        alert(`There are ${lineDrawnDict.size} circle in dictionary`)

        //circleDrawnDict -> is the variable which holds the circle drawn information
        // You can add your logic here to to create data to store in CSV .


    })

    d3.select(".toggleDraw").on("click", ()=> {
        toogleDrawCircle = !toogleDrawCircle;
        d3.select('.toggleDraw')
            .style('background', ()=>toogleDrawCircle ? 'lightsteelblue' : '');

    });


    d3.select('.plotCircles').on('click', ()=> {
        plotCircle = !plotCircle;
        const transform = d3.zoomTransform(this);
        randomLines.forEach((d)=> {
            generateNewLine(data[d], transform, false);
        })

        d3.select('.plotCircles')
            .style('background', ()=>plotCircle ? 'lightsteelblue' : '');


    })


    //For deleting the circle action
    d3.select('.yes').on('click', ()=> {
        d3.selectAll(`[data-attr="${currentSelect}"]`).remove();
        lineDrawnDict.delete(currentSelect);
        deleteMeDialog.style('display', 'none');
        const countPos = newLines.selectAll('path.pos').size()
        const countNeg = newLines.selectAll('path.neg').size()
        d3.select('.negative').text(`Neg:${countNeg}`)
        d3.select('.positive').text(`Pos:${countPos}`)
        console.log(lineDrawnDict, 'Circle is deleted Successfully!')

    });

    d3.select('.no').on('click', ()=> deleteMeDialog.style('display', 'none'))


})
