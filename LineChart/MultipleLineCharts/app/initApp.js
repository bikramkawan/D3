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

            const render = require('./render');


            const xAxis1 = d3.axisBottom(x),
                yAxis1 = d3.axisLeft(y1),
                yAxis2 = d3.axisLeft(y2),
                yAxis3 = d3.axisLeft(y3),
                xAxis2 = d3.axisBottom(x2)

            const {lineY11, lineY12, lineY13, lineY21, lineY22, lineY31} = require('./defineLine').defineLine(x, y1, y2, y3);

            d3.csv("data/newdataV2.csv", function (error, rawdata) {
                if (error) throw error;
                const data = require('./constants').formatData(rawdata);
                console.log(data)
                let y1Extent = [0, 0];
                let y2Extent = [0, 0];
                data.forEach((d)=> {
                    const y1Values = d3.extent([d.y11, d.y12, d.y13])
                    const y2Values = d3.extent([d.y21, d.y22])
                    y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];
                    y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

                })
                x12.domain(d3.extent(data, d=>d.date));
                x22.domain(d3.extent(data, d=> d.time2));
                y12.domain(y1Extent);
                y22.domain(y2Extent);
                y32.domain(d3.extent(data, d=> d.y31));


                const config = {
                    data,
                    xAxis1,
                    xAxis2,
                    x,
                    x2,
                    y1,
                    y2,
                    y3,
                    svg,
                    width,
                    lineY11,
                    lineY12,
                    lineY13,
                    lineY21,
                    lineY22,
                    lineY31,
                    yAxis1,
                    yAxis2,
                    yAxis3,

                };

                const lineData = constants.formatLineData(config)

                lineData.forEach(item=>render.drawLine(item));
                render.drawLegends();
                render.toggleMode();
                const brushDimension = {width, height};
                const configBrush = {x12, margin, x22, brushDimension, y12, y22, y32, lineData}


                //
                // const brush1 = svg.append("g")
                //     .classed(`brush-grp`, true)
                //     .attr("transform", "translate(" + margin.left + ",0)");
                // brush1.append("g")
                //     .attr("class", "axis xAxis TopX1")
                //     .attr("transform", `translate(0,0)`)
                //     .call(xAxis1);

                // const brush1 = svg.append("g")
                //     .classed(`brush-grp`, true)
                // // .attr("transform", "translate(" + margin.left + ",0)");
                // brush1.append("g")
                //     .attr("class", `axis yAxis Yleft`)
                //     .attr("transform", `translate(${width+200+50},70 )`)
                //     .call(yAxis2);


                const bAxis = svg.append("g")
                    .classed(`brush-grp`, true)
                const brushes = constants.formatBrushAxisData({
                    brushMargins, xAxis1,
                    xAxis2,
                    yAxis1,
                    yAxis2,
                    yAxis3
                })

                console.error(brushes)

                brushes.forEach((e)=> {

                    bAxis.append("g")
                        .attr("class", `axis ${e.selector}`)
                        .attr("transform", `translate(${e.margin.x},${e.margin.y})`)
                        .call(e.axis);

                })

                const brushData = constants.formatBrushData(configBrush);
                //
                // const brush = d3.brushX()
                //     .extent([[0, 0], [width, 20]])
                //     .on("brush end", ()=> this.brush(param));
                //
                // d3.select('.brush1').append("g")
                //     .attr("class", "brush")
                //     .call(brush)
                //     .call(brush.move, x.range());

                brushData.forEach(brush=>render.drawBrush(brush));

            });


        }
    };
});
