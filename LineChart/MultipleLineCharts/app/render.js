/**
 * Created by bikramkawan on 10/27/17.
 */
define(function (require) {
    const newExtents = new Map();
    let enableSlopeLine = false;
    let enableFlagMode = false;
    let disableMidpoint = true;
    const lineDict = new Map();
    const dx = 100, dy = 70;
    let svgContainer;
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

        },
        drawCircle: function ({key}) {
            const {cx, cy} = lineDict.get(key);
            const that = this;
            svgContainer.append('circle')
                .classed(key, true)
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 5)
                .call(d3.drag()
                    .on("start", ()=>console.log('Circle Dragging start'))
                    .on("drag", function () {
                        if (!enableSlopeLine) return
                        const cx = d3.event.sourceEvent.offsetX - dx;
                        const cy = d3.event.sourceEvent.offsetY - dy;
                        lineDict.set(key, {cx, cy})
                        d3.select(this).attr('cx', cx).attr('cy', cy)
                        if (disableMidpoint) {
                            that.drawSlopeLine();
                            that.drawMiddleCircle();

                        } else {
                            that.splitSlopeLine()
                        }


                    })
                    .on("end", ()=>console.log('Circle Dragging Ended')));


        },
        drawSlopeLine: function () {
            if (!enableSlopeLine) return
            d3.selectAll('.slopeLine').remove();
            let start = lineDict.get('start');
            let end = lineDict.get('end');
            let mid = lineDict.get('mid');
            let x1 = start.cx;
            let y1 = start.cy;
            let x2 = end.cx;
            let y2 = end.cy;
            let mx = mid.cx;
            let my = mid.cy;
            svgContainer.append('path')
                .classed('slopeLine', true)
                .attr('d', `M ${x1} ${y1} L ${x2} ${y2}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 4)
                .call(d3.drag()
                    .on("start", function () {
                        console.log(' Line Dragging start')

                        const tempstart = lineDict.get('start');
                        const tempend = lineDict.get('end');
                        const tempmid = lineDict.get('mid');
                        const tempx1 = tempstart.cx;
                        const tempy1 = tempstart.cy;
                        const tempx2 = tempend.cx;
                        const tempy2 = tempend.cy;
                        const tempmx = tempmid.cx;
                        const tempmy = tempmid.cy;

                        x1 = tempx1;
                        y1 = tempy1;
                        x2 = tempx2;
                        y2 = tempy2;
                        mx = tempmx;
                        my = tempmy;


                    })
                    .on("drag", function () {
                        if (!enableSlopeLine) return
                        const {sourceEvent} = d3.event;
                        const xCord = sourceEvent.offsetX - dx;
                        const yCord = sourceEvent.offsetY - dy;
                        const diffX = xCord - d3.event.subject.x;
                        const diffY = yCord - d3.event.subject.y;

                        d3.select(this)
                            .attr('d', `M ${x1 + diffX} ${y1 + diffY} L ${x2 + diffX} ${y2 + diffY}`)

                        d3.select('.start')
                            .attr('cx', x1 + diffX)
                            .attr('cy', y1 + diffY)

                        d3.select('.end')
                            .attr('cx', x2 + diffX)
                            .attr('cy', y2 + diffY)

                        d3.select('.middle')
                            .attr('cx', mx + diffX)
                            .attr('cy', my + diffY)

                        lineDict.set('start', {cx: x1 + diffX, cy: y1 + diffY})
                        lineDict.set('mid', {cx: mx + diffX, cy: my + diffY})
                        lineDict.set('end', {cx: x2 + diffX, cy: y2 + diffY})


                    })
                    .on("end", function () {
                            console.log('dragging of line end')

                        }
                    ));


        },
        drawMiddleCircle: function () {

            if (!enableSlopeLine) return
            const that = this;
            d3.selectAll('.middle').remove();
            const {cx, cy} = this.calcMidPoint();
            lineDict.set('mid', {cx, cy});
            svgContainer.append('circle')
                .classed('middle', true)
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 5)
                .attr('stroke', 'red')
                .call(d3.drag()
                    .on("start", ()=>console.log('start'))
                    .on("drag", function () {
                        if (!enableSlopeLine || disableMidpoint) return
                        const cx = d3.event.sourceEvent.offsetX - dx;
                        const cy = d3.event.sourceEvent.offsetY - dy;
                        lineDict.set('mid', {cx, cy})
                        d3.select(this).attr('cx', cx).attr('cy', cy);
                        that.splitSlopeLine();


                    })
                    .on("end", ()=>console.log('end')));

        },
        splitSlopeLine: function () {

            if (!enableSlopeLine) return
            d3.selectAll('.slopeLineSplit').remove();
            d3.selectAll('.slopeLine').remove();
            const start = lineDict.get('start');
            const end = lineDict.get('end');
            const mid = lineDict.get('mid')
            const x1 = start.cx;
            const y1 = start.cy;
            const x2 = end.cx;
            const y2 = end.cy;
            const mx = mid.cx;
            const my = mid.cy;

            svgContainer.append('path')
                .classed('slopeLineSplit', true)
                .attr('d', `M ${x1} ${y1} L ${mx} ${my}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 4)

            svgContainer.append('path')
                .classed('slopeLineSplit', true)
                .attr('d', `M ${mx} ${my} L ${x2} ${y2}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 4)


        },
        enableSlope: function () {
            d3.select('.slopeButton')
                .on('click', function () {
                    enableSlopeLine = !enableSlopeLine;
                    d3.select(this).classed('selected', enableSlopeLine)
                });


        },
        enableFlagMode: function () {
            d3.select('.flagButton')
                .on('click', function () {
                    enableFlagMode = !enableFlagMode;
                    d3.select(this).classed('selected', enableFlagMode)
                });

        },
        toggleCheckBox: function () {
            const that = this;
            d3.select('.midpoint')
                .on('change', function () {
                    disableMidpoint = d3.select(this).node().checked;

                    if (disableMidpoint) {

                        d3.selectAll('.slopeLineSplit').remove();
                        d3.selectAll('circle').remove();
                        that.drawCircle({key: 'start'});
                        that.drawCircle({key: 'end'})
                        that.drawMiddleCircle();
                        that.drawSlopeLine()

                    }


                });

        },
        calcMidPoint: function () {
            const start = lineDict.get('start');
            const end = lineDict.get('end');
            const xDiff = Math.abs((start.cx - end.cx) / 2);
            const yDiff = Math.abs((start.cy - end.cy) / 2);
            const cx = Math.min(start.cx, end.cx) + xDiff;
            const cy = Math.min(start.cy, end.cy) + yDiff;
            return {cx, cy};

        },
        drawRectContainer: function (svg, width, height, x2, y2) {
            svgContainer = svg.append('g').attr("transform", `translate(100,70)`)
            const that = this;
            const svgRect = svgContainer.append('rect')
                .attr('x', 0)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'transparent')
                .attr('stroke', 'red')
            let clickCount = 0;
            svgRect.on("click", function () {
                const cx = d3.event.offsetX - dx;
                const cy = d3.event.offsetY - dy;

                const slopeLineClass = d3.select('.slopeButton').attr('class');
                const isSlopeLineEnable = slopeLineClass.indexOf('selected') > 0;

                const FlagLineClass = d3.select('.flagButton').attr('class');
                const isFlagModeEnable = FlagLineClass.indexOf('selected') > 0;


                if (isFlagModeEnable) {

                    svgContainer.append('path')
                        .classed('flags', true)
                        .attr('d', arc)
                        .attr('transform', `translate(${cx},-2)rotate(90)`)


                    svgContainer.append('path')
                        .classed('flagsLine', true)
                        .attr('d', `M ${cx - 4} -8 L ${cx - 4} 20`)
                        .attr('stroke', 'red')
                        .attr('fill', 'none')
                }


                if (isSlopeLineEnable) {
                    clickCount++
                    if (clickCount === 1) {
                        lineDict.set('start', {cx, cy})
                        that.drawCircle({key: 'start'});
                    }
                    if (clickCount === 2) {

                        lineDict.set('end', {cx, cy})
                        that.drawCircle({key: 'end'})
                        that.drawMiddleCircle();
                        that.drawSlopeLine()


                    }
                }


            })


        }

    }


})


