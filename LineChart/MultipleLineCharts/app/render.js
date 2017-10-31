/**
 * Created by bikramkawan on 10/27/17.
 */
define(function (require) {
    const newExtents = new Map();

    return {

        drawLine: function drawLine(params) {

            const {
                linedata, linefunc, lineclass, lineYAxis, yAxisOffset, xAxis1, xAxis2,
                x, x2,
                y1,
                y2,
                y3, svg, yAxixClass,
                yAxis1,
                yAxis2,
                yAxis3,
            } = params;
            const {margin, width, height} = require('./constants.js').constants();


            let y1Extent = [0, 0];
            let y2Extent = [0, 0];
            linedata.forEach((d)=> {
                const y1Values = d3.extent([d.y11, d.y12, d.y13])
                const y2Values = d3.extent([d.y21, d.y22])
                y1Extent = [Math.min(y1Values[0], y1Extent[0]), Math.max(y1Values[1], y1Extent[1])];
                y2Extent = [Math.min(y2Values[0], y2Extent[0]), Math.max(y2Values[1], y2Extent[1])]

            })


            x.domain(d3.extent(linedata, d=>d.date));
            x2.domain(d3.extent(linedata, d=> d.time2));
            y1.domain(y1Extent);
            y2.domain(y2Extent);
            y3.domain(d3.extent(linedata, d=> d.y31));

            d3.selectAll(`.${lineclass}`).remove()
            d3.selectAll('.lineAxix-grp').remove();
            const line = svg.append("g")
                .classed(`${lineclass}-grp`, true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            const lineAxis = svg.append("g")
                .classed('lineAxix-grp', true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            line.append("path")
                .data([linedata])
                .attr("class", lineclass)
                .attr("d", linefunc);


            lineAxis.append("g")
                .attr("class", "axis xAxis TopX")
                .attr("transform", `translate(0,-${margin.topX})`)
                .call(xAxis1);


            lineAxis.append("g")
                .attr("class", "axis xAxis BottomX")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis2);


            lineAxis.append("g")
                .attr("class", `axis yAxis Yleft`)
                .attr("transform", `translate(${0},0 )`)
                .call(yAxis1);

            lineAxis.append("g")
                .attr("class", `axis yAxis YRight1`)
                .attr("transform", `translate(${width + 30},0 )`)
                .call(yAxis2);
            //
            lineAxis.append("g")
                .attr("class", `axis yAxis YRight2`)
                .attr("transform", `translate(${width + 100},0 )`)
                .call(yAxis3);


        },

        drawLegends: function drawLegends() {
            const {legends} = require('./constants').main();
            const el = d3.select('.legends')
                .selectAll('div')
                .data(legends)
                .enter()
                .append('div')
                .classed('row', true)
                .on('click', (d)=> {
                    const hidden = d3.select(`path.${d.className}`).attr('visibility') !== 'hidden';
                    d3.select(`path.${d.className}`).attr('visibility', hidden ? 'hidden' : 'visible');
                    d3.select(`div.${d.className}`).style('opacity', hidden ? '0.5' : '1');

                })
            el.append('div').text(d=>d.name).classed('name', true)
            el.append('div').attr('class', (d)=> `color-${d.className}`)
            el.append('div').classed('unit', true).text((d)=> {
                const s = d.scale.domain();
                return `[${Math.floor(s[0])},${Math.floor(s[1])}] - ${d.unit}(unit)`

            })

        },

        toggleMode: function () {

            d3.select('.mode').on('click', ()=> {
                const isDark = d3.select('.mode').attr('class') === 'mode';
                d3.select('.mode').classed('dark', isDark);
                d3.selectAll('.axis').classed('darkMode', isDark)
                d3.select('.chart').classed('darkChart', isDark);

            })

        },

        drawBrush: function (param) {

            const {selector, scale, brushDimension, orientation, margin, key, lineData} = param


            if (orientation === 'horizontal') {

                const {width, height} = brushDimension;
                const brush = d3.brushX()
                    .extent([[0, 0], [width, 20]])
                    .on("brush end", ()=> this.brush(param));

                d3.select(`.${selector}`).append("g")

                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, scale.range());
            } else {

                const width = 20;
                const {height} = brushDimension;
                const brush = d3.brushY()
                    .extent([[0, 0], [width, height]])
                    .on("brush end", ()=> this.brush(param));

                d3.select(`.${selector}`).append("g")
                    .attr("transform", `translate(${-width},0 )`)
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, [0, height]);

            }

        },
        brush: function brushed(param) {
            const {scale, key, lineData} = param;
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            const extents = d3.event.selection.map(scale.invert);

            newExtents.set(key, extents)

            let filtered = lineData[0].allData;

            if (newExtents.has('date')) {
                filtered = filtered.filter((d)=>d.date >= newExtents.get('date')[0] && d.date < newExtents.get('date')[1])

            }

            if (newExtents.has('time2')) {
                filtered = filtered.filter((d)=>d.time2 >= newExtents.get('time2')[0] && d.time2 < newExtents.get('time2')[1])

            }

            if (newExtents.has('y31')) {
                filtered = filtered.filter((d)=>d.y31 >= newExtents.get('y31')[1] && d.y31 < newExtents.get('y31')[0])

            }

            if (newExtents.has('y1')) {
                filtered = filtered.filter((d)=> (d.y11 >= newExtents.get('y1')[1] && d.y11 < newExtents.get('y1')[0]) &&
                    (d.y12 >= newExtents.get('y1')[1] && d.y12 < newExtents.get('y1')[0]) &&
                    (d.y13 >= newExtents.get('y1')[1] && d.y13 < newExtents.get('y1')[0])
                )

            }

            if (newExtents.has('y2')) {
                filtered = filtered.filter((d)=> (d.y21 >= newExtents.get('y2')[1] && d.y21 < newExtents.get('y2')[0]) &&
                    (d.y22 >= newExtents.get('y2')[1] && d.y22 < newExtents.get('y2')[0])
                )

            }


            const newLine = lineData.map((d)=> Object.assign({}, d, {linedata: filtered}))

            newLine.forEach(item=>this.drawLine(item));


        },
        drawBrushAxis: function (param) {
            const {svg, axix} = param;

            const bAxis = svg.append("g")
                .classed(`brush-grp`, true)

            bAxis.selectAll('g')
                .data(axix)
                .enter()
                .append("g")
                .attr("class", `axis yAxis Yleft`)
                .attr("transform", `translate(${width + 200 + 50},70 )`)
                .call(d=>d.axis);

        }
    }


})