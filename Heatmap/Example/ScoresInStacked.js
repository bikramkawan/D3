class ScoresInStacked {
    constructor({ data }) {
        this.data = data;
    }

    draw() {
        const margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 700,
            height = 100;
        this.topSvg = d3
            .select('.score-top')
            .style('width', `${width}px`)
            .style('height', `${height}px`)
            .style('border', '1px solid');

        this.innerTop = this.topSvg.append('div').classed('top',true)
        this.innerBottom = this.topSvg.append('div').classed('bottom',true)
        this.bottomSvg = d3
            .select('.score-bottom')
            .style('width', `${width}px`)
            .style('height', `${height}px`)
            .style('border', '1px solid');

        console.error(this.data, 'ata');

        this.addTotalSumFromAll();
        this.addUndeliverable();
        this.addTotalReadAndSkimmed();
        this.addSumDiffReadAndSkimmed();
        this.addPieChart();
    }

    addPieChart() {
        const svg = d3.select('.pieChart');

        const filter = this.data.filter(d => d.category === 'read');
        const previousRead = _.sumBy(filter, 'previous');
        const amountRead = _.sumBy(filter, 'amount');
        const diff = (100 * amountRead - previousRead) / amountRead;
        const amountReadPerc = 100 * amountRead / this.totalAmountSumFromAllCat;
        const totalPrevous = _.sumBy(this.data, 'previous');

        const previousPerc = 100 * previousRead / totalPrevous;

        svg
            .append('circle')
            .attr('cx', 150)
            .attr('cy', 150)
            .attr('r', 125)
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', '25');

        svg
            .append('circle')
            .attr('cx', 150)
            .attr('cy', 150)
            .attr('r', 100)
            .attr('fill', 'none')
            .attr('stroke', 'lightgreen')
            .attr('stroke-width', '25');

        svg
            .append('text')
            .attr('x', 150)
            .attr('y', 150)
            .text(`${amountReadPerc.toFixed(1)}%`)
            .attr('stroke', 'none')
            .attr('fill', 'black');

        svg
            .append('text')
            .attr('x', 150)
            .attr('y', 200)
            .text(`${diff.toFixed(1)}%`)
            .attr('stroke', 'none')
            .attr('fill', 'black');
    }

    addSumDiffReadAndSkimmed() {
        const filter = this.data.filter(
            d => d.category === 'skimmed' || d.category === 'read',
        );

        const sumByAmount = _.sumBy(filter, 'amount');
        const sumByPrevious = _.sumBy(filter, 'previous');

        const difference = sumByAmount - sumByPrevious;
        const perc = 100 * difference / sumByAmount;
        console.error(sumByAmount, sumByPrevious, 'dfaffaf', difference, perc);

        const differenceEl = this.innerBottom
            .append('div')
            .classed('readSkimmedDiff', true);

        differenceEl
            .append('div')
            .classed('diff', true)
            .text(difference);
        differenceEl
            .append('div')
            .classed('perc', true)
            .text(perc.toFixed(1));
    }
    addTotalSumFromAll() {
        this.totalAmountSumFromAllCat = _.sumBy(this.data, 'amount');

        console.error(this.totalAmountSumFromAllCat);
        const totalSumEl = this.innerTop
            .append('div')
            .classed('totalSumFromAllCat', true);
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

        console.error(totalSum, filters);
        const bottomEl = this.bottomSvg
            .append('div')
            .classed('undeliverable', true);

        totalSum.forEach(item => {
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
            .classed('readSkimmedEl', true);

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
            .classed('addUOpenEl', true);

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
