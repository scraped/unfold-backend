import sinon from 'sinon';
import { Subscriber, Channels } from '../stream';
import { withCreateEvent } from '../spec-utils';


describe('Model hooks', function() {
    let event;

    withCreateEvent(vars => { ({ event } = vars); });

    it('publishes a new post', async function() {
        let subs, deferred = new Promise(resolve => { subs = sinon.spy(resolve); });
        await Subscriber.subscribe(Channels.event(event.id), subs);

        // Note that the afterCreate hook runs asynchronously, so "await" is useless
        event.createPost({ caption: 'Hate you' });

        await deferred;
        expect(subs).to.have.been.calledOnce; // eslint-disable-line

        let e = subs.firstCall.args[0];
        expect(e).to.have.property('resource', 'post');
        expect(e).to.have.property('type', 'created');
        expect(e).to.have.deep.property('data.caption', 'Hate you');
    });
});
