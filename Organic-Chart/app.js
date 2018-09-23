queue()
    .defer(d3.csv, 'data/data.csv')
    .awaitAll(ready);

function ready(err, results) {
    const rawData = results[0].map(d => ({
        ...d,
        Count: Number(d.Count),
        Previous: Number(d.Previous)
    }));

    const totalCount = _.sumBy(rawData, 'Count');
    const withPercentage = rawData.map(d => ({
        ...d,
        percentage: 100 * (d.Count / totalCount)
    }));
    const width = 1100;
    const height = 500;

    const svg = d3
        .select('#app')
        .style('width', `${width}px`)
        .style('height', `${height}px`);
    const color = {
        desktop: '#5FB41A',
        mobile: '#2C93D9'
    };
    const config = {
        data: withPercentage,
        width: width - 200,
        height: height,
        color,
        rotateRightCircle: -200,
        rotateLeftCircle: 400
    };
    const circle = new Circle(config);
    circle.draw();
    const legends = new Legends({ width, height, data: withPercentage, color });
    legends.draw();
}
