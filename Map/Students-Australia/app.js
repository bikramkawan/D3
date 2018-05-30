// This is an array of source/target pairs.
// Each location array is in the order of longitude and then latitude.
// You often see these as lat/lng but since we need this to be in math format we do them in lng/lat, which is x/y.
// You could also nest this data and change what object you bind your data to save space. There's no single correct way.
// Do what is best for your data and for your deadlines.

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
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [101.365186, 35.850349],
        country: 'China',
        studentsInbound: 136097,
        studentsOutbound: 3524,
        ratio: '39:1',
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [78.221685, 23.520203],
        country: 'India',
        studentsInbound: 53568,
        studentsOutbound: 70,
        ratio: '765:1',
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [108.258306, 14.494816],
        country: 'Vietnam',
        studentsInbound: 21807,
        studentsOutbound: 5,
        ratio: '5451:1',
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [127.84087, 36.808447],
        country: 'South Korea',
        studentsInbound: 20790,
        studentsOutbound: 185,
        ratio: '112:1',
    },
    {
        sourceLocation: [134.906184, -24.470587], // Long / lat
        targetLocation: [101.925235, 4.829889],
        country: 'Malaysia',
        studentsInbound: 20640,
        studentsOutbound: 206,
        ratio: '100:1',
    },
    {
        targetLocation: [-102.247068, 39.984288], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'USA',
        studentsInbound: 8810,
        studentsOutbound: 4769,
        ratio: '1.8:1',
    },
    {
        targetLocation: [-1.653117, 52.999399], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'UK',
        studentsInbound: 2019,
        studentsOutbound: 3304,
        ratio: '1:1.6',
    },
    {
        targetLocation: [13.25115, 42.445011], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'Italy',
        studentsInbound: 1332,
        studentsOutbound: 1266,
        ratio: '1.05:1',
    },
    {
        targetLocation: [138.750162, 36.474422], // Long / lat
        sourceLocation: [134.906184, -24.470587],
        country: 'Japan',
        studentsInbound: 1748,
        studentsOutbound: 276,
        ratio: '6.3:1',
    },

    // {
    //     sourceLocation: [134.906184,-24.470587],  // Long / lat
    //     targetLocation: [-58.886157, -9.709944],
    //     country:'Brazil',
    //     studentsInbound:17.267,
    //     studentsOutbound:70,
    // }, {
    //     sourceLocation: [134.906184,-24.470587],  // Long / lat
    //     targetLocation: [102.029778, 4.456913],
    //     country:'Thailand',
    //     studentsInbound:17.245,
    //     studentsOutbound:70,
    // },
    // {
    //     sourceLocation: [134.906184,-24.470587],  // Long / lat
    //     targetLocation: [84.672294, 27.984329],
    //     country:'Nepal',
    //     studentsInbound:15.219,
    //     studentsOutbound:70,
    // }, {
    //     sourceLocation: [134.906184,-24.470587],  // Long / lat
    //     targetLocation: [114.15959, 0.779586],
    //     country:'Indonesia',
    //     studentsInbound:14.189,
    //     studentsOutbound:70,
    // }, {
    //     sourceLocation: [134.906184,-24.470587],  // Long / lat
    //     targetLocation: [114.048463, 22.532668],
    //     country:'Hongkong',
    //     studentsInbound:12.864,
    //     studentsOutbound:70,
    // },
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
// Create an SVG

d3.select('.map').append('div')
const svg = d3
    .select('.app')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Group for the states
// SVG drawing order is based strictly on the order in the DOM
// So you can't use something like z-index to make an element appear above or below another object
// We have to draw the states group first so that it appears below the arcs
// Change the order of these two variables if you want to see how it would look incorrect.
const states = svg.append('g').attr('class', 'states');

// Group for the arcs
const arcs = svg.append('g').attr('class', 'arcs');

// Keeps track of currently zoomed feature

queue()
    .defer(d3.json, 'data.json')
    .defer(d3.tsv, 'world-country-names.tsv')
    .await(makeMyMap);

