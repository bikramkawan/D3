/**
 * Created by bikramkawan on 12/13/17.
 */
const colors = [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
];
import * as d3 from 'd3';
export default class LineChart {
    constructor(params) {
        this.data = params.data;
        this.svg = params.lineSVG;
        this.width = params.width;
        this.height = params.height;
        this.margin = params.margin;
        this.random = params.randomDataForLine;
        this.setScale();
    }

    setScale() {
        const mergedData = this.data.reduce((a, b) => a.concat(b), []);
        this.xScale = d3
            .scaleTime()
            .rangeRound([0, this.width])
            .domain(d3.extent(this.data[0], d => d.time));

        this.yScale = d3
            .scaleLinear()
            .rangeRound([this.height, 0])
            .domain([0, d3.max(mergedData, d => d.count)]);

        this.area = d3
            .area()
            .x(d => this.xScale(d.time))
            .y1(d => this.yScale(d.count))
            .y0(this.yScale(0));

        this.line = d3
            .line()
            .x(d => this.xScale(d.time))
            .y(d => this.yScale(d.count));
    }

    update(filtered) {
        this.data = filtered;
        this.random = filtered;
        this.setScale();
        this.draw();
    }

    updateDimension(height, width) {
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.setScale();

        d3
            .select('.line')
            .selectAll('svg')
            .remove();

        this.svg = d3
            .select('.line')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        this.draw();
    }
    draw() {
        this.svg.selectAll('g').remove();

        const g = this.svg
            .append('g')
            .attr(
                'transform',
                'translate(' + this.margin.left + ',' + this.margin.top + ')',
            );
        //
        // g
        //     .append('path')
        //     .datum(this.data)
        //     .attr('d', this.area)
        //     .classed('area1', true);

        // g
        //     .append('path')
        //     .datum(this.random)
        //     .attr('d', this.area)
        //     .classed('area2', true);

        // g
        //     .append('path')
        //     .data([this.random])
        //     .classed('line2', true)
        //     .attr('d', this.line);

        g
            .append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScale));

        g
            .append('g')
            .call(d3.axisLeft(this.yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('wifiCount');

        this.data.forEach((data, index) => {
            this.mapLines({ selector: g, data, color: colors[index], index });
        });

        this.createLegend();
    }

    mapLines({ selector, data, color, index }) {
        selector
            .append('path')
            .data([data])
            .attr('stroke', color)
            .attr('data-line', index)
            .classed('line-path', true)
            .attr('fill', 'none')
            .attr('d', this.line);
    }

    createLegend() {
        const select = d3
            .select('.line-legends')
            .selectAll('div')
            .data(this.data);

        const lineRow = select
            .enter()
            .append('div')
            .attr('class', (d, i) => `line-row line-source${i}`)
            .on('click', function(d, i) {
                const isSelected =
                    d3
                        .select(this)
                        .attr('class')
                        .indexOf('selected') > -1;

                if (isSelected) {
                    d3.selectAll('.line-path').style('visibility', 'visible');
                    d3.selectAll('.line-row').classed('selected', false);
                } else {
                    d3.selectAll('.line-path').style('visibility', 'hidden');
                    d3.selectAll('.line-row').classed('selected', false);
                    d3
                        .select(`[data-line="${i}"]`)
                        .style('visibility', 'visible');
                    d3.select(this).classed('selected', true);
                }
            });

        lineRow
            .append('div')
            .classed('line-label', true)
            .text((d, i) => `Data Source ${i}`);
        lineRow
            .append('div')
            .classed('color', true)
            .style('background-color', (d, i) => colors[i]);
    }
}
