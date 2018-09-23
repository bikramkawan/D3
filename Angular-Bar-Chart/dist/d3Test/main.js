(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n.focus{\n  fill:orange;\n}\n\n.foreign-tooltip {\n  display: none;\n}\n\n.foreign-tooltip.visible{\n  display:block\n}\n\ndiv.tooltip {\n  position: absolute;\n  text-align: center;\n  font: 12px sans-serif;\n  pointer-events: none;\n  background: white;\n  color: black;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 30px;\n  width: 120px;\n  margin-left: 3px;\n  border: 1px solid;\n}\n\n.foreignObjectWrapper{\n  background: white;\n  color: black;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  width: 100%;\n  margin-left: 3px;\n  border: 1px solid;\n}\n\n.arrow{\n  height: 10px;\n  width: 10px;\n  background: white;\n  position: absolute;\n  top: -5px;\n  left: 5px;\n  -webkit-transform: rotate(45deg);\n          transform: rotate(45deg);\n  border: 1px solid;\n  z-index: -1;\n}\n\n.chart{\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n\n}\n\n.title{\n  border-bottom: 1px solid;\n}\n"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-d3-chart\n  *ngFor=\"let chart of renderCharts\"\n   [props]=\"chart\">\n</app-d3-chart>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _mock_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mock-data.service */ "./src/app/mock-data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = /** @class */ (function () {
    function AppComponent(mockDataService) {
        this.mockDataService = mockDataService;
        this.title = 'app';
        this.chartData = [];
        this.renderCharts = [];
        this.numberOfChart = 5;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.chartData = this.mockDataService.getbarData();
        var array = Array.from({ length: this.numberOfChart }, function (v, i) { return i; });
        this.renderCharts = array.map(function (a) { return ({
            id: _this.mockDataService.randomID(),
            data: _this.chartData,
        }); });
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")],
        }),
        __metadata("design:paramtypes", [_mock_data_service__WEBPACK_IMPORTED_MODULE_1__["MockDataService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _mock_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mock-data.service */ "./src/app/mock-data.service.ts");
/* harmony import */ var _d3_chart_d3_chart_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./d3-chart/d3-chart.component */ "./src/app/d3-chart/d3-chart.component.ts");
/* harmony import */ var _previous_previous_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./previous/previous.component */ "./src/app/previous/previous.component.ts");
/* harmony import */ var _recent_recent_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./recent/recent.component */ "./src/app/recent/recent.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
                _d3_chart_d3_chart_component__WEBPACK_IMPORTED_MODULE_4__["D3ChartComponent"],
                _previous_previous_component__WEBPACK_IMPORTED_MODULE_5__["PreviousComponent"],
                _recent_recent_component__WEBPACK_IMPORTED_MODULE_6__["RecentComponent"],
            ],
            imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"]],
            providers: [_mock_data_service__WEBPACK_IMPORTED_MODULE_3__["MockDataService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]],
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/d3-chart/d3-chart.component.css":
/*!*************************************************!*\
  !*** ./src/app/d3-chart/d3-chart.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".bar {\r\n  fill: steelblue;\r\n}\r\n\r\n.bar:hover {\r\n  fill: brown;\r\n}\r\n\r\n.axis-title {\r\n  fill: none;\r\n  stroke: black;\r\n  stroke-width: 0.5px;\r\n}\r\n\r\ndiv{\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  flex-direction: column;\r\n}"

/***/ }),

/***/ "./src/app/d3-chart/d3-chart.component.html":
/*!**************************************************!*\
  !*** ./src/app/d3-chart/d3-chart.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #chartWrapper>\n  <app-previous [props]=\"previousProps\"></app-previous>\n  <app-recent [props]=\"recentProps\">  </app-recent>\n</div>\n\n\n\n\n\n\n"

/***/ }),

/***/ "./src/app/d3-chart/d3-chart.component.ts":
/*!************************************************!*\
  !*** ./src/app/d3-chart/d3-chart.component.ts ***!
  \************************************************/
