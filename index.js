#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const static_site_1 = require("./static-site");
class MyStaticSiteStack extends cdk.Stack {
    constructor(parent, name) {
        super(parent, name);
        new static_site_1.StaticSite(this, 'JSCCStaticWebsite');
    }
}
const app = new cdk.App();
new MyStaticSiteStack(app, 'MyJSCCStaticWebsite');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBcUM7QUFDckMsK0NBQTJDO0FBRTNDLE1BQU0saUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdkMsWUFBWSxNQUFlLEVBQUUsSUFBWTtRQUN2QyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBCLElBQUksd0JBQVUsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBRWxELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFN0YXRpY1NpdGUgfSBmcm9tICcuL3N0YXRpYy1zaXRlJztcblxuY2xhc3MgTXlTdGF0aWNTaXRlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSk7XG5cbiAgICBuZXcgU3RhdGljU2l0ZSh0aGlzLCAnSlNDQ1N0YXRpY1dlYnNpdGUnKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgTXlTdGF0aWNTaXRlU3RhY2soYXBwLCAnTXlKU0NDU3RhdGljV2Vic2l0ZScpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==