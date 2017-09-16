function create_legend(colors, brush) {
    // create legend
    var legend_data = d3.select("#legend")
        .html("")
        .selectAll(".row")
        .data(_.keys(colors).sort())
    //console.log(_.keys(colors).sort());


    // filter by group
    var legend = legend_data
        .enter().append("div")
        .attr("title", "Hide group")
        .on("click", function (d) {
            // toggle food group
            if (_.contains(excluded_groups, d)) {
                //In excluded group, so remove
                d3.select(this).attr("title", "Hide group")
                excluded_groups = _.difference(excluded_groups, [d]);
            } else {
                // Not in excluded group, so add.
                d3.select(this).attr("title", "Show group")
                excluded_groups.push(d);
            }
            brush();
        });

    legend
        .append("span")
        .style("background", (d, i)=> color(d, 1))
        .attr("class", "color-bar");

    legend
        .append("span")
        .attr("class", "tally")
        .text(()=> 0);

    legend
        .append("span")
        .text((d, i)=> " " + d);

    return legend;
}


// render polylines i to i+render_speed
function render_range(selection, i, max, opacity) {
    selection.slice(i, max).forEach(function (d) {
        path(d, foreground, color(d.group, opacity));
    });
};

// simple data table
function data_table(sample) {
    // sort by first column
    var sample = sample.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    var table = d3.select("#initiator-list")
        .html("")
        .selectAll(".row")
        .data(sample)
        .enter().append("div")
        .attr("class", "data-row")
        .on("mouseover", (d)=> highlightScatter(d))
        .on("mouseout", (d)=> removeHighlightScatter(d));

    table
        .append("span")
        .attr("class", "color-block")
        .style("background", (d) =>color(d.group, 0.85))

    table
        .append("span")
        .text((d)=>d.name)
}

// Adjusts rendering speed
function optimize(timer) {
    var delta = (new Date()).getTime() - timer;
    render_speed = Math.max(Math.ceil(render_speed * 30 / delta), 8);
    render_speed = Math.min(render_speed, 300);
    return (new Date()).getTime();
}

// Feedback on rendering progress
function render_stats(i, n, render_speed) {
    d3.select("#rendered-count").text(i);
    d3.select("#rendered-bar")
        .style("width", (100 * i / n) + "%");
    d3.select("#render-speed").text(render_speed);
}

// Feedback on selection
function selection_stats(opacity, n, total) {
    d3.select("#data-count").text(total);
    d3.select("#selected-count").text(n);
    d3.select("#selected-bar").style("width", (100 * n / total) + "%");
    d3.select("#opacity").text(("" + (opacity * 100)).slice(0, 4) + "%");
}

function highlight(d) {
    d3.select("#foreground").style("opacity", "0.25");
    d3.selectAll(".row").style("opacity", (p)=> (d.group == p) ? null : "0.3");
    //console.log(d);
    path(d, highlighted, color(d.group, 1));
    addTextLabels(d, 1);


}

// Remove highlight
function unhighlight() {
    d3.select("#foreground").style("opacity", null);
    d3.selectAll(".row").style("opacity", null);
    highlighted.clearRect(0, 0, w, h);
    d3.selectAll('.textHighlight').remove();
}


function invert_axis(d) {
    // save extent before inverting
    if (!yscale[d].brush.empty()) {
        var extent = yscale[d].brush.extent();
    }
    if (yscale[d].inverted == true) {
        yscale[d].range([h, 0]);
        d3.selectAll('.label')
            .filter((p)=>p == d)
            .style("text-decoration", null);
        yscale[d].inverted = false;
    } else {
        yscale[d].range([0, h]);
        d3.selectAll('.label')
            .filter((p)=> p == d)
            .style("text-decoration", "underline");
        yscale[d].inverted = true;
    }
    return extent;
}

