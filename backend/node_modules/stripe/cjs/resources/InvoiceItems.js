"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItems = void 0;
const StripeResource_js_1 = require("../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.InvoiceItems = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v1/invoiceitems',
        requestSchema: {
            kind: 'object',
            fields: {
                price_data: {
                    kind: 'object',
                    fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                },
                quantity_decimal: { kind: 'decimal_string' },
                unit_amount_decimal: { kind: 'decimal_string' },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                pricing: {
                    kind: 'nullable',
                    inner: {
                        kind: 'object',
                        fields: {
                            unit_amount_decimal: {
                                kind: 'nullable',
                                inner: { kind: 'decimal_string' },
                            },
                        },
                    },
                },
                quantity_decimal: { kind: 'decimal_string' },
            },
        },
    }),
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/invoiceitems/{invoiceitem}',
        responseSchema: {
            kind: 'object',
            fields: {
                pricing: {
                    kind: 'nullable',
                    inner: {
                        kind: 'object',
                        fields: {
                            unit_amount_decimal: {
                                kind: 'nullable',
                                inner: { kind: 'decimal_string' },
                            },
                        },
                    },
                },
                quantity_decimal: { kind: 'decimal_string' },
            },
        },
    }),
    update: stripeMethod({
        method: 'POST',
        fullPath: '/v1/invoiceitems/{invoiceitem}',
        requestSchema: {
            kind: 'object',
            fields: {
                price_data: {
                    kind: 'object',
                    fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                },
                quantity_decimal: { kind: 'decimal_string' },
                unit_amount_decimal: { kind: 'decimal_string' },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                pricing: {
                    kind: 'nullable',
                    inner: {
                        kind: 'object',
                        fields: {
                            unit_amount_decimal: {
                                kind: 'nullable',
                                inner: { kind: 'decimal_string' },
                            },
                        },
                    },
                },
                quantity_decimal: { kind: 'decimal_string' },
            },
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/invoiceitems',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            pricing: {
                                kind: 'nullable',
                                inner: {
                                    kind: 'object',
                                    fields: {
                                        unit_amount_decimal: {
                                            kind: 'nullable',
                                            inner: { kind: 'decimal_string' },
                                        },
                                    },
                                },
                            },
                            quantity_decimal: { kind: 'decimal_string' },
                        },
                    },
                },
            },
        },
    }),
    del: stripeMethod({
        method: 'DELETE',
        fullPath: '/v1/invoiceitems/{invoiceitem}',
    }),
});
