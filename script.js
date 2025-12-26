// 🔹 DEBUG
console.log("script.js loaded");

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAhhMuccY9MnOxSDhlJgnAdpVOQYubGLbg",
  authDomain: "skillswap-e13ee.firebaseapp.com",
  projectId: "skillswap-e13ee",
  storageBucket: "skillswap-e13ee.firebasestorage.app",
  messagingSenderId: "966257721764",
  appId: "1:966257721764:web:eeffd75d8322265dffc131"
};

// 🔹 Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// 🔹 Firebase services
const auth = firebase.auth();
const db = firebase.firestore();


// ================= SIGNUP =================
function signup() {
  console.log("Signup clicked");

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const name = document.getElementById("signup-name").value;
  const branch = document.getElementById("branch").value;
  const year = document.getElementById("year").value;

  if (!email || !password || !name || !branch || !year) {
    alert("Please fill all fields");
    return;
  }

  // ✅ Allow only Somaiya emails
  const allowedDomains = ["@somaiya.edu", "@somaiya.edu.in"];
  const isAllowed = allowedDomains.some(domain => email.endsWith(domain));

  if (!isAllowed) {
    alert("Please use your official Somaiya email ID");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return db.collection("users").doc(user.uid).set({
        name,
        email,
        branch,
        year,
        points: 0
      });
    })
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}


// ================= LOGIN =================
function login() {
  console.log("Login clicked");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}


// ================= LOGOUT =================
function logoutUser() {
  auth.signOut()
    .then(() => {
      window.location.href = "login.html";
    })
    .catch(error => {
      alert(error.message);
    });
}


// ================= AUTH PROTECTION =================
auth.onAuthStateChanged(user => {
  const path = window.location.pathname;

  // Protect dashboard & internal pages
  if (
    !user &&
    (path.includes("dashboard") ||
     path.includes("profile") ||
     path.includes("browse") ||
     path.includes("requests") ||
     path.includes("reward") ||
     path.includes("points"))
  ) {
    window.location.href = "login.html";
  }
});

// ================= POST SKILL =================
function postSkill() {
  console.log("Post Skill clicked");

  const skillName = document.getElementById("skillName").value.trim();
  const days = document.getElementById("days").value.trim();
  const time = document.getElementById("time").value.trim();
  const desc = document.getElementById("desc").value.trim();

  // 🛑 Basic validation
  if (!skillName || !days || !time || !desc) {
    alert("Please fill all fields");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in");
    return;
  }

  // 📦 Save skill in Firestore
  db.collection("skills").add({
    skillName: skillName,
    days: days,
    time: time,
    description: desc,
    mentorId: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Skill posted successfully 🎉");
    
    // clear inputs
    document.getElementById("skillName").value = "";
    document.getElementById("days").value = "";
    document.getElementById("time").value = "";
    document.getElementById("desc").value = "";
  })
  .catch(error => {
    console.error(error);
    alert("Error posting skill");
  });
}
