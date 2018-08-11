class SingleHeatMap {
    constructor({ data, width, height }) {
        this.data = data;
        this.height = height;
        this.width = width;
    }

    draw() {
        this.width = this.width - 200;
        const topHeight = 0.8 * this.height;
        const bottomHeight = 0.2 * this.height;
        const someOffset = -30;
        const { data, itemScale, maxPercentage } = this.prepareData();

        d3
            .select('#singleheatmap')
            .selectAll('*')
            .remove();
        const svg = d3
            .select('#singleheatmap')
            .style('width', `${this.width}px`)
            .style('height', `${this.height}px`);

        const topSvg = svg.append('g').classed('topheatmap', true);

        topSvg
            .append('rect')
            .classed('background-rect', true)
            .attr('width', this.width)
            .attr('height', topHeight);
        const gEnter = topSvg
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .classed('col', true)
            .attr('transform', (d, i) => {
                const previousArrayLength = Array.from(
                    { length: i },
                    (v, i) => i,
                );
                const width = _.sumBy(
                    previousArrayLength.map(d =>
                        itemScale(data[d].value.value),
                    ),
                );
                return `translate(${width},0)`;
            });

        gEnter
            .append('rect')
            .classed('top', true)
            .attr('width', d => itemScale(d.value.value))
            .attr('height', topHeight)
            .attr('fill', d => d.color);
        gEnter
            .append('path')
            .attr('d', d => {
                if (d.hasPercentageLine) {
                    const availableWidth = itemScale(d.value.value);
                    return `M${availableWidth *
                        d.value.percentage},0 L${availableWidth *
                        d.value.percentage},${topHeight}`;
                }
            })
            .attr('stroke', 'red')
            .attr('fill', 'none');

        gEnter
            .append('rect')
            .classed('inset', true)
            .attr('width', d => itemScale(d.value.value) * d.value.clicked)
            .attr('height', d => topHeight * d.value.clicked)
            .attr('x', d => {
                const binWidth = itemScale(d.value.value) * d.value.clicked;
                return itemScale(d.value.value) - binWidth;
            })
            .attr('y', d => {
                const binHeight = topHeight * d.value.clicked;
                return topHeight - binHeight;
            })
            .attr('fill', '#1aa4cd')
            .append('title')
            .text(d => `${d.value.clicked * 100}%`);
        //
        gEnter
            .append('text')
            .attr('x', d => {
                const binWidth = itemScale(d.value.value) * d.value.clicked;
                return 5 + itemScale(d.value.value) - binWidth;
            })
            .attr('y', d => {
                const binHeight = topHeight * d.value.clicked;
                return topHeight - binHeight / 2;
            })
            .text(d => `${d.value.clicked * 100}%`);
        const labelHeight = 0.75 * this.height;
        const availableLabelHeight = this.height - labelHeight;

        const labelSvg = svg
            .append('g')
            .classed('label', true)
            .attr('transform', (d, i) => `translate(0,${labelHeight})`);

        const binSize = this.width / data.length;

        const labelEnter = labelSvg
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .classed('category', true)
            .attr('transform', (d, i) => {
                return `translate(${binSize * i},${0})`;
            });

        labelEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', d => {
                return 0;
            })
            .attr('y', d => {
                return availableLabelHeight / 2;
            })
            .text(d => {
                const shortName = d.shortName ? d.shortName : d.label;
                const value = Math.floor(d.value.value * 100);
                return `${value}% ${shortName}`;
            })
            .attr('fill', d => d.color)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => {
                const shortName = d.shortName ? d.shortName : d.label;
                const value = Math.floor(d.value.value * 100);
                return `${value}% ${shortName}`;
            });
    }
    prepareData() {
        const groupByHeatmap = _.groupBy(this.data, d => d.category);
        const uniquesHeatmap = _.uniqBy(this.data, d => d.category).map(
            d => d.category,
        );
        const data = uniquesHeatmap.map(id => {
            const item = groupByHeatmap[id];
            return {
                ...item[0],
                label: item[0].category,
                color: item[0].color,
                value: {
                    percentage: item[0].percentage,
                    clicked: item[0].clicked,
                    value: item[0].value,
                },
            };
        });

        const maxPercentage = 1;

        const itemScale = d3.scale
            .linear()
            .domain([0, maxPercentage])
            .range([0, this.width]);
        return { data, itemScale, maxPercentage };
    }
}
