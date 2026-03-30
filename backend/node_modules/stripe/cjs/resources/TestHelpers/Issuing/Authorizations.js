"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorizations = void 0;
const StripeResource_js_1 = require("../../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Authorizations = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations',
        requestSchema: {
            kind: 'object',
            fields: {
                fleet: {
                    kind: 'object',
                    fields: {
                        reported_breakdown: {
                            kind: 'object',
                            fields: {
                                fuel: {
                                    kind: 'object',
                                    fields: { gross_amount_decimal: { kind: 'decimal_string' } },
                                },
                                non_fuel: {
                                    kind: 'object',
                                    fields: { gross_amount_decimal: { kind: 'decimal_string' } },
                                },
                                tax: {
                                    kind: 'object',
                                    fields: {
                                        local_amount_decimal: { kind: 'decimal_string' },
                                        national_amount_decimal: { kind: 'decimal_string' },
                                    },
                                },
                            },
                        },
                    },
                },
                fuel: {
                    kind: 'object',
                    fields: {
                        quantity_decimal: { kind: 'decimal_string' },
                        unit_cost_decimal: { kind: 'decimal_string' },
                    },
                },
            },
        },
        responseSchema: {
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
    }),
    capture: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations/{authorization}/capture',
        requestSchema: {
            kind: 'object',
            fields: {
                purchase_details: {
                    kind: 'object',
                    fields: {
                        fleet: {
                            kind: 'object',
                            fields: {
                                reported_breakdown: {
                                    kind: 'object',
                                    fields: {
                                        fuel: {
                                            kind: 'object',
                                            fields: { gross_amount_decimal: { kind: 'decimal_string' } },
                                        },
                                        non_fuel: {
                                            kind: 'object',
                                            fields: { gross_amount_decimal: { kind: 'decimal_string' } },
                                        },
                                        tax: {
                                            kind: 'object',
                                            fields: {
                                                local_amount_decimal: { kind: 'decimal_string' },
                                                national_amount_decimal: { kind: 'decimal_string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        fuel: {
                            kind: 'object',
                            fields: {
                                quantity_decimal: { kind: 'decimal_string' },
                                unit_cost_decimal: { kind: 'decimal_string' },
                            },
                        },
                        receipt: {
                            kind: 'array',
                            element: {
                                kind: 'object',
                                fields: { quantity: { kind: 'decimal_string' } },
                            },
                        },
                    },
                },
            },
        },
        responseSchema: {
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
    }),
    expire: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations/{authorization}/expire',
        responseSchema: {
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
    }),
    finalizeAmount: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations/{authorization}/finalize_amount',
        requestSchema: {
            kind: 'object',
            fields: {
                fleet: {
                    kind: 'object',
                    fields: {
                        reported_breakdown: {
                            kind: 'object',
                            fields: {
                                fuel: {
                                    kind: 'object',
                                    fields: { gross_amount_decimal: { kind: 'decimal_string' } },
                                },
                                non_fuel: {
                                    kind: 'object',
                                    fields: { gross_amount_decimal: { kind: 'decimal_string' } },
                                },
                                tax: {
                                    kind: 'object',
                                    fields: {
                                        local_amount_decimal: { kind: 'decimal_string' },
                                        national_amount_decimal: { kind: 'decimal_string' },
                                    },
                                },
                            },
                        },
                    },
                },
                fuel: {
                    kind: 'object',
                    fields: {
                        quantity_decimal: { kind: 'decimal_string' },
                        unit_cost_decimal: { kind: 'decimal_string' },
                    },
                },
            },
        },
        responseSchema: {
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
    }),
    increment: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations/{authorization}/increment',
        responseSchema: {
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
    }),
    respond: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations/{authorization}/fraud_challenges/respond',
        responseSchema: {
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
    }),
    reverse: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/issuing/authorizations/{authorization}/reverse',
        responseSchema: {
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
    }),
});
