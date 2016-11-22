import {Meteor} from 'meteor/meteor';
import {pipeline, state} from '/imports/pipeline'
import createMessage from '/imports/pipeline/create-message';

Meteor.methods({
    chat(text){
        createMessage(text, false);
        this.unblock();
        pipeline(text).then(answer => {
            createMessage(answer, true);
        }).catch(err => {
            createMessage(`Something went wrong: ${err.message}`, true);
        });
        return state;
    }
});