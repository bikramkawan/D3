/**
 * Created by bikramkawan on 12/13/17.
 */
class LineChart {
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
        this.xScale = d3
            .scaleTime()
            .rangeRound([0, this.width])
            .domain(d3.extent(this.data, d => d.time));

        this.yScale = d3
            .scaleLinear()
            .rangeRound([this.height, 0])
            .domain([0, d3.max(this.data, d => d.count)]);

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

        g
            .append('path')
            .datum(this.data)
            .attr('d', this.area)
            .classed('area1', true);

        g
            .append('path')
            .datum(this.random)
            .attr('d', this.area)
            .classed('area2', true);

        g
            .append('path')
            .data([this.data])
            .classed('line1', true)
            .attr('d', this.line);

        g
            .append('path')
            .data([this.random])
            .classed('line2', true)
            .attr('d', this.line);

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
    }
}
