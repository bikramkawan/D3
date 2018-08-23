const createThemes = [
    {
        key: 'Theme 1',
        colors: [
            {
                categoryName: 'Engaged',
                color: '#e5f5f9',
            },
            {
                categoryName: 'Ignored',
                color: '#ccece6',
            },
            {
                categoryName: 'LeftOpen',
                color: '#99d8c9',
            },
            {
                categoryName: 'Read',
                color: '#66c2a4',
            },
            {
                categoryName: 'Skim',
                color: '#41ae76',
            },
        ],
    },
    {
        key: 'Theme 2',

        colors: [
            {
                categoryName: 'Engaged',
                color: '#fff7fb',
            },
            {
                categoryName: 'Ignored',
                color: '#ece7f2',
            },
            {
                categoryName: 'LeftOpen',
                color: '#d0d1e6',
            },
            {
                categoryName: 'Read',
                color: '#a6bddb',
            },
            {
                categoryName: 'Skim',
                color: '#74a9cf',
            },
        ],
    },
    {
        key: 'Theme 3',
        colors: [
            {
                categoryName: 'Engaged',
                color: '#fff7ec',
            },
            {
                categoryName: 'Ignored',
                color: '#fee8c8',
            },
            {
                categoryName: 'LeftOpen',
                color: '#fdd49e',
            },
            {
                categoryName: 'Read',
                color: '#fdbb84',
            },
            {
                categoryName: 'Skim',
                color: '#fc8d59',
            },
        ],
    },
];

const width = 900;
const height = 300;

function getColor(colors, shortName) {
    const filter = colors.filter(c => c.categoryName === shortName);
    return (filter && filter.length > 0 && filter[0].color) || undefined;
}

function getCategoriesToRender(theme) {
    const currentTheme = createThemes.filter(ct => ct.key === theme);
    const colors = currentTheme[0].colors;
    console.error(currentTheme, colors);
    return [
        {
            category: 'EngagedReadRate',
            color: getColor(colors, 'Engaged') || '#e5f5f9',
            percentage: 'PercentRead',
            clickCount: 'EngagedRead_clickRate',
            shortName: 'Engaged',
        },
        {
            category: 'IgnoredRate',
            color: getColor(colors, 'Ignored') || '#ccece6',
            percentage: 'PercentRead',
            clickCount: 'ignored_clickRate',
            shortName: 'Ignored',
        },
        {
            category: 'LeftOpenRate',
            color: getColor(colors, 'LeftOpen') || '#99d8c9',
            percentage: 'PercentRead',
            clickCount: 'LeftOpen_clickrate',
            shortName: 'LeftOpen',
        },
        {
            category: 'ReadRate',
            color: getColor(colors, 'Read') || '#66c2a4',
            percentage: 'PercentRead',
            clickCount: 'Read_clickRate',
            hasPercentageLine: true,
            shortName: 'Read',
        },
        {
            category: 'SkimmedRate',
            color: getColor(colors, 'Skim') || '#41ae76',
            percentage: 'PercentRead',
            clickCount: 'skimmed_clickRate',
            shortName: 'Skim',
        },
    ];
}

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

    const select = d3.select('.color-theme').on('change', function() {
        const selectValue = d3.select('.color-theme').property('value');
        console.log('faasfsafa', selectValue);
        initApp({ csvdata, scoreData, theme: selectValue });
    });

    select
        .selectAll('option')
        .data(createThemes)
        .enter()
        .append('option')
        .text(function(d) {
            return d.key;
        });

    console.log(createThemes[0].key, 'afasfa');
    initApp({ csvdata, scoreData, theme: createThemes[0].key });
}

function initApp({ csvdata, scoreData, theme }) {
    const singleHeatData = createHeatMapData([csvdata[0]], theme);
    const multipleHeatmap = createHeatMapData(csvdata, theme);

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
        clickedWidth: 0.2,
        clickedColor: 'blue',
    });
    singleHeatMap.draw();
    const arrayHeatMap = new MultipleHeatmap({
        data: multipleHeatmap,
        width,
        height,
        clickedWidth: 0.2,
        clickedColor: 'blue',
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

function createHeatMapData(csvdata, theme) {
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

    const categoriesToRender = getCategoriesToRender(theme);
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
