"use strict";
exports.__esModule = true;
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
require("@testing-library/jest-dom");
var server_1 = require("~/mocks/server");
beforeAll(function () { return server_1.server.listen({ onUnhandledRequest: "error" }); });
afterAll(function () { return server_1.server.close(); });
afterEach(function () { return server_1.server.resetHandlers(); });
