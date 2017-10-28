define(function (require) {
    return {
        initApp: function () {
            const constants = require('./constants');
            const {
                margin,
                width,
                height,
                legends,
                x,
                y1,
                y2,
                y3,
                x2
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
                let y1Extent = [0, 0];
                let y2Extent = [0, 0];
                data.forEach((d)=> {
                    const y1Values = d3.extent([d.y11, d.y12, d.y3])
                    const y2Values = d3.extent([d.y21, d.y22])
                    y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];
                    y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

                })

                x.domain(d3.extent(data, d=>d.date));
                x2.domain(d3.extent(data, d=> d.time2));
                y1.domain(y1Extent);
                y2.domain(y2Extent);
                y3.domain(d3.extent(data, d=> d.y31));

                render.drawLine(data, lineY11, 'lineY11', yAxis1, 0, xAxis1, xAxis2, x, svg);
                render.drawLine(data, lineY12, 'lineY12', yAxis1, 0, xAxis1, xAxis2, x, svg);
                render.drawLine(data, lineY13, 'lineY13', yAxis1, 0, xAxis1, xAxis2, x, svg);
                render.drawLine(data, lineY21, 'lineY21', yAxis2, width + 50, xAxis1, xAxis2, x, svg);
                render.drawLine(data, lineY22, 'lineY22', yAxis2, width + 50, xAxis1, xAxis2, x, svg);
                render.drawLine(data, lineY31, 'lineY31', yAxis3, width + 100, xAxis1, xAxis2, x, svg);
                console.log(y1.domain(), y2.domain(), y3.domain(), x.domain())
                render.drawLegends();
                render.toggleMode();


            });


        }
    };
});
