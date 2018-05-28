const firebase = require('firebase')
// The configuration for initializing the application will be provided!
module.exports = firebase.initializeApp({
  databaseURL: 'https://leapyear-take-home-d2123.firebaseio.com/'
})
