/**
 * Created by bikramkawan on 10/27/17.
 */
define(function (require) {

    return {

        drawLine: function drawLine(linedata, linefunc, lineclass, lineYAxis, yAxisOffset, xAxis1, xAxis2, x, svg) {

            const {margin, width, height} = require('./constants.js').constants();


            d3.selectAll(`.${lineclass}-grp`).remove()
            d3.selectAll('.xAxis').remove();

            x.domain(d3.extent(linedata, function (d) {
                return d.date;
            }));

            const line = svg.append("g")
                .classed(`${lineclass}-grp`, true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            line.append("path")
                .data([linedata])
                .attr("class", lineclass)
                .attr("d", linefunc);


            line.append("g")
                .attr("class", "axis xAxis")
                .attr("transform", `translate(0,-${margin.top - 5})`)
                .call(xAxis1);

            line.append("g")
                .attr("class", "axis xAxis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis2);

            line.append("g")
                .attr("class", "axis yAxis")
                .attr("transform", `translate(${yAxisOffset},0 )`)
                .call(lineYAxis);

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
            el.append('div').attr('class', d=>d.className)
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

        }

    }


})