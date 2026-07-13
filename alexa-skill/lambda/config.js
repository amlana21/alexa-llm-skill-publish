// Local dev credentials — gitignored, deployed via ask deploy but never committed
// When env vars are configured in the hosted Lambda, this file becomes unused
module.exports = {
    RETRIEVAL_SERVICE_URL: '<ngrok url>',
    RETRIEVAL_AUTH_USER: 'changeme',
    RETRIEVAL_AUTH_PASS: 'changeme'
};
