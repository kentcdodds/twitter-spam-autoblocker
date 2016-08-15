var loopback = require('loopback');
var boot = require('loopback-boot');
var secrets = require("../../../../secure/secrets.js");

var app = module.exports = loopback();
var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
var session = require('express-session');
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};



// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

// Enable http session
app.use(session({ secret: secrets.sessionSecret }));
 
// Load the provider configurations
var config = {};
try {
 config = require('./providers.json');
 
} catch(err) {
 console.error('Please configure your passport strategy in `providers.json`.');
 console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
 process.exit(1);
}
// Initialize passport
passportConfigurator.init();
 //console.log(app.models());
// Set up related models
passportConfigurator.setupModels({
 userModel: app.models.user,
 userIdentityModel: app.models.userIdentity,
 userCredentialModel: app.models.userCredential
});
// Configure passport strategies for third party auth providers
for(var s in config) {
  console.log(s);
 var c = config[s];
 c.consumerKey = secrets.consumerKey;
 c.consumerSecret = secrets.consumerSecret;

 c.session = c.session !== false;
 passportConfigurator.configureProvider(s, c);
}
