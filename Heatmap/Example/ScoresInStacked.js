class ScoresInStacked {
    constructor({ data }) {
        this.data = data;
    }

    draw() {
        this.width = 900;
        this.height = 600;
        const margin = { top: 30, right: 20, bottom: 30, left: 50 };
        this.lineChartHeight = 380;
        this.pieChartHeight = 300;
        this.labelHeight = 100;

        this.addSvg();
        this.addTotalSumFromAll();
        this.addUndeliverable();
        this.addTotalReadAndSkimmed();
        this.addSumDiffReadAndSkimmed();
        this.addLineChart();
        this.addPieChart();
    }

    addSvg() {
        const margin = { top: 30, right: 20, bottom: 30, left: 50 };
        const mainWidth = this.width;
        this.pieWidth = mainWidth - 350;
        this.svg = d3
            .select('#scorestackchart')
            .attr('width', this.width)
            .attr('height', this.height);

        this.topLabel = this.svg
            .append('g')
            .classed('topLabel', true)
            .attr('transform', `translate(${0},${10})`);

        this.lineChartSvg = this.svg
            .append('g')
            .classed('stackedChart', true)
            .attr(
                'transform',
                `translate(${margin.left} ,${this.labelHeight})`,
            );

        this.pieSvg = this.svg
            .append('g')
            .classed('pie', true)
            .attr(
                'transform',
                `translate(${this.pieWidth},${this.labelHeight})`,
            );

        this.bottomLabel = this.svg
            .append('g')
            .classed('bottomLabel', true)
            .attr(
                'transform',
                `translate(${0},${this.labelHeight +
                    this.lineChartHeight +
                    30})`,
            );
    }
    addLineChart() {
        const mainWidth = this.width;
        const mainHeight = this.lineChartHeight;
        this.pieWidth = mainWidth - 350;
        const margin = { top: 30, right: 20, bottom: 30, left: 50 },
            width = this.pieWidth - margin.left - margin.right,
            height = mainHeight - margin.top - margin.bottom;

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
        const svg = this.pieSvg;
        const filter = this.data.filter(d => d.category === 'read');
        const previousRead = _.sumBy(filter, 'previous');
        const amountRead = _.sumBy(filter, 'amount');
        const diff =
            (100 * amountRead - previousRead) / amountRead + previousRead;
        const amountReadPerc = 100 * amountRead / this.totalAmountSumFromAllCat;
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

        const svg = this.topLabel
            .append('g')
            .classed('readSkimmedDiff', true)
            .attr('transform', `translate(${this.width - 200},${40})`);

        svg
            .append('path')
            .attr('d', difference > 0 ? triangleUp : triangleDown)
            .attr('fill', () => (difference > 0 ? 'green' : 'red'))
            .attr('stroke-width', 1)
            .attr('transform', `translate(10,0)`);

        const diffText = difference > 0 ? `+ ${difference}` : `${difference}`;
        const percText =
            difference > 0 ? `+ ${perc.toFixed(1)} %` : `${perc.toFixed(1)} %`;

        svg
            .append('text')
            .attr('x', 50)
            .attr('y', -5)
            .classed('diff', true)
            .text(diffText)
            .attr('fill', () => (difference > 0 ? 'green' : 'red'))
            .style('font-size', '18px');

        svg
            .append('text')
            .attr('x', 50)
            .attr('y', 15)
            .classed('perc', true)
            .text(percText)
            .attr('fill', () => (difference > 0 ? 'green' : 'red'))
            .style('font-size', '18px');
    }
    addTotalSumFromAll() {
        this.totalAmountSumFromAllCat = _.sumBy(this.data, 'amount');

        const svg = this.topLabel
            .append('g')
            .classed('totalSumFromAllCat', true)
            .attr('transform', `translate(${10},${10})`);

        svg
            .append('text')
            .classed('value', true)
            .text(this.totalAmountSumFromAllCat)
            .style('font-size', '20px')
            .attr('fill', 'black');

        svg
            .append('text')
            .classed('label', true)
            .attr('x', 50)
            .text('SENT')
            .style('font-size', '20px')
            .attr('fill', 'black');
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

        const binWidth = 250;
        const height = 30;
        const offSet = 10;

        const svg = this.bottomLabel
            .selectAll('g')
            .data(totalSum)
            .enter()
            .append('g')
            .classed('colItem', true)
            .attr(
                'transform',
                (d, i) => `translate(${offSet * i + binWidth * i},${10})`,
            );

        svg
            .append('rect')
            .classed('background', true)
            .attr('width', binWidth)
            .attr('height', height)
            .attr('fill', '#f4f4f4');

        const textOffset = 10;
        svg
            .append('text')
            .classed('sum', true)
            .text(d => d.sum)
            .attr('x', (d, i) => textOffset * 2)
            .attr('y', (d, i) => 5 + height / 2)
            .style('text-transform', 'capitalize')
            .style('font-size', '18px');

        svg
            .append('text')
            .classed('label', true)
            .attr('x', (d, i) => textOffset * 7)
            .text(d => d.label)
            .attr('y', (d, i) => 5 + height / 2)
            .style('text-transform', 'capitalize')
            .style('font-size', '18px');

        svg
            .append('text')
            .attr('x', (d, i) => binWidth - textOffset * 6)
            .classed('perc', true)
            .text(
                d =>
                    `${(100 * d.sum / this.totalAmountSumFromAllCat).toFixed(
                        1,
                    )}%`,
            )
            .attr('y', (d, i) => 5 + height / 2)
            .style('text-transform', 'capitalize')
            .style('font-size', '18px');
    }

    addTotalReadAndSkimmed() {
        const filter = this.data.filter(
            d => d.category === 'skimmed' || d.category === 'read',
        );
        const sum = _.sumBy(filter, 'amount');

        const svg = this.topLabel
            .append('g')
            .classed('readSkimmedEl', true)
            .attr('transform', `translate(${10},${50})`);

        svg
            .append('text')
            .classed('value', true)
            .text(`${(100 * sum / this.totalAmountSumFromAllCat).toFixed(1)}%`)
            .style('font-size', '35px')
            .attr('fill', 'black');

        svg
            .append('text')
            .classed('label', true)
            .attr('x', 100)
            .text('Reach')
            .style('font-size', '35px')
            .attr('fill', 'black');

        this.addUOpen(sum);
    }

    addUOpen(sum) {
        const svg = this.topLabel
            .append('g')
            .classed('addUOpenEl', true)
            .attr('transform', `translate(${this.width - 200},${10})`);
        svg
            .append('text')
            .classed('value', true)
            .text(sum)
            .style('font-size', '20px')
            .attr('fill', 'black');
        svg
            .append('text')

            .classed('label', true)
            .attr('x', 50)
            .text(`u Open`)
            .style('font-size', '20px')
            .attr('fill', 'black');
    }
}
