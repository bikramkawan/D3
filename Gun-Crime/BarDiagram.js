class BarDiagram {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    update(newData) {
        this.data = newData.data;
        d3
            .select('.bar-wrapper')
            .select('svg')
            .remove();
        this.render();
    }

    getTopAndBottomThree(label) {
        const sorted = this.data
            .slice()
            .sort((a, b) => b[label] - a[label])
            .filter(f => f[label] > 0);
        const highStates = [sorted[0], sorted[1], sorted[2]];
        const lowStates = [
            sorted[sorted.length - 1],
            sorted[sorted.length - 2],
            sorted[sorted.length - 3],
        ];
        return { highStates, lowStates };
    }

    prepareBarData() {
        const fillColor = d3
            .scaleOrdinal(d3.schemeCategory20c)
            .domain(this.props.groups.map(d => d.label));
        return this.props.groups.map(gt => ({
            label: gt.label,
            count: _.sumBy(this.data, gt.label),
            color: fillColor(gt.label),
            topThree: this.getTopAndBottomThree(gt.label),
        }));
    }

    render() {
        const barData = this.prepareBarData();
        const that = this;
        let width = this.props.width;
        let height = this.props.height;
        const svg = d3
            .select('.bar-wrapper')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        const x = d3
                .scaleBand()
                .rangeRound([0, width])
                .padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        const g = svg
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')',
            );

        x.domain(barData.map(d => d.label));
        y.domain([
            0,
            d3.max(barData, function(d) {
                return d.count;
            }),
        ]);

        g
            .append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        g
            .append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'translate(20,-20)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .attr('fill', 'black')
            .text('Total Murders');

        g
            .selectAll('.bar')
            .data(barData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.label);
            })
            .attr('y', function(d) {
                return y(d.count);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return height - y(d.count);
            })
            .attr('fill', d => d.color)
            .on('mouseover', function(d) {
                that.createToolTip(d);
            })
            .on('mouseout', function(d) {
                d3.select('.tooltip-bar').style('display', 'none');
            });
    }

    createToolTip(object) {
        d3
            .select('.tooltip-bar')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const topThree = d3.select('.top-three').select('.row-content');
        const bottomThree = d3.select('.bottom-three').select('.row-content');
        topThree.selectAll('div').remove();
        bottomThree.selectAll('div').remove();

        const topRow = topThree
            .selectAll('div')
            .data(object.topThree.highStates)
            .enter()
            .append('div')
            .classed('row', true);

        topRow
            .append('div')
            .classed('item-country', true)
            .text(d => d.State);
        topRow
            .append('div')
            .classed('item-count', true)
            .text(d => d[object.label]);

        const bottomRow = bottomThree
            .selectAll('div')
            .data(object.topThree.lowStates)
            .enter()
            .append('div')
            .classed('row', true);

        bottomRow
            .append('div')
            .classed('item-country', true)
            .text(d => d.State);
        bottomRow
            .append('div')
            .classed('item-count', true)
            .text(d => d[object.label]);
    }
}
