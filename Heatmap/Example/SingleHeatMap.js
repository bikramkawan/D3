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
        const svg = d3
            .select('#singleheatmap')
            .style('width', `${this.width}px`)
            .style('height', `${this.height}px`)
            .style('background', 'grey');

        const gEnter = svg
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
            .text(d => d.value.clicked);
        //
        gEnter
            .append('foreignObject')
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
            .append('xhtml:div')
            .attr('title', d => `${d.value.clicked}%`)
            .classed('foreignObject', true)
            .text(d => `${d.value.clicked}%`);

        /*
        gEnter
            .append('text')
            .classed('clickedText', true)
            .attr('x', d => {
                const binWidth =
                    itemScale(d.value.percentage) * d.value.clicked / 100;
                return itemScale(d.value.percentage) - binWidth + 10;
            })
            .attr('y', d => {
                const binHeight = topHeight * d.value.clicked / 100;
                return topHeight - binHeight / 2;
            })
            .text(d => `${d.value.clicked}%`);

        */

        gEnter
            .append('rect')
            .classed('bottom', true)
            .attr('width', d => itemScale(d.value.value))
            .attr('y', topHeight)
            .attr('height', bottomHeight)
            .attr('fill', 'lightgray');

        gEnter
            .append('foreignObject')
            .attr('width', d => itemScale(d.value.value))
            .attr('y', topHeight)
            .attr('height', bottomHeight)
            .append('xhtml:div')
            .attr('title', d => `${d.label}(${d.value.value}%)`)
            .classed('foreignObject', true)
            .html(
                d =>
                    `<div >${d.label}</div><div>${Math.floor(
                        d.value.value * 100,
                    )}%</div>`,
            );

        /*
        gEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', d => {
                return someOffset + itemScale(d.value.percentage) / 2;
            })
            .attr('y', d => {
                return 0.9 * this.height;
            })
            .text(d => d.label)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => d.label);

        gEnter
            .append('text')
            .classed('perctage', true)
            .attr('x', d => {
                return someOffset + itemScale(d.value.percentage) / 2;
            })
            .attr('y', d => {
                return 0.99 * this.height;
            })
            .text(d => `${d.value.percentage}%`)
            .append('title')
            .text(d => d.label);
            */
    }
    prepareData() {
        const groupByHeatmap = _.groupBy(this.data, d => d.category);
        const uniquesHeatmap = _.uniqBy(this.data, d => d.category).map(
            d => d.category,
        );
        const data = uniquesHeatmap.map(id => {
            const item = groupByHeatmap[id];
            // const totalPerc = _.sumBy(item, 'percentage');
            //const totalClicked = _.sumBy(item, 'clicked');
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
console.error(data,'single format')
        return { data, itemScale, maxPercentage };
    }
}
