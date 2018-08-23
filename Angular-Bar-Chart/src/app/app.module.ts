import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MockDataService } from './mock-data.service';
import { D3ChartComponent } from './d3-chart/d3-chart.component';
import { PreviousComponent } from './previous/previous.component';
import { RecentComponent } from './recent/recent.component';

@NgModule({
    declarations: [
        AppComponent,
        D3ChartComponent,
        PreviousComponent,
        RecentComponent,
    ],
    imports: [BrowserModule],
    providers: [MockDataService],
    bootstrap: [AppComponent],
})
export class AppModule {}
