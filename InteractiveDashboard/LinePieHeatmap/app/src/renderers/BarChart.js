/**
 * Created by bikramkawan on 12/13/17.
 */
export default class BarChart {
    constructor(params) {
        this.data = formatData(params.data);
        this.svg = params.barSVG;
        this.width = params.width;
        this.height = params.height;
        this.margin = params.margin;
        this.setScale();
    }

    setScale() {
        this.xScale0 = d3
            .scaleBand()
            .rangeRound([0, this.width])
            .paddingInner(0.1)
            .domain(this.data.map(d => d.day));

        this.keys = Object.keys(this.data[0]).filter(d => d !== 'day');
        this.xScale1 = d3
            .scaleBand()
            .padding(0.05)
            .domain(this.keys)
            .rangeRound([0, this.xScale0.bandwidth()]);

        const that = this;
        this.yScale = d3
            .scaleLinear()
            .rangeRound([this.height, 0])
            .domain([
                0,
                d3.max(this.data, function(d) {
                    return d3.max(that.keys, function(key) {
                        return d[key];
                    });
                }),
            ])
            .nice();

        this.zScale = d3.scaleOrdinal(d3.schemeCategory10);
    }

    update(filtered) {
        if (filtered.length < 0) return;
        this.data = formatData(filtered);
        this.setScale();
        this.draw();
    }

    updateDimension(height, width) {
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.setScale();

        d3
            .select('.bar')
            .selectAll('svg')
            .remove();

        this.svg = d3
            .select('.bar')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        this.draw();
    }

    draw() {
        this.svg.selectAll('g').remove();
        const that = this;
        const svg = this.svg
            .append('g')
            .attr(
                'transform',
                'translate(' + this.margin.left + ',' + this.margin.top + ')',
            );
        svg
            .append('g')
            .selectAll('g')
            .data(this.data)
            .enter()
            .append('g')
            .attr('transform', function(d) {
                return 'translate(' + that.xScale0(d.day) + ',0)';
            })
            .selectAll('rect')
            .data(function(d) {
                return that.keys.map(function(key) {
                    return { key: key, value: d[key] };
                });
            })
            .enter()
            .append('rect')
            .attr('x', function(d) {
                return that.xScale1(d.key);
            })
            .attr('y', function(d) {
                return that.yScale(d.value);
            })
            .attr('width', this.xScale1.bandwidth())
            .attr('height', function(d) {
                return that.height - that.yScale(d.value);
            })
            .attr('fill', function(d) {
                return that.zScale(d.key);
            })
            .append('title')
            .text(d=>d.value.toFixed(2))

        svg
            .append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScale0));

        svg
            .append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(that.yScale).ticks(null, 's'))
            .append('text')
            .attr('x', 2)
            .attr('y', that.yScale(that.yScale.ticks().pop()) + 0.5)
            .attr('dy', '0.32em')
            .attr('fill', '#000')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .text('Visitor');

        const legend = svg
            .append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .attr('text-anchor', 'end')
            .selectAll('g')
            .data(this.keys.slice().reverse())
            .enter()
            .append('g')
            .attr('transform', function(d, i) {
                return 'translate(0,' + i * 20 + ')';
            });

        legend
            .append('rect')
            .attr('x', this.width - 19)
            .attr('width', 19)
            .attr('height', 19)
            .attr('fill', this.zScale);

        legend
            .append('text')
            .attr('x', this.width - 24)
            .attr('y', 9.5)
            .attr('dy', '0.32em')
            .attr('fill', '#000')
            .style('text-transform', 'capitalize')
            .classed('legendDataSource', true)
            .text(function(d) {
                return d;
            });
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
function formatData(groupData) {
    const groupedData = groupData
        .map((d, i) => groupByDay(d, i))
        .map((dataSource, i) =>
            dataSource.map(item => ({
                ...item,
            })),
        );

    return DAYS.map(day => {
        const filter = groupedData.map(
            (g, i) => g.filter(f => f.day === day)[0],
        );
        const obj = {};
        filter.forEach((val, i) => {
            const dataSource = 'dataSource' + i;
            obj[dataSource] = val.count;
        });
        obj.day = filter[0].day;

        return obj;
    });
}

function groupByDay(data, sourceId) {
    const days = Array.from({ length: 7 }, (v, i) => i);
    const newData = days.map(
        d => _.groupBy(data, e => e.time.getDay() === d).true,
    );
    return newData.map((d, i) => ({
        day: DAYS[i],
        count: _.sumBy(d, 'count'),
        ['dataSource' + sourceId]: sourceId,
    }));
}