// Draw a single polyline
/*
 function path(d, ctx, color) {
 if (color) ctx.strokeStyle = color;
 var x = xscale(0)-15;
 y = yscale[dimensions[0]](d[dimensions[0]]);   // left edge
 ctx.beginPath();
 ctx.moveTo(x,y);
 dimensions.map(function(p,i) {
 x = xscale(p),
 y = yscale[p](d[p]);
 ctx.lineTo(x, y);
 });
 ctx.lineTo(x+15, y);                               // right edge
 ctx.stroke();
 }
 */

// Draw a single polyline
function path(d, ctx, color) {

    if (color) ctx.strokeStyle = color;
    var x = xscale(0) - 15;
    var y = yscale[dimensions[0]](d[dimensions[0]]);   // left edge

    x_orig = -1
    ctx.beginPath();
    for (i = 0; i < dimensions.length; i++) {
        p = dimensions[i];
        x = xscale(p),
            y = yscale[p](d[p]);

        if (x_orig != -1) {
            ctx.bezierCurveTo(x_orig + 15, y_orig, x - 15, y, x, y);
        } else {
            ctx.moveTo(x, y);
        }
        x_orig = x
        y_orig = y
    }
    ;
    ctx.stroke();
}


function path_orig(d, ctx, color) {
    if (color) ctx.strokeStyle = color;
    ctx.beginPath();
    var x0 = xscale(0) - 15,
        y0 = yscale[dimensions[0]](d[dimensions[0]]);   // left edge
    // start
    ctx.moveTo(x0, y0);
    dimensions.map(function (p, i) {
        var x = xscale(p),
            y = yscale[p](d[p]);
        var delta = x - x0;
        var cp1x = x - 0.85 * delta;
        var cp1y = y0;
        var cp2x = x - 0.15 * delta;
        var cp2y = y;
        // control, end
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        x0 = x;
        y0 = y;
    });
    ctx.lineTo(x0 + '00', y0);                               // right edge
    ctx.stroke();
};

function color(d, a) {
    var c = colors[d];
    return ["hsla(", c[0], ",", c[1], "%,", c[2], "%,", a, ")"].join("");
}

function position(d) {
    var v = dragging[d];
    return v == null ? xscale(d) : v;
}

// Handles a brush event, toggling the display of foreground lines.
// TODO refactor
let selected = [];
const tempdata = 1;


function brush() {
    console.log("calling brush()..");
    //return;

    brush_count++;
    var actives = dimensions.filter(function (p) {
            return !yscale[p].brush.empty();
        }),

        extents = new Array(actives.length);
    for (i = 0; i < extents.length; i++) {
        extents[i] = yscale[actives[i]].brush.extent()
    }

    // hack to hide ticks beyond extent
    var b = d3.selectAll('.dimension')[0];
    for (i = 0; i < b.length; i++) {
        element = b[i];
        var dimension = d3.select(element).data()[0];
        d3.select(element)
            .selectAll('text')
            .style('font-size', null)
            .style('font-weight', null)
            .style('display', null);
        d3.select(element)
            .selectAll('.label')
            .style('display', null);
    }
    ;

    // bold dimensions with label
    d3.selectAll('.label')
        .style("font-weight", (dimension) => {
            if (_.include(actives, dimension)) return "bold";
            return null;
        });

    // Get lines within extents

    data
        .filter((d) =>!_.contains(excluded_groups, d.group))
        .map((d)=> {
            return actives.every((p, dimension) => {
                return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
            }) ? selected.push(d) : null;
        });

    // free text search
    var query = d3.select("#search")[0][0].value;
    if (query.length > 0) {
        selected = search(selected, query);
    }

    if (selected.length < data.length && selected.length > 0) {
        d3.select("#keep-data").attr("disabled", null);
        d3.select("#exclude-data").attr("disabled", null);
    } else {
        d3.select("#keep-data").attr("disabled", "disabled");
        d3.select("#exclude-data").attr("disabled", "disabled");
    }
    ;

    // total by food group
    var tallies = _(selected)
        .groupBy((d)=>d.group)

    // include empty groups
    _(colors).each((v, k)=> tallies[k] = tallies[k] || []);

    legend
        .style("text-decoration", (d)=> _.contains(excluded_groups, d) ? "line-through" : null)
        .attr("class", (d)=> (tallies[d].length > 0) ? "row" : "row off");

    legend.selectAll(".color-bar")
        .style("width", (d) => Math.ceil(1200 * tallies[d].length / data.length) + "px");

    legend.selectAll(".tally")
        .text((d, i)=>tallies[d].length);

    // Render selected lines
    paths(selected, foreground, brush_count, true);

    const selection = d3.select(this);
    if (extents.length === 0) {
        // Render BW plot
        showScatterPlot(selected, foreground, brush_count, false);
    }

    if (selection.data()[0] === 'Read BW demand') {

        const bwExtents = yscale['Read BW demand'].brush.extent();

        const top = yscale['Read BW demand'](bwExtents[0])
        const bottom = yscale['Read BW demand'](bwExtents[1])
        drawExtentsText([top, bottom], bwExtents, selection);
        const filterData = data.slice().filter((d)=> d['Read BW demand'] >= bwExtents[0] && d['Read BW demand'] < bwExtents[1]);

        showScatterPlot(filterData, foreground, brush_count, true);
    }


} // brush()

