

// // // document.addEventListener("DOMContentLoaded", () => {
// // //   const loginForm = document.getElementById("login-form");

// // //   loginForm.addEventListener("submit", async (e) => {
// // //     e.preventDefault();

// // //     const email = document.getElementById("email").value.trim();
// // //     const password = document.getElementById("password").value.trim();

// // //     if (!email || !password) {
// // //       alert("Please fill in all fields.");
// // //       return;
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:3000/user/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email, password }),
// // //       });

// // //       const data = await response.json();

// // //       if (response.ok) {
// // //         // Store token in localStorage
       
// // //         localStorage.setItem("authToken", data.token);
// // // console.log("Stored Token:", localStorage.getItem("authToken"));
// // // alert("Login successful!");
// // // setTimeout(() => {
// // //   window.location.href = "index.html";
// // // }, 500); // Wait 0.5 seconds

        

// // //         // window.location.href = "index.html"; // Redirect to dashboard
// // //       } else {
// // //         alert(data.message || "Login failed. Please try again.");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error during login:", error);
// // //       alert("An error occurred. Please try again later.");
// // //     }
// // //   });
// // // });


// // // Check if token is stored correctly after login
// // document.addEventListener("DOMContentLoaded", () => {
// //   const loginForm = document.getElementById("login-form");

// //   loginForm.addEventListener("submit", async (e) => {
// //     e.preventDefault();

// //     const email = document.getElementById("email").value.trim();
// //     const password = document.getElementById("password").value.trim();

// //     if (!email || !password) {
// //       alert("Please enter email and password");
// //       return;
// //     }

// //     try {
// //       const response = await fetch("http://localhost:3000/user/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password }),
// //       });

// //       const data = await response.json();
// //       console.log("Login Response Data:", data); // Debug output

// //       if (response.ok && data.token) {
// //         localStorage.setItem("authToken", data.token);
// //         alert("Login successful!");
// //         setTimeout(() => {
// //           window.location.href = "index.html";
// //         }, 600); // Delay ensures the token is saved
// //         // Monitor storage changes
// // window.addEventListener("storage", (event) => {
// //   if (event.key === "authToken") {
// //     console.log("Token Changed:", event.newValue);
// //   }
// // });
// //       } else {
// //         alert(data.message || "Login failed");
// //       }
// //     } catch (error) {
// //       console.error("Login error:", error);
// //       alert("An error occurred during login");
// //     }
// //   });
// // });



// // Login Function: Store Token in Cookie
// async function loginUser(email, password) {
//   try {
//     const response = await fetch("http://localhost:3000/user/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     if (response.ok && data.token) {
//       // Store the token in a cookie (Secure and HttpOnly for production)
//       document.cookie = `authToken=${data.token}; path=/; secure`;

//       console.log("Token saved in Cookie:", data.token);
//       window.location.href = "profile.html"; // Redirect to profile page
//     } else {
//       alert(data.message || "Login failed");
//     }
//   } catch (error) {
//     console.error("Login Error:", error);
//     alert("Error logging in");
//   }
// }

// // Call the login function when form is submitted
// document.getElementById("login-form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();
//   loginUser(email, password);
// });



// Login Function: Store Token in localStorage
async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:3000/user/login", {
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
