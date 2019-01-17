d3.csv('connect-data-large.csv', function(err, csv) {
    console.error(csv, err);
    const uniquGT = _.uniqBy(csv, 'Group').map((g, i) => ({
        groupID: i + 1,
        groupName: g.Group
    }));
    const uniquGS = _.uniqBy(csv, 'Code');
    const nodes = uniquGS.map((d, i) => {
        const findGroupID = uniquGT.find(g => g.groupName === d.Group);
        return {
            name: d.Code,
            group: findGroupID.groupID,
            label: d.Code,
            id: i
        };
    });

    const links = csv.map(ld => {
        let targetNode = nodes.find(nd => nd.name === ld.Target);
        const sourceNode = nodes.find(nd => nd.name === ld.Code);
        if (!targetNode) targetNode = sourceNode;
        return {
            source: sourceNode.id,
            target: targetNode.id,
            hasTarget: !!ld.Target
        };
    });

    const width = 0.9 * window.innerWidth,
        height = 0.9 * window.innerHeight;

    let simulationConfig = {
        strength: -100,
        circleRadius: 10
    };

    // Feel free to change or delete any of the code you see in this editor!
    const svg = d3
        .select('svg')
        .attr('width', width)
        .attr('height', height);
    const graph = {
        nodes,
        links
    };
    let node, link, text, g, lines, symbols, marker;

    let simulation = d3.forceSimulation().nodes(graph.nodes);
    updateChart(simulationConfig);
    function updateChart(props) {
        svg.selectAll('*').remove();
        simulation = d3.forceSimulation().nodes(graph.nodes);

        simulation
            .force('charge_force', d3.forceManyBody().strength(props.strength))
            .force('center_force', d3.forceCenter(width / 2, height / 2))
            .force(
                'links',
                d3.forceLink(graph.links).id(function(d) {
                    return d.id;
                })
            )
            .force(
                'collide',
                d3
                    .forceCollide()
                    .radius(5)
                    .strength(1)
            );

        simulation.on('tick', ticked);

        //add encompassing group for the zoom
        g = svg.append('g').attr('class', 'everything');

        //Create deffinition for the arrow markers showing relationship directions
        marker = g
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr("viewBox", "0 -5 10 10")
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr("d", "M0,-5L10,0L0,5");

        link = g.append('g').attr('class', 'links');
        const linksEnter = link
            .selectAll('line')
            .data(graph.links)
            .enter();

        lines = linksEnter
            .append('line')
            .attr('stroke', function(d) {
                return d3.color('#9cf');
            })
            .attr('marker-end', d => {
                let arrowVisible = d.hasTarget;
                if (d.source.name === d.target.name) {
                    arrowVisible = false;
                }
                return arrowVisible ? 'url(#arrow)' : '';
            })
            .attr('data-attr', d => d.target.name);

        text = g
            .append('g')
            .attr('class', 'labels')
            .selectAll('g')
            .data(graph.nodes)
            .enter()
            .append('g')
            .append('text')
            .attr('x', 14)
            .attr('y', '.31em')
            .style('font-family', 'sans-serif')
            .style('font-size', '0.7em')
            .text(function(d) {
                return d.label;
            });
        node = g
            .append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(graph.nodes)
            .enter()
            .append('circle')
            .attr('data-attr', d => d.label)
            .attr('r', props.circleRadius)
            .attr('fill', function(d) {
                return d3.color('#FFFF2F');
            })
            .style('stroke', function(d) {
                return d3.color('#FF8D2F');
            });
        // .on('mouseover', function(d) {
        //     link.style('opacity', 0.1);
        //     node.style('opacity', 0.1);
        //     text.style('opacity', 0.1);
        //     link
        //         .filter(function(e) {
        //             return e.target.id == d.id || e.source.id == d.id;
        //         })
        //         .style('opacity', 1)
        //         .style('stroke', 'red');
        //     d3.select(this).style('opacity', 1);
        // })
        // .on('mouseout', function() {
        //     link.style('opacity', 1);
        //     node.style('opacity', 1);
        //     text.style('opacity', 1);
        // });

        //add drag capabilities
        const drag_handler = d3
            .drag()
            .on('start', drag_start)
            .on('drag', drag_drag)
            .on('end', drag_end);

        drag_handler(node);
        drag_handler(text);
        drag_handler(link);

        node.on('click', function(d) {
            d3.event.stopImmediatePropagation();
            self.onNodeClicked.emit(d.id);
        });

        node.append('title').text(function(d) {
            return d.label;
        });
    }

    //add zoom capabilities
    var zoom_handler = d3.zoom().on('zoom', zoom_actions);

    zoom_handler(svg);

    //Drag functions
    //d is the node
    function drag_start(d) {
        d.fx = d.x;
        d.fy = d.y;
        simulation.stop();
    }

    //make sure you can't drag the circle outside the box
    function drag_drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        ticked();
    }

    function drag_end(d) {
        // if (!d3.event.active) simulation.alphaTarget(0);
        // d.fx = null;
        // d.fy = null;

        simulation.stop();
    }

    //Zoom functions
    function zoom_actions() {
        g.attr('transform', d3.event.transform);
    }

    function ticked() {
        //update circle positions each tick of the simulation
        node
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            });

        //update link positions
        lines
            .attr('x1', function(d) {
                return d.source.x;
            })
            .attr('y1', function(d) {
                return d.source.y;
            })
            .attr('x2', function(d) {
                return d.target.x;
            })
            .attr('y2', function(d) {
                return d.target.y;
            });

        text.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });


        d3.select('#arrow').attr('refX', 20 + simulationConfig.circleRadius);
    }

    d3.select('#edge-length').on('change', function() {
        const value = d3.select(this).property('value');
        simulationConfig = {
            ...simulationConfig,
            strength: -Number(value)
        };
        updateChart(simulationConfig);
    });
    d3.select('#node-spacing').on('change', function() {
        const value = d3.select(this).property('value');
        simulationConfig = {
            ...simulationConfig,
            circleRadius: Number(value)
        };
        updateChart(simulationConfig);
    });
});