function drawExtentsText(position, extents, selection) {

    selection.selectAll('text').remove();

    selection.append('text')
        .classed('extent1', true)
        .attr('x', 13)
        .attr('y', position[0])
        .text(extents[0].toFixed(2))
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "red");

    selection.append('text')
        .classed('extent2', true)
        .attr('x', 13)
        .attr('y', position[1])
        .text(extents[1].toFixed(2))
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "red");


}


// render a set of polylines on a canvas
function paths(selected, ctx, count) {
    var n = selected.length,
        i = 0,
        opacity = d3.min([2 / Math.pow(n, 0.3), 1]),
        timer = (new Date()).getTime();

    selection_stats(opacity, n, data.length)

    shuffled_data = _.shuffle(selected);
    //shuffled_data = selected;

    data_table(shuffled_data.slice(0, 25));

    ctx.clearRect(0, 0, w + 1, h + 1);

    // render all lines until finished or a new brush event
    function animloop() {
        if (i >= n || count < brush_count) return true;
        var max = d3.min([i + render_speed, n]);
        render_range(shuffled_data, i, max, opacity);
        render_stats(max, n, render_speed);
        i = max;
        timer = optimize(timer);  // adjusts render_speed
    };

    d3.timer(animloop);

}

// transition ticks for reordering, rescaling and inverting
function update_ticks(d, extent) {
    // update brushes
    if (d) {
        var brush_el = d3.selectAll(".brush")
            .filter((key)=> key == d);
        // single tick
        if (extent) {
            // restore previous extent
            brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).extent(extent).on("brush", brush));
        } else {
            brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
        }
    } else {
        // all ticks
        d3.selectAll(".brush")
            .each(function (d) {
                d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
            })
    }

    brush_count++;

    show_ticks();

    // update axes
    d3.selectAll(".axis")
        .each(function (d, i) {
            // hide lines for better performance
            d3.select(this).selectAll('line').style("display", "none");

            // transition axis numbers
            d3.select(this)
                .transition()
                .duration(720)
                .call(axis.scale(yscale[d]));

            // bring lines back
            d3.select(this).selectAll('line').transition().delay(800).style("display", null);

            d3.select(this)
                .selectAll('text')
                .style('font-weight', null)
                .style('font-size', null)
                .style('display', null);
        });
}

