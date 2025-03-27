async function sendMessage(userId, messageText) {
    const token = localStorage.getItem("token");
  
    if (!messageText.trim()) return;
  
    try {
        console.log(users._id)
      const response = await fetch(`https://realtimechat-2-u3vp.onrender.com/chats/send/${users._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: messageText }),
      });
  
      if (!response.ok) throw new Error("Message not sent");
  
      const message = await response.json();
      return message; // Returns the stored message
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }
  