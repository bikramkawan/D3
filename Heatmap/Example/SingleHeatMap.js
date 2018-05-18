class SingleHeatMap {
    constructor({ data }) {
        this.data = data;
    }

    draw() {
        const groupByHeatmap = _.groupBy(this.data, d => d.category);

        const uniquesHeatmap = _.uniqBy(this.data, d => d.category).map(
            d => d.category,
        );

        const data = uniquesHeatmap.map(id => {
            const item = groupByHeatmap[id];
            const totalPerc = _.sumBy(item, 'percentage');
            const totalClicked = _.sumBy(item, 'clicked');
            return {
                label: item[0].category,
                color: color[item[0].category],
                value: { percentage: totalPerc, clicked: totalClicked },
            };
        });

        console.error(data)

        const width = 700;
        const height = 200;
        const maxPercentage = _.sumBy(data, d => d.value.percentage);

        const itemScale = d3.scale
            .linear()
            .domain([0, maxPercentage])
            .range([0, width]);
        const svg = d3
            .select('#singleheatmap')
            .style('width', `${width}px`)
            .style('height', `${height}px`);

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

                console.error(previousArrayLength,d,'fafasfafsingle')
                const width = _.sumBy(
                    previousArrayLength.map(d =>
                        itemScale(data[d].value.percentage),
                    ),
                );

                return `translate(${width},0)`;
            });

        gEnter
            .append('rect')
            .classed('top', true)
            .attr('width', d => itemScale(d.value.percentage))
            .attr('height', 0.8 * height)
            .attr('fill', d => d.color);

        const calculateWidth = item => {
            const clickedWidthScale =
                itemScale(item.value.percentage) * item.value.clicked / 100;
            return `${clickedWidthScale}px`;
        };

        const calculateHeight = item => {
            const clickedHeight = 0.8 * height * item.value.clicked / 100;
            return `${clickedHeight}px`;
        };

        gEnter
            .append('rect')
            .classed('inset', true)
            .attr(
                'width',
                d => itemScale(d.value.percentage) * d.value.clicked / 100,
            )
            .attr('height', d => 0.8 * height * d.value.clicked / 100)
            .attr('x', d => {
                const binWidth =
                    itemScale(d.value.percentage) * d.value.clicked / 100;
                return itemScale(d.value.percentage) - binWidth;
            })
            .attr('y', d => {
                const binHeight = 0.8 * height * d.value.clicked / 100;
                return 0.8 * height - binHeight;
            })
            .attr('fill', '#1aa4cd')
            .append('title')
            .text(d => d.value.clicked);

        gEnter
            .append('text')
            .classed('clickedText', true)
            .attr('x', d => {
                const binWidth =
                    itemScale(d.value.percentage) * d.value.clicked / 100;
                return itemScale(d.value.percentage) - binWidth + 10;
            })
            .attr('y', d => {
                const binHeight = 0.8 * height * d.value.clicked / 100;
                return 0.8 * height - binHeight / 2;
            })
            .text(d => `${d.value.clicked}%`);

        gEnter
            .append('rect')
            .classed('bottom', true)
            .attr('width', d => itemScale(d.value.percentage))
            .attr('y', 0.8 * height)
            .attr('height', 0.2 * height)
            .attr('fill', 'lightgray');

        gEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', d => {
                return -30 + itemScale(d.value.percentage) / 2;
            })
            .attr('y', d => {
                return 0.9 * height;
            })
            .text(d => d.label)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => d.label);

        gEnter
            .append('text')
            .classed('perctage', true)
            .attr('x', d => {
                return -30 + itemScale(d.value.percentage) / 2;
            })
            .attr('y', d => {
                return 0.99 * height;
            })
            .text(d => `${d.value.percentage}%`)
            .append('title')
            .text(d => d.label);

        d3
            .select('.singleHeatmap-container')
            .style('width', `${width}px`)
            .style('height', `${height}px`);

        const clickedHeightScale = d3.scale
            .linear()
            .range([0, 0.8 * height])
            .domain([0, maxPercentage]);

        const itemColumn = d3
            .select('.singleHeatmap-container')
            .selectAll('div')
            .data(data)
            .enter()
            .append('div')
            .classed('col', true)
            .style('width', d => `${itemScale(d.value.percentage)}px`);

        const topContainer = itemColumn
            .append('div')
            .classed('top', true)
            .style('background', d => d.color)
            .style('height', `${0.8 * height}px`);
        console.error(itemColumn, data, 'fa');
        const bottomContainer = itemColumn
            .append('div')
            .classed('bottom', true)
            .style('height', `${0.2 * height}px`)
            .attr('title', d => `${d.label}(${d.value.percentage}%)`);

        bottomContainer
            .append('div')
            .classed('label', true)
            .text(d => d.label);

        bottomContainer
            .append('div')
            .classed('perc', true)
            .text(d => `${d.value.percentage} %`);

        topContainer
            .append('div')
            .classed('inset', true)
            .style('width', d => calculateWidth(d))
            .style('height', d => calculateHeight(d))
            .text(d => `${d.value.clicked}%`)
            .attr('title', d => `Clicked (${d.value.clicked}%)`);
    }
}
