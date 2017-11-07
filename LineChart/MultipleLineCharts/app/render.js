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

        drawCircle: function ({currentSlopeKey, cx, cy, className}) {
            const that = this;
            svgContainer.append('circle')
                .attr(`data-${className}Circle`, currentSlopeKey)
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', 5)
                .classed(className, true)
                .call(d3.drag()
                    .on("start", ()=>console.log('Circle Dragging start'))
                    .on("drag", function () {
                        if (!enableSlopeLine) return;
                        const myClassName = d3.select(this).attr('class');
                        const isStart = myClassName === 'start';
                        const cx = d3.event.sourceEvent.offsetX - dx;
                        const cy = d3.event.sourceEvent.offsetY - dy;
                        const {start, end, mid} = lineDict.get(currentSlopeKey);
                        if (isStart) {
                            lineDict.set(currentSlopeKey, {start: {cx, cy}, mid, end})
                        }

                        if (!isStart) {
                            lineDict.set(currentSlopeKey, {end: {cx, cy}, mid, start})
                        }

                        d3.select(this).attr('cx', cx).attr('cy', cy)

                        if (disableMidpoint) {
                            that.drawSlopeLine(currentSlopeKey);
                            that.drawMiddleCircle(currentSlopeKey);
                            that.drawSlopeText(currentSlopeKey)

                        } else {
                            that.splitSlopeLine(currentSlopeKey)
                            that.drawSlopeText(currentSlopeKey)
                        }


                    })
                    .on("end", ()=>console.log('Circle Dragging Ended')));


        },
        drawSlopeLine: function (key) {
            if (!enableSlopeLine) return
            d3.selectAll(`[data-slopeLine="${key}"]`).remove();
            let {x1, y1, x2, y2, mx, my} = this.getPoints(key);
            const that = this;
            svgContainer.append('path')
                .attr('data-slopeLine', key)
                .classed('slopeLine', true)
                .attr('d', `M ${x1} ${y1} L ${x2} ${y2}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 4)
                .on('dblclick', function () {
                    that.deleteSlopeLine(key)

                })
                .call(d3.drag()
                    .on("start", function () {
                        console.log(' Line Dragging start')
                        const temp = that.getPoints(key);
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


                        d3.select(`[data-startCircle="${key}"]`)
                            .attr('cx', x1 + diffX)
                            .attr('cy', y1 + diffY)

                        d3.select(`[data-endCircle="${key}"]`)
                            .attr('cx', x2 + diffX)
                            .attr('cy', y2 + diffY)

                        d3.select(`[data-midCircle="${key}"]`)
                            .attr('cx', mx + diffX)
                            .attr('cy', my + diffY)

                        const start = {cx: x1 + diffX, cy: y1 + diffY};
                        const mid = {cx: mx + diffX, cy: my + diffY};
                        const end = {cx: x2 + diffX, cy: y2 + diffY}

                        lineDict.set(key, {start, mid, end})

                        that.drawSlopeText(key)


                    })
                    .on("end", function () {
                            console.log('dragging of line end')

                        }
                    ));


        },
        drawMiddleCircle: function (key) {
            if (!enableSlopeLine) return
            const that = this;
            d3.selectAll(`[data-midCircle="${key}"]`).remove();
            const {cx, cy} = this.calcMidPoint(key);
            const {start, end} = lineDict.get(key);
            lineDict.set(key, {start, end, mid: {cx, cy}});
            svgContainer.append('circle')
                .attr('data-midCircle', key)
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
                        const {start, mid, end} = lineDict.get(key);
                        lineDict.set(key, {start, mid: {cx, cy}, end})
                        d3.select(this).attr('cx', cx).attr('cy', cy);
                        that.splitSlopeLine(key);


                    })
                    .on("end", ()=>console.log('end')));

        },
        splitSlopeLine: function (key) {

            if (!enableSlopeLine) return
            d3.selectAll(`[data-slopeLineSplit="${key}"]`).remove()
            d3.select(`[data-slopeLine="${key}"]`).remove()
            d3.selectAll(`[data-slopeText="${key}"]`).remove();
            const {x1, y1, x2, y2, mx, my} = this.getPoints(key);
            svgContainer.append('path')
                .attr('data-slopeLineSplit', key)
                .classed('slopeLineSplit', true)
                .attr('d', `M ${x1} ${y1} L ${mx} ${my}`)
                .attr('stroke', 'red')
                .attr('stroke-width', 4)

            svgContainer.append('path')
                .attr('data-slopeLineSplit', key)
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

        calcMidPoint: function (key) {
            const {start, end} = lineDict.get(key);
            const xDiff = Math.abs((start.cx - end.cx) / 2);
            const yDiff = Math.abs((start.cy - end.cy) / 2);
            const cx = Math.min(start.cx, end.cx) + xDiff;
            const cy = Math.min(start.cy, end.cy) + yDiff;
            return {cx, cy};

        },
        drawSlopeText: function (key) {
            d3.selectAll(`[data-slopeText="${key}"]`).remove();
            const slope = this.calculateSlope(key);
            const {mx, my} = this.getPoints(key);
            svgContainer.append('text')
                .attr('data-slopeText', key)
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
            let clickCount = 0;

            let currentSlopeKey = null;
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
                        currentSlopeKey = cx;
                        lineDict.set(currentSlopeKey, {start: {cx, cy}})

                        that.drawCircle({currentSlopeKey, cx, cy, className: 'start'});
                    }
                    if (clickCount === 2) {
                        const {start} = lineDict.get(currentSlopeKey);
                        lineDict.set(currentSlopeKey, {start, end: {cx, cy}})
                        that.drawCircle({currentSlopeKey, cx, cy, className: 'end'})
                        that.drawMiddleCircle(currentSlopeKey);
                        that.drawSlopeLine(currentSlopeKey);
                        that.drawSlopeText(currentSlopeKey);
                        clickCount = 0;


                    }
                }


            })

        },
        calculateSlope: function (key) {

            const {x1, y1, x2, y2} = this.getPoints(key);
            return ((yScale.invert(y2) - yScale.invert(y1)) / (xScale.invert(x2) - xScale.invert(x1))).toFixed(2);

        },
        getPoints: function (key) {

            const {start, end, mid} = lineDict.get(key);
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
                .classed('flag', true)
                .attr('transform', `translate(${cx},-2)`)
                .on('mouseover', function () {
                    d3.select(`[data-flagitem="${xVal}"]`)
                        .select('.header')
                        .classed('highlighted', true)
                })
                .on('mouseleave', function () {

                    d3.select(`[data-flagitem="${xVal}"]`)
                        .select('.header')
                        .classed('highlighted', false)

                })
                .call(d3.drag()
                    .on("start", ()=>console.log(' Flag dragging start'))
                    .on("drag", function () {



                    })
                    .on("end", function () {

                        const cx = d3.event.sourceEvent.offsetX - dx;
                        const cy = d3.event.sourceEvent.offsetY - dy;
                        d3.select(this).attr('transform', `translate(${cx},-2)`)
                        const xValNew = xScale.invert(cx).toFixed(2);
                        const yValNew = yScale.invert(cy).toFixed(2);
                        flagMap.set(xVal, {xVal: xValNew, yVal: yValNew})
                        that.updateFlagScore();
                        console.log('Flag dragging end')
                    }));

            g.append('path')
                .classed('flags', true)
                .attr('d', arc)
                .attr('transform', `rotate(90)`)


            g.append('path')
                .classed('flagsLine', true)
                .attr('d', `M -4 -8 L -4 20`)
            flagMap.set(xVal, {xVal, yVal});
            this.updateFlagScore()

        },
        updateFlagScore: function () {

            const scores = [];

            flagMap.forEach(({xVal, yVal}, key)=> {
                scores.push({key, xVal, yVal})
            })

            const sorted = scores.slice().sort((a, b)=>a.xVal - b.xVal)

            sorted.forEach(score=>this.addFlagScore(score))


        },
        addFlagScore: function ({key, xVal, yVal}) {

            const {x, x2, y1, y2, y3} = renderLine.getAxisScales();
            const parseTime = d3.timeFormat("%d %b, %Y %H:%M:%S")

            const legends = [
                {
                    name: 'Time',
                    className: 'time',
                    value: parseTime(x.invert(xVal)),
                    unit: null,
                    isLine: false
                },
                {
                    name: 'Line Press #1',
                    className: 'lineY11',
                    value: y1.invert(yVal).toFixed(2),
                    unit: 'Psi',
                    isLine: true
                },
                {

                    name: 'Line Press #2',
                    className: 'lineY12',
                    value: y1.invert(yVal).toFixed(2),
                    unit: 'Psi',
                    isLine: true


                },
                {

                    name: 'Tubing Press',
                    className: 'lineY13',
                    value: y1.invert(yVal).toFixed(2),
                    unit: 'Psi',
                    isLine: true


                }, {

                    name: 'Discharge Rate',
                    className: 'lineY21',
                    value: y2.invert(yVal).toFixed(2),
                    unit: 'bbl/min',
                    isLine: true


                }, {

                    name: 'Tubing Rate',
                    className: 'lineY22',
                    value: y2.invert(yVal).toFixed(2),
                    unit: 'bbl/min',
                    isLine: true


                }, {

                    name: 'Proppant Conc 40/70',
                    className: 'lineY31',
                    value: y3.invert(yVal).toFixed(2),
                    unit: 'ppa',
                    isLine: true


                }


            ]
            d3.selectAll(`[data-flagItem="${key}"]`).remove();
            const flagScore = d3.select('.inner-items')
                .append('div')
                .classed('flagItem', true)
                .attr('data-flagItem', key)
                .on('mouseover', function () {
                    console.log('enter')
                    d3.select(`[data-attrFlag="${key}"]`)
                        .select('.flags')
                        .classed('highlighted', true)
                })
                .on('mouseleave', function () {
                    console.log('eleave')
                    d3.select(`[data-attrFlag="${key}"]`)
                        .select('.flags')
                        .classed('highlighted', false)

                })

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
                .append('i')
                .classed("fa fa-trash-o", true)


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


        },
        deleteSlopeLine: function (key) {
            const deleteMe = d3.select('.delete');
            deleteMe.style('display', 'flex')
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

            d3.select('.yes').on('click', ()=> {
                d3.selectAll(`[data-midCircle="${key}"]`).remove();
                d3.selectAll(`[data-slopeLineSplit="${key}"]`).remove()
                d3.select(`[data-slopeLine="${key}"]`).remove()
                d3.selectAll(`[data-slopeText="${key}"]`).remove();
                d3.selectAll(`[data-startCircle="${key}"]`).remove();
                d3.selectAll(`[data-endCircle="${key}"]`).remove();
                deleteMe.style('display', 'none');
                lineDict.delete(key)
                console.log('Slope Line  deleted Successfully!')
                console.log(lineDict)

            });

            d3.select('.no').on('click', ()=> deleteMe.style('display', 'none'))


        },


    }


})


