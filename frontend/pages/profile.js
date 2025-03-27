console.log("✅ profile.js is loaded!");

// Utility: Retrieve auth token
// Utility: Retrieve auth token
function getAuthToken() {
  const token = localStorage.getItem("authToken");
  console.log("🔑 Retrieved Token from Local Storage:", token);
  return token;
}

async function checkAuth() {
  const token = getAuthToken();
  console.log("📌 Token before API call:", token);
  if (!token) return redirectToLogin();
}



// Utility: Redirect to login page
function redirectToLogin() {
  alert("Session expired. Please log in again.");
  //localStorage.removeItem("authToken");
  // window.location.href = "login.html";
}

// Check user authentication and fetch profile
async function checkAuth() {
  const token = getAuthToken();
  console.log(token)
  if (!token) return redirectToLogin();

  try {
    const response = await fetch("https://realtimechat-2-u3vp.onrender.com/user/check-auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Unauthorized");

    const data = await response.json();
    console.log("🔍 User Data:", data);

    if (data.id) {
      document.getElementById("welcome-msg").innerText = `Welcome, User ${data.id}`;
      loadUserProfile();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Auth Error:", error);
    redirectToLogin();
  }
}

// Fetch user profile and populate the UI

async function loadUserProfile() {
  try {
    const token = getAuthToken();
    console.log("profile 1")
    if (!token) throw new Error("Missing auth token");
console.log("profile")
    const response = await fetch("https://realtimechat-2-u3vp.onrender.com/user/profile", {
      method: "GET",
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`, // Include token here
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load profile");
    }

    const { profilePic, username } = await response.json();
    if (profilePic) document.getElementById("profile-img").src = profilePic;
    if (username) document.getElementById("username").value = username;
  } catch (error) {
    console.error("Profile Load Error:", error);
    alert("Error loading profile. Please try again.");
  
    if (error.message.includes("Unauthorized")) {  
      localStorage.removeItem("authToken");
     // window.location.href = "login.html";
    }
  }
  
}

// Upload profile image and update server

async function uploadImage(file) {
  const token = getAuthToken();
  if (!token) return redirectToLogin();

  const reader = new FileReader();
  reader.onloadend = async () => {
    try {
      const response = await fetch("https://realtimechat-2-u3vp.onrender.com/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token here
        },
        body: JSON.stringify({
          username: document.getElementById("username").value,
          profilePic: reader.result,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert(result.msg);
      
      document.getElementById("profile-img").src = result.updatedUser.profilePic;
      document.getElementById("sidebar-img").src = result.updatedUser.profilePic;
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to update profile. Try again later.");
    }
  };
  reader.readAsDataURL(file);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  document.getElementById("image-upload").addEventListener("change", (e) => {
    if (e.target.files[0]) uploadImage(e.target.files[0]);
  });
});










