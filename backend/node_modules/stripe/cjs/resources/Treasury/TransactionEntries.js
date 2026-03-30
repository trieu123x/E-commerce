"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEntries = void 0;
const StripeResource_js_1 = require("../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.TransactionEntries = StripeResource_js_1.StripeResource.extend({
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/treasury/transaction_entries/{id}',
        responseSchema: {
            kind: 'object',
            fields: {
                flow_details: {
                    kind: 'nullable',
                    inner: {
                        kind: 'object',
                        fields: {
                            issuing_authorization: {
                                kind: 'object',
                                fields: {
                                    fleet: {
                                        kind: 'nullable',
                                        inner: {
                                            kind: 'object',
                                            fields: {
                                                reported_breakdown: {
                                                    kind: 'nullable',
                                                    inner: {
                                                        kind: 'object',
                                                        fields: {
                                                            fuel: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        gross_amount_decimal: {
                                                                            kind: 'nullable',
                                                                            inner: { kind: 'decimal_string' },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                            non_fuel: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        gross_amount_decimal: {
                                                                            kind: 'nullable',
                                                                            inner: { kind: 'decimal_string' },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                            tax: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        local_amount_decimal: {
                                                                            kind: 'nullable',
                                                                            inner: { kind: 'decimal_string' },
                                                                        },
                                                                        national_amount_decimal: {
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
                                    fuel: {
                                        kind: 'nullable',
                                        inner: {
                                            kind: 'object',
                                            fields: {
                                                quantity_decimal: {
                                                    kind: 'nullable',
                                                    inner: { kind: 'decimal_string' },
                                                },
                                                unit_cost_decimal: {
                                                    kind: 'nullable',
                                                    inner: { kind: 'decimal_string' },
                                                },
                                            },
                                        },
                                    },
                                    transactions: {
                                        kind: 'array',
                                        element: {
                                            kind: 'object',
                                            fields: {
                                                purchase_details: {
                                                    kind: 'nullable',
                                                    inner: {
                                                        kind: 'object',
                                                        fields: {
                                                            fleet: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        reported_breakdown: {
                                                                            kind: 'nullable',
                                                                            inner: {
                                                                                kind: 'object',
                                                                                fields: {
                                                                                    fuel: {
                                                                                        kind: 'nullable',
                                                                                        inner: {
                                                                                            kind: 'object',
                                                                                            fields: {
                                                                                                gross_amount_decimal: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'decimal_string',
                                                                                                    },
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                    non_fuel: {
                                                                                        kind: 'nullable',
                                                                                        inner: {
                                                                                            kind: 'object',
                                                                                            fields: {
                                                                                                gross_amount_decimal: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'decimal_string',
                                                                                                    },
                                                                                                },
                                                                                            },
                                                                                        },
                                                                                    },
                                                                                    tax: {
                                                                                        kind: 'nullable',
                                                                                        inner: {
                                                                                            kind: 'object',
                                                                                            fields: {
                                                                                                local_amount_decimal: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'decimal_string',
                                                                                                    },
                                                                                                },
                                                                                                national_amount_decimal: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'decimal_string',
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
                                                            fuel: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        quantity_decimal: {
                                                                            kind: 'nullable',
                                                                            inner: { kind: 'decimal_string' },
                                                                        },
                                                                        unit_cost_decimal: { kind: 'decimal_string' },
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
                        },
                    },
                },
            },
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/treasury/transaction_entries',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            flow_details: {
                                kind: 'nullable',
                                inner: {
                                    kind: 'object',
                                    fields: {
                                        issuing_authorization: {
                                            kind: 'object',
                                            fields: {
                                                fleet: {
                                                    kind: 'nullable',
                                                    inner: {
                                                        kind: 'object',
                                                        fields: {
                                                            reported_breakdown: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        fuel: {
                                                                            kind: 'nullable',
                                                                            inner: {
                                                                                kind: 'object',
                                                                                fields: {
                                                                                    gross_amount_decimal: {
                                                                                        kind: 'nullable',
                                                                                        inner: { kind: 'decimal_string' },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        non_fuel: {
                                                                            kind: 'nullable',
                                                                            inner: {
                                                                                kind: 'object',
                                                                                fields: {
                                                                                    gross_amount_decimal: {
                                                                                        kind: 'nullable',
                                                                                        inner: { kind: 'decimal_string' },
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                        tax: {
                                                                            kind: 'nullable',
                                                                            inner: {
                                                                                kind: 'object',
                                                                                fields: {
                                                                                    local_amount_decimal: {
                                                                                        kind: 'nullable',
                                                                                        inner: { kind: 'decimal_string' },
                                                                                    },
                                                                                    national_amount_decimal: {
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
                                                fuel: {
                                                    kind: 'nullable',
                                                    inner: {
                                                        kind: 'object',
                                                        fields: {
                                                            quantity_decimal: {
                                                                kind: 'nullable',
                                                                inner: { kind: 'decimal_string' },
                                                            },
                                                            unit_cost_decimal: {
                                                                kind: 'nullable',
                                                                inner: { kind: 'decimal_string' },
                                                            },
                                                        },
                                                    },
                                                },
                                                transactions: {
                                                    kind: 'array',
                                                    element: {
                                                        kind: 'object',
                                                        fields: {
                                                            purchase_details: {
                                                                kind: 'nullable',
                                                                inner: {
                                                                    kind: 'object',
                                                                    fields: {
                                                                        fleet: {
                                                                            kind: 'nullable',
                                                                            inner: {
                                                                                kind: 'object',
                                                                                fields: {
                                                                                    reported_breakdown: {
                                                                                        kind: 'nullable',
                                                                                        inner: {
                                                                                            kind: 'object',
                                                                                            fields: {
                                                                                                fuel: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'object',
                                                                                                        fields: {
                                                                                                            gross_amount_decimal: {
                                                                                                                kind: 'nullable',
                                                                                                                inner: {
                                                                                                                    kind: 'decimal_string',
                                                                                                                },
                                                                                                            },
                                                                                                        },
                                                                                                    },
                                                                                                },
                                                                                                non_fuel: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'object',
                                                                                                        fields: {
                                                                                                            gross_amount_decimal: {
                                                                                                                kind: 'nullable',
                                                                                                                inner: {
                                                                                                                    kind: 'decimal_string',
                                                                                                                },
                                                                                                            },
                                                                                                        },
                                                                                                    },
                                                                                                },
                                                                                                tax: {
                                                                                                    kind: 'nullable',
                                                                                                    inner: {
                                                                                                        kind: 'object',
                                                                                                        fields: {
                                                                                                            local_amount_decimal: {
                                                                                                                kind: 'nullable',
                                                                                                                inner: {
                                                                                                                    kind: 'decimal_string',
                                                                                                                },
                                                                                                            },
                                                                                                            national_amount_decimal: {
                                                                                                                kind: 'nullable',
                                                                                                                inner: {
                                                                                                                    kind: 'decimal_string',
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
                                                                        fuel: {
                                                                            kind: 'nullable',
                                                                            inner: {
                                                                                kind: 'object',
                                                                                fields: {
                                                                                    quantity_decimal: {
                                                                                        kind: 'nullable',
                                                                                        inner: { kind: 'decimal_string' },
                                                                                    },
                                                                                    unit_cost_decimal: {
                                                                                        kind: 'decimal_string',
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
});
