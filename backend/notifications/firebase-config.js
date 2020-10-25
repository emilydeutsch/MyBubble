var admin = require("firebase-admin");

var serviceAccount = require("./mybubble-ede11-firebase-adminsdk-ad31a-7467be0e8d.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mybubble-ede11.firebaseio.com"
})

module.exports.admin = admin