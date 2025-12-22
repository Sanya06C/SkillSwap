// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhhMuccY9MnOxSDhlJgnAdpVOQYubGLbg",
  authDomain: "skillswap-e13ee.firebaseapp.com",
  projectId: "skillswap-e13ee",
  storageBucket: "skillswap-e13ee.firebasestorage.app",
  messagingSenderId: "966257721764",
  appId: "1:966257721764:web:eeffd75d8322265dffc131"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login function
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
}