// Rescale to new dataset domain
function rescale() {
    // reset yscales, preserving inverted state
    dimensions.forEach((d, i)=> {
        if (yscale[d].inverted) {
            yscale[d] = d3.scale.linear()
                .domain(d3.extent(data, (p)=> +p[d]))
                .range([0, h]);
            yscale[d].inverted = true;
        } else {
            yscale[d] = d3.scale.linear()
                .domain(d3.extent(data, (p) => +p[d]))
                .range([h, 0]);
        }
    });

    update_ticks();

    // Render selected data
    paths(data, foreground, brush_count);
}

// Get polylines within extents
function actives() {
    var actives = dimensions.filter((p) =>!yscale[p].brush.empty()),
        extents = actives.map((p)=>yscale[p].brush.extent());

    // filter extents and excluded groups
    var selected = [];
    data
        .filter((d)=>!_.contains(excluded_groups, d.group))
        .map((d)=> {
            return actives.every((p, i) => extents[i][0] <= d[p] && d[p] <= extents[i][1]) ? selected.push(d) : null;
        });

    // free text search
    var query = d3.select("#search")[0][0].value;
    if (query > 0) {
        selected = search(selected, query);
    }

    return selected;
}

// Export data
function export_csv() {
    var keys = d3.keys(data[0]);
    var rows = actives().map((row)=> {
        return keys.map((k)=> row[k])
    });
    var csv = d3.csv.format([keys].concat(rows)).replace(/\n/g, "<br/>\n");
    var styles = "<style>body { font-family: sans-serif; font-size: 12px; }</style>";
    window.open("csv").document.write(styles + csv);
}

