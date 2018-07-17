const forceStrength = 0.03;
let svg = null;
let bubbles = null;
let nodes = [];
const width = 900;
const height = 600;
let bubbleSVGContainer;
const center = { x: width / 2, y: height / 2 };
const groupCentroids = {
    South: { x: 450 + 3 * width / 16, y: height / 3 },
    West: { x: 350 + width / 3, y: 50 + 2 * height / 3 },
    Northeast: { x: 3 * width / 8, y: height / 3 },
    Midwest: { x: -100 + width / 2, y: 50 + 2 * height / 3 },
};

const stateTitle = {
    South: { x: 550 + width / 10, y: height / 8 },
    West: { x: 450 + 9 * width / 40, y: 50 + 9 * height / 20 },
    Northeast: { x: 7 * width / 20, y: height / 8 },
    Midwest: { x: -150 + width / 2, y: 50 + 9 * height / 20 },
};

let simulation;
const createCharges = d => -Math.pow(d.radius, 2.0) * forceStrength;

function createBubbles(selector, rawData) {
    simulation = d3
        .forceSimulation()
        .velocityDecay(0.2)
        .force(
            'x',
            d3
                .forceX()
                .strength(forceStrength)
                .x(center.x),
        )
        .force(
            'y',
            d3
                .forceY()
                .strength(forceStrength)
                .y(center.y),
        )
        .force('charge', d3.forceManyBody().strength(createCharges))
        .on('tick', ticked);

    simulation.stop();
    nodes = createNodes(rawData);
    bubbleSVGContainer = d3
        .select(selector)
        .append('svg')
        .attr('id', 'bubble_svg')
        .attr('width', width)
        .attr('height', height);

    bubbles = bubbleSVGContainer.selectAll('.bubble').data(nodes, d => d.id);

    const bubblesE = bubbles
        .enter()
        .append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', d => d.color)
        .attr('stroke', d => 'black')
        .attr('stroke-width', 0.5)
        .on('mouseover', d => {
            createToolTip(d);
        })
        .on('mouseout', () => {
            d3.select('.tooltip-bubble').style('display', 'none');
        });

    bubbles = bubbles.merge(bubblesE);

    bubbles
        .transition()
        .duration(2000)
        .attr('r', d => d.radius);

    simulation.nodes(nodes);

    initialGroups();
}

const selectChartType = displayName =>
    displayName === 'murder_range' ? viewByGroups() : initialGroups();

function createNodes(rawData) {
    const maxAmount = d3.max(rawData, function(d) {
        return +d.murders;
    });

    const radiusScale = d3
        .scalePow()
        .exponent(0.5)
        .range([2, 35])
        .domain([0, maxAmount]);

    const myNodes = rawData.map(d => ({
        state: d.State,
        radius: radiusScale(+d.murders),
        murders: +d.murders,
        group: d.US_Regions,
        x: Math.random() * 900,
        y: Math.random() * 800,
        groupRange: d.groupRange,
        color: d.color,
        groupData: d.groupData,
    }));

    myNodes.slice().sort((a, b) => b.murders - a.murders);

    return myNodes;
}

const ticked = () => {
    bubbles
        .attr('cx', function(d) {
            return d.x;
        })
        .attr('cy', function(d) {
            return d.y;
        });
};

function createToolTip(object) {
    d3
        .select('.tooltip-bubble')
        .style('left', d3.event.pageX - 200 + 'px')
        .style('top', d3.event.pageY + 20 + 'px')
        .style('display', 'flex');

    const selector = d3.select('.tooltip-bubble');

    selector.select('.state-name').text(object.state);
    selector.select('.totals').text(`Total Murders : ${object.murders}`);
    // selector
    //     .select('.types')
    //     .selectAll('div')
    //     .remove();
    // selector
    //     .select('.types')
    //     .append('div')
    //     .classed('type-col', true)
    //     .text(`Group Name : ${object.group}`);
    // selector
    //     .select('.types')
    //     .append('div')
    //     .classed('type-col', true)
    //     .text(
    //         `Group Range : [${object.groupRange[0]},${object.groupRange[1]}]`,
    //     );
}

const nodeGroupX = d => {
    return groupCentroids[d.group].x;
};

const nodeGroupY = d => groupCentroids[d.group].y;

function initialGroups() {
    hideGroupNames('.state');
    hideGroupNames('.stars');

    simulation.force(
        'x',
        d3
            .forceX()
            .strength(forceStrength)
            .x(center.x),
    );
    simulation.force(
        'y',
        d3
            .forceY()
            .strength(forceStrength)
            .y(center.y),
    );
    simulation.alpha(1).restart();
}

function viewByGroups() {
    hideGroupNames('.stars');
    showGroupNames(stateTitle, 'state');
    simulation.force(
        'x',
        d3
            .forceX()
            .strength(forceStrength)
            .x(nodeGroupX),
    );
    simulation.force(
        'y',
        d3
            .forceY()
            .strength(forceStrength)
            .y(nodeGroupY),
    );

    simulation.alpha(1).restart();
}

const hideGroupNames = title => bubbleSVGContainer.selectAll(title).remove();

function showGroupNames(title, titleClass) {
    const titleData = d3.keys(title);
    const titles = bubbleSVGContainer
        .selectAll('.' + titleClass)
        .data(titleData);

    titles
        .enter()
        .append('text')
        .attr('class', titleClass)
        .attr('x', d => title[d].x)
        .attr('y', d => title[d].y)
        .attr('text-anchor', 'middle')
        .text(d => {
            const range = nodes[0].groupData.find(gd => gd.category === d)
                .range;
            return d;
        });
}

function createButtons() {
    d3
        .select('#buttons')
        .selectAll('.button')
        .on('click', function() {
            d3.selectAll('.button').classed('active', false);
            const button = d3.select(this);
            button.classed('active', true);
            const buttonId = button.attr('id');
            selectChartType(buttonId);
        });
}

function renderBubbleChart(data) {
    d3
        .select('.bubble-wrapper')
        .selectAll('svg')
        .remove();
    createBubbles('.bubble-wrapper', data);
}

createButtons();
