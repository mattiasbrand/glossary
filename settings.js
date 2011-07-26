var settings = {}

settings.couchdb = {}
settings.couchdb.host = 'https://brand.cloudant.com';
settings.couchdb.port = 443;
settings.couchdb.user = process.env.glossary_couchdb_user;
settings.couchdb.password = process.env.glossary_couchdb_password;
settings.couchdb.database = 'glossary';

module.exports = settings;
