"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persons = void 0;
const StripeResource_js_1 = require("../../../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Persons = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v2/core/accounts/{account_id}/persons',
        requestSchema: {
            kind: 'object',
            fields: {
                relationship: {
                    kind: 'object',
                    fields: { percent_ownership: { kind: 'decimal_string' } },
                },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                relationship: {
                    kind: 'object',
                    fields: { percent_ownership: { kind: 'decimal_string' } },
                },
            },
        },
    }),
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v2/core/accounts/{account_id}/persons/{id}',
        responseSchema: {
            kind: 'object',
            fields: {
                relationship: {
                    kind: 'object',
                    fields: { percent_ownership: { kind: 'decimal_string' } },
                },
            },
        },
    }),
    update: stripeMethod({
        method: 'POST',
        fullPath: '/v2/core/accounts/{account_id}/persons/{id}',
        requestSchema: {
            kind: 'object',
            fields: {
                relationship: {
                    kind: 'object',
                    fields: { percent_ownership: { kind: 'decimal_string' } },
                },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                relationship: {
                    kind: 'object',
                    fields: { percent_ownership: { kind: 'decimal_string' } },
                },
            },
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v2/core/accounts/{account_id}/persons',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            relationship: {
                                kind: 'object',
                                fields: { percent_ownership: { kind: 'decimal_string' } },
                            },
                        },
                    },
                },
            },
        },
    }),
    del: stripeMethod({
        method: 'DELETE',
        fullPath: '/v2/core/accounts/{account_id}/persons/{id}',
    }),
});
