import {Meteor} from 'meteor/meteor';
import createMessage from '/imports/pipeline/create-message';
import YouTube from 'youtube-node';
const youtube = new YouTube();
youtube.setKey(Meteor.settings.apiKey);

Meteor.methods({
    'callYoutube'(thing){
        youtube.search(thing, 1, Meteor.bindEnvironment((err, res)=> {
            if (err) {
                console.log(err);
            }
            if (res.items.length > 0) {
                console.log(_.first(res.items).snippet);
                createMessage(_.first(res.items).snippet, true);
            } else {
                createMessage('I could not find anything... :(');
            }
        }));
    },
    'callAmazon'(thing){

    }
})