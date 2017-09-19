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
const circleDrawnDict = new Map(); // Will store the information of circles drawn after clicked with date and price
const parseTime = d3.timeParse("%Y-%m-%d");  // Date parser for D3;
const bisectDate = d3.bisector((d) =>d.p3).left;

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


const newLines = svg.append("g")
    .classed("newLines", true);

const focusedCircleGroup = svg.append("g")          // Selector for the circles drawn after user clicks
    .classed('focusedClicked', true);

const dateScore = d3.select('.dataScore');   // Selector for the date value on the panel
const priceScore = d3.select('.priceScore');  // Selector for price text on the panel

const dummyDateToPlot = [{
    date: 'Jan 2000',
    price: 1394.46
}, {
    date: 'Jan 2000',
    price: 1394.46
}, {
    date: 'Feb 2000',
    price: 1366.42
}
    , {
        date: 'Mar 2000',
        price: 1498.58
    }, {
        date: 'Jun 2000',
        price: 1454.6
    }]


dummyDateToPlot.forEach((d, i) => {
    d.p3 = +d.p3;
    d.p1 = +d.p1;
});


let data = [], date_max, gX, gY, xAxis, yAxis;
let gX2, gY2, xAxis2, yAxis2;
const DELAY = 300;
let clicks = 0, timer = null;
let currentSelect = null;
//    (80% of vertical svgHeight1) Y Axis: Column P1, X Axis: Column p3
//(20% of vertical svgHeight1) Y Axis: Column P5, X Axis: Column p3

//   x.domain(d3.extent(data, (d) => d.p3));
//  y.domain(d3.extent(data, (d)=> d.p1));
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


    console.log(x.domain(), x2.domain(), y2.domain())
    // Zoom variable [defines how far you can zoom (scaleExtent) and pan (translateExtent)]
    const zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[-1000, -1000], [1000, 1000]])
        .on("zoom", zoomed)


    // x-axis variable
    xAxis = d3.axisBottom(x)
        .ticks(8, 's')
        .tickSize(-svgHeight1)
        .tickPadding(10);

    // y-axis variable
    yAxis = d3.axisRight(y)
        .ticks(5)
        .tickSize(width)
        .tickPadding(-20 - width);

    // g-element for storing x-axis gridlines
    gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + svgHeight1 + ")")
        .call(xAxis);

    // y-element for storing y-axis gridlines
    gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);


    //For chart 2

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


    svg2.append("path")
        .attr("class", "line2")
        .attr("d", bottomLineSeries(data));


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

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (svgHeight1 + margin.top + 20) + ")")
        .text(xAxixText);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 1.2)
        .attr("x", 0 - (svgHeight1 / 2))
        .text(yAxixText);

    // call zoom function on #rect
    d3.select("#rect").call(zoom)
    d3.select("#rect").call(zoom).on("dblclick.zoom", null);

    // assign zoom reset on click of button
    d3.select(".reset").on("click", resetted);
    d3.select(".toggleDraw").on("click", ()=> {
        toogleDrawCircle = !toogleDrawCircle;
        d3.select('.toggleDraw')
            .style('background', ()=>toogleDrawCircle ? 'lightsteelblue' : '');

    });


    //Action when user click on save button to download the data
    d3.select('.saveData').on('click', ()=> {


        alert(`There are ${circleDrawnDict.size} circle in dictionary`)

        //circleDrawnDict -> is the variable which holds the circle drawn information
        // You can add your logic here to to create data to store in CSV .


    })


    d3.select('.plotCircles').on('click', ()=> {
        const transform = d3.zoomTransform(this);
        const xt = transform.rescaleX(x), yt = transform.rescaleY(y);
        d = mouseDate(xt);
        // alert(`${circleDrawnDict.size} circles will be added to the plot from dictionary`)
        dummyDateToPlot.forEach((e, i)=> {
            focusedCircleGroup.append("circle")
                .attr("class", "clickedCircle")
                .attr('data-attr', ()=>e.date)
                .attr('cx', ()=> x(e.p3))
                .attr('cy', ()=> y(e.p1))

        });

        //circleDrawnDict -> is the variable which holds the circle drawn information
        // You can add your logic here to to draw circle from CSV .


    })


    // mouseMove function accesses #rect via this
    // defines movement of hovertool after extracting
    // current zoom extent parameters and applies
    // these to circle and text objects


    //For deleting the circle action
    d3.select('.yes').on('click', ()=> {
        d3.selectAll(`[data-attr="${currentSelect}"]`).remove();
        circleDrawnDict.delete(currentSelect);
        deleteMeDialog.style('display', 'none');
        d3.select('.circleDrawn').text(`Count Circles: ${circleDrawnDict.size}`);

        console.log(circleDrawnDict, 'Circle is deleted Successfully!')

    });

    d3.select('.no').on('click', ()=> deleteMeDialog.style('display', 'none'))


})
