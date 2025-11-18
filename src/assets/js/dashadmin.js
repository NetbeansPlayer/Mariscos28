const admin = localStorage.getItem("userRole");
    if (admin !== "admin") window.location.href = "index3.html";

    function logout() {
      localStorage.clear();
      window.location.href = "index3.html";
    }