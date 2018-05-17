class ScoresInStacked {
    constructor({ data }) {
        this.data = data;
    }

    draw() {
        this.width = 700;
        this.height = 100;
        var margin = { top: 30, right: 20, bottom: 30, left: 50 };
        this.topSvg = d3
            .select('.score-top')
            .style('width', `${this.width - margin.left - margin.right}px`)
            .style('height', `${this.height}px`)
            .style('margin-left', `${margin.left}px`);

        this.innerTop = this.topSvg.append('div').classed('top', true);
        this.innerBottom = this.topSvg.append('div').classed('bottom', true);

        this.bottomSvg = d3
            .select('.score-bottom')
            .style('width', `${this.width - margin.left - margin.right}px`)
            .style('margin-left', `${margin.left}px`);

        this.addTotalSumFromAll();
        this.addUndeliverable();
        this.addTotalReadAndSkimmed();
        this.addSumDiffReadAndSkimmed();
        this.addLineChart();
        this.addPieChart();
    }

    addLineChart() {
        var margin = { top: 30, right: 20, bottom: 30, left: 50 },
            width = this.width - margin.left - margin.right,
            height = this.height + 200 - margin.top - margin.bottom;

        this.lineChartSvg = d3
            .select('.stacked-line')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')',
            );

        const parseDate = d3.time.format('%d-%b-%y').parse;

        const x = d3.time.scale().range([0, width]);
        const yScale = d3.scale.linear().range([height, 0]);

        const xAxis = d3.svg
            .axis()
            .scale(x)
            .orient('bottom')
            .ticks(5);

        const yAxis = d3.svg
            .axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);

        const valuelineAmount = d3.svg
            .line()
            .x(d => x(d.date))
            .y(d => yScale(d.amount));

        const valuelinePrevious = d3.svg
            .line()
            .x(d => x(d.date))
            .y(d => yScale(d.previous));

        const dataOnlyReadAndSkimmed = this.data.filter(
            d => d.category === 'skimmed' || d.category === 'read',
        );

        const uniqueDate = _.uniqBy(dataOnlyReadAndSkimmed, 'date');
        const collectData = uniqueDate.map(d => {
            const thisDate = dataOnlyReadAndSkimmed.filter(
                rs => rs.date === d.date,
            );
            const sumByPrevious = _.sumBy(thisDate, 'previous');
            const sumByAmount = _.sumBy(thisDate, 'amount');

            return {
                date: parseDate(d.date),
                previous: sumByPrevious,
                amount: sumByAmount,
            };
        });

        const meanByAmount = _.meanBy(collectData, 'amount');
        const meanByPrevious = _.meanBy(collectData, 'previous');
        const totalMean = _.meanBy([meanByPrevious, meanByAmount]);

        x.domain(
            d3.extent(collectData, function(d) {
                return d.date;
            }),
        );
        const extentAmount = d3.extent(collectData, d => d.amount);
        const extentPrevious = d3.extent(collectData, d => d.previous);
        yScale.domain([0, d3.max([...extentAmount, ...extentPrevious])]);

        const topRectHeight = yScale(totalMean);

        this.lineChartSvg
            .append('rect')
            .attr('width', width)
            .attr('height', topRectHeight)
            .attr('class', 'topRect')
            .attr('fill', '#F0FCE5');

        this.lineChartSvg
            .append('rect')
            .attr('width', width)
            .attr('height', 2)
            .attr('y', topRectHeight)
            .attr('class', 'average')
            .attr('fill', 'red');

        this.lineChartSvg
            .append('rect')
            .attr('width', width)
            .attr('height', height - topRectHeight)
            .attr('y', topRectHeight)
            .attr('class', 'bottomRect')
            .attr('fill', '#F4F8EF');

        this.lineChartSvg
            .append('path')
            .attr('class', 'amount-line')
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('d', valuelineAmount(collectData));

        this.lineChartSvg
            .append('path')
            .attr('class', 'previous-line')
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('d', valuelinePrevious(collectData));

        this.lineChartSvg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        this.lineChartSvg
            .append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    }
    addPieChart() {
        const svg = d3
            .select('.stacked-line')
            .append('svg')
            .attr('width', 300)
            .attr('height', 300);
        const filter = this.data.filter(d => d.category === 'read');
        const previousRead = _.sumBy(filter, 'previous');
        const amountRead = _.sumBy(filter, 'amount');
        const diff =
            (100 * amountRead - previousRead) / amountRead + previousRead;
        const amountReadPerc = 100 * amountRead / this.totalAmountSumFromAllCat;
        const totalPrevous = _.sumBy(this.data, 'previous');

        const previousPerc = 100 * previousRead / totalPrevous;

        let makeAmoutReadDataForCircle = [];
        if (amountReadPerc < 100) {
            const amountRead = {
                legend: 'Amount',
                value: amountReadPerc,
                color: 'green',
            };
            const amountReadPercGrey = {
                legend: 'Amount',
                value: 100 - amountReadPerc,
                color: 'grey',
            };

            makeAmoutReadDataForCircle.push(amountRead);
            makeAmoutReadDataForCircle.push(amountReadPercGrey);
        } else {
            makeAmoutReadDataForCircle.push({
                legend: 'Amount',
                value: amountReadPerc,
                color: 'green',
            });
        }

        let makePreviousReadDataForCircle = [];
        if (diff < 100) {
            const previousReadPerc = {
                legend: 'Amount',
                value: diff,
                color: 'lightgreen',
            };
            const previousReadPercGrey = {
                legend: 'Amount',
                value: 100 - diff,
                color: 'grey',
            };

            makePreviousReadDataForCircle.push(previousReadPerc);
            makePreviousReadDataForCircle.push(previousReadPercGrey);
        } else {
            makePreviousReadDataForCircle.push({
                legend: 'Amount',
                value: diff,
                color: 'lightgreen',
            });
        }

        // svg
        //     .append('circle')
        //     .attr('cx', 50)
        //     .attr('cy', 50)
        //     .attr('r', 205)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'green')
        //     .attr('stroke-width', '25');
        //
        // svg
        //     .append('circle')
        //     .attr('cx', 150)
        //     .attr('cy', 150)
        //     .attr('r', 100)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'lightgreen')
        //     .attr('stroke-width', '25');

        svg
            .append('text')
            .attr('x', 120)
            .attr('y', 150)
            .text(`${amountReadPerc.toFixed(1)}%`)
            .attr('stroke', 'none')
            .style('font-size', '35px')
            .attr('fill', 'black');

        const diffText =
            diff > 0 ? `+ ${diff.toFixed(1)}` : `- ${diff.toFixed(1)}`;

        svg
            .append('text')
            .attr('x', 150)
            .attr('y', 200)
            .text(`${diffText}%`)
            .attr('stroke', 'none')
            .attr('fill', d => (diff > 0 ? 'green' : 'red'));

        const scale = d3.scale
            .linear()
            .domain([1, 6])
            .range([100, 1000]);
        const triangleUp = d3.svg
            .symbol()
            .type('triangle-up')
            .size(d => scale(2.5));

        const triangleDown = d3.svg
            .symbol()
            .type('triangle-down')
            .size(d => scale(2.5));

        svg
            .append('path')
            .attr('d', diff > 0 ? triangleUp : triangleDown)
            .attr('fill', () => (diff > 0 ? 'green' : 'red'))
            .attr('stroke-width', 1)
            .attr('transform', `translate(120,190)`);

        const amountArc = d3.svg
            .arc()
            .outerRadius(150)
            .innerRadius(125);

        const pie = d3.layout
            .pie()
            .sort(null)
            .value(d => d.value);

        const pieChart = svg
            .append('g')
            .attr('transform', 'translate(' + 300 / 2 + ',' + 300 / 2 + ')');
        const amountG = pieChart
            .selectAll('.amountPie')
            .data(pie(makeAmoutReadDataForCircle))
            .enter()
            .append('g')
            .attr('class', 'amountPie');

        amountG
            .append('path')
            .attr('d', amountArc)
            .attr('fill', d => d.data.color);

        const diffArc = d3.svg
            .arc()
            .outerRadius(125)
            .innerRadius(100);

        const diffG = pieChart
            .selectAll('.diffPie')
            .data(pie(makePreviousReadDataForCircle))
            .enter()
            .append('g')
            .attr('class', 'diffPie');

        diffG
            .append('path')
            .attr('d', diffArc)
            .attr('fill', d => d.data.color);
    }

    addSumDiffReadAndSkimmed() {
        const filter = this.data.filter(
            d => d.category === 'skimmed' || d.category === 'read',
        );
        const scale = d3.scale
            .linear()
            .domain([1, 6])
            .range([100, 1000]);
        const triangleUp = d3.svg
            .symbol()
            .type('triangle-up')
            .size(d => scale(2.5));

        const triangleDown = d3.svg
            .symbol()
            .type('triangle-down')
            .size(d => scale(2.5));
        const sumByAmount = _.sumBy(filter, 'amount');
        const sumByPrevious = _.sumBy(filter, 'previous');

        const difference = sumByAmount - sumByPrevious;
        const perc = 100 * difference / (sumByAmount + sumByPrevious);

        const differenceEl = this.innerBottom
            .append('div')
            .classed('colItem readSkimmedDiff', true)
            .style('display', 'flex')
            .style('color', () => (difference > 0 ? 'green' : 'red'));

        const triangle = differenceEl
            .append('svg')
            .classed('triangle', true)
            .attr('width', 50)
            .attr('height', 50);

        triangle
            .append('path')
            .attr('d', difference > 0 ? triangleUp : triangleDown)
            .attr('fill', () => (difference > 0 ? 'green' : 'red'))
            .attr('stroke-width', 1)
            .attr('transform', `translate(25,25)`);

        const scores = differenceEl.append('div').classed('scores', true);

        const diffText = difference > 0 ? `+ ${difference}` : `${difference}`;
        const percText =
            difference > 0 ? `+ ${perc.toFixed(1)} %` : `${perc.toFixed(1)} %`;
        scores
            .append('div')
            .classed('diff', true)
            .text(diffText);
        scores
            .append('div')
            .classed('perc', true)
            .text(percText);
    }
    addTotalSumFromAll() {
        this.totalAmountSumFromAllCat = _.sumBy(this.data, 'amount');

        const totalSumEl = this.innerTop
            .append('div')
            .classed('colItem totalSumFromAllCat', true);
        totalSumEl
            .append('div')
            .classed('value', true)
            .text(this.totalAmountSumFromAllCat);
        totalSumEl
            .append('div')
            .classed('label', true)
            .text('SENT');
    }

    addUndeliverable() {
        const bottomCatItems = [
            'undeliverable',
            'out of office',
            'unsubscribed',
        ];

        const filters = bottomCatItems.map(d =>
            this.data.filter(e => e.category === d),
        );
        const totalSum = filters.map(d => ({
            label: d[0].category,
            sum: _.sumBy(d, 'amount'),
        }));

        totalSum.forEach(item => {
            const bottomEl = this.bottomSvg
                .append('div')
                .classed('colItem', true);
            bottomEl
                .append('div')
                .classed('sum', true)
                .text(item.sum);
            bottomEl
                .append('div')
                .classed('label', true)
                .text(item.label);
            bottomEl
                .append('div')
                .classed('perc', true)
                .text(
                    `${(100 * item.sum / this.totalAmountSumFromAllCat).toFixed(
                        1,
                    )}%`,
                );
        });
    }

    addTotalReadAndSkimmed() {
        const filter = this.data.filter(
            d => d.category === 'skimmed' || d.category === 'read',
        );
        const sum = _.sumBy(filter, 'amount');

        const readSkimmedEl = this.innerBottom
            .append('div')
            .classed('colItem readSkimmedEl', true);

        readSkimmedEl
            .append('div')
            .classed('value', true)
            .text(`${(100 * sum / this.totalAmountSumFromAllCat).toFixed(1)}%`);

        readSkimmedEl
            .append('div')
            .classed('label', true)
            .text('Reach');

        this.addUOpen(sum);
    }

    addUOpen(sum) {
        const addUOpenEl = this.innerTop
            .append('div')
            .classed('colItem addUOpenEl', true);

        addUOpenEl
            .append('div')
            .classed('value', true)
            .text(`${sum}`);

        addUOpenEl
            .append('div')
            .classed('label', true)
            .text(`u Open`);
    }
}
