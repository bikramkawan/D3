const stackedData = [
    {
        date: '01-Apr-07',
        category: 'ignored',
        amount: 10,
    },
    {
        date: '03-Apr-07',
        category: 'ignored',
        amount: 20,
    },
    {
        date: '04-Apr-07',
        category: 'ignored',
        amount: 25,
    },
    {
        date: '05-Apr-07',
        category: 'ignored',
        amount: 5,
    },
    {
        date: '06-Apr-07',
        category: 'ignored',
        amount: 7,
    },
    {
        date: '07-Apr-07',
        category: 'ignored',
        amount: 10,
    },
    {
        date: '08-Apr-07',
        category: 'ignored',
        amount: 32,
    },
    {
        date: '09-Apr-07',
        category: 'ignored',
        amount: 2,
    },
    {
        date: '10-Apr-07',
        category: 'ignored',
        amount: 6,
    },

    {
        date: '01-Apr-07',
        category: 'skimmed',
        amount: 5,
    },
    {
        date: '03-Apr-07',
        category: 'skimmed',
        amount: 8,
    },
    {
        date: '04-Apr-07',
        category: 'skimmed',
        amount: 15,
    },
    {
        date: '05-Apr-07',
        category: 'skimmed',
        amount: 10,
    },
    {
        date: '06-Apr-07',
        category: 'skimmed',
        amount: 17,
    },
    {
        date: '07-Apr-07',
        category: 'skimmed',
        amount: 9,
    },
    {
        date: '08-Apr-07',
        category: 'skimmed',
        amount: 21,
    },
    {
        date: '09-Apr-07',
        category: 'skimmed',
        amount: 5,
    },
    {
        date: '10-Apr-07',
        category: 'skimmed',
        amount: 10,
    },

    {
        date: '01-Apr-07',
        category: 'read',
        amount: 15,
    },
    {
        date: '03-Apr-07',
        category: 'read',
        amount: 20,
    },
    {
        date: '04-Apr-07',
        category: 'read',
        amount: 5,
    },
    {
        date: '05-Apr-07',
        category: 'read',
        amount: 12,
    },
    {
        date: '06-Apr-07',
        category: 'read',
        amount: 20,
    },
    {
        date: '07-Apr-07',
        category: 'read',
        amount: 15,
    },
    {
        date: '08-Apr-07',
        category: 'read',
        amount: 5,
    },
    {
        date: '09-Apr-07',
        category: 'read',
        amount: 10,
    },
    {
        date: '10-Apr-07',
        category: 'read',
        amount: 7,
    },

    {
        date: '01-Apr-07',
        category: 'other1',
        amount: 8,
    },
    {
        date: '03-Apr-07',
        category: 'other1',
        amount: 15,
    },
    {
        date: '04-Apr-07',
        category: 'other1',
        amount: 20,
    },
    {
        date: '05-Apr-07',
        category: 'other1',
        amount: 30,
    },
    {
        date: '06-Apr-07',
        category: 'other1',
        amount: 10,
    },
    {
        date: '07-Apr-07',
        category: 'other1',
        amount: 5,
    },
    {
        date: '08-Apr-07',
        category: 'other1',
        amount: 15,
    },
    {
        date: '09-Apr-07',
        category: 'other1',
        amount: 10,
    },
    {
        date: '10-Apr-07',
        category: 'other1',
        amount: 5,
    },

    {
        date: '01-Apr-07',
        category: 'other2',
        amount: 18,
    },
    {
        date: '03-Apr-07',
        category: 'other2',
        amount: 10,
    },
    {
        date: '04-Apr-07',
        category: 'other2',
        amount: 15,
    },
    {
        date: '05-Apr-07',
        category: 'other2',
        amount: 10,
    },
    {
        date: '06-Apr-07',
        category: 'other2',
        amount: 5,
    },
    {
        date: '07-Apr-07',
        category: 'other2',
        amount: 10,
    },
    {
        date: '08-Apr-07',
        category: 'other2',
        amount: 10,
    },
    {
        date: '09-Apr-07',
        category: 'other2',
        amount: 20,
    },
    {
        date: '10-Apr-07',
        category: 'other2',
        amount: 15,
    },
];

const groupBy = _.groupBy(stackedData, d => d.category);
const uniques = _.uniqBy(stackedData, d => d.category).map(d => d.category);
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

const stackedMargin = { top: 20, right: 20, bottom: 30, left: 50 },
    stackedWidth = 700 - stackedMargin.left - stackedMargin.right,
    stackedHeight = 400 - stackedMargin.top - stackedMargin.bottom;

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
    .select('.stackedChart-container')
    .append('svg')
    .attr('width', stackedWidth + stackedMargin.left + stackedMargin.right)
    .attr('height', stackedHeight + stackedMargin.top + stackedMargin.bottom)
    .append('g')
    .attr(
        'transform',
        'translate(' + stackedMargin.left + ',' + stackedMargin.top + ')',
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

const items = svg
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

svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + stackedHeight + ')')
    .call(xAxis);

svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis);

const legend = d3
    .select('.stackedChart-container')
    .append('div')
    .classed('legends', true);

const row = legend
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
