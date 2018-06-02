// China:Aus = 136,097:3524 = 39:1
// India:Aus = 53,568:70 = 765:1
// Viet:Aus = 21,807:<5 = 5451:1
// Korea:Aus = 20,790:185 = 112:1
// Malay:Aus = 20,641:206 = 100:1
// USA:Aus = 8,810:4,769 = 1.8:1
// UK:Aus = 2,019:3,304 = 1:1.6
// Italy:Aus = 1,332:1,266 = 1.05:1
// Japan:Aus = 1,748:276 = 6.3:1

const arcdata = [
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat  // Australia
        targetLocation: [101.365186, 35.850349], // Long and Lat of China
        country: 'China',
        studentsInbound: 136097,
        studentsOutbound: 3524,
        ratio: '39:1',
        id: 156,
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [78.221685, 23.520203],
        country: 'India',
        studentsInbound: 53568,
        studentsOutbound: 70,
        ratio: '765:1',
        id: 356,
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [108.258306, 14.494816],
        country: 'Vietnam',
        studentsInbound: 21807,
        studentsOutbound: 5,
        ratio: '5451:1',
        id: 704,
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [127.84087, 36.808447],
        country: 'South Korea',
        studentsInbound: 20790,
        studentsOutbound: 185,
        ratio: '112:1',
        id: 410,
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [101.925235, 4.829889],
        country: 'Malaysia',
        studentsInbound: 20640,
        studentsOutbound: 206,
        ratio: '100:1',
        id: 458,
    },
    {
        targetLocation: [-102.247068, 39.984288], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'USA',
        studentsInbound: 8810,
        studentsOutbound: 4769,
        ratio: '1.8:1',
        id: 840,
    },
    {
        targetLocation: [-1.653117, 52.999399], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'UK',
        studentsInbound: 2019,
        studentsOutbound: 3304,
        ratio: '1:1.6',
        id: 826,
    },
    {
        targetLocation: [13.25115, 42.445011], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'Italy',
        studentsInbound: 1332,
        studentsOutbound: 1266,
        ratio: '1.05:1',
        id: 380,
    },
    {
        targetLocation: [138.750162, 36.474422], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'Japan',
        studentsInbound: 1748,
        studentsOutbound: 276,
        ratio: '6.3:1',
        id: 392,
    },
];

// Map dimensions (in pixels)
const width = 1300,
    height = 809;
const center = [0, 50];
const scale = 150;
// Map projection
const projection = d3
    .geoMercator()
    .scale(scale)
    .translate([width / 2, height / 2])
    .center(center);

const path = d3.geoPath().projection(projection);

const svg = d3
    .select('.map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Toggle between inbound and outbound
d3.select('.selectToggle').on('change', function(e) {
    const checked = d3.select(this).property('checked');
    if (!checked) {
        d3.selectAll('.arc-path-inbound').style('visibility', 'hidden');
        d3.selectAll('.arc-path-outbound').style('visibility', 'visible');
    }
    if (checked) {
        d3.selectAll('.arc-path-inbound').style('visibility', 'visible');
        d3.selectAll('.arc-path-outbound').style('visibility', 'hidden');
    }
});

d3.select('.studentsIn').on('click', function() {
    const isVisible =
        d3
            .select('.arc-path-inbound')
            .attr('class')
            .indexOf('visible') > 0;
    d3.selectAll('.arc-path-inbound').classed('visible', !isVisible);

    d3.select(this).classed('hidden', isVisible);
});

d3.select('.studentsOut').on('click', function() {
    const isVisible =
        d3
            .select('.arc-path-outbound')
            .attr('class')
            .indexOf('visible') > 0;
    d3.selectAll('.arc-path-outbound').classed('visible', !isVisible);

    d3.select(this).classed('hidden', isVisible);
});

const states = svg.append('g').attr('class', 'states'); // Svg containing world map

const arcs = svg.append('g').attr('class', 'arcs visible'); // Svg for arcs

const markers = svg.append('g').attr('class', 'markers'); // svg for markers

const strokeScaleInBound = d3.scale.linear().range([1, 5]); // thickness of the line
const strokeScaleOutbound = d3.scale.linear().range([1, 5]);

const maxStudentsInbound = d3.extent(arcdata, d => d.studentsInbound);
const maxStudentsOutbound = d3.extent(arcdata, d => d.studentsOutbound);
// Reading map data
queue()
    .defer(d3.json, 'data.json')
    .defer(d3.tsv, 'world-country-names.tsv')
    .await(makeMyMap);

function makeMyMap(error, world, names) {
    console.error(world, names);

    if (error) return console.log(error);

    // Rendering world map
    states
        .selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append('path')
        .attr('d', path)

        .attr('fill', '#DBDBDB')
        .attr('stroke', 'rebeccapurple')
        .on('click', clicked)
        .on('mouseover', function(d) {
            const findCountry = arcdata.filter(
                ad => ad.id === parseFloat(d.id),
            );
            if (findCountry && findCountry.length > 0) {
                displayToolTip(findCountry[0]);
            }
        })
        .on('mouseout', function(d) {
            d3.select('.tooltip2').style('opacity', 0);
        })
        .style('opacity', d => {
            const find =
                arcdata.filter(ad => ad.id === parseFloat(d.id)).length > 0;
            return find ? 1 : 0.2;
        })
        .append('title')
        .text(d => {
            const findName = names.filter(
                n => parseFloat(n.id) === parseFloat(d.id),
            );
            return findName.length > 0 ? findName[0].name : '';
        });

    // End of Rendering world map

    strokeScaleInBound.domain(maxStudentsInbound);
    strokeScaleOutbound.domain(maxStudentsOutbound);

    // Plot for In Bound Students
    plotArcs({
        arcdata,
        arcClassName: 'arc-path-inbound visible',
        strokeScale: strokeScaleInBound,
        dataPoint: 'studentsInbound',
        color: 'blue',
        initiallyVisible: true,
    });

    // plot for outbound students
    plotArcs({
        arcdata,
        arcClassName: 'arc-path-outbound visible',
        strokeScale: strokeScaleOutbound,
        dataPoint: 'studentsOutbound',
        color: 'red',
        initiallyVisible: false,
    });

    plotMarker({ arcdata });
}

function plotMarker({ arcdata }) {
    markers
        .selectAll('foreignObject')
        .data(arcdata)
        .enter()
        .append('foreignObject')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', function(d) {
            return -5 + projection(d.targetLocation)[0];
        })
        .attr('y', function(d) {
            return -15 + projection(d.targetLocation)[1];
        })
        .append('xhtml:i')
        .classed('fa fa-map-marker', true)
        .attr('title', d => d.country);
}

