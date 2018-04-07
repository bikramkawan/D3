class PieChart {
    constructor(param) {
        this.data = formatTableData(param.data);
        this.margin = param.margin;
        this.width = param.width;
        this.height = param.height;
    }

    update(filtered) {
        if (filtered.length < 0) return;
        this.data = formatTableData(filtered);
        this.draw();
    }

    updateDimension(height, width) {
        this.height = height;
        this.width = width;

        this.draw();
    }

    draw() {
        d3
            .select('.pie')
            .select('svg')
            .remove();

        const svg = d3
            .select('.pie')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr(
                'transform',
                `translate(${this.width / 2},${this.height / 2})`,
            );

        const radius = Math.min(this.width, this.height) / 2;
        const pie = d3
            .pie()
            .sort(null)
            .value(d => d.count);

        const path = d3
            .arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        const label = d3
            .arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);
        const arc = svg
            .selectAll('.arc')
            .data(pie(this.data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arc
            .append('path')
            .attr('d', path)
            .attr('fill', d => d.data.color);

        // arc
        //     .append('text')
        //     .attr('transform', d=> `translate(${label.centroid(d)})`)
        //     .attr('dy', '0.35em')
        //     .text(d=>d.data.label);
    }
}