// scale to window size
window.onresize = function () {
    width = document.body.clientWidth,
        height = d3.max([document.body.clientHeight - 500, 220]);

    w = width - m[1] - m[3],
        h = height - m[0] - m[2];

    d3.select("#chart")
        .style("height", (h + m[0] + m[2]) + "px")

    d3.selectAll("canvas")
        .attr("width", w)
        .attr("height", h)
        .style("padding", m.join("px ") + "px");

    d3.select("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .select("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    xscale = d3.scale.ordinal().rangePoints([0, w], 1).domain(dimensions);
    dimensions.forEach((d)=> yscale[d].range([h, 0]));

    d3.selectAll(".dimension")
        .attr("transform", (d)=> "translate(" + xscale(d) + ")")
    // update brush placement
    d3.selectAll(".brush")
        .each(function (d) {
            d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
        })
    brush_count++;

    // update axis placement
    axis = axis.ticks(1 + height / 50),
        d3.selectAll(".axis")
            .each(function (d) {
                d3.select(this).call(axis.scale(yscale[d]));
            });

    // render data
    brush();
};

// Remove all but selected from the dataset
function keep_data() {
    new_data = actives();
    if (new_data.length == 0) {
        alert("Can't remove all the data.\n\nTry removing some brushes to get your data back. Then click 'Keep' when you've selected data you want to look closer at.");
        return false;
    }
    data = new_data;
    rescale();
}

// Exclude selected from the dataset
function exclude_data() {
    new_data = _.difference(data, actives());
    if (new_data.length == 0) {
        alert("Can't remove all the data.\n\nTry selecting just a few data points then clicking 'Exclude'.");
        return false;
    }
    data = new_data;
    rescale();
}

function remove_axis(d, g) {
    dimensions = _.difference(dimensions, [d]);
    xscale.domain(dimensions);
    g.attr("transform", (p) => "translate(" + position(p) + ")");
    g.filter((p) =>p == d).remove();
    update_ticks();
}

d3.select("#keep-data").on("click", keep_data);
d3.select("#exclude-data").on("click", exclude_data);
d3.select("#export-data").on("click", export_csv);
d3.select("#search").on("keyup", brush);


// Appearance toggles
d3.select("#hide-ticks").on("click", hide_ticks);
d3.select("#show-ticks").on("click", show_ticks);
d3.select("#dark-theme").on("click", dark_theme);
d3.select("#light-theme").on("click", light_theme);
d3.select("#remove-filters").on("click", resetFilters);
d3.select("#unselect-all").on("click", unselectAll);
d3.select("#select-all").on("click", selectAll);

function resetFilters() {
    update_ticks()
    brush();
}

function unselectAll() {
    excluded_groups = _.keys(colors);
    d3.selectAll("#select-all").attr("disabled", null);
    d3.selectAll("#unselect-all").attr("disabled", "disabled");
    brush();
}

function selectAll() {
    excluded_groups = [];
    d3.selectAll("#select-all").attr("disabled", "disabled");
    d3.selectAll("#unselect-all").attr("disabled", null);
    brush();
}

function hide_ticks() {
    d3.selectAll(".axis g").style("display", "none");
    d3.selectAll("g.x.baxis").style("display", "none");
    d3.selectAll("g.y.baxis").style("display", "none");
//d3.selectAll(".axis path").style("display", "none");
    d3.selectAll(".background").style("visibility", "hidden");
    d3.selectAll("#hide-ticks").attr("disabled", "disabled");
    d3.selectAll("#show-ticks").attr("disabled", null);
};

function show_ticks() {
    d3.selectAll(".axis g").style("display", null);
    d3.selectAll("g.x.baxis").style("display", null);
    d3.selectAll("g.y.baxis").style("display", null);
//d3.selectAll(".axis path").style("display", null);
    d3.selectAll(".background").style("visibility", null);
    d3.selectAll("#show-ticks").attr("disabled", "disabled");
    d3.selectAll("#hide-ticks").attr("disabled", null);
};

function dark_theme() {
    d3.select("body").attr("class", "dark");
    d3.selectAll("#dark-theme").attr("disabled", "disabled");
    d3.selectAll("#light-theme").attr("disabled", null);
}

function light_theme() {
    d3.select("body").attr("class", null);
    d3.selectAll("#light-theme").attr("disabled", "disabled");
    d3.selectAll("#dark-theme").attr("disabled", null);
}

function search(selection, str) {
    pattern = new RegExp(str, "i")
    return _(selection).filter((d)=>pattern.exec(d.name));
}


/* Correlation scatter plot */
console.log("Create correlation scatter plot..");


const margins1 = {
    "left": 40,
    "right": 30,
    "top": 30,
    "bottom": 30
};

var margins2 = {
    "left": 60,
    "right": 30,
    "top": 30,
    "bottom": 30
};


var chartDiv = document.getElementById("plot1");
var plot1Width = chartDiv.clientWidth;

const constants = {
    plot1XScale: ()=> d3.scale.linear().domain([-100, 100]).range([0, plot1Width - margins1.left - margins1.right]),

    plot1YScale: ()=> d3.scale.linear().domain([-100, 100]).range([plot1Width - margins1.top - margins1.bottom, 0]),

    plot2XScale: ()=> d3.scale.linear().domain([0, 3000]).range([0, plot1Width - margins2.left - margins2.right]),

    plot2YScale: ()=> d3.scale.linear().domain([0, 8100]).range([plot1Width - margins2.top - margins2.bottom, 0]),

    plot3XScale: () => d3.scale.linear().domain([0, 70]).range([0, plot1Width - margins2.left - margins2.right]),

    plot3YScale: ()=> d3.scale.linear().domain([0, 40]).range([plot1Width - margins2.top - margins2.bottom, 0]),


}


function showScatterPlot(selected, foreground, brush_count, drawRect) {
    console.log("In showScatterPlot()...");
    // console.log(brush_count,foreground)
    // just to have some space around items.

    var margins1 = {
        "left": 40,
        "right": 30,
        "top": 30,
        "bottom": 30
    };


    const plot1 = {
        xScale: constants.plot1XScale(),
        yScale: constants.plot1YScale(),
        dataset: selected,
        margins: margins1,
        svgSelector: 'plot1',
        lineClassName: 'plot1Line',
        groupNodeClassName: 'node1',
        attributes: ["Read BW % diff", "Write BW % diff"],


    }
    const margins2 = {
        "left": 60,
        "right": 30,
        "top": 30,
        "bottom": 30
    };

    const plot2 = {
        xScale: constants.plot2XScale(),
        yScale: constants.plot2YScale(),
        dataset: selected,
        margins: margins2,
        svgSelector: 'plot2',
        lineClassName: 'plot2Line',
        groupNodeClassName: 'node2',
        attributes: ["Read Latency", "Write Latency"]

    };


    const plot3 = {
        xScale: constants.plot3XScale(),
        yScale: constants.plot3YScale(),
        dataset: selected,
        margins: margins2,
        svgSelector: 'plot3',
        lineClassName: 'plot3Line',
        groupNodeClassName: 'node3',
        attributes: ["Read Outstanding", "Write Outstanding"]

    }

    const plotBrushRect = true;
    plotScatterGlobal(plot1, drawRect);

    plotScatterGlobal(plot2);

    plotScatterGlobal(plot3);


}


function plotScatterGlobal(plot, drawRect) {

    var chartDiv = document.getElementById("plot1");
    // Extract the width and height that was computed by CSS.
    const width = chartDiv.clientWidth;

    const xScale = plot.xScale;
    const yScale = plot.yScale;
    const margins = plot.margins;
    const selected = plot.dataset;
    const svgSelect = plot.svgSelector;
    const attributes = plot.attributes;
    const {lineClassName, groupNodeClassName} = plot;
    const rectYCord = [-5, 5 + yScale.range()[0]];
    const sortedData = _.sortBy(selected.slice(), 'Read BW % diff');

    d3.select(`#${svgSelect}`).html("");
    const svg = d3.select(`#${svgSelect}`)
        .append("svg")
        .attr("width", width)
        .attr("height", width)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");


    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x baxis").attr("transform", "translate(0," + yScale.range()[0] + ")");
    svg.append("g").attr("class", "y baxis");

    // this is our X axis label. Nothing too special to see here.
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 30)
        .attr("class", "label")
        .text("Read % diff");

    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "middle")
        .attr("x", -90)
        .attr("y", -30)
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .text("Write % diff");

    svg.append('path')
        .attr('class', lineClassName)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    if (drawRect && sortedData.length > 0) {
        const leftCoord = sortedData[0]['Read BW % diff'];
        const rightCord = sortedData[sortedData.length - 1]['Read BW % diff']
        svg.append("rect")
            .classed('rectbrush', true)
            .attr("x", xScale(leftCoord))
            .attr("y", rectYCord[0])
            .attr("width", xScale(rightCord) - xScale(leftCoord))
            .attr("height", rectYCord[1])

    }

    const xAxix = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    const yAxix = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);
    svg.selectAll("g.y.baxis").call(yAxix);
    svg.selectAll("g.x.baxis").call(xAxix);

    const dataset = svg.selectAll(`g.${groupNodeClassName}`).data(selected, (d)=>d.name);
    const datasetGroup = dataset.enter().append("g")
        .attr("class", groupNodeClassName)
        .attr('data-attr', (d)=>d.name)
        .attr('transform', (d)=> "translate(" + xScale(d[attributes[0]]) + "," + yScale(d[attributes[1]]) + ")");

    datasetGroup.append("circle")
        .attr("r", 5)
        .attr("class", "dot")
        .attr('data-attr', (d)=>d.name)
        .style("fill", (d)=> color(d.group, 1));

    datasetGroup.append("text")
        .attr("text-anchor", "middle")
        .attr('data-attr-t1', (d)=>d.name)
        .style("visibility", "hidden")
        .text((d)=>d.name);

    datasetGroup
        .on("mouseover", (d)=> highlightScatter(d))
        .on("mouseout", (d)=> removeHighlightScatter(d))


}


