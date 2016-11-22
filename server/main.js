import { Meteor } from 'meteor/meteor';
import Messages from '/imports/messages';

Meteor.startup(() => {
  Messages.remove({});

});
