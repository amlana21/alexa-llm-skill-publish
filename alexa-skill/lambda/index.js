const Alexa = require('ask-sdk-core');
const https = require('https');
const http = require('http');

let localConfig = {};
try { localConfig = require('./config'); } catch (e) { /* no local config */ }

const RETRIEVAL_SERVICE_URL = process.env.RETRIEVAL_SERVICE_URL || localConfig.RETRIEVAL_SERVICE_URL;
const RETRIEVAL_AUTH_USER = process.env.RETRIEVAL_AUTH_USER || localConfig.RETRIEVAL_AUTH_USER;
const RETRIEVAL_AUTH_PASS = process.env.RETRIEVAL_AUTH_PASS || localConfig.RETRIEVAL_AUTH_PASS;

const LAUNCH_MESSAGE = "Hello, I'm <name_of_bot>. You can ask me questions about the knowledge base. What would you like to know?";
const HELP_MESSAGE = "Ask me a question about the knowledge base. For example, say: ask about the oncology SOP.";
const STOP_MESSAGE = "Goodbye!";
const FALLBACK_MESSAGE = "I'm not sure about that. Please try asking a specific question about the knowledge base.";
const ERROR_MESSAGE = "Sorry, I had trouble getting an answer. Please try again.";

function callRetrievalService(query) {
    return new Promise((resolve, reject) => {
        const targetUrl = new URL(`${RETRIEVAL_SERVICE_URL}/query`);
        const body = JSON.stringify({ query });
        const auth = Buffer.from(`${RETRIEVAL_AUTH_USER}:${RETRIEVAL_AUTH_PASS}`).toString('base64');

        const options = {
            hostname: targetUrl.hostname,
            port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
            path: targetUrl.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'Authorization': `Basic ${auth}`
            }
        };

        const client = targetUrl.protocol === 'https:' ? https : http;

        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.answer || ERROR_MESSAGE);
                } catch (e) {
                    reject(e);
                }
            });
        });

        // Alexa requires a response within ~8s — cap retrieval at 5s
        req.setTimeout(5000, () => {
            req.destroy(new Error('Retrieval service timed out'));
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(LAUNCH_MESSAGE)
            .reprompt(LAUNCH_MESSAGE)
            .getResponse();
    }
};

const QueryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QueryIntent';
    },
    async handle(handlerInput) {
        const query = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query') || '';

        let answer;
        try {
            answer = await callRetrievalService(query);
        } catch (err) {
            console.error('Retrieval service error:', err.message);
            answer = ERROR_MESSAGE;
        }

        return handlerInput.responseBuilder
            .speak(answer)
            .reprompt('Is there anything else you would like to know?')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .reprompt(HELP_MESSAGE)
            .getResponse();
    }
};

const StopAndCancelIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(STOP_MESSAGE)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt(FALLBACK_MESSAGE)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.error('Unhandled error:', error.message);
        return handlerInput.responseBuilder
            .speak(ERROR_MESSAGE)
            .reprompt(ERROR_MESSAGE)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        QueryIntentHandler,
        HelpIntentHandler,
        StopAndCancelIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
