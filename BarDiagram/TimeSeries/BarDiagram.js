class BarDiagram {
    constructor(props) {
        this.props = props;
    }

    prepareScale() {}

    draw() {
        const that = this;
        this.svg = d3
            .select(this.props.selector)
            .append('svg')
            .attr(
                'width',
                this.props.width +
                    this.props.margin.left +
                    this.props.margin.right +
                    this.props.widthOffSet,
            )
            .attr(
                'height',
                this.props.height +
                    this.props.margin.top +
                    this.props.margin.bottom,
            );

        const g = this.svg
            .append('g')
            .attr(
                'transform',
                'translate(' +
                    this.props.margin.left +
                    ',' +
                    this.props.margin.top +
                    ')',
            );

        this.xScale = d3
            .scaleBand()
            .rangeRound([0, this.props.width])
            .padding(0.1);

        this.yScale = d3.scaleLinear().rangeRound([this.props.height, 0]);

        this.xScale.domain(
            this.props.data.map(function(d) {
                return d[0];
            }),
        );
        this.yScale.domain([
            0,
            d3.max(this.props.data, function(d) {
                return Number(d[1]);
            }),
        ]);

        this.xAxis = d3
            .axisBottom(this.xScale)
            .ticks(5)
            .tickSize(0);
        g
            .append('g')
            .attr('transform', 'translate(0,' + this.props.height + ')')
            .call(this.xAxis)
            .selectAll('text')
            .attr('dx', '-2.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');

        g
            .append('g')
            .call(d3.axisLeft(this.yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 16)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('value');

        g
            .selectAll('.bar')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('data-attr', d => d[0])
            .attr('class', this.props.barClass)
            .attr('fill', this.props.color)
            .attr('x', function(d) {
                return that.xScale(d[0]);
            })
            .attr('y', function(d) {
                return that.yScale(Number(d[1]));
            })
            .attr('width', this.xScale.bandwidth())
            .attr('height', function(d) {
                return that.props.height - that.yScale(Number(d[1]));
            });

        const foreignEnter = g
            .selectAll('.foreignObject')
            .data(this.props.data)
            .enter();

        const foreignSVG = foreignEnter
            .append('foreignObject')
            .classed('foreign-tooltip', true)
            .attr('tool-attr-' + this.props.barClass, d => d[0])
            .attr('x', function(d) {
                return that.xScale(d[0]);
            })
            .attr('y', function(d) {
                const h = that.props.height - that.yScale(Number(d[1]));
                return h / 2;
            })
            .attr('width', 100)
            .attr('height', function(d) {
                return 30;
            });
        const div = foreignSVG
            .append('xhtml:div')
            .attr('class', this.props.barClass + ' foreignObjectWrapper')
            .text(d => d[1]);

        div.append('div').classed('arrow', true);
    }
}
