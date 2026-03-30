"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const StripeResource_js_1 = require("../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Products = StripeResource_js_1.StripeResource.extend({
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/climate/products/{product}',
        responseSchema: {
            kind: 'object',
            fields: { metric_tons_available: { kind: 'decimal_string' } },
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/climate/products',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: { metric_tons_available: { kind: 'decimal_string' } },
                    },
                },
            },
        },
    }),
});