/*! exports provided: D3ChartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D3ChartComponent", function() { return D3ChartComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _mock_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mock-data.service */ "./src/app/mock-data.service.ts");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var D3ChartComponent = /** @class */ (function () {
    function D3ChartComponent(mock, el) {
        this.mock = mock;
        this.el = el;
        this.title = 'Bar Chart';
    }
    D3ChartComponent.prototype.ngAfterViewInit = function () {
        this.chartEl = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this.el.nativeElement);
    };
    D3ChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        var margin = { top: 30, right: 20, bottom: 70, left: 50 };
        var width = 800 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;
        this.previousProps = {
            margin: margin,
            data: this.props.data.previous,
            width: width,
            height: height,
            color: 'steelblue',
            selector: '.previous',
            barClass: 'previous-bar',
            widthOffSet: 110,
            foreignHeight: 30,
            foreignWidth: 150,
            id: this.props.id,
        };
        this.recentProps = {
            margin: margin,
            data: this.props.data.recent,
            width: width,
            height: height,
            color: 'steelblue',
            selector: '.recent',
            barClass: 'recent-bar',
            widthOffSet: 110,
            foreignHeight: 30,
            foreignWidth: 150,
            id: this.props.id,
        };
        var previousToolTip = d3__WEBPACK_IMPORTED_MODULE_2__["select"]('body')
            .append('div')
            .attr('class', 'tooltip previousToolTip')
            .style('opacity', 0);
        var recentToolTip = d3__WEBPACK_IMPORTED_MODULE_2__["select"]('body')
            .append('div')
            .attr('class', 'tooltip recentToolTip')
            .style('opacity', 0);
        this.mock.focusEvent.subscribe(function (data) {
            if (_this.props.id !== data.id)
                return;
            switch (data.source) {
                case 'previous':
                    if (data.type === 'focus') {
                        return _this.recentFocus(data.index);
                    }
                    else {
                        return _this.recentBlur(data.index);
                    }
                case 'recent':
                    if (data.type === 'focus') {
                        _this.previousFocus(data.index);
                    }
                    else {
                        _this.previousBlur(data.index);
                    }
                    break;
                default:
                    return null;
            }
        });
    };
    D3ChartComponent.prototype.previousFocus = function (index) {
        this.chartEl.selectAll("[data-attr=\"" + index + "\"]").classed('focus', true);
        this.chartEl
            .selectAll("[tool-attr-previous-bar=\"" + index + "\"]")
            .classed('visible', true);
    };
    D3ChartComponent.prototype.previousBlur = function (index) {
        this.chartEl
            .selectAll("[data-attr=\"" + index + "\"]")
            .classed('focus', false);
        this.chartEl
            .selectAll("[tool-attr-previous-bar=\"" + index + "\"]")
            .classed('visible', false);
    };
    D3ChartComponent.prototype.recentFocus = function (index) {
        this.chartEl.selectAll("[data-attr=\"" + index + "\"]").classed('focus', true);
        this.chartEl
            .selectAll("[tool-attr-recent-bar=\"" + index + "\"]")
            .classed('visible', true);
    };
    D3ChartComponent.prototype.recentBlur = function (index) {
        this.chartEl
            .selectAll("[data-attr=\"" + index + "\"]")
            .classed('focus', false);
        this.chartEl
            .selectAll("[tool-attr-recent-bar=\"" + index + "\"]")
            .classed('visible', false);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('chartWrapper'),
        __metadata("design:type", Object)
    ], D3ChartComponent.prototype, "elem", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], D3ChartComponent.prototype, "props", void 0);
    D3ChartComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-d3-chart',
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
            template: __webpack_require__(/*! ./d3-chart.component.html */ "./src/app/d3-chart/d3-chart.component.html"),
            styles: [__webpack_require__(/*! ./d3-chart.component.css */ "./src/app/d3-chart/d3-chart.component.css")],
        }),
        __metadata("design:paramtypes", [_mock_data_service__WEBPACK_IMPORTED_MODULE_1__["MockDataService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], D3ChartComponent);
    return D3ChartComponent;
}());



/***/ }),

/***/ "./src/app/mock-data.service.ts":
/*!**************************************!*\
  !*** ./src/app/mock-data.service.ts ***!
  \**************************************/
