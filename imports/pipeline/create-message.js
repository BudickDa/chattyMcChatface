import Messages from '/imports/messages';

const createMessage = function (text, bot) {
    const message = {
        datetime: new Date(),
        text: text,
        bot: bot,
        userId: 'This makes the bot skaleable, because every user has its own conversation.'
    };
    Messages.insert(message);
};

export {createMessage as default};
