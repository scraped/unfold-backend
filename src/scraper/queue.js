import kue from 'kue';

import { Config } from '../config';


export const queue = kue.createQueue({
    redis: Config.redis,
});

export { kue };

export function nodeify(fn) {
    return function(job, done) {
        let ret = fn(job);
        if (ret && typeof ret.then !== 'undefined' && typeof ret.catch !== 'undefined')
            ret.then(done, done);
    };
}
