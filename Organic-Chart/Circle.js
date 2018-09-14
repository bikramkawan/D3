class Circle {
    constructor(props) {
        this.props = props;
    }

    draw() {
        const desktop = this.props.data.filter(d => d.IsMobile !== 'TRUE');
        const mobile = this.props.data.filter(d => d.IsMobile === 'TRUE');

        const offset = 50;
        this.scale = d3.scale
            .linear()
            .domain([0, this.props.data.length])
            .range([0, this.props.height - offset]);

        this.svg = d3
            .select('#app')
            .append('g')
            .classed('circle-chart-wrapper', true)
            .attr('transform', `translate(-${this.props.width / 4 - 30},0)`);
        this.createCircle();
        const desktopConfig = {
            radius: this.scale(desktop.length) / 2,
            cx: this.props.width / 2,
            position: 'left',
            data: desktop,
            color: this.props.color.desktop,
            domain: [5, 13],
            offset: 0,
            className: 'desktop'
        };
        const mobileConfig = {
            radius: this.scale(mobile.length) / 2,
            cx: this.props.width / 2,
            position: 'right',
            data: mobile,
            color: this.props.color.mobile,
            domain: [10, 25],
            offset: 100,
            className: 'mobile'
        };

        this.createSpawn(mobileConfig);
        this.createSpawn(desktopConfig);
    }

    createCircle() {
        this.svg
            .append('circle')
            .attr('class', 'main-circle')
            .attr('r', this.props.height / 2)
            .attr('cx', this.props.width / 2)
            .attr('cy', this.props.height / 2)
            .attr('fill', '#F3F4F6');
    }

    createSpawn(params) {
        const diffR = this.props.height / 2 - params.radius;
        const originX =
            params.position === 'left' ? params.cx - diffR : params.cx + diffR;
        const originY = this.props.height / 2;
        const offset = Math.max(...params.domain);
        const innerCircleRadius = params.radius - offset;
        const outerCircleRadius = params.radius;
        const circleOriginX = originX + outerCircleRadius * Math.sin(0);
        const circleOriginY = originY - outerCircleRadius * Math.cos(0);
        const svg = this.svg.append('g').classed(params.className, true);
        const extents = d3.extent(params.data, d => d.Count);
        const radiusScale = d3.scale
            .linear()
            .domain(extents)
            .range(params.domain);

        const innerAndOuterCircleGroup = svg
            .append('g')
            .classed('innerAndOuterCircleGroup', true);

        // innerAndOuterCircleGroup.append('circle').attr({
        //     class: 'outercircle',
        //     cx: originX,
        //     cy: originY,
        //     r: outerCircleRadius,
        //     fill: 'none',
        // });

        innerAndOuterCircleGroup.append('circle').attr({
            class: 'innerCircle',
            cx: originX,
            cy: originY,
            r: innerCircleRadius,
            fill: params.color
        });

        const spawnCircles = svg.append('g').classed('spawn-circles', true);

        spawnCircles
            .selectAll('circle')
            .data(params.data)
            .enter()
            .append('circle')
            .attr('cx', circleOriginX)
            .attr('cy', circleOriginY)
            .attr('r', (d, i) => radiusScale(d.Count))
            .attr('data-index', (d, i) => i)
            .style('fill', params.color)
            .attr('transform', (d, i) => {
                return (
                    'rotate(' +
                    360 / params.data.length * i +
                    ', ' +
                    originX +
                    ',' +
                    originY +
                    ')'
                );
            });
    }
}
