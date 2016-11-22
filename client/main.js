import {Template} from 'meteor/templating';
import Messages from '/imports/messages';
import moment from 'moment';

import {ReactiveVar} from 'meteor/reactive-var';

const offsetValue = new ReactiveVar(0);

Template.chat.helpers({
    messages() {
        return Messages.find().map(doc => {
            if (doc.bot) {
                doc.avatar = 'asdf.jpg';
                doc.botClass = 'bot';
            }
            doc.time = moment(doc.datetime).format('HH:mm');
            return doc;
        });
    },
    offset(){
        return offsetValue.get();
    }
});

Template.chat.events({
    'submit form'(event, instance) {
        event.preventDefault();
        const text = instance.$('.js-text').val();
        console.log(text);
        Meteor.call('chat', text, () => {
            Meteor.setTimeout(() => {
                offset(instance);
            }, 500);
        });
        instance.$('.js-text').val('')
    },
    'keyup .js-text'(event, instance){
        if (event.key === 'Enter') {
            event.preventDefault();
            instance.$('form').submit();
        }
    }
});

Template.chat.onRendered(function () {
    Meteor.setTimeout(() => {
        offset(this);
    }, 500);
});
function offset(instance) {
    const heightChat = instance.$('.chat--messages').height();
    const heightWindow = instance.$('.chat').height();
    console.log(heightChat, heightWindow);
    if (heightChat > heightWindow) {
        offsetValue.set(heightChat - heightWindow);
    } else {
        offsetValue.set(0);
    }
}
