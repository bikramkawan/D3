class CombinedHeatMap {
    constructor({ newData, color, correctData }) {
        this.data = newData;
        this.color = color;
        this.correctData = correctData;
    }

    draw() {
        const newData = this.data;

        const color = this.color;
        const width = 700;
        const height = 400;

        const opacityAdjust = 0.2;

        const groupByHeatmap = _.groupBy(newData, d => d.category);

        const uniquesHeatmap = _.uniqBy(newData, d => d.category).map(
            d => d.category,
        );

        const parseDateHeatmap = d3.time.format('%d-%b-%y').parse;

        const heatmapData = groupByHeatmap[uniquesHeatmap[0]].map(d => {
            const obj = {};
            obj['date'] = parseDateHeatmap(d.date);
            obj['values'] = uniquesHeatmap.map(c => {
                return groupByHeatmap[c].filter(e => e.date === d.date)[0];
            });

            return obj;
        });
        console.error(heatmapData);

        const dataWithColorAdjust1 = heatmapData.map((item, index) => {
            return item.values.map(d => {
                return {
                    ...d,
                    opacity: 1 - opacityAdjust * index,
                };
            });
        });

        const dataWithColorAdjust = dataWithColorAdjust1;
        console.error(dataWithColorAdjust);
        const maxPercentage = dataWithColorAdjust.map(data => {
            const percScore = _.sumBy(data, 'percentage');
            const clickedScore = _.sumBy(data, 'clicked');
            return { percScore, clickedScore };
        });

        console.error(maxPercentage, 'max');
        const percentageScale = maxPercentage.map(item => {
            const scale = d3.scale
                .linear()
                .domain([0, item.percScore])
                .range([0, width]);
            return scale;
        });

        console.error(percentageScale, dataWithColorAdjust, maxPercentage);
        const svg = d3
            .select('#combinedheatmap')
            .style('width', `${width}px`)
            .style('height', `${height}px`);

        dataWithColorAdjust.forEach(data => {
            const maxPercentage = _.sumBy(data, 'percentage');
            const clickedScore = _.sumBy(data, 'clicked');

            const itemScale = d3.scale
                .linear()
                .domain([0, maxPercentage])
                .range([0, width]);

            const heatMapEnter = svg.append('g').classed('heatmap', true);

            const gEnter = heatMapEnter
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
                            itemScale(data[d].percentage),
                        ),
                    );

                    return `translate(${width},0)`;
                });

            gEnter
                .append('rect')
                .classed('top', true)
                .attr('width', d => itemScale(d.percentage))
                .attr('height', 0.8 * height)
                .attr('fill', d => color[d.category])
                .attr('opacity', d => d.opacity);

            const calculateWidth = item => {
                const clickedWidthScale =
                    itemScale(item.value.percentage) * item.clicked / 100;
                return `${clickedWidthScale}px`;
            };

            const calculateHeight = item => {
                const clickedHeight = 0.8 * height * item.clicked / 100;
                return `${clickedHeight}px`;
            };

            gEnter
                .append('rect')
                .classed('inset', true)
                .attr('width', d => itemScale(d.percentage) * d.clicked / 100)
                .attr('height', d => 0.8 * height * d.clicked / 100)
                .attr('x', d => {
                    const binWidth = itemScale(d.percentage) * d.clicked / 100;
                    return itemScale(d.percentage) - binWidth;
                })
                .attr('y', d => {
                    const binHeight = 0.8 * height * d.clicked / 100;
                    return 0.8 * height - binHeight;
                })
                .attr('fill', '#1aa4cd')
                .append('title')
                .text(d => d.clicked);
        });

        const labelSvg = svg.append('g').classed('label', true);
        const labels = heatmapData
            .map(d => d.values.map(e => e.category))
            .reduce((c, b) => c.concat(b), []);
        const uniq = _.uniq(labels);

        const filterBy = uniq
            .map(u =>
                heatmapData.map(d =>
                    d.values.filter((e, i) => e.category === u),
                ),
            )
            .reduce((c, b) => c.concat(b), [])
            .reduce((c, b) => c.concat(b), []);

        const filteredAndSum = uniq.map(u =>
            filterBy.filter(f => f.category === u),
        );

        const totalSumScore = filteredAndSum.map(d => ({
            label: d[0].category,
            percentage: _.sumBy(d, o => o.percentage),
        }));
        const binSize = width / totalSumScore.length;
        console.error(totalSumScore);
        const labelEnter = labelSvg
            .selectAll('g')
            .data(totalSumScore)
            .enter()
            .append('g')
            .classed('category', true)
            .attr('transform', (d, i) => {
                return `translate(${binSize * i},${0.8 * height})`;
            });
        const labelHeight = 0.2 * height;
        labelEnter
            .append('rect')
            .classed('top', true)
            .attr('width', (d, i) => binSize)
            .attr('height', labelHeight)
            .attr('fill', d => color[d.label]);

        labelEnter
            .append('text')
            .classed('perc', true)
            .attr('x', (d, i) => {
                return 10;
            })
            .attr('y', (d, i) => {
                return 0.7 * labelHeight;
            })

            .text(d => d.label)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => d.label);

        labelEnter
            .append('text')
            .classed('percLabel', true)
            .attr('x', (d, i) => {
                return 10;
            })
            .attr('y', (d, i) => {
                return 0.5 * labelHeight;
            })

            .text(d => `${d.percentage}%`)
            .style('text-transform', 'capitalize')
            .append('title')
            .text(d => d.percentage);

        const app = d3
            .select('.heatmap-container')
            .selectAll('div')
            .data(dataWithColorAdjust);
        const heatmapEnter = app
            .enter()
            .append('div')
            .classed('heatmap', true)
            .style('width', `${width}px`)
            .style('height', `${height}px`)
            .style('position', 'absolute')
            .style('opacity', (d, i) => 1 - 0.2 * i);

        const clickedScale = maxPercentage.map(item => {
            const scale = d3.scale
                .linear()
                .domain([0, item.clickedScore])
                .range([0, width]);
            return scale;
        });

        const clickedHeightScale = d3.scale
            .linear()
            .range([0, 0.8 * height])
            .domain([0, maxPercentage]);

        const itemColumn = heatmapEnter
            .selectAll('.col')
            .data(d => {
                return d;
            })
            .enter()
            .append('div')
            .classed('col', true)
            .style('width', (d, i) => {
                return `${percentageScale[i](d.percentage)}px`;
            });

        const topContainer = itemColumn
            .append('div')
            .classed('top', true)
            .style('background', (d, i) => {
                return color[d.category];
            })
            .style('opacity', d => d.opacity);

        // const labels = heatmapData
        //     .map(d => d.values.map(e => e.category))
        //     .reduce((c, b) => c.concat(b), []);
        // const uniq = _.uniq(labels);
        //
        // const filterBy = uniq
        //     .map(u =>
        //         heatmapData.map(d =>
        //             d.values.filter((e, i) => e.category === u),
        //         ),
        //     )
        //     .reduce((c, b) => c.concat(b), [])
        //     .reduce((c, b) => c.concat(b), []);
        //
        // const filteredAndSum = uniq.map(u =>
        //     filterBy.filter(f => f.category === u),
        // );
        // const totalSumScore = filteredAndSum.map(d => ({
        //     label: d[0].category,
        //     percentage: _.sumBy(d, o => o.percentage),
        // }));

        const bottomContainer = d3
            .select('.heatmap-container')
            .append('div')
            .classed('bottom', true)
            .style('width', `${width}px`)
            .style('height', `${100}px`)
            .style('position', 'relative')
            .style('top', `${height}px`);

        const scoreCol = bottomContainer
            .selectAll('.scoreCol')
            .data(totalSumScore)
            .enter()
            .append('div')
            .classed('scoreCol', true)
            .style('background', d => color[d.label]);

        scoreCol
            .append('div')
            .classed('label', true)
            .text(d => d.category);

        scoreCol
            .append('div')
            .classed('perc', true)
            .text(d => `${d.percentage} %`);

        const calculateWidth = (item, index) => {
            const clickedWidthScale =
                percentageScale[index](item.percentage) * item.clicked / 100;
            return `${clickedWidthScale}px`;
        };

        const calculateHeight = (item, index) => {
            const clickedHeight = 0.8 * height * item.clicked / 100;
            return `${clickedHeight}px`;
        };
        topContainer
            .append('div')
            .classed('inset', true)
            .style('width', (d, i) => calculateWidth(d, i))
            .style('height', (d, i) => calculateHeight(d, i))
            // .text(d => `${d.value.clicked}%`)
            .attr('title', d => `Clicked (${d.clicked}%)`);
    }
}
