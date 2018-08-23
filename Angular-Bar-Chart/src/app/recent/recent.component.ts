import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef,
} from '@angular/core';
import * as d3 from 'd3';
import { MockDataService } from '../mock-data.service';

@Component({
    selector: 'app-recent',
    templateUrl: './recent.component.html',
    styleUrls: ['./recent.component.css'],
})
export class RecentComponent implements OnInit {
    @Input() props: any;
    @ViewChild('chart') svg: any;
    @Output() myServiceEvent: EventEmitter<any> = new EventEmitter();
    xScale: any;
    yScale: any;

    xAxis: any;
    constructor(public mock: MockDataService, private element: ElementRef) {}
    ngOnInit() {}
    ngAfterViewInit() {
        const that = this;
        const select = d3.select(this.element.nativeElement);
        this.svg = select
            .append('svg')
            .attr(
                'width',
                this.props.width +
                    this.props.margin.left +
                    this.props.margin.right +
                    this.props.widthOffSet,
            )
            .attr(
                'height',
                this.props.height +
                    this.props.margin.top +
                    this.props.margin.bottom,
            );

        const g = this.svg
            .append('g')
            .attr(
                'transform',
                'translate(' +
                    this.props.margin.left +
                    ',' +
                    this.props.margin.top +
                    ')',
            );

        this.xScale = d3
            .scaleBand()
            .rangeRound([0, this.props.width])
            .padding(0.1);

        this.yScale = d3.scaleLinear().rangeRound([this.props.height, 0]);

        this.xScale.domain(this.props.data.map(d => d[0]));
        this.yScale.domain([0, d3.max(this.props.data, d => Number(d[1]))]);

        this.xAxis = d3
            .axisBottom(this.xScale)
            .ticks(5)
            .tickSize(0);
        g
            .append('g')
            .attr('transform', 'translate(0,' + this.props.height + ')')
            .call(this.xAxis)
            .selectAll('text')
            .attr('dx', '-2.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)');

        g
            .append('g')
            .call(d3.axisLeft(this.yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 16)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text('value');

        g
            .selectAll('.bar')
            .data(this.props.data)
            .enter()
            .append('rect')
            .attr('data-attr', (d, i) => i)
            .attr('class', this.props.barClass)
            .attr('fill', this.props.color)
            .attr('x', d => that.xScale(d[0]))
            .attr('y', d => that.yScale(Number(d[1])))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => that.props.height - that.yScale(Number(d[1])))
            .on('mouseover', function(data, index) {
                d3.select(this).classed('focus', true);
                const recentToolTip = d3.select('.recentToolTip');
                recentToolTip.style('opacity', 1);
                recentToolTip
                    .text(`${data[0]}, ${data[1]}`)
                    .style('left', d3.event.pageX + 'px')
                    .style('top', d3.event.pageY - 28 + 'px');
                that.mock.focusEvent.emit({
                    data,
                    index,
                    source: 'recent',
                    type: 'focus',
                    id: that.props.id,
                });
            })
            .on('mouseleave', function(d, index) {
                d3.select(this).classed('focus', false);
                const recentToolTip = d3.select('.recentToolTip');
                recentToolTip.style('opacity', 0);
                that.mock.focusEvent.emit({
                    d,
                    index,
                    source: 'recent',
                    type: 'blur',
                    id: that.props.id,
                });
            });

        const foreignEnter = g
            .selectAll('.foreignObject')
            .data(this.props.data)
            .enter();

        const foreignSVG = foreignEnter
            .append('foreignObject')
            .classed('foreign-tooltip', true)
            .attr('tool-attr-' + this.props.barClass, (d, i) => i)
            .attr('x', d => that.xScale(d[0]))
            .attr('y', d => {
                const h = that.props.height - that.yScale(Number(d[1]));
                return h / 2;
            })
            .attr('width', this.props.foreignWidth)
            .attr('height', this.props.foreignHeight);
        const div = foreignSVG
            .append('xhtml:div')
            .attr('class', this.props.barClass + ' foreignObjectWrapper')
            .text(d => `${d[0]}, ${d[1]}`);

        div.append('div').classed('arrow', true);
    }
}
