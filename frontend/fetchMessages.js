async function fetchMessages(userId) {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`https://realtimechat-2-u3vp.onrender.com/chats/get-messages/${users._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const messages = await response.json();
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }
  