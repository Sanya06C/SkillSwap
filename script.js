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
const db = firebase.firestore();


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

function signup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const name = document.getElementById("signup-name").value;


  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save user data to Firestore
      return db.collection("users").doc(user.uid).set({
        email: email,
        name: name,
        points: 0
      });
    })
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

function postSkill() {

  const skillName = document.getElementById("skillName").value;
  const days = document.getElementById("days").value;
  const time = document.getElementById("time").value;
  const desc = document.getElementById("desc").value;

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  db.collection("skills").add({
      userID: user.uid,
      skillName: skillName,
      days: days,
      time: time,
      description: desc
  })
  .then(() => {
      alert("Skill posted successfully!");
      window.location.href = "dashboard.html";
  })
  .catch(error => {
      alert(error.message);
  });
}