function highlightScatter(d) {


    d3.selectAll('.node1').attr('opacity', 0.015)
    d3.selectAll('.node2').attr('opacity', 0.015)
    d3.selectAll('.node3').attr('opacity', 0.015)
    d3.selectAll(`[data-attr="${d.name}"]`).attr('opacity', '1')
    d3.selectAll(`[data-attr="${d.name}"]`).attr('r', 8)

    d3.selectAll(`[data-attr-t1="${d.name}"]`).style("visibility", "visible")
    d3.selectAll(`[data-attr-t2="${d.name}"]`).style("visibility", "visible")
    d3.selectAll(`[data-attr-t3="${d.name}"]`).style("visibility", "visible")

    updateScatterLines(d);

    return highlight(d);

}


function removeHighlightScatter(d) {
    d3.selectAll('.node1').attr('opacity', '1')
    d3.selectAll('.node2').attr('opacity', '1')
    d3.selectAll('.node3').attr('opacity', '1')
    d3.selectAll(`[data-attr="${d.name}"]`).attr('r', 5)

    d3.selectAll(`[data-attr-t1="${d.name}"]`).style("visibility", "hidden")
    d3.selectAll(`[data-attr-t2="${d.name}"]`).style("visibility", "hidden")
    d3.selectAll(`[data-attr-t3="${d.name}"]`).style("visibility", "hidden")
    d3.selectAll('.plot1Line').style('display', 'none');
    d3.selectAll('.plot2Line').style('display', 'none');
    d3.selectAll('.plot3Line').style('display', 'none');


    return unhighlight(d)


}

