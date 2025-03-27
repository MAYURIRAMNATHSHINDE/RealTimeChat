# Real-Time Chat Application

## Introduction
The Real-Time Chat Application is designed to provide users with instant communication. This project utilizes **Node.js**, **Express.js**, **Socket.IO**, **MongoDB**, and **JWT authentication** to deliver a secure, responsive, and real-time messaging experience.

## Features
- **User Authentication:** Secure registration and login using JWT.
- **Real-Time Messaging:** Instant message exchange powered by Socket.IO.
- **Chat Rooms:** Users can create and join chat rooms.
- **Profile Management:** Users can update their details.
- **Session Handling:** Ensures smooth and persistent communication.
- **Secure Data Storage:** Messages and user data stored securely in MongoDB.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Real-Time Communication:** Socket.IO
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Frontend:** HTML, CSS, JavaScript

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB (Local or Cloud)

### Steps to Run the Application
1. **Clone the Repository**
   ```sh
   git clone "https://github.com/MAYURIRAMNATHSHINDE/RealTimeChat.git"
   cd RealTimeChat
   ```
2. **Install Dependencies**
   ```sh
   npm init -y
   ```
3. **Configure Environment Variables**
   - Create a `.env` file and add the required environment variables:
     ```env
     PORT=3000
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     ```
4. **Start the Server**
   ```sh
   npm start
   ```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/user/signup` | Register a new user |
| POST   | `/user/login` | Login user and receive JWT token |
| GET    | `/user/all-user` | Fetch all users |
| POST   | `/chats/messages` | Send a new message |
| GET    | `/chats/messages/:chatId` | Retrieve chat history |

## Deployment
- Deployed on **[Heroku/Vercel/AWS]** (Update based on actual deployment)
- Database hosted on **MongoDB Atlas** (or local instance)

## Future Improvements
- Add push notifications for new messages.
- Support multimedia file sharing.
- Improve security with OAuth-based authentication.

## License
This project is open-source and available under the [MIT License](LICENSE).
