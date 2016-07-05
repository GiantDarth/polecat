'use strict';

// src\services\character\hooks\create-id.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const crypto = require('crypto');
const errors = require('feathers-errors');

// const defaults = {};

module.exports = () => {
    // options = Object.assign({}, defaults, options);

    return hook => {
        const characterService = hook.app.service('characters');

        let promise = () => new Promise((resolve, reject) => {
            crypto.randomBytes(20, (err, buffer) => {
                if (err) {
                    reject(err);
                }

                let id = buffer.toString('hex');
                characterService.find({ query: { _id: id } })
                    .then(result => {
                        if (result.total) {
                            console.log(id);

                            return resolve(promise());
                        }
                        else {
                            hook.data._id = id;

                            resolve(hook);
                        }
                    });
            });
        });

        return promise();
    };
};
