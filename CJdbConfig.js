const admin = require('firebase-admin');
const credentials = require('./credentials');

const initializeAdmin = () => {
  try{
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    console.log("Initialized admin.");
  }catch{
    console.log("Admin not initialized.");
  }
};

initializeAdmin();
//var auth = getAuth(app);
//var provider = new GoogleAuthProvider();

module.exports = {admin};