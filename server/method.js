import {Meteor} from 'meteor/meteor';
import Messages from '/imports/messages';
import pipeline from '/imports/pipeline'

const createMessages = function (text, bot) {
    return {
        datetime: new Date(),
        text: text,
        bot: bot,
        userId: 'This makes the bot skaleable, because every user has its own conversation.'
    };
};

Meteor.methods({
    chat(text){
        Messages.insert(createMessages(text, false));
        const answer = pipeline(text);
        Messages.insert(createMessages(answer, true));
    }
})