/*! exports provided: MockDataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MockDataService", function() { return MockDataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var chartData = [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
    { letter: 'D', frequency: 0.04253 },
    { letter: 'E', frequency: 0.12702 },
    { letter: 'F', frequency: 0.02288 },
    { letter: 'G', frequency: 0.02015 },
    { letter: 'H', frequency: 0.06094 },
    { letter: 'I', frequency: 0.06966 },
    { letter: 'J', frequency: 0.00153 },
    { letter: 'K', frequency: 0.00772 },
    { letter: 'L', frequency: 0.04025 },
    { letter: 'M', frequency: 0.02406 },
    { letter: 'N', frequency: 0.06749 },
    { letter: 'O', frequency: 0.07507 },
    { letter: 'P', frequency: 0.01929 },
    { letter: 'Q', frequency: 0.00095 },
    { letter: 'R', frequency: 0.05987 },
    { letter: 'S', frequency: 0.06327 },
    { letter: 'T', frequency: 0.09056 },
    { letter: 'U', frequency: 0.02758 },
    { letter: 'V', frequency: 0.00978 },
    { letter: 'W', frequency: 0.0236 },
    { letter: 'X', frequency: 0.0015 },
    { letter: 'Y', frequency: 0.01974 },
    { letter: 'Z', frequency: 0.00074 },
];
var MockDataService = /** @class */ (function () {
    function MockDataService() {
        this.focusEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    MockDataService.prototype.getData = function () {
        return chartData;
    };
    MockDataService.prototype.randomID = function () {
        return ('_' +
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substr(2, 9) +
            '_');
    };
    MockDataService.prototype.getbarData = function () {
        return {
            recent: [
                ['20180524', 0.7983],
                ['20180525', 0.82823],
                ['20180526', 0.77262],
                ['20180527', 0.83185],
                ['20180528', 0.77423],
                ['20180529', 0.79863],
                ['20180530', 0.82279],
                ['20180531', 0.76892],
                ['20180601', 0.79874],
                ['20180602', 0.80104],
                ['20180603', 0.81819],
                ['20180604', 0.7956],
                ['20180605', 0.80795],
                ['20180606', 0.77628],
                ['20180607', 0.81848],
                ['20180608', 0.79418],
                ['20180609', 0.79872],
                ['20180610', 0.79813],
                ['20180611', 0.75833],
                ['20180612', 0.81017],
                ['20180613', 0.83729],
                ['20180614', 0.84755],
                ['20180615', 0.79397],
                ['20180616', 0.81735],
                ['20180617', 0.7775],
                ['20180618', 0.78959],
                ['20180619', 0.7806],
                ['20180620', 0.7903],
                ['20180621', 0.82657],
                ['20180622', 0.73845],
                ['20180623', 0.79645],
            ],
            previous: [
                ['20180424', 0.78492],
                ['20180425', 0.8152],
                ['20180426', 0.79326],
                ['20180427', 0.77628],
                ['20180428', 0.77859],
                ['20180429', 0.77536],
                ['20180430', 0.78522],
                ['20180501', 0.79195],
                ['20180502', 0.75426],
                ['20180503', 0.77987],
                ['20180504', 0.82088],
                ['20180505', 0.82445],
                ['20180506', 0.75681],
                ['20180507', 0.80448],
                ['20180508', 0.7876],
                ['20180509', 0.79602],
                ['20180510', 0.79175],
                ['20180511', 0.78127],
                ['20180512', 0.81668],
                ['20180513', 0.79814],
                ['20180514', 0.79442],
                ['20180515', 0.77849],
                ['20180516', 0.80022],
                ['20180517', 0.8389],
                ['20180518', 0.85034],
                ['20180519', 0.81438],
                ['20180520', 0.8067],
                ['20180521', 0.78133],
                ['20180522', 0.74752],
                ['20180523', 0.77524],
            ],
        };
    };
    MockDataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [])
    ], MockDataService);
    return MockDataService;
}());



/***/ }),

/***/ "./src/app/previous/previous.component.css":
/*!*************************************************!*\
  !*** ./src/app/previous/previous.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/previous/previous.component.html":
/*!**************************************************!*\
  !*** ./src/app/previous/previous.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #chart class=\"chart\">\n  <div class=\"title\">Previous</div>\n  <div class=\"previous\"></div>\n</div>\n"

/***/ }),

/***/ "./src/app/previous/previous.component.ts":
/*!************************************************!*\
  !*** ./src/app/previous/previous.component.ts ***!
  \************************************************/
