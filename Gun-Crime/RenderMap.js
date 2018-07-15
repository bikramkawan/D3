class RenderMap {
    constructor(props) {
        this.props = props;
    }

    draw() {}

    render() {
        const totalFieldName = this.props.fields.find(f => f.isTotal).label;
        const that = this;
        const mapWidth = this.props.width - this.props.legendOffset;
        const projection = d3
            .geoAlbersUsa()
            .translate([mapWidth / 2, this.props.height / 2])
            .scale([1000]);

        const path = d3.geoPath().projection(projection);
        this.svg = d3
            .select('.map-wrapper')
            .append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        const dataArray = [];
        for (let d = 0; d < this.props.data.length; d++) {
            dataArray.push(parseFloat(this.props.data[d][totalFieldName]));
        }
        const minVal = d3.min(dataArray);
        const maxVal = d3.max(dataArray);
        const ramp = d3
            .scaleLinear()
            .domain([minVal, maxVal])
            .range([this.props.color.min, this.props.color.max]);

        // Loop through each state data value in the .csv file
        for (let i = 0; i < this.props.data.length; i++) {
            // Grab State Name
            const dataState = this.props.data[i].State;

            // Grab data value
            const dataValue = parseFloat(this.props.data[i][totalFieldName]);
            const putDataToMap = this.props.fields.map(gt => ({
                ...gt,
                value: parseFloat(this.props.data[i][gt.label]),
            }));
            // Find the corresponding state inside the GeoJSON
            for (let j = 0; j < this.props.map.features.length; j++) {
                let jsonState = this.props.map.features[j].properties.name;

                if (dataState == jsonState) {
                    // Copy the data value into the JSON

                    putDataToMap.forEach(item => {
                        this.props.map.features[j].properties[item.label] =
                            item.value;
                    });
                    // Stop looking through the JSON
                    break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature

        const states = this.svg.append('g').classed('states-group', true);

        states
            .selectAll('path')
            .data(this.props.map.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'map-path')
            .attr('stroke', '#fff')
            .attr('stroke-width', '1')
            .attr('fill', function(d) {
                return d.properties[totalFieldName]
                    ? ramp(d.properties[totalFieldName])
                    : 'lightgray';
            })
            .on('mouseover', function(d) {
                that.createToolTip(d);
            })
            .on('mouseout', function(d) {
                d3.select('.tooltip-map').style('display', 'none');
            });

        this.createLegend(minVal, maxVal);
    }

    createLegend(minVal, maxVal) {
        const legendSVG = this.svg
            .append('g')
            .attr('class', 'legend')
            .attr(
                'transform',
                `translate(${this.props.width - this.props.legendOffset},100)`,
            );

        legendSVG
            .append('text')
            .text('Total Murders')
            .attr('transform', `translate(0,-15)`);

        const legend = legendSVG
            .append('defs')
            .append('svg:linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '100%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        legend
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.props.color.max)
            .attr('stop-opacity', 1);

        legend
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', this.props.color.min)
            .attr('stop-opacity', 1);

        legendSVG
            .append('rect')
            .attr('width', this.props.legendWidth - 100)
            .attr('height', this.props.legendHeight)
            .style('fill', 'url(#gradient)');

        const y = d3
            .scaleLinear()
            .range([this.props.legendHeight, 0])
            .domain([minVal, maxVal]);

        const yAxis = d3.axisRight(y);

        legendSVG
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(41,0)')
            .call(yAxis);
    }

    createToolTip(object) {
        d3
            .select('.tooltip-map')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const selector = d3.select('.tooltip-map');
        const totalFieldName = this.props.fields.find(f => f.isTotal).label;
        selector.select('.state-name').text(object.properties.name);
        selector
            .select('.totals')
            .text(`Total : ${object.properties[totalFieldName]}`);

        const types = this.props.fields.filter(f => !f.isTotal);

        const typeRow = selector
            .select('.types')
            .selectAll('div')
            .data(types)
            .enter()
            .append('div')
            .classed('type-col', true);

        typeRow
            .append('div')
            .classed('type-row', true)
            .text(d => d.label);
        typeRow
            .append('div')
            .classed('type-row', true)
            .text(d => {
                return object.properties[d.label];
            });
    }
}
