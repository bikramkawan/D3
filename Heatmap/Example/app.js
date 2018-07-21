const color = {
    ignored: '#B4C3CA',
    skimmed: '#76E49C',
    read: '#3ED772',
    other1: '#2CC7B4',
    other2: '#2CC7B4',
    undeliverable: '#2CC7B4',
    'out of office': '#2CC7B4',
    unsubscribed: '#1489c7',
};

const width = 900;
const height = 300;

const excludeCategoryName = ['ID', 'SentDate', 'ClickCount', 'report_type_id'];

const getColor = () => {
    return (
        '#' +
        '0123456789abcdef'
            .split('')
            .map(function(v, i, a) {
                return i > 5 ? null : a[Math.floor(Math.random() * 16)];
            })
            .join('')
    );
};
const colorbrewer = [
    '#f7fcfd',
    '#e5f5f9',
    '#ccece6',
    '#99d8c9',
    '#66c2a4',
    '#41ae76',
    '#238b45',
    '#006d2c',
    '#00441b',
];

const categoriesToRender = [
    {
        category: 'EngagedReadRate',
        color: '#e5f5f9',
        percentage: 'PercentRead',
        clickCount: 'EngagedRead_clickRate',
        shortName: 'Engaged',
    },
    {
        category: 'IgnoredRate',
        color: '#ccece6',
        percentage: 'PercentRead',
        clickCount: 'ignored_clickRate',
        shortName: 'Ignored',
    },
    {
        category: 'LeftOpenRate',
        color: '#99d8c9',
        percentage: 'PercentRead',
        clickCount: 'LeftOpen_clickrate',
        shortName: 'LeftOpen',
    },
    {
        category: 'ReadRate',
        color: '#66c2a4',
        percentage: 'PercentRead',
        clickCount: 'Read_clickRate',
        hasPercentageLine: true,
        shortName: 'Read',
    },
    {
        category: 'SkimmedRate',
        color: '#41ae76',
        percentage: 'PercentRead',
        clickCount: 'skimmed_clickRate',
        shortName: 'Skim',
    },
];

const trimString = (string, stringWidth, width) => {
    if (stringWidth > width) {
        return 'a';
    }
};
const strictIsoParse = d3.time.format('%Y-%m-%d %H:%M:%S');
const strictIsoDate = d3.time.format('%Y-%m-%d');
const requiredFormat = d3.time.format('%d-%b-%y');
const getDay = d3.time.format('%d');
const dateString = '2018-04-23T15:25:52';

queue()
    .defer(d3.csv, 'data/heatdata.csv')
    .defer(d3.csv, 'data/scoredata.csv')
    .awaitAll(ready);

function ready(err, results) {
    console.error(results);
    const csvdata = results[0];
    const scoreData = results[1];
    const singleHeatData = createHeatMapData([csvdata[0]]);
    const multipleHeatmap = createHeatMapData(csvdata);

    const scoreDataCorrectDate = scoreData
        .map(s => {
            const formatDate = strictIsoDate.parse(s.SentDate.split('T')[0]);
            return {
                ...s,
                date: formatDate ? requiredFormat(formatDate) : null,
                days: formatDate ? getDay(formatDate) : null,
            };
        })
        .filter(f => f.date);

    const keys = Object.keys(scoreDataCorrectDate[0])
        .filter(f => f)
        .filter(e => e !== 'days' && e !== 'date');
    const parseScored = scoreDataCorrectDate
        .map(s => {
            const obj = {};

            keys.forEach(k => (obj[k] = Math.abs(parseFloat(s[k]))));

            return { ...s, ...obj };
        })
        .slice()
        .sort((a, b) => parseFloat(a.days) - parseFloat(b.days));

    console.error(scoreDataCorrectDate, 'scored', parseScored);
    const singleHeatMap = new SingleHeatMap({
        data: singleHeatData,
        width,
        height,
    });
    singleHeatMap.draw();
    const arrayHeatMap = new MultipleHeatmap({
        data: multipleHeatmap,
        width,
        height,
        opt: {
            color: 'blue',
        },
    });
    arrayHeatMap.draw();

    // const stackedChart = new StackedChart({
    //     stackedData,
    //     color,
    //     width,
    //     height,
    // });
    // stackedChart.draw();
    // //
    const stackedScore = new ScoresInStacked({
        data: parseScored,
        width,
        height,
        topLine: {
            name: 'OpenRate',
            color: 'green',
        },
        bottomLine: {
            name: 'IgnoredRate',
            color: 'grey',
        },
        horLine: {
            name: 'OpenRate',
            color: 'orange',
        },
        yDomain: [0, 1],
        sent: {
            name: 'Sent',
            label: 'Sent',
        },
        reach: {
            name: 'OpenRate',
            label: 'Reach',
        },
        uopen: {
            name: 'OpenCount',
            label: 'u Open',
        },
        triangle: {
            top: 'OpenRate',
            bottom: 'PreviousAttentionRate',
        },
        gauge: {
            outer: 'AttentionRate',
            inner: 'PreviousAttentionRate',
        },
        gaugeNumbers: {
            number1: 'AttentionRate',
            number2: 'PreviousAttentionRate',
            percNumber: 'AttentionRate',
        },
        bottomItem: {
            name: 'OpenRate',
            read20Domain: [0.2, 0.59],
            read60Domain: [0.6, 1.49],
        },
        enableAxis: false,
    });

    stackedScore.draw();
    // const stackedScore = new ScoresInStacked({
    //     data: taskPiData,
    //     width,
    //     height,
    // });
}

function createHeatMapData(csvdata) {
    const validDateOnlyData = csvdata
        .map(item => {
            const formatDate = strictIsoParse.parse(
                item.sentdate.split('.')[0],
            );

            return {
                ...item,
                date: formatDate ? requiredFormat(formatDate) : null,
            };
        })
        .filter(d => d.date);

    const filteredData = validDateOnlyData.map(item => {
        const id = uid();
        return categoriesToRender.map(cat => {
            return {
                ...cat,
                date: item.date,
                category: cat.category,
                percentage: Math.min(
                    Math.abs(parseFloat(item[cat.percentage])),
                    1,
                ),
                clicked: Math.min(
                    Math.abs(parseFloat(item[cat.clickCount])),
                    1,
                ),
                color: cat.color,
                value: Math.min(Math.abs(parseFloat(item[cat.category])), 1),
                hasPercentageLine: (cat && cat.hasPercentageLine) || false,
                id,
            };
        });
    });

    return filteredData.reduce((acc, val) => acc.concat(val), []);
}

function uid() {
    return (
        '_' +
        Math.random()
            .toString(36)
            .substr(2, 9)
    );
}
