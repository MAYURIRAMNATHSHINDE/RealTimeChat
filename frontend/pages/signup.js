// // signup.js

// document.addEventListener("DOMContentLoaded", () => {
//     const signupBtn = document.getElementById("signup-btn");
  
//     // Redirect to signup.html when the button is clicked
//     if (signupBtn) {
//       signupBtn.addEventListener("click", () => {
//         window.location.href = "signup.html";
//       });
//     }
  
//     // Handle form submission on signup.html page
//     const signupForm = document.getElementById("signup-form");
//     if (signupForm) {
//       signupForm.addEventListener("submit", (e) => {
//         e.preventDefault();
  
//         const fullName = document.getElementById("full-name").value.trim();
//         const email = document.getElementById("email").value.trim();
//         const password = document.getElementById("password").value.trim();
  
//         if (!fullName || !email || !password) {
//           alert("All fields are required!");
//           return;
//         }
  
//         alert(`Welcome, ${fullName}! Your account has been created.`);
//         signupForm.reset();
//       });
//     }
//   });
  

document.addEventListener("DOMContentLoaded", () => {
    //const signupBtn = document.getElementById("signup-btn");
  
    // Redirect to signup.html when the button is clicked
    // if (signupBtn) {
    //   signupBtn.addEventListener("click", () => {
    //     window.location.href = "signup.html";
    //   });
    // }
  
    // Handle form submission on signup.html page
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
  
        if (!username || !email || !password) {
          alert("All fields are required!");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:3000/user/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          });
  
          if (response.ok) {
            alert(`Welcome, ${username}! Your account has been created.`);
            signupForm.reset();
            window.location.href = "login.html"; // Redirect to profile page
          } else {
            alert("Error during signup. Try again.");
          }
        } catch (error) {
          alert("Error connecting to the server.");
        }
      });
    }
  });
  