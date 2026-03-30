"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditNotes = void 0;
const StripeResource_js_1 = require("../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.CreditNotes = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v1/credit_notes',
        requestSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                    },
                },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'object',
                    fields: {
                        data: {
                            kind: 'array',
                            element: {
                                kind: 'object',
                                fields: {
                                    unit_amount_decimal: {
                                        kind: 'nullable',
                                        inner: { kind: 'decimal_string' },
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
        fullPath: '/v1/credit_notes/{id}',
        responseSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'object',
                    fields: {
                        data: {
                            kind: 'array',
                            element: {
                                kind: 'object',
                                fields: {
                                    unit_amount_decimal: {
                                        kind: 'nullable',
                                        inner: { kind: 'decimal_string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    update: stripeMethod({
        method: 'POST',
        fullPath: '/v1/credit_notes/{id}',
        responseSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'object',
                    fields: {
                        data: {
                            kind: 'array',
                            element: {
                                kind: 'object',
                                fields: {
                                    unit_amount_decimal: {
                                        kind: 'nullable',
                                        inner: { kind: 'decimal_string' },
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
        fullPath: '/v1/credit_notes',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            lines: {
                                kind: 'object',
                                fields: {
                                    data: {
                                        kind: 'array',
                                        element: {
                                            kind: 'object',
                                            fields: {
                                                unit_amount_decimal: {
                                                    kind: 'nullable',
                                                    inner: { kind: 'decimal_string' },
                                                },
                                            },
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
    listLineItems: stripeMethod({
        method: 'GET',
        fullPath: '/v1/credit_notes/{credit_note}/lines',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            unit_amount_decimal: {
                                kind: 'nullable',
                                inner: { kind: 'decimal_string' },
                            },
                        },
                    },
                },
            },
        },
    }),
    listPreviewLineItems: stripeMethod({
        method: 'GET',
        fullPath: '/v1/credit_notes/preview/lines',
        methodType: 'list',
        requestSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                    },
                },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            unit_amount_decimal: {
                                kind: 'nullable',
                                inner: { kind: 'decimal_string' },
                            },
                        },
                    },
                },
            },
        },
    }),
    preview: stripeMethod({
        method: 'GET',
        fullPath: '/v1/credit_notes/preview',
        requestSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: { unit_amount_decimal: { kind: 'decimal_string' } },
                    },
                },
            },
        },
        responseSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'object',
                    fields: {
                        data: {
                            kind: 'array',
                            element: {
                                kind: 'object',
                                fields: {
                                    unit_amount_decimal: {
                                        kind: 'nullable',
                                        inner: { kind: 'decimal_string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    voidCreditNote: stripeMethod({
        method: 'POST',
        fullPath: '/v1/credit_notes/{id}/void',
        responseSchema: {
            kind: 'object',
            fields: {
                lines: {
                    kind: 'object',
                    fields: {
                        data: {
                            kind: 'array',
                            element: {
                                kind: 'object',
                                fields: {
                                    unit_amount_decimal: {
                                        kind: 'nullable',
                                        inner: { kind: 'decimal_string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
});
