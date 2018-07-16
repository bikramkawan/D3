d3
    .queue()
    .defer(d3.json, 'data/gun-data.json')
    .defer(d3.json, 'data/us-states.json')
    .defer(d3.csv, 'data/2010.csv')
    .awaitAll(ready);

function ready(err, results) {
    console.error(results, err, 'results');

    const gunData = results[0];
    const usMapData = results[1];
    const year = results[1];

    const mapFields = [
        { label: 'Total_murders', isTotal: true },
        { label: 'Handguns', isTotal: false },
        { label: 'Rifles', isTotal: false },
        { label: 'Shotguns', isTotal: false },
        { label: 'Firearms', isTotal: false },
        { label: 'Knives_or_cutting_instruments', isTotal: false },
        { label: 'Other_weapons', isTotal: false },
        { label: 'Hands_fist_feet_etc', isTotal: false },
    ];
    const mapProps = {
        map: usMapData,
        data: gunData,
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

    const state = {
        1: 'G1',
        2: 'G2',
        3: 'G3',
        4: 'G4',
        5: 'G5',
        6: 'G6',
        7: 'G7',
    };
    const reviewsExt = d3.extent(gunData, d => d['Total_murders'])[1];
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
    console.error(createGroups, reviewsExt);
    const bubbleColorScale = d3
        .scaleLinear()
        .domain([0, reviewsExt])
        .range(['#f9f9f9', '#bc2a66']);

    const makeCat = createGroups.find((d, i) => 700 <= d.value);
    const createBubble = gunData.map(item => {
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

    console.error(reviewsExt, 'review', createGroups, makeCat, createBubble);
    renderBubbleChart(createBubble);
    const barProps = {
        data: gunData,
        width: 960,
        height: 500,
        groups: mapFields.filter(mf => !mf.isTotal),
    };

    //
    const createBarDiagram = new BarDiagram(barProps);
    createBarDiagram.render();
}
