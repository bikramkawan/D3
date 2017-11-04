define(function (require) {
    return {
        initApp: function () {
            const constants = require('./constants');
            const {
                margin,
                width,
                height,
                legends,
                brushMargins,
                x,
                y1,
                y2,
                y3,
                x2,
                x12, x22, y12, y22, y32
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

                let y1Extent = [0, 0];
                let y2Extent = [0, 0];
                data.forEach((d)=> {
                    const y1Values = d3.extent([d.y11, d.y12, d.y13])
                    const y2Values = d3.extent([d.y21, d.y22])
                    y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];
                    y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

                })


                // For Brush Axix;
                x12.domain(d3.extent(data, d=>d.date));
                x22.domain(d3.extent(data, d=> d.time2));
                y12.domain(y1Extent);
                y22.domain(y2Extent);
                y32.domain(d3.extent(data, d=> d.y31));

                renderLine.setupScales(data, lineSvg, axisSVG, brushSVG);
                const lines = renderLine.setupLineConfig();
                lines.forEach(item=>renderLine.drawLine(item));

                const axixs = renderLine.setupAxisConfig();

                axixs.forEach(axis=>renderLine.drawAxis(axis));

                const brushes = renderLine.setupBrushConfig();

                brushes.forEach(brush=>renderLine.drawBrushAxis(brush))
                brushes.forEach(brush=>renderLine.drawBrushRect(brush))


                const config = {
                    data,
                    x,
                    x2,
                    y1,
                    y2,
                    y3,
                    svg,
                    width,


                };

                //   const lineData = constants.formatLineData(config)

                render.drawLegends();
                render.toggleMode();
                render.enableSlope();
                render.enableFlagMode();
                render.toggleCheckBox();
                render.drawRectContainer(svg, width, height, x22, y12);
                const brushDimension = {width, height};
                const configBrush = {x12, margin, x22, brushDimension, y12, y22, y32}

                // const brushes = constants.formatBrushAxisData({
                //     brushMargins, xAxis1,
                //     xAxis2,
                //     yAxis1,
                //     yAxis2,
                //     yAxis3
                // })
                //
                //
                // brushes.forEach((e)=> {
                //
                //     brushSVG.append("g")
                //         .attr("class", `axis ${e.selector}`)
                //         .attr("transform", `translate(${e.margin.x},${e.margin.y})`)
                //         .call(e.axis);
                //
                // })

                // const brushData = constants.formatBrushData(configBrush);
                // brushData.forEach(brush=>render.drawBrush(brush));


            });


        }
    };
});
