"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSchedules = void 0;
const StripeResource_js_1 = require("../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.SubscriptionSchedules = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v1/subscription_schedules',
        requestSchema: {
            kind: 'object',
            fields: {
                phases: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            add_invoice_items: {
                                kind: 'array',
                                element: {
                                    kind: 'object',
                                    fields: {
                                        price_data: {
                                            kind: 'object',
                                            fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                                        },
                                    },
                                },
                            },
                            items: {
                                kind: 'array',
                                element: {
                                    kind: 'object',
                                    fields: {
                                        price_data: {
                                            kind: 'object',
                                            fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/subscription_schedules/{schedule}',
    }),
    update: stripeMethod({
        method: 'POST',
        fullPath: '/v1/subscription_schedules/{schedule}',
        requestSchema: {
            kind: 'object',
            fields: {
                phases: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            add_invoice_items: {
                                kind: 'array',
                                element: {
                                    kind: 'object',
                                    fields: {
                                        price_data: {
                                            kind: 'object',
                                            fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                                        },
                                    },
                                },
                            },
                            items: {
                                kind: 'array',
                                element: {
                                    kind: 'object',
                                    fields: {
                                        price_data: {
                                            kind: 'object',
                                            fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/subscription_schedules',
        methodType: 'list',
    }),
    cancel: stripeMethod({
        method: 'POST',
        fullPath: '/v1/subscription_schedules/{schedule}/cancel',
    }),
    release: stripeMethod({
        method: 'POST',
        fullPath: '/v1/subscription_schedules/{schedule}/release',
    }),
});