function plotArcs({
    arcdata,
    arcClassName,
    strokeScale,
    dataPoint,
    color,
    initiallyVisible,
}) {
    arcs
        .selectAll(`.${arcClassName}`)
        .data(arcdata)
        .enter()
        .append('path')
        .attr('class', arcClassName)
        .attr('d', function(d) {
            return lngLatToArc(d, 'sourceLocation', 'targetLocation', 2);
        })
        .attr('stroke-width', d => strokeScale(d[dataPoint]))
        .attr('stroke', color)
        .attr('data-attr', d => `data-${d.country}`)
        .style('visibility', initiallyVisible ? 'visible' : 'hidden')
        .on('click', function(d) {})
        .on('mouseover', function(d) {
            d3.selectAll(`.${arcClassName}`).attr('opacity', '0.2');
            d3
                .select(this)
                .attr('stroke', color)
                .attr('opacity', '1');
            // displayToolTip(d)  comment for now
        })
        .on('mouseout', function(d) {
            d3
                .selectAll(`.${arcClassName}`)
                .attr('stroke', color)
                .attr('opacity', '1');
        });
}

function displayToolTip(d) {
    const toolTip = d3
        .select('.tooltip2')
        .style('left', d3.event.pageX - 200 + 'px')
        .style('top', d3.event.pageY + 20 + 'px')
        .style('opacity', 1);

    toolTip.select('.country-header').text(d.country);
    toolTip.select('.source-country-label').text(d.country);
    toolTip.select('.source-country-number').text(d.studentsInbound);
    toolTip.select('.target-country-number').text(d.studentsOutbound);
    toolTip.select('.ratio-number').text(d.ratio);
}

// Load the basemap data
// This function takes an object, the key names where it will find an array of lng/lat pairs, e.g. `[-74, 40]`
// And a bend parameter for how much bend you want in your arcs, the higher the number, the less bend.
function lngLatToArc(d, sourceName, targetName, bend) {
    // If no bend is supplied, then do the plain square root
    bend = bend || 1;
    // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
    // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

    const sourceLngLat = d[sourceName],
        targetLngLat = d[targetName];

    if (targetLngLat && sourceLngLat) {
        const sourceXY = projection(sourceLngLat),
            targetXY = projection(targetLngLat);

        // Uncomment this for testing, useful to see if you have any null lng/lat values
        // if (!targetXY) console.log(d, targetLngLat, targetXY)
        const sourceX = sourceXY[0],
            sourceY = sourceXY[1];

        const targetX = targetXY[0],
            targetY = targetXY[1];

        const dx = targetX - sourceX,
            dy = targetY - sourceY,
            dr = Math.sqrt(dx * dx + dy * dy) * bend;

        // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
        const west_of_source = targetX - sourceX < 0;
        if (west_of_source)
            return (
                'M' +
                targetX +
                ',' +
                targetY +
                'A' +
                dr +
                ',' +
                dr +
                ' 0 0,1 ' +
                sourceX +
                ',' +
                sourceY
            );
        return (
            'M' +
            sourceX +
            ',' +
            sourceY +
            'A' +
            dr +
            ',' +
            dr +
            ' 0 0,1 ' +
            targetX +
            ',' +
            targetY
        );
    } else {
        return 'M0,0,l0,0z';
    }
}
function clicked(d) {
    const findItem = arcdata.filter(ad => ad.id === parseFloat(d.id));
    const barHeight = 100;
    if (findItem.length > 0) {
        d3.select('.bar-chart').style('visibility', 'visible');
        const item = findItem[0];
        const total = item.studentsOutbound + item.studentsInbound;
        const inbound = item.studentsInbound / total;
        const outbound = 1 - inbound;
        d3.select('.bar-container').style('height', barHeight + 'px');

        d3
            .select('.inbound-bar')
            .style('height', inbound * barHeight + 'px')
            .text(item.studentsInbound)
            .attr('title', item.studentsInbound);
        d3
            .select('.outbound-bar')
            .style('height', outbound * barHeight + 'px')
            .text(item.studentsOutbound)
            .attr('title', item.studentsOutbound);
        d3.select('.bar-label').text(`${item.country} vs Australia`);
    }
}
