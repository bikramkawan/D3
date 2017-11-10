/**
 * Created by bikramkawan on 10/26/17.
 */

const mapMargin = {top: 30, right: 20, bottom: 50, left: 20},
    mapWidth = 300 - mapMargin.left - mapMargin.right,
    mapHeight = 300 - mapMargin.top - mapMargin.bottom;


const barMargin = {top: 20, right: 20, bottom: 30, left: 40},
    barWidth = 390 - barMargin.left - barMargin.right,
    barHeight = 500 - barMargin.top - barMargin.bottom;

const svgMap = d3.select('.map')
    .append('svg')
    .attr('width', mapWidth + mapMargin.left + mapMargin.right)
    .attr('height', mapHeight + mapMargin.top + mapMargin.bottom)


const svgBar = d3.select('.bar1')
    .append('svg')
    .attr('width', barWidth + barMargin.left + barMargin.right)
    .attr('height', barHeight + barMargin.top + barMargin.bottom)

var path = d3.geoPath().projection(scale(0.25, mapWidth, mapHeight))

function scale(scaleFactor, width, height) {
    return d3.geoTransform({
        point: function (x, y) {

            this.stream.point((x - width / 2) * scaleFactor + width / 2, (y - height / 2) * scaleFactor + height / 2);
        }
    });
}

d3.queue()
    .defer(d3.json, 'usmap.json')
    .defer(d3.tsv, 'states.tsv')
    .defer(d3.csv, 'CountryExport.csv')
    .defer(d3.csv, 'CountryImport.csv')
    .defer(d3.csv, 'StateExport.csv')
    .defer(d3.csv, 'StateImport.csv')
    .awaitAll(ready);


function ready(error, results) {
    console.log(results)
    if (error) throw error;

    const {usmaps, states, countryExport, countryImport, stateExport, stateImport} = prepareData(results);
    svgMap.append("g").attr("transform", "translate(" + -(mapMargin.left) + "," + -(mapMargin.top) + ")")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(usmaps, usmaps.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .on('mouseover', (d)=>console.log(d))

    svgMap.append("g").attr("transform", "translate(" + -(mapMargin.left) + "," + -(mapMargin.top) + ")")
        .append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(usmaps, usmaps.objects.states, function (a, b) {
            return a !== b;
        })));

    const bardata = countryExport.filter(d=>d.statename === 'Alabama');
    console.log(bardata)
    drawBarChart(bardata,svgBar,barMargin,barWidth,barHeight,'i','val2013','bar1Group');
}