import {Meteor} from 'meteor/meteor';
import createMessage from '/imports/pipeline/create-message';
import YouTube from 'youtube-node';
import Apac from 'apac';

const OperationHelper = Apac.OperationHelper;
const opHelper = new OperationHelper({
    awsId: Meteor.settings.awsId,
    awsSecret: Meteor.settings.awsSecret,
    assocId: Meteor.settings.assocId
});

const youtube = new YouTube();
youtube.setKey(Meteor.settings.apiKey);

Meteor.methods({
    'callYoutube'(thing){
        console.log(thing);
        youtube.search(thing, 1, Meteor.bindEnvironment((err, res)=> {
            if (err) {
                console.log(err);
            }
            if (res.items.length > 0) {
                const description = _.first(res.items).snippet.description;
                const image = _.first(res.items).snippet.thumbnails.default.url;
                if (image && description) {
                    createMessage(`<img src="${image}"><p>${description}</p>`, true);
                } else {
                    createMessage('I could not find anything... :(', true);
                }

            } else {
                createMessage('I could not find anything... :(', true);
            }
        }));
    },
    'callAmazon'(thing){
        createMessage(`Buy ${thing} on amazon! <button>Buy</button>`, true);
    }
});
