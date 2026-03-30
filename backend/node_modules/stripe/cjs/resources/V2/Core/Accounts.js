"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accounts = void 0;
const StripeResource_js_1 = require("../../../StripeResource.js");
const Persons_js_1 = require("./Accounts/Persons.js");
const PersonTokens_js_1 = require("./Accounts/PersonTokens.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Accounts = StripeResource_js_1.StripeResource.extend({
    constructor: function (...args) {
        StripeResource_js_1.StripeResource.apply(this, args);
        this.persons = new Persons_js_1.Persons(...args);
        this.personTokens = new PersonTokens_js_1.PersonTokens(...args);
    },
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v2/core/accounts',
        requestSchema: {
            kind: 'object',
            fields: {
                identity: {
                    kind: 'object',
                    fields: {
                        individual: {
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
        },
        responseSchema: {
            kind: 'object',
            fields: {
                identity: {
                    kind: 'object',
                    fields: {
                        individual: {
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
        },
    }),
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v2/core/accounts/{id}',
        responseSchema: {
            kind: 'object',
            fields: {
                identity: {
                    kind: 'object',
                    fields: {
                        individual: {
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
        },
    }),
    update: stripeMethod({
        method: 'POST',
        fullPath: '/v2/core/accounts/{id}',
        requestSchema: {
            kind: 'object',
            fields: {
                identity: {
                    kind: 'object',
                    fields: {
                        individual: {
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
        },
        responseSchema: {
            kind: 'object',
            fields: {
                identity: {
                    kind: 'object',
                    fields: {
                        individual: {
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
        },
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v2/core/accounts',
        methodType: 'list',
        responseSchema: {
            kind: 'object',
            fields: {
                data: {
                    kind: 'array',
                    element: {
                        kind: 'object',
                        fields: {
                            identity: {
                                kind: 'object',
                                fields: {
                                    individual: {
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
                    },
                },
            },
        },
    }),
    close: stripeMethod({
        method: 'POST',
        fullPath: '/v2/core/accounts/{id}/close',
        responseSchema: {
            kind: 'object',
            fields: {
                identity: {
                    kind: 'object',
                    fields: {
                        individual: {
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
        },
    }),
});