function makeMyMap(error, world, names) {
    console.error(world, names);

    if (error) return console.log(error); //unknown error, check the console
    console.error(world, 'data');
    //Create a path for each map feature in the data
    states
        .selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features) //generate features from TopoJSON
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#DBDBDB')
        .on('click', clicked)
        .on('mouseover', function(d) {
            d3.select(this).attr('fill', 'red');
        })
        .on('mouseout', function(d) {
            console.error(d, 'dd', d3.select(this));
            d3.select(this).attr('fill', '#DBDBDB');
        });

    const maxStudents = d3.extent(arcdata, d => d.studentsInbound);
    const strokeScale = d3.scale
        .linear()
        .range([1, 5])
        .domain(maxStudents);
    console.error(maxStudents, 'daf');
    // Create a path for each source/target pair.
    const arcsd = arcs
        .selectAll('path')
        .data(arcdata)
        .enter()
        .append('path')
        .attr('class', 'arc-path')
        .attr('d', function(d) {
            return lngLatToArc(d, 'sourceLocation', 'targetLocation', 2); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
        })
        .attr('stroke-width', d => strokeScale(d.studentsInbound))
        .attr('stroke', 'tomato')
        .on('click', function(d) {
            console.error(d, 'click');
        })
        .on('mouseover', function(d) {
            console.error(d, 'arc');
            d3.selectAll('.arc-path').attr('opacity', '0.2');
            d3
                .select(this)
                .attr('stroke', 'red')
                .attr('opacity', '1');
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
        })
        .on('mouseout', function(d) {
            console.error(d, 'ddfasfsad', d3.select(this));
            d3
                .selectAll('.arc-path')
                .attr('stroke', 'tomato')
                .attr('opacity', '1');

            d3.select('.tooltip2').style('opacity', 0);
        });

    arcs
        .selectAll('arc-path1')
        .data(arcdata)
        .enter()
        .append('path')
        .attr('class', 'arc-path1')
        .attr('d', function(d) {
            return lngLatToArc(d, 'sourceLocation', 'targetLocation', 2); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
        })
        .attr('transform', 'translate(-10,10)')
        .attr('stroke-width', d => strokeScale(d.studentsInbound))
        .attr('stroke', 'blue')
        .on('click', function(d) {
            console.error(d, 'click');
        })
        .on('mouseover', function(d) {
            console.error(d, 'arc');
            d3.selectAll('.arc-path').attr('opacity', '0.2');
            d3
                .select(this)
                .attr('stroke', 'red')
                .attr('opacity', '1');
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
        })
        .on('mouseout', function(d) {
            console.error(d, 'ddfasfsad', d3.select(this));
            d3
                .selectAll('.arc-path')
                .attr('stroke', 'tomato')
                .attr('opacity', '1');

            d3.select('.tooltip2').style('opacity', 0);
        });
}

// Load the basemap data
// This function takes an object, the key names where it will find an array of lng/lat pairs, e.g. `[-74, 40]`
// And a bend parameter for how much bend you want in your arcs, the higher the number, the less bend.
function lngLatToArc(d, sourceName, targetName, bend) {
    // If no bend is supplied, then do the plain square root
    bend = bend || 1;
    // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
    // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

    var sourceLngLat = d[sourceName],
        targetLngLat = d[targetName];

    if (targetLngLat && sourceLngLat) {
        var sourceXY = projection(sourceLngLat),
            targetXY = projection(targetLngLat);

        // Uncomment this for testing, useful to see if you have any null lng/lat values
        // if (!targetXY) console.log(d, targetLngLat, targetXY)
        var sourceX = sourceXY[0],
            sourceY = sourceXY[1];

        var targetX = targetXY[0],
            targetY = targetXY[1];

        var dx = targetX - sourceX,
            dy = targetY - sourceY,
            dr = Math.sqrt(dx * dx + dy * dy) * bend;

        // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
        var west_of_source = targetX - sourceX < 0;
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

// Zoom to feature on click
// This is optional but if you use mapstarter.com, you get it for free.
function clicked(d, i) {
    console.error(d, 'dfdsfa');
}
