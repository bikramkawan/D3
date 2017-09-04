var width = document.body.clientWidth,
    height = d3.max([document.body.clientHeight - 540, 240]);
//height = d3.max([document.body.clientHeight-0, 240]);

var m = [60, 0, 10, 0],
    w = width - m[1] - m[3],
    h = height - m[0] - m[2],
    xscale = d3.scale.ordinal().rangePoints([0, w], 1),
    yscale = {},
    dragging = {},
    line = d3.svg.line(),
    axis = d3.svg.axis().orient("left").ticks(1 + height / 50),
    data,
    foreground,
    background,
    highlighted,
    lfg,
    lbg,
    lhi,
    ofg,
    obg,
    ohi,
    dimensions,
    legend,
    render_speed = 50,
    brush_count = 0,
    excluded_groups = [];


// colors here by initiator group
// key is "initiator"
// value is "color"
var colors = {
    "cpu0": [185, 56, 73],
    "cpu1": [37, 50, 75],
    "cpu2": [325, 50, 39],
    "elf": [10, 28, 67],
    "gpu0": [271, 39, 57],
    "gpu1": [56, 58, 73],
    "npu": [28, 100, 52],
    "pcie0": [41, 75, 61],
    "pcie1": [60, 86, 61],
    "pcie2": [30, 100, 73],
    "pcie3": [318, 65, 67],
    "sata": [274, 30, 76],
    "startup": [20, 49, 49],
    "usb0": [334, 80, 84],
    "usb1": [185, 80, 45],
    "core0": [10, 30, 42],
    "core1": [339, 60, 49],
    "core2": [359, 69, 49],
    "core3": [204, 70, 41],
    "videoin": [1, 100, 79],
    "videoout": [189, 57, 75],
    "vxd0": [110, 57, 70],
    "vxd1": [214, 55, 79],
    "vxe0": [339, 60, 75],
    "vxe1": [120, 56, 40],
    "vxe2": [128, 128, 128]
};


// Scale chart and canvas height
d3.select("#chart")
    .style("height", (h + m[0] + m[2]) + "px")

d3.selectAll("canvas")
    .attr("width", w)
    .attr("height", h)
    .style("padding", m.join("px ") + "px");


// Foreground canvas for primary view - containd actual lines
foreground = document.getElementById('foreground').getContext('2d');
foreground.globalCompositeOperation = "destination-over";
foreground.strokeStyle = "rgba(0,100,160,0.1)";
foreground.lineWidth = 1.7;
foreground.fillText("Loading...", w / 2, h / 2);

// Highlight canvas for temporary interactions
highlighted = document.getElementById('highlight').getContext('2d');
highlighted.strokeStyle = "rgba(0,100,160,1)";
highlighted.lineWidth = 4;

// Background canvas - contains labels
background = document.getElementById('background').getContext('2d');
background.strokeStyle = "rgba(0,100,160,0.1)";
background.lineWidth = 1.7;

// SVG for ticks, labels, and interactions
var svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

