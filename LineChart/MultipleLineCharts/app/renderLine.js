/**
 * Created by bikramkawan on 11/4/17.
 */

define(function (require) {


    const {margin, width, height, brushMargins} = require('./constants').constants();
    let svg;
    let axisSVG;
    let brushSVG;
    const x = d3.scaleTime().range([0, width]),
        y1 = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height, 0]),
        y3 = d3.scaleLinear().range([height, 0]),
        x2 = d3.scaleLinear().range([0, width]),

        // For Brushes
        x12 = d3.scaleTime().range([0, width]),
        y12 = d3.scaleLinear().range([height, 0]),
        y22 = d3.scaleLinear().range([height, 0]),
        y32 = d3.scaleLinear().range([height, 0]),
        x22 = d3.scaleLinear().range([0, width]);

    const {lineY11, lineY12, lineY13, lineY21, lineY22, lineY31} = require('./defineLine').defineLine(x, y1, y2, y3);

    const xAxis1 = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis1 = d3.axisLeft(y1),
        yAxis2 = d3.axisLeft(y2),
        yAxis3 = d3.axisLeft(y3);
    let data;
    return {

        setupScales: function (rawdata, lineSvg, svgAxis, svgBrush) {
            data = rawdata;
            svg = lineSvg;
            axisSVG = svgAxis;
            brushSVG = svgBrush;
            let y1Extent = [0, 0];
            let y2Extent = [0, 0];
            data.forEach((d)=> {
                const y1Values = d3.extent([d.y11, d.y12, d.y13])
                const y2Values = d3.extent([d.y21, d.y22])
                y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];
                y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

            });

            x.domain(d3.extent(data, d=>d.date));
            x2.domain(d3.extent(data, d=> d.time2));
            y1.domain(y1Extent);
            y2.domain(y2Extent);
            y3.domain(d3.extent(data, d=> d.y31));


            // For Brush Axix;
            x12.domain(d3.extent(data, d=>d.date));
            x22.domain(d3.extent(data, d=> d.time2));
            y12.domain(y1Extent);
            y22.domain(y2Extent);
            y32.domain(d3.extent(data, d=> d.y31));


        },
        setupLineConfig: function () {

            const line1 = {
                linedata: data,
                linefunc: lineY11,
                lineclass: 'lineY11',
                allData: data,
                key: 'y1'

            }

            const line2 = {
                linedata: data,
                linefunc: lineY12,
                lineclass: 'lineY12',
                allData: data,
                key: 'y1'

            }
            const line3 = {
                linedata: data,
                linefunc: lineY13,
                lineclass: 'lineY13',
                allData: data,
                key: 'y1'

            }

            const line4 = {
                linedata: data,
                linefunc: lineY21,
                lineclass: 'lineY21',
                allData: data,
                key: 'y2'

            }

            const line5 = {
                linedata: data,
                linefunc: lineY22,
                lineclass: 'lineY22',
                allData: data,
                key: 'y2'

            }
            const line6 = {
                linedata: data,
                linefunc: lineY31,
                lineclass: 'lineY31',
                allData: data,
                key: 'y3'

            }
            return [line1, line2, line3, line4, line5, line6]

        },
        drawLine: function (param) {
            const {lineclass, linefunc, linedata} =param;
            d3.selectAll(`.${lineclass}`).remove();
            svg.append("path")
                .data([linedata])
                .attr("class", lineclass)
                .attr("d", linefunc);
        },
        setupAxisConfig: function () {
            const axis1 = {
                orientation: 'hor',
                axis: xAxis1,
                classname: 'xAxis1',
                dx: 0,
                dy: -(margin.topX),
                key: 'date',
            };
            const axis2 = {
                orientation: 'hor',
                axis: xAxis2,
                classname: 'xAxis2',
                dx: 0,
                dy: height,
                key: 'time2',
            };
            const axis3 = {
                orientation: 'ver',
                axis: yAxis1,
                classname: 'yAxis1',
                dx: 0,
                dy: 0,
                key: 'y1',
            };
            const axis4 = {
                orientation: 'ver',
                axis: yAxis2,
                classname: 'yAxis2',
                dx: width + 30,
                dy: 0,
                key: 'y2',
            };
            const axis5 = {
                orientation: 'ver',
                axis: yAxis3,
                classname: 'yAxis3',
                dx: width + 100,
                dy: 0,
                key: 'y3'
            };


            return [axis1, axis2, axis3, axis4, axis5];

        },
        drawAxis: function (param) {
            const {orientation, axis, classname, dx, dy} = param;
            d3.selectAll(`.${classname}`).remove();
            axisSVG.append("g")
                .attr("class", `axis ${classname}`)
                .attr("transform", `translate(${dx},${dy})`)
                .call(axis);

        },
        setupBrushConfig: function () {

            const brush1 = {
                selector: 'brush1',
                margin: brushMargins.topX,
                axis: xAxis1,
                scale: x12,
                orientation: 'hor',
                key: 'date',
                linedata: data,
            }

            const brush2 = {

                scale: x22,
                orientation: 'hor',
                key: 'time2',
                selector: 'brush2',
                margin: brushMargins.bottomX,
                axis: xAxis2,
                linedata: data,

            }
            const brush3 = {
                selector: 'brush3',
                margin: brushMargins.y1,
                axis: yAxis1,
                scale: y12,
                orientation: 'ver',
                key: 'y1',
                linedata: data,

            }
            const brush4 = {
                selector: 'brush4',
                margin: brushMargins.y2,
                axis: yAxis2,
                scale: y22,
                orientation: 'ver',
                key: 'y2',
                linedata: data,

            }
            const brush5 = {
                selector: 'brush5',
                margin: brushMargins.y3,
                axis: yAxis3,
                scale: y32,
                orientation: 'ver',
                key: 'y3',
                linedata: data,
            }

            return [brush1, brush2, brush3, brush4, brush5];

        },
        drawBrushAxis: function (param) {
            const {selector, margin, axis}   = param;
            brushSVG.append("g")
                .attr("class", `axis ${selector}`)
                .attr("transform", `translate(${margin.x},${margin.y})`)
                .call(axis);
        },
        drawBrushRect: function (param) {
            const {selector, scale, orientation, key} = param
            if (orientation === 'hor') {
                const brush = d3.brushX()
                    .extent([[0, 0], [width, 20]])
                    .on("brush end", ()=> this.brushAction(param));

                d3.select(`.${selector}`).append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, scale.range());
            } else {
                const width = 20;
                const brush = d3.brushY()
                    .extent([[0, 0], [width, height]])
                    .on("brush end", ()=> this.brushAction(param));

                d3.select(`.${selector}`).append("g")
                    .attr("transform", `translate(${-width},0 )`)
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, [0, height]);

            }

        },
        brushAction: function (param) {
            const {scale, key, lineData} = param;
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            const extents = d3.event.selection.map(scale.invert);
            const updateAxis = this.setupAxisConfig().filter(d=>d.key === key);
            const allLines = this.setupLineConfig();
            const filterLines = allLines.filter(d=>d.key === key);
            const lines = filterLines.length > 0 ? filterLines : allLines;


            let filtered = data.slice();
            if (key === 'date') {
                filtered = filtered.filter((d)=>d.date >= extents[0] && d.date < extents[1]);
                x.domain(d3.extent(filtered, d=>d.date));
                this.drawAxis(updateAxis[0]);
                const newLine = lines.map((d)=> Object.assign({}, d, {linedata: filtered}))
                newLine.forEach(item=>this.drawLine(item));


            }


            if (key === 'time2') {
                filtered = filtered.filter((d)=>d.time2 >= extents[0] && d.time2 < extents[1])
                x.domain(d3.extent(filtered, d=> d.date));

                this.drawAxis(updateAxis[0]);
                const newLine = lines.map((d)=> Object.assign({}, d, {linedata: filtered}))
                newLine.forEach(item=>this.drawLine(item));


            }

            if (key === 'y1') {
                filtered = filtered.filter((d)=> (d.y11 >= extents[1] && d.y11 < extents[0]) &&
                (d.y12 >= extents[1] && d.y12 < extents[0]) &&
                (d.y13 >= extents[1] && d.y13 < extents[0]))
                let y1Extent = [0, 0];
                filtered.forEach((d)=> {
                    const y1Values = d3.extent([d.y11, d.y12, d.y13])
                    y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];

                });
                y1.domain(y1Extent);
                this.drawAxis(updateAxis[0]);
                const newLine = lines.map((d)=> Object.assign({}, d, {linedata: filtered}))
                newLine.forEach(item=>this.drawLine(item));


            }

            if (key === 'y2') {
                filtered = filtered.filter((d)=> (d.y21 >= extents[1] && d.y21 < extents[0]) &&
                (d.y22 >= extents[1] && d.y22 < extents[0]))

                let y2Extent = [0, 0];
                filtered.forEach((d)=> {
                    const y2Values = d3.extent([d.y21, d.y22])
                    y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

                });
                y2.domain(y2Extent);
                this.drawAxis(updateAxis[0]);
                const newLine = lines.map((d)=> Object.assign({}, d, {linedata: filtered}))
                newLine.forEach(item=>this.drawLine(item));


            }


            if (key === 'y3') {
                filtered = filtered.filter((d)=>d.y31 >= extents[1] && d.y31 < extents[0])
                y3.domain(d3.extent(data, d=> d.y31));
                const newLine = lines.map((d)=> Object.assign({}, d, {linedata: filtered}))
                newLine.forEach(item=>this.drawLine(item));

            }


        },
        getAxisScales: function () {
            return {x, x2, y1, y2, y3};

        }

    }


})