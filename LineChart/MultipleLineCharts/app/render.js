/**
 * Created by bikramkawan on 10/27/17.
 */
define(function (require) {
    const newExtents = new Map();
    let enableSlopeLine = false;
    let enableFlagMode = false;
    let disableMidpoint = true;
    const lineDict = new Map();
    const flagMap = new Map();
    const dx = 100, dy = 70, slopeTextOffset = 7;
    const arc = d3.symbol().type(d3.symbolTriangle);
    let xScale, yScale;
    let svgContainer;
    const renderLine = require('./renderLine');

    return {
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
                            that.drawSlopeText()

                        } else {
                            that.splitSlopeLine()
                            that.drawSlopeText()
                        }


                    })
                    .on("end", ()=>console.log('Circle Dragging Ended')));


        },
        drawSlopeLine: function () {
            if (!enableSlopeLine) return
            d3.selectAll('.slopeLine').remove();
            let {x1, y1, x2, y2, mx, my} = this.getPoints();
            const that = this;
            svgContainer.append('path')
                .classed('slopeLine', true)
                .attr('d', `M ${x1} ${y1} L ${x2} ${y2}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 4)
                .call(d3.drag()
                    .on("start", function () {
                        console.log(' Line Dragging start')
                        const temp = that.getPoints();
                        x1 = temp.x1;
                        y1 = temp.y1;
                        x2 = temp.x2;
                        y2 = temp.y2;
                        mx = temp.mx;
                        my = temp.my;


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
                        that.drawSlopeText()


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
            const {x1, y1, x2, y2, mx, my} = this.getPoints();
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
                        that.drawSlopeLine();


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
        drawSlopeText: function () {
            d3.selectAll('.slopeText').remove();
            const slope = this.calculateSlope();
            const {mx, my} = this.getPoints();
            svgContainer.append('text')
                .classed('slopeText', true)
                .attr('x', mx)
                .attr('y', my - slopeTextOffset)
                .text(`${slope} psi/s`)


        },
        drawRectContainer: function (svg, width, height, x2, y2) {
            svgContainer = svg.append('g').attr("transform", `translate(100,70)`);

            const that = this;
            xScale = x2;
            yScale = y2;
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

                    that.drawFlag(cx, cy)

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
                        that.drawSlopeLine();
                        that.drawSlopeText();


                    }
                }


            })

        },
        calculateSlope: function () {

            const {x1, y1, x2, y2} = this.getPoints();
            return ((yScale.invert(y2) - yScale.invert(y1)) / (xScale.invert(x2) - xScale.invert(x1))).toFixed(2);

        },
        getPoints: function () {

            const start = lineDict.get('start');
            const end = lineDict.get('end');
            const mid = lineDict.get('mid')
            const x1 = start.cx;
            const y1 = start.cy;
            const x2 = end.cx;
            const y2 = end.cy;
            const mx = mid.cx;
            const my = mid.cy;

            return {x1, y1, x2, y2, mx, my};

        },
        drawFlag: function (cx, cy) {
            const xVal = xScale.invert(cx).toFixed(2);
            const yVal = yScale.invert(cy).toFixed(2);
            const that = this;
            const g = svgContainer.append('g')
                .attr('data-attrFlag', xVal)
                .attr('transform', `translate(${cx},-2)`)
                .call(d3.drag()
                    .on("start", ()=>console.log(' Flag dragging start'))
                    .on("drag", function () {
                        const cx = d3.event.sourceEvent.offsetX - dx;
                        const cy = d3.event.sourceEvent.offsetY - dy;
                        d3.select(this).attr('transform', `translate(${cx},-2)`)
                        const xValNew = xScale.invert(cx).toFixed(2);
                        const yValNew = yScale.invert(cy).toFixed(2);
                        that.addFlagScore(xVal, xValNew, yValNew);


                    })
                    .on("end", ()=>console.log('Flag dragging end')));

            g.append('path')
                .classed('flags', true)
                .attr('d', arc)
                .attr('transform', `rotate(90)`)


            g.append('path')
                .classed('flagsLine', true)
                .attr('d', `M -4 -8 L -4 20`)
                .attr('stroke', 'red')
                .attr('fill', 'none')

            flagMap.set(xVal, {xVal, yVal});
            this.addFlagScore(xVal, cx, cy)

        },
        addFlagScore: function (key, cx, cy) {
            const {x, x2, y1, y2, y3} = renderLine.getAxisScales();
            const parseTime = d3.timeFormat("%d %b, %Y")
            const legends = [
                {
                    name: 'Time',
                    className: 'time',
                    value: parseTime(x.invert(cx)),
                    unit: null,
                    isLine: false
                },
                {
                    name: 'Line Press #1',
                    className: 'lineY11',
                    value: y1.invert(cy).toFixed(2),
                    unit: 'Psi',
                    isLine: true
                },
                {

                    name: 'Line Press #2',
                    className: 'lineY12',
                    value: y1.invert(cy).toFixed(2),
                    unit: 'Psi',
                    isLine: true


                },
                {

                    name: 'Tubing Press',
                    className: 'lineY13',
                    value: y1.invert(cy).toFixed(2),
                    unit: 'Psi',
                    isLine: true


                }, {

                    name: 'Discharge Rate',
                    className: 'lineY21',
                    value: y2.invert(cy).toFixed(2),
                    unit: 'bbl/min',
                    isLine: true


                }, {

                    name: 'Tubing Rate',
                    className: 'lineY22',
                    value: y2.invert(cy).toFixed(2),
                    unit: 'bbl/min',
                    isLine: true


                }, {

                    name: 'Proppant Conc 40/70',
                    className: 'lineY31',
                    value: y3.invert(cy).toFixed(2),
                    unit: 'ppa',
                    isLine: true


                }


            ]
            d3.selectAll(`[data-flagItem="${key}"]`).remove();
            const flagScore = d3.select('.inner-items')
                .append('div')
                .classed('flagItem', true)
                .attr('data-flagItem', key);

            const header = flagScore.append('div')
                .classed('header', true)

            const rowItems = flagScore.append('div')
                .classed('row-items', true)

            header.append('div')
                .classed('flagValue', true)
                .text((d)=>`Flag Name`)


            header.append('div')
                .classed('deleteFlag', true)
                .attr('data-attr', `tees`)
                .on('click', function () {
                    d3.selectAll(`[data-attrFlag="${key}"]`).remove();
                    d3.selectAll(`[data-flagItem="${key}"]`).remove();
                    flagMap.delete(key)

                })
                .text('X')


            const row = rowItems.selectAll('div')
                .data(legends)
                .enter()
                .append('div')
                .classed('row', true)

            row.append('div')
                .classed('flagValue', true)
                .text((d)=>`${d.name} - ${d.value}`)

            row.append('div')
                .attr('class', (d)=>`color ${d.className}`)


        }

    }


})


