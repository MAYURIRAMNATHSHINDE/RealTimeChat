

// Login Function: Store Token in localStorage
async function loginUser(email, password) {
  try {
    const response = await fetch("https://realtimechat-2-u3vp.onrender.com/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.status === 401) {
      localStorage.removeItem("authToken");
    }
    

    const data = await response.json();
    if (response.ok && data.token) {
      // Store token in localStorage

      window.addEventListener("storage", () => {
        console.log("🔍 Token changed:", localStorage.getItem("authToken"));
      });
      



      localStorage.setItem("authToken", data.token);

      console.log("Token saved in localStorage:", data.token);
      window.location.href = "index.html"; // Redirect to profile page
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Error logging in");
  }
}

// Call the login function when form is submitted
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  loginUser(email, password);
});