// Load the data and visualization
d3.csv("results.csv", function (raw_data) {

    // Convert quantitative scales to floats
    data = raw_data.map(function (d) {
        for (var k in d) {
            if (!_.isNaN(raw_data[0][k] - 0) && k != 'id') {
                d[k] = parseFloat(d[k]) || 0;
            }
        }
        ;
        return d;
    });

    // 1. Extract the list of numerical dimensions and create a scale for each.
    xscale.domain(dimensions = d3.keys(data[0]).filter(function (k) {
        console.log('-----');
        console.log(k);
        //console.log(data[0][k]);

        isNumber = _.isNumber(data[0][k]);
        yscale[k] = d3.scale.linear()
            .domain(d3.extent(data, function (d) {
                return +d[k];
            }))
            .range([h, 0]);

        if (k.indexOf("supply") !== -1) {
            //console.log("Supply Found");
            yscale[k] = d3.scale.linear()
                .domain([0, 25600])
                .range([h, 0]);
        }

        //console.log(yscale[k]);

        return (isNumber && yscale[k]);
    }));

    // 2. Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("svg:g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + xscale(d) + ")";
        })
        .call(d3.behavior.drag()
            .on("dragstart", function (d) {
                dragging[d] = this.__origin__ = xscale(d);
                this.__dragged__ = false;
                d3.select("#foreground").style("opacity", "0.35");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
                dimensions.sort(function (a, b) {
                    return position(a) - position(b);
                });
                xscale.domain(dimensions);
                g.attr("transform", function (d) {
                    return "translate(" + position(d) + ")";
                });
                brush_count++;
                this.__dragged__ = true;

                // Feedback for axis deletion if dropped
                if (dragging[d] < 12 || dragging[d] > w - 12) {
                    d3.select(this).select(".background").style("fill", "#b00");
                } else {
                    d3.select(this).select(".background").style("fill", null);
                }
            })
            .on("dragend", function (d) {
                if (!this.__dragged__) {
                    // no movement, invert axis
                    var extent = invert_axis(d);

                } else {
                    // reorder axes
                    d3.select(this).transition().attr("transform", "translate(" + xscale(d) + ")");

                    var extent = yscale[d].brush.extent();
                }

                // remove axis if dragged all the way left
                if (dragging[d] < 12 || dragging[d] > w - 12) {
                    remove_axis(d, g);
                }

                // TODO required to avoid a bug
                xscale.domain(dimensions);
                update_ticks(d, extent);

                // rerender
                d3.select("#foreground").style("opacity", null);
                brush();
                delete this.__dragged__;
                delete this.__origin__;
                delete dragging[d];
            }))

    // 3. Add an axis and title.
    g.append("svg:g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .each(function (d) {
            d3.select(this).call(axis.scale(yscale[d]));
        })
        .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("y", function (d, i) {
            return i % 2 == 0 ? -14 : -30
        })
        .attr("x", 0)
        .attr("class", "label")
        .text(String)
        .append("title")
        .text("Click to invert. Drag to reorder");


    // 4. Add and store a brush for each axis.
    g.append("svg:g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
        })
        .selectAll("rect")
        .style("visibility", null)
        .attr("x", -23)
        .attr("width", 36)
        .append("title")
        .text("Drag up or down to brush along this axis");

    g.selectAll(".extent")
        .append("title")
        .text("Drag or resize this filter");

    // 5. Create list of initiator types
    legend = create_legend(colors, brush);

    // 5. Render full foreground
    brush();

}); // d3.csv()


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
        .style("background", function (d, i) {
            return color(d, 1)
        })
        .attr("class", "color-bar");

    legend
        .append("span")
        .attr("class", "tally")
        .text(function (d, i) {
            return 0
        });

    legend
        .append("span")
        .text(function (d, i) {
            return " " + d
        });

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
    var sample = sample.sort(function (a, b) {
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
        .on("mouseover", highlight)
        .on("mouseout", unhighlight);
    console.log(sample)
    table
        .append("span")
        .attr("class", "color-block")
        .style("background", function (d) {
            return color(d.group, 0.85)
        })

    table
        .append("span")
        .text(function (d) {
            return d.name;
        })
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

// TODO below. Add text to axis-line crossings.
function addTextLabels(d) {
    coords = new Array(dimensions.length);

    for (i = 0; i < dimensions.length; i++) {
        coords[i] = new Array(3);
        p = dimensions[i];
        x = xscale(p),
            y = yscale[p](d[p]);
        coords[i][0] = x;
        coords[i][1] = y;
        coords[i][2] = d[p].toFixed(2);

        svg.append("text")
            .attr("transform", "translate(" + x + "," + y + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            .text(d[p].toFixed(2));
    }
    ;
}


function highlight(d) {
    d3.select("#foreground").style("opacity", "0.25");
    d3.selectAll(".row").style("opacity", function (p) {
        return (d.group == p) ? null : "0.3"
    });
    //console.log(d);
    path(d, highlighted, color(d.group, 1));
    //addTextLabels(d, 1);


}

// Remove highlight
function unhighlight() {
    d3.select("#foreground").style("opacity", null);
    d3.selectAll(".row").style("opacity", null);
    highlighted.clearRect(0, 0, w, h);
}

function invert_axis(d) {
    // save extent before inverting
    if (!yscale[d].brush.empty()) {
        var extent = yscale[d].brush.extent();
    }
    if (yscale[d].inverted == true) {
        yscale[d].range([h, 0]);
        d3.selectAll('.label')
            .filter(function (p) {
                return p == d;
            })
            .style("text-decoration", null);
        yscale[d].inverted = false;
    } else {
        yscale[d].range([0, h]);
        d3.selectAll('.label')
            .filter(function (p) {
                return p == d;
            })
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
        .style("font-weight", function (dimension) {
            if (_.include(actives, dimension)) return "bold";
            return null;
        });

    // Get lines within extents
    var selected = [];
    data
        .filter(function (d) {
            return !_.contains(excluded_groups, d.group);
        })
        .map(function (d) {
            return actives.every(function (p, dimension) {
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
        .groupBy(function (d) {
            return d.group;
        })

    // include empty groups
    _(colors).each(function (v, k) {
        tallies[k] = tallies[k] || [];
    });

    legend
        .style("text-decoration", function (d) {
            return _.contains(excluded_groups, d) ? "line-through" : null;
        })
        .attr("class", function (d) {
            return (tallies[d].length > 0)
                ? "row"
                : "row off";
        });

    legend.selectAll(".color-bar")
        .style("width", function (d) {
            return Math.ceil(1200 * tallies[d].length / data.length) + "px"
        });

    legend.selectAll(".tally")
        .text(function (d, i) {
            return tallies[d].length
        });

    // Render selected lines
    paths(selected, foreground, brush_count, true);


    // Render BW plot
    showScatterPlot(selected, foreground, brush_count);
} // brush()

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
            .filter(function (key) {
                return key == d;
            });
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
    dimensions.forEach(function (d, i) {
        if (yscale[d].inverted) {
            yscale[d] = d3.scale.linear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([0, h]);
            yscale[d].inverted = true;
        } else {
            yscale[d] = d3.scale.linear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([h, 0]);
        }
    });

    update_ticks();

    // Render selected data
    paths(data, foreground, brush_count);
}

// Get polylines within extents
function actives() {
    var actives = dimensions.filter(function (p) {
            return !yscale[p].brush.empty();
        }),
        extents = actives.map(function (p) {
            return yscale[p].brush.extent();
        });

    // filter extents and excluded groups
    var selected = [];
    data
        .filter(function (d) {
            return !_.contains(excluded_groups, d.group);
        })
        .map(function (d) {
            return actives.every(function (p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? selected.push(d) : null;
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
    var rows = actives().map(function (row) {
        return keys.map(function (k) {
            return row[k];
        })
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
    dimensions.forEach(function (d) {
        yscale[d].range([h, 0]);
    });

    d3.selectAll(".dimension")
        .attr("transform", function (d) {
            return "translate(" + xscale(d) + ")";
        })
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
    g.attr("transform", function (p) {
        return "translate(" + position(p) + ")";
    });
    g.filter(function (p) {
        return p == d;
    }).remove();
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
//d3.selectAll(".axis path").style("display", "none");
    d3.selectAll(".background").style("visibility", "hidden");
    d3.selectAll("#hide-ticks").attr("disabled", "disabled");
    d3.selectAll("#show-ticks").attr("disabled", null);
};

function show_ticks() {
    d3.selectAll(".axis g").style("display", null);
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
    return _(selection).filter(function (d) {
        return pattern.exec(d.name);
    });
}


/* Correlation scatter plot */
console.log("Create correlation scatter plot..");

function showScatterPlot_(selected, foreground, brush_count) {
}


function showScatterPlot(selected, foreground, brush_count) {

    console.log("In showScatterPlot()...");
    var chartDiv = document.getElementById("plot1");
    // Extract the width and height that was computed by CSS.
//  var width = 350;
//  var height = 350;
    var width = chartDiv.clientWidth;
    var height = width;

     console.log(width,height)
    // just to have some space around items.
    var margins = {
        "left": 40,
        "right": 30,
        "top": 30,
        "bottom": 30
    };


    //
    // Bandwidth plot
    //

    d3.select("#plot1").html("");
    var svg = d3.select("#plot1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // this sets the scale that we're using for the X and y axis. 
    var x = d3.scale.linear()
        .domain([-100, 100])
        .range([0, width - margins.left - margins.right]);

    var y = d3.scale.linear()
        .domain([-100, 100])
        .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x baxis").attr("transform", "translate(0," + y.range()[0] + ")");
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

    var xAxis1 = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis1 = d3.svg.axis().scale(y).orient("left").tickPadding(2);
    svg.selectAll("g.y.baxis").call(yAxis1);
    svg.selectAll("g.x.baxis").call(xAxis1);

    var dataset = svg.selectAll("g.node").data(selected, function (d) {
        return d.name;
    });
    var datasetGroup = dataset.enter().append("g").attr("class", "node")
        .on("mouseover", highlight)
        .on("mouseout", unhighlight)
        .attr('transform', function (d) {
            return "translate(" + x(d["Read BW % diff"]) + "," + y(d["Write BW % diff"]) + ")";
        });
    datasetGroup.append("circle")
        .attr("r", 5)
        .attr("class", "dot")
        .style("fill", function (d) {
            return color(d.group, 1); // TODO 0.85
        });


    //
    // Latency plot
    //
    var margins = {
        "left": 60,
        "right": 30,
        "top": 30,
        "bottom": 30
    };

    d3.select("#plot2").html("");
    var svg = d3.select("#plot2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // this sets the scale that we're using for the X and y axis. 
    var x = d3.scale.linear()
        .domain([0, 3000])
        .range([0, width - margins.left - margins.right]);

    var y = d3.scale.linear()
        .domain([0, 8100])
        .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x baxis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y baxis");

    // this is our X axis label. Nothing too special to see here.
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 30)
        .attr("class", "label")
        .text("Read");

    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "middle")
        .attr("x", -90)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .text("Write");

    var xAxis1 = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis1 = d3.svg.axis().scale(y).orient("left").tickPadding(2);
    svg.selectAll("g.y.baxis").call(yAxis1);
    svg.selectAll("g.x.baxis").call(xAxis1);

    var dataset = svg.selectAll("g.node").data(selected, function (d) {
        return d.name;
    });
    var datasetGroup = dataset.enter().append("g").attr("class", "node").on("mouseover", highlight)
        .on("mouseout", unhighlight)
        .attr('transform', function (d) {
            return "translate(" + x(d["Read Latency"]) + "," + y(d["Write Latency"]) + ")";
        });
    datasetGroup.append("circle")
        .attr("r", 5)
        .attr("class", "dot")
        .style("fill", function (d) {
            return color(d.group, 1); // TODO 0.85
        });

    //
    // Outstanding
    //

    d3.select("#plot3").html("");
    var svg = d3.select("#plot3")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // this sets the scale that we're using for the X and y axis. 
    var x = d3.scale.linear()
        .domain([0, 70])
        .range([0, width - margins.left - margins.right]);

    var y = d3.scale.linear()
        .domain([0, 40])
        .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x baxis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y baxis");

    // this is our X axis label. Nothing too special to see here.
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 30)
        .attr("class", "label")
        .text("Read");

    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "middle")
        .attr("x", -90)
        .attr("y", -30)
        .attr("transform", "rotate(-90)")
        .attr("class", "baxis")
        .text("Write");

    var xAxis1 = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis1 = d3.svg.axis().scale(y).orient("left").tickPadding(2);
    svg.selectAll("g.y.baxis").call(yAxis1);
    svg.selectAll("g.x.baxis").call(xAxis1);

    var dataset = svg.selectAll("g.node").data(selected, function (d) {
        return d.name;
    });
    var datasetGroup = dataset.enter().append("g").attr("class", "node")
        .on("mouseover", highlight)
        .on("mouseout", unhighlight)
        .attr('transform', function (d) {
            return "translate(" + x(d["Read Outstanding"]) + "," + y(d["Write Outstanding"]) + ")";
        });
    datasetGroup.append("circle")
        .attr("r", 5)
        .attr("class", "dot")
        .style("fill", function (d) {
            return color(d.group, 1); // TODO 0.85
        });


}


console.log("END.");