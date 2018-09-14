class Legends {
    constructor(props) {
        this.props = props;
    }

    draw() {
        this.desktop = this.props.data.filter(d => d.IsMobile !== 'TRUE');
        this.mobile = this.props.data.filter(d => d.IsMobile === 'TRUE');

        this.svg = d3
            .select('#app')
            .append('g')
            .classed('legend-wrapper', true)
            .attr(
                'transform',
                `translate(${this.props.width / 2},${this.props.height / 3.5})`
            );

        const topConfig = {
            fontSizeBig: 40,
            fontSizeSmall: 30,
            marginBottom: 40,
            symbolLeftMargin: 15,
            marginLeft: 150
        };
        this.createTopLabel(topConfig);
        const bottomConfig = {
            fontSize: 30,
            marginBottom: 40,
            marginTop: topConfig.fontSizeBig + topConfig.marginBottom * 2,
            marginLeft: 100
        };
        this.createBrowserLabels(bottomConfig, topConfig);
    }
    createBrowserLabels(bottomConfig, topConfig) {
        const uniqueBrowsers = _.uniqBy(this.props.data, 'Browser');
        const labelData = uniqueBrowsers.map(ub => {
            const percent = this.props.data.filter(
                df => df.Browser === ub.Browser
            ).length;
            return {
                browser: ub.Browser,
                percent:
                    (100 * percent / this.props.data.length).toFixed(1) + '%',
                color:
                    ub.IsMobile === 'TRUE'
                        ? this.props.color.mobile
                        : this.props.color.desktop
            };
        });

        const bottomLabel = this.svg
            .append('g')
            .classed('bottom-label', true)
            .attr('transform', `translate(0,${bottomConfig.marginTop})`);

        const percentElement = bottomLabel
            .append('g')
            .classed('percent-label', true);

        const browserElement = bottomLabel
            .append('g')
            .classed('browsers-label', true)
            .attr('transform', `translate(${bottomConfig.marginLeft},0)`);

        const percentChunks = {
            selector: percentElement,
            data: labelData,
            color: 'grey',
            key: 'percent',
            ...bottomConfig
        };
        this.createBottomLabelChunks(percentChunks);

        this.createBottomLabelChunks({
            selector: browserElement,
            data: labelData,
            key: 'browser',
            ...bottomConfig
        });
    }

    createBottomLabelChunks(params) {
        const { selector, data, key, fontSize, marginBottom, color } = params;
        selector
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .text(d => d[key])
            .style('font-size', fontSize)
            .attr('fill', d => (color ? color : d.color))
            .attr('y', (d, i) => marginBottom * i);
    }

    createTopLabel(params) {
        const topLabelGroup = this.svg
            .append('g')
            .classed('top-label-grp', true);
        const { mobilePerc, desktopPerc } = this.prepareData();
        const mobileGroup = topLabelGroup
            .append('g')
            .classed('mobile-grp', true);

        const desktopGroup = topLabelGroup
            .append('g')
            .classed('desktop-grp', true)
            .attr('transform', `translate(${params.marginLeft},0)`);

        const mobileChunk = {
            selector: mobileGroup,
            percent: mobilePerc,
            label: 'Mobile',
            color: this.props.color.mobile,
            ...params
        };

        this.createTopLabelChunk(mobileChunk);

        const desktopChunk = {
            selector: desktopGroup,
            percent: desktopPerc,
            label: 'Desktop',
            color: this.props.color.desktop,
            ...params
        };
        this.createTopLabelChunk(desktopChunk);
    }

    createTopLabelChunk(params) {
        const {
            selector,
            percent,
            label,
            fontSizeBig,
            fontSizeSmall,
            marginBottom,
            symbolLeftMargin,
            color
        } = params;

        selector
            .append('text')
            .text(label)
            .style('font-size', fontSizeBig)
            .attr('fill', color);
        selector
            .append('text')
            .text(percent + '%')
            .attr('fill', 'black')
            .style('font-size', fontSizeSmall)
            .attr('y', marginBottom);

        const scale = d3.scale
            .linear()
            .domain([1, 6])
            .range([100, 1000]);

        const triangleUp = d3.svg
            .symbol()
            .type('triangle-up')
            .size(d => scale(2.5));

        selector
            .append('path')
            .attr('d', triangleUp)
            .attr('fill', 'green')
            .attr('stroke-width', 1)
            .attr(
                'transform',
                `translate(${symbolLeftMargin},${marginBottom * 1.7})`
            );
    }

    prepareData() {
        const mobilePerc = (
            100 *
            (this.mobile.length / this.props.data.length)
        ).toFixed(1);
        const desktopPerc = (
            100 *
            (this.desktop.length / this.props.data.length)
        ).toFixed(1);

        return { mobilePerc, desktopPerc };
    }
}
