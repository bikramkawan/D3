import { Component, OnInit } from '@angular/core';
import { MockDataService } from './mock-data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'app';
    chartData: any = [];
    renderCharts: any = [];
    numberOfChart: number = 5;

    constructor(private mockDataService: MockDataService) {}

    ngOnInit() {
        this.chartData = this.mockDataService.getbarData();

        const array = Array.from({ length: this.numberOfChart }, (v, i) => i);
        this.renderCharts = array.map(a => ({
            id: this.mockDataService.randomID(),
            data: this.chartData,
        }));
    }
}
