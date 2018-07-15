function bubbleChart() {
    // Constants for sizing
    const width = 900;
    const height = 600;
    let bubble_svg;
    // tooltip for mouseover functionality

    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    const center = { x: width / 2, y: height / 2 };

    const stateCenters = {
        G1: { x: 3 * width / 16, y: height / 3 },
        G2: { x: width / 3, y: 2 * height / 3 },
        G3: { x: 3 * width / 8, y: height / 3 },
        G4: { x: width / 2, y: 2 * height / 3 },
        G5: { x: 5 * width / 8, y: height / 3 },
        G6: { x: 2 * width / 3, y: 2 * height / 3 },
        G7: { x: 13 * width / 16, y: height / 3 },
    };

    const starCenters = {
        1: { x: width / 3, y: 2 * height / 3 },
        2: { x: 3 * width / 8, y: height / 3 },
        3: { x: width / 2, y: 2 * height / 3 },
        4: { x: 5 * width / 8, y: height / 3 },
        5: { x: 2 * width / 3, y: 2 * height / 3 },
    };

    const stateTitle = {
        G1: { x: width / 10, y: height / 8 },
        G2: { x: 9 * width / 40, y: 9 * height / 20 },
        G3: { x: 7 * width / 20, y: height / 8 },
        G4: { x: width / 2, y: 9 * height / 20 },
        G5: { x: 13 * width / 20, y: height / 8 },
        G6: { x: 31 * width / 40, y: 9 * height / 20 },
        G7: { x: 9 * width / 10, y: height / 8 },
    };

    const starTitle = {
        1: { x: width / 5, y: 8 * height / 20 },
        2: { x: 13 * width / 40, y: height / 9 },
        3: { x: width / 2, y: 8 * height / 20 },
        4: { x: 27 * width / 40, y: height / 9 },
        5: { x: 4 * width / 5, y: 8 * height / 20 },
    };

    const forceStrength = 0.03;
    let svg = null;
    let bubbles = null;
    let nodes = [];

    function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
    }

    let simulation = d3
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
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked);

    simulation.stop();

    function createNodes(rawData) {
        const maxAmount = d3.max(rawData, function(d) {
            return +d.murders;
        });

        const radiusScale = d3
            .scalePow()
            .exponent(0.5)
            .range([2, 35])
            .domain([0, maxAmount]);

        const myNodes = rawData.map(function(d) {
            return {
                state: d.State,
                radius: radiusScale(+d.murders),
                murders: +d.murders,
                group: d.group,
                x: Math.random() * 900,
                y: Math.random() * 800,
                groupRange: d.groupRange,
                color: d.color,
                groupData: d.groupData,
            };
        });

        myNodes.slice().sort(function(a, b) {
            return b.murders - a.murders;
        });

        return myNodes;
    }

    const chart = function chart(selector, rawData) {
        nodes = createNodes(rawData);

       bubble_svg = d3
            .select(selector)
            .append('svg')
            .attr('id', 'bubble_svg')
            .attr('width', width)
            .attr('height', height);

        bubbles = bubble_svg.selectAll('.bubble').data(nodes, function(d) {
            return d.id;
        });

        const bubblesE = bubbles
            .enter()
            .append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('fill', function(d, i) {
                return d.color;
            })
            .attr('stroke', function(d) {
                return 'black';
            })
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
            .attr('r', function(d) {
                return d.radius;
            });

        simulation.nodes(nodes);

        groupBubbles();
    };

    function ticked() {
        bubbles
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            });
    }

    function createToolTip(object) {
        d3
            .select('.tooltip-bubble')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const selector = d3.select('.tooltip-bubble');

        selector.select('.state-name').text(object.state);
        selector.select('.totals').text(`Total Murders : ${object.murders}`);
        selector
            .select('.types')
            .selectAll('div')
            .remove();
        selector
            .select('.types')
            .append('div')
            .classed('type-col', true)
            .text(`Group Name : ${object.group}`);
        selector
            .select('.types')
            .append('div')
            .classed('type-col', true)
            .text(
                `Group Range : [${object.groupRange[0]},${
                    object.groupRange[1]
                }]`,
            );
    }

    function nodeStatePosX(d) {
        return stateCenters[d.group].x;
    }

    function nodeStatePosY(d) {
        return stateCenters[d.group].y;
    }

    function nodeStarPosX(d) {
        if (d.stars > 3 && d.stars < 4) {
            console.error(d, 'star', Math.floor(d.stars));
            console.error(starCenters[Math.floor(d.stars)].x);
        }
        return starCenters[Math.floor(d.stars)].x;
    }

    function nodeStarPosY(d) {
        return starCenters[Math.floor(d.stars)].y;
    }

    function groupBubbles() {
        hideTitles('.state');
        hideTitles('.stars');

        d3.selectAll('#bubble_state_annotation').remove();
        d3.selectAll('#bubble_star_annotation').remove();

        // @v4 Reset the 'x' and 'y' force to draw the bubbles to the center.
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

    function splitStateBubbles() {
        hideTitles('.stars');
        showTitles(stateTitle, 'state');

        d3.selectAll('#bubble_state_annotation').remove();
        d3.selectAll('#bubble_star_annotation').remove();

        simulation.force(
            'x',
            d3
                .forceX()
                .strength(forceStrength)
                .x(nodeStatePosX),
        );
        simulation.force(
            'y',
            d3
                .forceY()
                .strength(forceStrength)
                .y(nodeStatePosY),
        );

        simulation.alpha(1).restart();
    }

    function splitStarBubbles() {
        hideTitles('.state');
        showTitles(starTitle, 'stars');

        d3.selectAll('#bubble_state_annotation').remove();
        d3.selectAll('#bubble_star_annotation').remove();
        d3
            .select('#bubble_svg')
            .append('g')
            .attr('class', 'annotation-group')
            .attr('id', 'bubble_star_annotation')
            .call(bubble_star_makeAnnotations);

        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force(
            'x',
            d3
                .forceX()
                .strength(forceStrength)
                .x(nodeStarPosX),
        );
        simulation.force(
            'y',
            d3
                .forceY()
                .strength(forceStrength)
                .y(nodeStarPosY),
        );

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    /*
     * Hides Year title displays.
     */
    function hideTitles(title) {
        bubble_svg.selectAll(title).remove();
    }

    /*
     * Shows Year title displays.
     */
    function showTitles(title, titleClass) {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
        var titleData = d3.keys(title);
        var titles = bubble_svg.selectAll('.' + titleClass).data(titleData);

        titles
            .enter()
            .append('text')
            .attr('class', titleClass)
            .attr('x', function(d) {
                return title[d].x;
            })
            .attr('y', function(d) {
                return title[d].y;
            })
            .attr('text-anchor', 'middle')
            .text(function(d) {
                if (d == 1) {
                    return '⭐';
                } else if (d == 2) {
                    return '⭐⭐';
                } else if (d == 3) {
                    return '⭐⭐⭐';
                } else if (d == 4) {
                    return '⭐⭐⭐⭐';
                } else if (d == 5) {
                    return '⭐⭐⭐⭐⭐';
                } else {
                    const range = nodes[0].groupData.find(
                        gd => gd.category === d,
                    ).range;
                    return `${d}: [${range[0]},${range[1]}]`;
                }
            });
    }

    chart.toggleDisplay = function(displayName) {
        if (displayName === 'murder_range') {
            splitStateBubbles();
        } else if (displayName === 'stars') {
            splitStarBubbles();
        } else {
            groupBubbles();
        }
    };

    // return the chart function from closure.
    return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

const myBubbleChart = bubbleChart();


function display(error, data) {
    console.error(data, 'data');

    if (error) {
        console.log(error);
    }

    myBubbleChart('.bubble-wrapper', data);
}

function setupButtons() {
    d3
        .select('#buttons')
        .selectAll('.button')
        .on('click', function() {
            // Remove active class from all buttons
            d3.selectAll('.button').classed('active', false);
            // Find the button just clicked
            var button = d3.select(this);

            // Set it as the active button
            button.classed('active', true);

            // Get the id of the button
            var buttonId = button.attr('id');

            // Toggle the bubble chart based on
            // the currently clicked button.
            myBubbleChart.toggleDisplay(buttonId);
        });
}

function makeMyBubble(data) {
    console.error(data, 'datacustom');

    myBubbleChart('.bubble-wrapper', data);
    //  d3.csv('bubble_chart.csv', display);
}

// setup the buttons.
setupButtons();
