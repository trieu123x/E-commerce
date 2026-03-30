"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const StripeResource_js_1 = require("../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Orders = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v1/climate/orders',
        requestSchema: {
            kind: 'object',
            fields: { metric_tons: { kind: 'decimal_string' } },
        },
        responseSchema: {
            kind: 'object',
            fields: { metric_tons: { kind: 'decimal_string' } },
        },
    }),
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/climate/orders/{order}',
        responseSchema: {
            kind: 'object',
            fields: { metric_tons: { kind: 'decimal_string' } },
        },
    }),
    update: stripeMethod({
        method: 'POST',
        fullPath: '/v1/climate/orders/{order}',
        responseSchema: {
            kind: 'object',
            fields: { metric_tons: { kind: 'decimal_string' } },
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/climate/orders',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: { metric_tons: { kind: 'decimal_string' } },
                    },
                },
            },
        },
    }),
    cancel: stripeMethod({
        method: 'POST',
        fullPath: '/v1/climate/orders/{order}/cancel',
        responseSchema: {
            kind: 'object',
            fields: { metric_tons: { kind: 'decimal_string' } },
        },
    }),
});
