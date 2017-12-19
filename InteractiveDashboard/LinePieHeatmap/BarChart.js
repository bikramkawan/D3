/**
 * Created by bikramkawan on 12/13/17.
 */
class BarChart {
    constructor(params) {
        this.data = formatData(params.data);
        this.svg = params.barSVG;
        this.width = params.width;
        this.height = params.height;
        this.margin = params.margin;
        this.setScale();
    }

    setScale() {
        this.xScale = d3
            .scaleBand()
            .range([0, this.width])
            .padding(0.1)
            .domain(this.data.map(d => d.day));

        this.yScale = d3
            .scaleLinear()
            .rangeRound([this.height, 0])
            .domain([0, d3.max(this.data, d => d.count)]);
    }

    update(filtered) {
        if (filtered.length < 0) return;
        this.data = formatData(filtered);
        this.setScale();
        this.draw();
    }

    draw() {
        this.svg.selectAll('g').remove();
        const svg = this.svg
            .append('g')
            .attr(
                'transform',
                'translate(' + this.margin.left + ',' + this.margin.top + ')',
            );
        svg
            .selectAll('.bar')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.xScale(d.day))
            .attr('width', this.xScale.bandwidth())
            .attr('y', d => this.yScale(d.count))
            .attr('height', d => this.height - this.yScale(d.count));

        svg
            .append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScale));

        svg.append('g').call(d3.axisLeft(this.yScale));
    }
}

const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
function formatData(data) {
    const days = Array.from({ length: 7 }, (v, i) => i);
    const newData = days.map(
        d => _.groupBy(data, e => e.time.getDay() === d).true,
    );
    return newData.map((d, i) => ({
        day: DAYS[i],
        count: _.sumBy(d, 'count'),
    }));
}
