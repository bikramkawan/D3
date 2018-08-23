import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { MockDataService } from '../mock-data.service';
import * as d3 from 'd3';
@Component({
    selector: 'app-d3-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './d3-chart.component.html',
    styleUrls: ['./d3-chart.component.css'],
})
export class D3ChartComponent implements OnInit {
    title = 'Bar Chart';
    @ViewChild('chartWrapper') elem: any;
    @Input() props: any;
    chartEl: any;
    previousProps: any;
    recentProps: any;
    constructor(public mock: MockDataService, private el: ElementRef) {}

    ngAfterViewInit() {
        this.chartEl = d3.select(this.el.nativeElement);
    }

    ngOnInit() {
        const margin = { top: 30, right: 20, bottom: 70, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        this.previousProps = {
            margin,
            data: this.props.data.previous,
            width,
            height,
            color: 'steelblue',
            selector: '.previous',
            barClass: 'previous-bar',
            widthOffSet: 110,
            foreignHeight: 30,
            foreignWidth: 150,
            id: this.props.id,
        };
        this.recentProps = {
            margin,
            data: this.props.data.recent,
            width,
            height,
            color: 'steelblue',
            selector: '.recent',
            barClass: 'recent-bar',
            widthOffSet: 110,
            foreignHeight: 30,
            foreignWidth: 150,
            id: this.props.id,
        };

        const previousToolTip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip previousToolTip')
            .style('opacity', 0);

        const recentToolTip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip recentToolTip')
            .style('opacity', 0);

        this.mock.focusEvent.subscribe((data: any) => {
            if (this.props.id !== data.id) return;
            switch (data.source) {
                case 'previous':
                    if (data.type === 'focus') {
                        return this.recentFocus(data.index);
                    } else {
                        return this.recentBlur(data.index);
                    }

                case 'recent':
                    if (data.type === 'focus') {
                        this.previousFocus(data.index);
                    } else {
                        this.previousBlur(data.index);
                    }
                    break;
                default:
                    return null;
            }
        });
    }
    previousFocus(index) {
        this.chartEl.selectAll(`[data-attr="${index}"]`).classed('focus', true);
        this.chartEl
            .selectAll(`[tool-attr-previous-bar="${index}"]`)
            .classed('visible', true);
    }
    previousBlur(index) {
        this.chartEl
            .selectAll(`[data-attr="${index}"]`)
            .classed('focus', false);
        this.chartEl
            .selectAll(`[tool-attr-previous-bar="${index}"]`)
            .classed('visible', false);
    }

    recentFocus(index) {
        this.chartEl.selectAll(`[data-attr="${index}"]`).classed('focus', true);

        this.chartEl
            .selectAll(`[tool-attr-recent-bar="${index}"]`)
            .classed('visible', true);
    }

    recentBlur(index) {
        this.chartEl
            .selectAll(`[data-attr="${index}"]`)
            .classed('focus', false);

        this.chartEl
            .selectAll(`[tool-attr-recent-bar="${index}"]`)
            .classed('visible', false);
    }
}
