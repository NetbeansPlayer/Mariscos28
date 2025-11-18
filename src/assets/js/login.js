const users = [
  { username: "cliente1", password: "1234", role: "cliente" },
  { username: "admin", password: "admin123", role: "admin" }
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("userRole", user.role);
    if (user.role === "admin") {
      window.location.href = "dashboard_admin.html";
    } else {
      window.location.href = "dashboard_cliente.html";
    }
  } else {
    errorMsg.textContent = "Usuario o contraseña incorrectos.";
  }
});