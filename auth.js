// auth.js
function waitForAuth(callback) {
  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      unsubscribe(); // stop listening
      callback(user);
    }
  });
}
