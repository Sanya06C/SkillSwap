function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user && pass) {
    window.location.href = "dashboard.html";
  } else {
    alert("Please fill all fields");
  }
}
