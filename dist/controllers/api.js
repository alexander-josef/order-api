"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = (req, res, next) => {
    return res.status(200).send({ title: 'Order API' });
};
