import {Meteor} from 'meteor/meteor';
import util from 'util';
import NLP from 'google-nlp-api';
import _ from 'underscore';
import createMessage from '/imports/pipeline/create-message';

const nlp = new NLP(Meteor.settings.apiKey);

const state = {
    greeted: false,
    settings: {
        humour: 80
    },
    user: {
        happy: 50
    },
    todos: []
};

function greet() {
    if (state.greeted) {
        return 'Hello again. ';
    }
    state.greeted = true;
    return 'Hello. ';
}

function tellJoke(response) {
    return response + ' <insert joke here>';
}

async function pipeline(question) {
    let response = '';
    const resEntities = await nlp.analyzeEntities(question);

    if (question.toLowerCase().indexOf('hi') !== -1 ||
        question.toLowerCase().indexOf('hello') !== -1 ||
        question.toLowerCase().indexOf('hallo') !== -1) {
        response = greet();
    }

    const entities = resEntities.entities.filter(i => {
        return _.contains(['PERSON', 'CONSUMER_GOOD'], i.type);
    });

    if (entities.length === 0) {
        return tellJoke(response);
    }
    let thing = '';
    if (entities.length === 1) {
        thing = _.first(entities).name;
    } else {
        thing = _.pick(entities, 'name').join(' ');
    }

    if (question.toLowerCase().indexOf('buy') !== -1) {
        state.todos.push({'do': 'buy', 'what': thing});
        return response + ' Looking on amazon for: ' + thing;
    }
    if (question.toLowerCase().indexOf('watch') !== -1 ||
        question.toLowerCase().indexOf('listen') !== -1
    ) {
        state.todos.push({'do': 'watch', 'what': thing});
        return response + ' Looking on youtube for: ' + thing;
    }
    if (entities.length > 0) {
        const entity = entities[0];
        return `${response} I found ${entity.name} on <a href="${entity.metadata.wikipedia_url}" target="_blank">Wikipedia</a>.`;
    }else{
        return 'I am sorry Jon, I can\'t do this.';
    }
    return response;
}

const checkState = function() {
    if (state.todos.length > 0) {
        const todo = _.last(state.todos);
        if (todo.do === 'buy') {
            Meteor.call('callAmazon', todo.what);
            state.todos.push({'do': 'insure', 'what': todo.what});
        }
        if (todo.do === 'watch') {
            Meteor.call('callYoutube', todo.what);
        }
        if (todo.do === 'insure') {
            createMessage(`Do you want to buy insurance for ${todo.what}? <button>YES</button>`, true);
        }
    }
    state.todos.shift();
    Meteor.setTimeout(checkState, 100);
};
Meteor.startup(checkState);



export {pipeline, state};