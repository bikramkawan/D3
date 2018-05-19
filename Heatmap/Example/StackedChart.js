class StackedChart {
    constructor({ stackedData, color }) {
        this.data = stackedData;
        this.color = color;
    }

    draw() {
        const color = this.color;
        const stackedData = this.data;

        const groupBy = _.groupBy(stackedData, d => d.category);
        const uniques = _.uniqBy(stackedData, d => d.category).map(
            d => d.category,
        );
        const parseDate = d3.time.format('%d-%b-%y').parse,
            formatPercent = d3.format('.0%');

        const dataR = groupBy[uniques[0]].map(d => {
            const obj = {};
            obj['date'] = parseDate(d.date);
            uniques.forEach(c => {
                const f = groupBy[c].filter(e => e.date === d.date)[0];
                obj[f.category] = f.amount;
            });

            return obj;
        });

        const mainWidth = 900;
        const mainHeight = 400;
        const stackChartWidth = mainWidth - 200;
        const labelEnterheight = 50;
        const labelAreaWidth = mainWidth - stackChartWidth;
        const stackedMargin = { top: 20, right: 20, bottom: 30, left: 50 },
            stackedWidth =
                stackChartWidth - stackedMargin.left - stackedMargin.right,
            stackedHeight =
                mainHeight - stackedMargin.top - stackedMargin.bottom;

        const stackedXScale = d3.time.scale().range([0, stackedWidth]);

        const stackedYScale = d3.scale.linear().range([stackedHeight, 0]);

        const xAxis = d3.svg
            .axis()
            .scale(stackedXScale)
            .orient('bottom');

        const yAxis = d3.svg
            .axis()
            .scale(stackedYScale)
            .orient('left')
            .tickFormat(formatPercent);

        const area = d3.svg
            .area()
            .x(function(d) {
                return stackedXScale(d.date);
            })
            .y0(function(d) {
                return stackedYScale(d.y0);
            })
            .y1(function(d) {
                return stackedYScale(d.y0 + d.y);
            });

        const stack = d3.layout.stack().values(function(d) {
            return d.values;
        });

        const svg = d3
            .select('#stacklinechart')
            .attr('width', mainWidth)
            .attr('height', mainHeight);

        const stackedChartSvg = svg
            .append('g')
            .classed('stackedChart', true)
            .attr(
                'transform',
                'translate(' +
                    stackedMargin.left +
                    ',' +
                    stackedMargin.top +
                    ')',
            );

        const labelSvg = svg
            .append('g')
            .classed('stackedChart', true)
            .attr(
                'transform',
                `translate(${stackChartWidth},${stackedMargin.top})`,
            );

        const itemCollections = stack(
            uniques.map(name => {
                return {
                    name: name,
                    values: dataR.map(function(d) {
                        return { date: d.date, y: d[name] / 100 };
                    }),
                };
            }),
        );

        stackedXScale.domain(d3.extent(dataR, d => d.date));

        const items = stackedChartSvg
            .selectAll('.items')
            .data(itemCollections)
            .enter()
            .append('g')
            .attr('class', 'items');
        items
            .append('path')
            .attr('class', 'area')
            .attr('d', d => area(d.values))
            .style('fill', d => color[d.name]);
        stackedChartSvg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + stackedHeight + ')')
            .call(xAxis);

        stackedChartSvg
            .append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        const legends = d3
            .select('.stackChart-Main')
            .append('div')
            .classed('legends', true);

        const labelEnter = labelSvg
            .selectAll('g')
            .data(uniques)
            .enter()
            .append('g')
            .classed('legendColumn', true)
            .attr(
                'transform',
                (d, i) => `translate(0,${labelEnterheight * i})`,
            );

        // labelEnter
        //     .append('rect')
        //     .classed('labelColor', true)
        //     .attr('width', 40)
        //     .attr('height', 30)
        //     .attr('fill', d => color[d])
        //     .attr('x', d => labelAreaWidth * 0.5);

        labelEnter
            .append('rect')
            .classed('labelColor', true)
            .attr('width', labelAreaWidth * 0.9)
            .attr('height', labelEnterheight * 0.9)
            .attr('fill', d => color[d]);

        labelEnter
            .append('text')
            .classed('label', true)
            .attr('x', d => -30 + labelAreaWidth * 0.9 / 2)
            .attr('y', labelEnterheight * 0.9 / 2)
            .text(d => `${d}`)
            .style('text-transform', 'capitalize');

        const row = legends
            .selectAll('div')
            .data(uniques)
            .enter()
            .append('div')
            .classed('legendColumn', true);

        row
            .append('div')
            .classed('name', true)
            .text(d => d);
        row
            .append('div')
            .classed('color', true)
            .style('background', d => color[d]);
    }
}
