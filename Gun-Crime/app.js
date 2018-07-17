function splitDataByYear({ completeData, allKeys, mainKeys }) {
    const years = ['2009', '2010', '2011'];
    const fields = [];
    const dataByYear = years.map((year, index) => {
        const fieldKeys = allKeys.filter(k => k.indexOf(year) > -1);
        const data = completeData.map((data, i) => {
            const object = {};
            fieldKeys.forEach(k => {
                const label = k.split(`_${year}`)[0];
                if (index === 0 && i === 0) fields.push(label);

                object[label] = parseFloat(data[k]);
            });

            mainKeys.forEach(mk => {
                object[mk] = data[mk];
            });

            return object;
        });

        return { year, data, fields };
    });

    return dataByYear;
}

function createBubbleData(data) {
    const state = {
        1: 'South',
        2: 'West',
        3: 'Northeast',
        4: 'Midwest',
    };
    const reviewsExt = d3.extent(data, d => d['Total_murders'])[1];
    const createGroups = Array.from({ length: 7 }, (v, i) => i + 1).map(
        (d, i) => ({
            value: Math.floor(reviewsExt / 7 * d),
            category: state[i + 1],
            range: [
                Math.floor(reviewsExt / 7 * (d - 1)),
                Math.floor(reviewsExt / 7 * d),
            ],
        }),
    );

    const bubbleColorScale = d3
        .scaleLinear()
        .domain([0, reviewsExt])
        .range(['#f9f9f9', '#bc2a66']);

    return data.map(item => {
        const value = parseFloat(item['Total_murders']);
        const colorValue = createGroups.find((d, i) => value <= d.value).value;
        return {
            ...item,
            murders: value,
            group: createGroups.find((d, i) => value <= d.value).category,
            groupRange: createGroups.find((d, i) => value <= d.value).range,
            color: bubbleColorScale(colorValue),
            groupData: createGroups,
            width: 900,
            height: 600,
        };
    });
}

d3
    .queue()
    .defer(d3.json, 'data/gun-data.json')
    .defer(d3.json, 'data/us-states.json')
    .defer(d3.csv, 'data/gun-data.csv')
    .awaitAll(ready);

function ready(err, results) {
    console.error(results, err, 'results');
    const usMapData = results[1];
    const completeData = results[2];

    const allKeys = Object.keys(completeData[0]);

    const mainKeys = allKeys.filter(k => {
        return (
            k.indexOf('2009') < 0 &&
            k.indexOf('2010') < 0 &&
            k.indexOf('2011') < 0
        );
    });

    const dataByYear = splitDataByYear({ completeData, allKeys, mainKeys });

    const mapFields = dataByYear[0].fields.map(f => {
        return { label: f, isTotal: f === 'Total_murders' };
    });
    const mapProps = {
        map: usMapData,
        data: dataByYear[0].data,
        height: 500,
        width: 960,
        legendOffset: 100,
        legendWidth: 140,
        legendHeight: 300,
        color: {
            min: '#f9f9f9',
            max: '#bc2a66',
        },
        fields: mapFields,
    };
    const createMap = new RenderMap(mapProps);
    createMap.render();

    const uniqueStates = _.uniqBy(dataByYear[0].data, 'US_Regions').map(
        s => s.US_Regions,
    );

    const bubbleData = createBubbleData(dataByYear[0].data);

    renderBubbleChart(bubbleData);
    const barProps = {
        data: dataByYear[0].data,
        width: 960,
        height: 500,
        groups: mapFields.filter(mf => !mf.isTotal),
    };

    const createBarDiagram = new BarDiagram(barProps);
    createBarDiagram.render();

    const mapBtnData = {
        selector: 'map-btns',
        data: [
            {
                label: '2009',
                className: 'btn',
                id: 0,
                class: createMap,
            },
            {
                label: '2010',
                className: 'btn',
                id: 1,
                class: createMap,
            },
            {
                label: '2011',
                className: 'btn',
                id: 2,
                class: createMap,
            },
        ],
    };

    const bubbleBtnData = {
        selector: 'bubble-btns',
        data: [
            {
                label: '2009',
                className: 'btn',
                id: 0,
                isFunction: true,
            },
            {
                label: '2010',
                className: 'btn',
                id: 1,
                isFunction: true,
            },
            {
                label: '2011',
                className: 'btn',
                id: 2,
                isFunction: true,
            },
        ],
    };

    const barBtnData = {
        selector: 'bar-btns',
        data: [
            {
                label: '2009',
                className: 'btn',
                id: 0,
                class: createBarDiagram,
            },
            {
                label: '2010',
                className: 'btn',
                id: 1,
                class: createBarDiagram,
            },
            {
                label: '2011',
                className: 'btn',
                id: 2,
                class: createBarDiagram,
            },
        ],
    };
    attachBtnEvents(mapBtnData);
    attachBtnEvents(bubbleBtnData);
    attachBtnEvents(barBtnData);

    function attachBtnEvents(mapBtnData) {
        const container = d3.select(`.${mapBtnData.selector}`);
        container
            .selectAll('button')
            .data(mapBtnData.data)
            .enter()
            .append('button')
            .attr('class', d => d.className)
            .text(d => d.label)
            .on('click', function(buttton) {
                if (buttton.isFunction) {
                    const bubbleData = createBubbleData(
                        dataByYear[buttton.id].data,
                    );
                    renderBubbleChart(bubbleData);
                } else {
                    buttton.class.update(dataByYear[buttton.id]);
                }
            });
    }
}