/*! exports provided: PreviousComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreviousComponent", function() { return PreviousComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _mock_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mock-data.service */ "./src/app/mock-data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PreviousComponent = /** @class */ (function () {
    function PreviousComponent(mock, element) {
        this.mock = mock;
        this.element = element;
    }
    PreviousComponent.prototype.ngAfterViewInit = function () {
        var select = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.element.nativeElement);
        var that = this;
        this.svg = select
            .append('svg')
            .attr('width', this.props.width +
            this.props.margin.left +
            this.props.margin.right +
            this.props.widthOffSet)
            .attr('height', this.props.height +
            this.props.margin.top +
            this.props.margin.bottom);
        var g = this.svg
            .append('g')
            .attr('transform', 'translate(' +
            this.props.margin.left +
            ',' +
            this.props.margin.top +
            ')');
        this.xScale = d3__WEBPACK_IMPORTED_MODULE_1__["scaleBand"]()
            .rangeRound([0, this.props.width])
            .padding(0.1);
        this.yScale = d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]().rangeRound([this.props.height, 0]);
        this.xScale.domain(this.props.data.map(function (d) { return d[0]; }));
        this.yScale.domain([0, d3__WEBPACK_IMPORTED_MODULE_1__["max"](this.props.data, function (d) { return Number(d[1]); })]);
        this.xAxis = d3__WEBPACK_IMPORTED_MODULE_1__["axisBottom"](this.xScale)
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
            .call(d3__WEBPACK_IMPORTED_MODULE_1__["axisLeft"](this.yScale))
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
            .attr('data-attr', function (d, i) { return i; })
            .attr('class', this.props.barClass)
            .attr('fill', this.props.color)
            .attr('x', function (d) { return that.xScale(d[0]); })
            .attr('y', function (d) { return that.yScale(Number(d[1])); })
            .attr('width', this.xScale.bandwidth())
            .attr('height', function (d) { return that.props.height - that.yScale(Number(d[1])); })
            .on('mouseover', function (data, index) {
            d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).classed('focus', true);
            var previousToolTip = d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.previousToolTip');
            previousToolTip.style('opacity', 1);
            previousToolTip
                .text(data[0] + ", " + data[1])
                .style('left', d3__WEBPACK_IMPORTED_MODULE_1__["event"].pageX + 'px')
                .style('top', d3__WEBPACK_IMPORTED_MODULE_1__["event"].pageY - 28 + 'px');
            that.mock.focusEvent.emit({
                data: data,
                index: index,
                source: 'previous',
                type: 'focus',
                id: that.props.id,
            });
        })
            .on('mouseleave', function (data, index) {
            d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).classed('focus', false);
            var previousToolTip = d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.previousToolTip');
            previousToolTip.style('opacity', 0);
            that.mock.focusEvent.emit({
                data: data,
                index: index,
                source: 'previous',
                type: 'blur',
                id: that.props.id,
            });
        });
        var foreignEnter = g
            .selectAll('.foreignObject')
            .data(this.props.data)
            .enter();
        var foreignSVG = foreignEnter
            .append('foreignObject')
            .classed('foreign-tooltip', true)
            .attr('tool-attr-' + this.props.barClass, function (d, i) { return i; })
            .attr('x', function (d) { return that.xScale(d[0]); })
            .attr('y', function (d) {
            var h = that.props.height - that.yScale(Number(d[1]));
            return h / 2;
        })
            .attr('width', this.props.foreignWidth)
            .attr('height', this.props.foreignHeight);
        var div = foreignSVG
            .append('xhtml:div')
            .attr('class', this.props.barClass + ' foreignObjectWrapper')
            .text(function (d) { return d[0] + ", " + d[1]; });
        div.append('div').classed('arrow', true);
    };
    PreviousComponent.prototype.ngOnInit = function () { };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], PreviousComponent.prototype, "props", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('chart'),
        __metadata("design:type", Object)
    ], PreviousComponent.prototype, "svg", void 0);
    PreviousComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-previous',
            template: __webpack_require__(/*! ./previous.component.html */ "./src/app/previous/previous.component.html"),
            styles: [__webpack_require__(/*! ./previous.component.css */ "./src/app/previous/previous.component.css")],
        }),
        __metadata("design:paramtypes", [_mock_data_service__WEBPACK_IMPORTED_MODULE_2__["MockDataService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], PreviousComponent);
    return PreviousComponent;
}());



/***/ }),

/***/ "./src/app/recent/recent.component.css":
/*!*********************************************!*\
  !*** ./src/app/recent/recent.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/recent/recent.component.html":
/*!**********************************************!*\
  !*** ./src/app/recent/recent.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #chart class=\"chart\">\n  <div class=\"title\">Recent</div>\n  <div class=\"recent\"></div>\n</div>\n"

/***/ }),

/***/ "./src/app/recent/recent.component.ts":
/*!********************************************!*\
  !*** ./src/app/recent/recent.component.ts ***!
  \********************************************/
