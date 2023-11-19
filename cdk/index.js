#!/usr/bin/env node
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var cdk = require("@aws-cdk/core");
var static_site_1 = require("./static-site");
var MyStaticSiteStack = /** @class */ (function (_super) {
    __extends(MyStaticSiteStack, _super);
    function MyStaticSiteStack(parent, name) {
        var _this = _super.call(this, parent, name) || this;
        new static_site_1.StaticSite(_this, 'JSCCStaticWebsite');
        return _this;
    }
    return MyStaticSiteStack;
}(cdk.Stack));
var app = new cdk.App();
new MyStaticSiteStack(app, 'MyJSCCStaticWebsite');
app.synth();
