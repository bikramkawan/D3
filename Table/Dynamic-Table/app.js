const sampleSize = 100;
const isFloat = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
const categoricalConfidence = 0.8;
const floatConfidence = 0.8;

const type = {
    string: 'string',
    categorical: 'categorical',
    number: 'number',
};

const priority = [
    {
        type: type.categorical,
        value: 3,
    },
    {
        type: type.number,
        value: 2,
    },
    {
        type: type.string,
        value: 1,
    },
];

const width = 95;
const height = 60;
function isMissingNumber(v) {
    return v == null || (v && v.toString().trim().length === 0) || v === 'NaN';
}
function guessCategorical(data) {
    const testSize = Math.min(data.length, sampleSize);
    if (testSize <= 0) {
        return 0;
    }
    const categories = {};
    let validSize = 0;
    for (let i = 0; i < testSize; ++i) {
        const v = data[i];

        if (v == null || (v && v.toString().trim().length === 0)) {
            continue; //skip empty samples
        }
        validSize++;
        categories[v] = v;
    }

    // const uniques = _.uniqBy(data);
    // return uniques.length / data.length < categoricalThreshold;
    const numCats = Object.keys(categories).length;
    return 1 - numCats / validSize > categoricalConfidence;
}
function guessNumber(data) {
    const testSize = Math.min(data.length, sampleSize);
    if (testSize <= 0) {
        return 0;
    }
    const isFloat = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
    let numNumerical = 0;
    let validSize = 0;

    for (let i = 0; i < testSize; ++i) {
        const v = data[i];
        if (isMissingNumber(v)) {
            continue; //skip empty samples
        }
        validSize++;
        if (isFloat.test(v) || v === 'NaN') {
            numNumerical += 1;
        }
    }

    return numNumerical / validSize > floatConfidence;
}

function getHeaders(data) {
    return Object.keys(data[0]);
}

function guessType(data, header) {
    const mapHeaderData = data.slice(0, sampleSize).map(d => d[header]);
    const isCategorical = guessCategorical(mapHeaderData);
    const isNumber = guessNumber(mapHeaderData);
    const priorities = priority.slice().sort((a, b) => b.value - a.value);

    const update = priorities.map(p => {
        const isCat = p.type === type.categorical;
        const isNum = p.type === type.number;
        if (isCat) {
            return {
                ...p,
                result: isCategorical,
            };
        }

        if (isNum) {
            return {
                ...p,
                result: isNumber,
            };
        }

        return {
            ...p,
            result: true,
        };
    });

    const isType = update.filter(u => u.result);
    if (isType && Array.isArray(isType) && isType.length > 0) {
        return isType[0].type;
    }
    return type.string;
}

function renderTable(data) {
    const app = d3
        .select('.body')
        .selectAll('div')
        .data(data)
        .enter();

    const column = app.append('div').classed('col', true);

    const row = column
        .selectAll('div')
        .data(d => d.data)
        .enter();
    row
        .append('div')
        .classed('row', true)
        .text(d => d)
        .attr('title', d => d);
}

function renderHeader(data) {
    const header = d3
        .select('.header')
        .selectAll('div')
        .data(data)
        .enter();

    header
        .append('div')
        .classed('col header', true)
        .text(d => d.header)
        .attr('title', d => d.header)
        .on('click', d => {
            const select = d3.select(`[data-attr="${d.header}"]`);
            const isVisible = select.attr('class').indexOf('visible') > 0;
            select.classed('visible', !isVisible);
        });
}

function createBars(selection, rawdata) {
    const data = rawdata.data;
    const bar = selection
        .append('div')
        .classed('chart bar-wrapper', true)
        .attr('data-attr', rawdata.header);

    const svg = bar
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('data-attr', rawdata.header);
    const categories = _.uniq(data);

    const results = categories.map(c => {
        const f = rawdata.data.filter(d => d === c);
        return { label: c, count: f.length };
    });

    const x = d3
            .scaleBand()
            .rangeRound([0, width])
            .padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(results.map(d => d.label));
    y.domain([0, d3.max(results, d => d.count)]);
    const g = svg.append('g');

    g
        .selectAll('.bar')
        .data(results)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.count))
        .append('title')
        .text(d => `${d.label}(${d.count})`);
}

function createHistogram(selection, rawdata) {
    const data = rawdata.data.map(d => parseFloat(d)).filter(e => e);
    const histWrapper = selection
        .append('div')
        .classed('chart hist-wrapper', true)
        .attr('data-attr', rawdata.header);
    const svg = histWrapper
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('data-attr', rawdata.header);
    const g = svg.append('g');

    const x = d3
        .scaleLinear()
        .range([0, width])
        .domain(d3.extent(data));

    const bins = d3
        .histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))(data);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);

    const hist = g
        .selectAll('.hist')
        .data(bins)
        .enter()
        .append('g')
        .attr('class', 'hist')
        .attr('transform', d => {
            return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
        });

    hist
        .append('rect')
        .attr('x', 1)
        .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr('height', d => height - y(d.length))
        .append('title')
        .text(d => y(d.length));
}
function renderCharts(data) {
    const container = d3.select('.chart-wrapper');
    data.forEach(item => {
        if (item.type === type.categorical) {
            createBars(container, item);
        } else if (item.type === type.number) {
            createHistogram(container, item);
        } else {
            container
                .append('div')
                .classed('chart', true)
                .attr('data-attr', item.header)
                .style('height', '1px');
        }
    });
}

function renderApp(parsedData) {
    d3
        .select('.chart-wrapper')
        .selectAll('*')
        .remove();
    d3
        .select('.header')
        .selectAll('*')
        .remove();
    d3
        .select('.body')
        .selectAll('*')
        .remove();

    const rawdata = parsedData.slice(0, sampleSize);
    const headers = getHeaders(rawdata);
    const guessTypes = headers.map(header => {
        const type = guessType(rawdata, header);
        return {
            header,
            type,
        };
    });

    const toRender = guessTypes.map(fields => {
        const data = rawdata.map(d => d[fields.header]);
        return {
            ...fields,
            data,
        };
    });
    renderHeader(toRender);
    renderTable(toRender);
    renderCharts(toRender);
}

const reader = new FileReader();
let file = null;
function loadFile() {
    file = document.querySelector('input[type=file]').files[0];

    reader.addEventListener('load', parseFile, false);
    if (file) {
        reader.readAsText(file);
    }
}

function parseFile() {
    if (file && file.type == 'text/csv') {
        const data = d3.csvParse(reader.result, function(d) {
            return d;
        });
        renderApp(data);
    }

    if (file && file.type == 'application/json') {
        const data = JSON.parse(reader.result);
        renderApp(data);
    }

    // renderApp(data);
}