/*! exports provided: RecentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecentComponent", function() { return RecentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _mock_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mock-data.service */ "./src/app/mock-data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RecentComponent = /** @class */ (function () {
    function RecentComponent(mock, element) {
        this.mock = mock;
        this.element = element;
        this.myServiceEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    RecentComponent.prototype.ngOnInit = function () { };
    RecentComponent.prototype.ngAfterViewInit = function () {
        var that = this;
        var select = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.element.nativeElement);
        this.svg = select
            .append('svg')
            .attr('width', this.props.width +
            this.props.margin.left +
            this.props.margin.right +
            this.props.widthOffSet)
            .attr('height', this.props.height +
            this.props.margin.top +
            this.props.margin.bottom);
        var g = this.svg
            .append('g')
            .attr('transform', 'translate(' +
            this.props.margin.left +
            ',' +
            this.props.margin.top +
            ')');
        this.xScale = d3__WEBPACK_IMPORTED_MODULE_1__["scaleBand"]()
            .rangeRound([0, this.props.width])
            .padding(0.1);
        this.yScale = d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]().rangeRound([this.props.height, 0]);
        this.xScale.domain(this.props.data.map(function (d) { return d[0]; }));
        this.yScale.domain([0, d3__WEBPACK_IMPORTED_MODULE_1__["max"](this.props.data, function (d) { return Number(d[1]); })]);
        this.xAxis = d3__WEBPACK_IMPORTED_MODULE_1__["axisBottom"](this.xScale)
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
            .call(d3__WEBPACK_IMPORTED_MODULE_1__["axisLeft"](this.yScale))
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
            .attr('data-attr', function (d, i) { return i; })
            .attr('class', this.props.barClass)
            .attr('fill', this.props.color)
            .attr('x', function (d) { return that.xScale(d[0]); })
            .attr('y', function (d) { return that.yScale(Number(d[1])); })
            .attr('width', this.xScale.bandwidth())
            .attr('height', function (d) { return that.props.height - that.yScale(Number(d[1])); })
            .on('mouseover', function (data, index) {
            d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).classed('focus', true);
            var recentToolTip = d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.recentToolTip');
            recentToolTip.style('opacity', 1);
            recentToolTip
                .text(data[0] + ", " + data[1])
                .style('left', d3__WEBPACK_IMPORTED_MODULE_1__["event"].pageX + 'px')
                .style('top', d3__WEBPACK_IMPORTED_MODULE_1__["event"].pageY - 28 + 'px');
            that.mock.focusEvent.emit({
                data: data,
                index: index,
                source: 'recent',
                type: 'focus',
                id: that.props.id,
            });
        })
            .on('mouseleave', function (d, index) {
            d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).classed('focus', false);
            var recentToolTip = d3__WEBPACK_IMPORTED_MODULE_1__["select"]('.recentToolTip');
            recentToolTip.style('opacity', 0);
            that.mock.focusEvent.emit({
                d: d,
                index: index,
                source: 'recent',
                type: 'blur',
                id: that.props.id,
            });
        });
        var foreignEnter = g
            .selectAll('.foreignObject')
            .data(this.props.data)
            .enter();
        var foreignSVG = foreignEnter
            .append('foreignObject')
            .classed('foreign-tooltip', true)
            .attr('tool-attr-' + this.props.barClass, function (d, i) { return i; })
            .attr('x', function (d) { return that.xScale(d[0]); })
            .attr('y', function (d) {
            var h = that.props.height - that.yScale(Number(d[1]));
            return h / 2;
        })
            .attr('width', this.props.foreignWidth)
            .attr('height', this.props.foreignHeight);
        var div = foreignSVG
            .append('xhtml:div')
            .attr('class', this.props.barClass + ' foreignObjectWrapper')
            .text(function (d) { return d[0] + ", " + d[1]; });
        div.append('div').classed('arrow', true);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], RecentComponent.prototype, "props", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('chart'),
        __metadata("design:type", Object)
    ], RecentComponent.prototype, "svg", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"])
    ], RecentComponent.prototype, "myServiceEvent", void 0);
    RecentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-recent',
            template: __webpack_require__(/*! ./recent.component.html */ "./src/app/recent/recent.component.html"),
            styles: [__webpack_require__(/*! ./recent.component.css */ "./src/app/recent/recent.component.css")],
        }),
        __metadata("design:paramtypes", [_mock_data_service__WEBPACK_IMPORTED_MODULE_2__["MockDataService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], RecentComponent);
    return RecentComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/bikramkawan/Github/D3/Angular-Bar-Chart/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map