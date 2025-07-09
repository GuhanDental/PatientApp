// auth.js

const userEmail = localStorage.getItem("userEmail") || "";

function isAdmin() {
  return userEmail === "guhandental@gmail.com";
}

function isAssistant() {
  return userEmail === "guhandentalassistant@gmail.com";
}

function getUserEmail() {
  return userEmail;
}

function requireLogin() {
  if (!userEmail) {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
}