function updateScatterLines(d) {

    const plot1XScale = constants.plot1XScale();
    const plot1YScale = constants.plot1YScale();
    const plot1 = [plot1XScale(d["Read BW % diff"]), plot1YScale(d["Write BW % diff"])];

    d3.select('.plot1Line')
        .attr("d", `M0 ${plot1[1]} L${plot1[0]} ${plot1[1]} M${plot1[0]} ${plot1[1]} L${plot1[0]} ${plot1YScale.range()[0]}`)
        .attr("stroke", ()=> color(d.group, 1))
        .style('display', 'block');

    const plot2XScale = constants.plot2XScale();
    const plot2YScale = constants.plot2YScale();
    const plot2 = [plot2XScale(d["Read Latency"]), plot2YScale(d["Write Latency"])]

    d3.select('.plot2Line')
        .attr("d", `M0 ${plot2[1]} L${plot2[0]} ${plot2[1]} M${plot2[0]} ${plot2[1]} L${plot2[0]} ${plot2YScale.range()[0]}`)
        .attr("stroke", ()=> color(d.group, 1))
        .style('display', 'block');


    const plot3XScale = constants.plot3XScale();
    const plot3YScale = constants.plot3YScale();

    const plot3 = [plot3XScale(d["Read Outstanding"]), plot3YScale(d["Write Outstanding"])]

    d3.select('.plot3Line')
        .attr("d", `M0 ${plot3[1]} L${plot3[0]} ${plot3[1]} M${plot3[0]} ${plot3[1]} L${plot3[0]} ${plot3YScale.range()[0]}`)
        .attr("stroke", ()=> color(d.group, 1))
        .style('display', 'block');


}


// TODO below. Add text to axis-line crossings.
function addTextLabels(data) {

    const textGroup = svg.append("g").classed('textHighlight', true);
    const coords = Array.from({length: dimensions.length}, (v, i) => i)
        .map((e, i)=> {
            const p = dimensions[i];
            const x = xscale(p);
            const y = yscale[p](data[p]);
            const pval = data[p].toFixed(2);
            return {x, y, pval}
        });


    textGroup.selectAll('text')
        .data(coords)
        .enter()
        .append("text")
        .classed('tooltopText', true)
        .attr("transform", (d)=> "translate(" + d.x + "," + d.y + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text((d)=> d.pval);


}

