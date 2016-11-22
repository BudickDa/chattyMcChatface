import { Meteor } from 'meteor/meteor';
import Messages from '/imports/messages';
import '/server/method';
import '/imports/pipeline/calls';

Meteor.startup(() => {
  Messages.remove({});

});
