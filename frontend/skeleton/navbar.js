
document.addEventListener("DOMContentLoaded", () => {
    const authUser = true; // Simulating user authentication status
  
    const logout = () => console.log("User logged out");
  
    document.body.insertAdjacentHTML("afterbegin", `
      <header class="navbar">
        <div class="container">
          <a href="/" class="logo">
            <div class="logo" style="display: flex; align-items: center; gap: 8px;">
            <div class="logo-icon">🗨️</div>
            <h1>Chatty</h1></div>
          </a>
  
          <nav class="nav-links">
            <a href="/settings" class="btn">⚙️ Settings</a>
            ${authUser ? `
              <a href="/profile.html" class="btn">👤 Profile</a>
              <a href="/signup.html" class="btn">Signup</a>
              <a href="/login.html" class="btn">Login</a>
              <button id="logout-btn" class="btn">Logout</button>
            ` : ''}
          </nav>
        </div>
      </header>
    `);
  
   
    
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      const response = await fetch('https://realtimechat-2-u3vp.onrender.com/user/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent
      });

      if (response.ok) {
        alert('Logout successful!');
        window.location.href = '/login'; // Redirect to login page
      } else {
        alert('Logout failed. Try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  });

  });
  