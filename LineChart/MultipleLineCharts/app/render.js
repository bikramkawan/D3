/**
 * Created by bikramkawan on 10/27/17.
 */
define(function (require) {
    const newExtents = new Map();

    return {

        drawLine: function drawLine(params) {

            const {linedata, linefunc, lineclass, lineYAxis, yAxisOffset, xAxis1, xAxis2, x, svg, yAxixClass} = params;
            const {margin, width, height} = require('./constants.js').constants();

            d3.selectAll(`.${lineclass}`).remove()
            // d3.selectAll('.xAxis').remove();
            const isYExist = d3.selectAll(`.${yAxixClass}`).node();
            const isTopX = d3.selectAll('.TopX').node();
            const isBottomX = d3.selectAll('.BottomX').node();


            const line = svg.append("g")
                .classed(`${lineclass}-grp`, true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            line.append("path")
                .data([linedata])
                .attr("class", lineclass)
                .attr("d", linefunc);


            if (!isTopX) {
                line.append("g")
                    .attr("class", "axis xAxis TopX")
                    .attr("transform", `translate(0,-${margin.top})`)
                    .call(xAxis1);
            }

            if (!isBottomX) {
                line.append("g")
                    .attr("class", "axis xAxis BottomX")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis2);
            }


            if (!isYExist) {
                line.append("g")
                    .attr("class", `axis yAxis ${yAxixClass}`)
                    .attr("transform", `translate(${yAxisOffset},0 )`)
                    .call(lineYAxis);
            }


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
                    .extent([[0, 0], [width, 30]])
                    .on("brush end", ()=> this.brush(param));

                d3.select(`.${selector}`).append("g")
                    .attr("class", "brush")
                    .call(brush)
                    .call(brush.move, scale.range());
            } else {

                const width = margin.left - 10;
                const {height} = brushDimension;
                const brush = d3.brushY()
                    .extent([[0, 0], [width, height]])
                    .on("brush end", ()=> this.brush(param));

                d3.select(`.${selector}`).append("g")
                    .attr("transform", `translate(-${width},0 )`)
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


            const newLine = lineData.map((d)=> Object.assign({}, d, {linedata: filtered}))

            newLine.forEach(item=>this.drawLine(item));


        }
    }


})