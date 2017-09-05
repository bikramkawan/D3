let width = document.body.clientWidth,
    height = d3.max([document.body.clientHeight - 540, 240]);
//height = d3.max([document.body.clientHeight-0, 240]);

let m = [60, 0, 10, 0],
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
const colors = {
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
const svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

// Load the data and visualization
d3.csv("results.csv", (raw_data) => {
    // Convert quantitative scales to floats
    data = raw_data.map((d) => {
        for (var k in d) {
            if (!_.isNaN(raw_data[0][k] - 0) && k != 'id') {
                d[k] = parseFloat(d[k]) || 0;
            }
        }
        return d;
    });

    // 1. Extract the list of numerical dimensions and create a scale for each.
    xscale.domain(dimensions = d3.keys(data[0]).filter((k) => {
        console.log('-----');
        console.log(k);
        //console.log(data[0][k]);

        isNumber = _.isNumber(data[0][k]);
        yscale[k] = d3.scale.linear()
            .domain(d3.extent(data, (d) =>+d[k]))
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
        .attr("transform", (d)=> "translate(" + xscale(d) + ")")
        .call(d3.behavior.drag()
            .on("dragstart", (d) => {
                dragging[d] = this.__origin__ = xscale(d);
                this.__dragged__ = false;
                d3.select("#foreground").style("opacity", "0.35");
            })
            .on("drag", (d)=> {
                dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
                dimensions.sort((a, b) =>position(a) - position(b));
                xscale.domain(dimensions);
                g.attr("transform", (d) => "translate(" + position(d) + ")");
                brush_count++;
                this.__dragged__ = true;

                // Feedback for axis deletion if dropped
                if (dragging[d] < 12 || dragging[d] > w - 12) {
                    d3.select(this).select(".background").style("fill", "#b00");
                } else {
                    d3.select(this).select(".background").style("fill", null);
                }
            })
            .on("dragend", (d)=> {
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
        .attr("y", (d, i) => i % 2 == 0 ? -14 : -30)
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




console.log("END.");