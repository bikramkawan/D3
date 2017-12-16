/**
 * Created by bikramkawan on 12/15/17.
 */

class HeatMap {
    constructor(param) {
        this.margin = param.margin;
        this.width = param.width - this.margin.left - this.margin.right;
        this.height = param.height - this.margin.top - this.margin.bottom;
        this.data = randomHeatData();
        this.rawData = randomHeatData();
        this.setScale();
    }

    /**/
    setScale() {
        this.gridSize = Math.floor(this.width / 24);
        this.legendElementWidth = this.gridSize * 2;
        const buckets = 4;
        this.colorScale = d3
            .scaleQuantile()
            .domain([0, buckets - 1, d3.max(this.data, d => d.count)])
            .range(colors);
    }

    setData(filterParam) {
        const { id, filterBy } = filterParam;
        let filtered = null;
        if (filterBy === 'month') {
            filtered = this.rawData.filter(d => d.month === id);
        }
        if (filterBy === 'week') {
            filtered = this.rawData.filter(d => d.week === id - 1);
        }
        if (filtered.length > 0) {
            this.data = filtered;
            this.draw();
        } else {
            alert('No Data Found in this Range');
        }
    }

    draw() {
        const that = this;
        d3
            .select('.heatmap')
            .select('svg')
            .remove();

        const svg = d3
            .select('.heatmap')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr(
                'transform',
                `translate( ${this.margin.left},${this.margin.top})`,
            );

        svg
            .selectAll('.dayLabel')
            .data(days)
            .enter()
            .append('text')
            .text(d => d)
            .attr('x', 0)
            .attr('y', (d, i) => i * that.gridSize)
            .style('text-anchor', 'end')
            .attr('transform', `translate(-6,${that.gridSize / 1.5})`)
            .attr(
                'class',
                (d, i) =>
                    i >= 0 && i <= 4
                        ? 'dayLabel mono axis axis-workweek'
                        : 'dayLabel mono axis',
            );

        svg
            .selectAll('.timeLabel')
            .data(times)
            .enter()
            .append('text')
            .text(d => d)
            .attr('x', (d, i) => i * that.gridSize)
            .attr('y', 0)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(' + this.gridSize / 2 + ', -6)')
            .attr(
                'class',
                (d, i) =>
                    i >= 7 && i <= 16
                        ? 'timeLabel mono axis axis-worktime'
                        : 'timeLabel mono axis',
            );

        const rectangles = svg
            .selectAll('.hour')
            .data(this.data, d => d.day + ':' + d.hour);

        rectangles
            .enter()
            .append('rect')
            .attr('x', d => d.hour * that.gridSize)
            .attr('y', d => d.day * that.gridSize)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('class', 'hour bordered')
            .attr('width', this.gridSize)
            .attr('height', this.gridSize)
            .attr('fill', d => that.colorScale(d.count))
            .append('title')
            .text(d => Math.round(d.count));

        rectangles.exit().remove();

        const belowLegend = svg
            .selectAll('.legend')
            .data([0].concat(this.colorScale.quantiles()), d => d)
            .enter()
            .append('g')
            .attr('class', 'legend');

        belowLegend
            .append('rect')
            .attr('x', (d, i) => that.legendElementWidth * i)
            .attr('y', this.height)
            .attr('width', this.legendElementWidth)
            .attr('height', this.gridSize / 2)
            .style('fill', (d, i) => colors[i]);

        belowLegend
            .append('text')
            .attr('class', 'mono')
            .text(d => '≥ ' + Math.round(d))
            .attr('x', (d, i) => that.legendElementWidth * i)
            .attr('y', this.height + this.gridSize);

        belowLegend.exit().remove();
    }
}

const colors = ['blue', 'green', 'yellow', 'red']; // alternatively colorbrewer.YlGnBu[9]
const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const times = [
    '1a',
    '2a',
    '3a',
    '4a',
    '5a',
    '6a',
    '7a',
    '8a',
    '9a',
    '10a',
    '11a',
    '12a',
    '1p',
    '2p',
    '3p',
    '4p',
    '5p',
    '6p',
    '7p',
    '8p',
    '9p',
    '10p',
    '11p',
    '12p',
];

//https://gist.github.com/IamSilviu/5899269
function parseWeek(date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}
function randomHeatData() {
    const randomHours = d3.timeHour.range(
        new Date(2017, 0, 1),
        new Date(2017, 3, 15),
        1,
    );

    const randomHourData = randomHours.map(d => ({
        time: d,
        count: Math.random() * 100,
    }));
    const daysIndex = days.map((d, i) => i);
    const timeIndex = times.map((d, i) => i);
    const dataByWeek = daysIndex.map(
        d => _.groupBy(randomHourData, e => e.time.getDay() === d).true,
    );

    return dataByWeek
        .map((d, i) => {
            return timeIndex
                .map(e => {
                    let groupedBy = _.groupBy(d, f => f.time.getHours() === e)
                        .true;

                    return groupedBy.map((g, f) => ({
                        ...g,
                        day: i,
                        hour: groupedBy[0].time.getHours(),
                        month: g.time.getMonth(),
                        week: parseWeek(g.time) - 1,
                    }));
                })
                .reduce((acc, cur) => acc.concat(cur), []);
        })
        .reduce((acc, cur) => acc.concat(cur), []);
}
