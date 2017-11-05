define(function (require) {
    return {
        initApp: function () {
            const constants = require('./constants');
            const {
                margin,
                width,
                height,
                x22, y12
            } = constants.main();

            const svg = d3.select('.chart')
                .append("svg:svg")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)

            const lineSvg = svg.append("g")
                .classed('lineGroup', true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            const axisSVG = svg.append("g")
                .classed('axisGroup', true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            const brushSVG = svg.append("g")
                .classed(`brush-grp`, true)

            const render = require('./render');
            const renderLine = require('./renderLine');

            d3.csv("data/newdataV2.csv", function (error, rawdata) {
                if (error) throw error;
                const data = require('./constants').formatData(rawdata);

                renderLine.setupScales(data, lineSvg, axisSVG, brushSVG);
                const lines = renderLine.setupLineConfig();
                lines.forEach(item=>renderLine.drawLine(item));

                const axixs = renderLine.setupAxisConfig();

                axixs.forEach(axis=>renderLine.drawAxis(axis));

                const brushes = renderLine.setupBrushConfig();

                brushes.forEach(brush=>renderLine.drawBrushAxis(brush))
                brushes.forEach(brush=>renderLine.drawBrushRect(brush))

                render.drawLegends();
                render.toggleMode();
                render.enableSlope();
                render.enableFlagMode();
                render.toggleCheckBox();
                render.drawRectContainer(svg, width, height, x22, y12);


            });


        }
    };
});
