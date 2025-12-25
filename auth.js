function waitForAuth(callback) {
  const unsub = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      unsub();
      callback(user);
    }
  });
}

