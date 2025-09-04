# QuickChat

A full-stack real-time chat application built with **React, TypeScript, Tailwind CSS** on the frontend and **Express.js, PostgreSQL, Prisma, Socket.io** on the backend. QuickChat enables seamless one-on-one and group messaging with real-time updates, typing indicators, and user authentication.

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup and Installation](#setup-and-installation)
- [Folder Structure](#folder-structure)  
- [API Endpoints](#api-endpoints)  

## Features
- 🔑 User authentication with JWT  
- 💬 One-on-one and group chat support  
- ⏱ Real-time messaging with Socket.io  
- ✍️ Typing indicators for an interactive chat experience  
- 👥 Manage group members (add/remove users, assign admins)  
- 📱 Responsive UI with Tailwind CSS  

## Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express.js, Socket.io  
**Database:** PostgreSQL with Prisma ORM  
**Authentication:** JSON Web Tokens (JWT)  

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/QuickChat.git
   cd QuickChat
    ```

2. **Install dependencies:**

   * Backend:

     ```bash
     cd server
     npm install
     ```

   * Frontend:

     ```bash
     cd ../client
     npm install
     ```

3. **Setup environment variables:**

   * **Server `.env`**  

     Create a `.env` file inside the `server` directory and configure the following:  

     ```env
     DATABASE_URL="postgresql://<username>:<password>@localhost:5432/chatapp?schema=public"
     JWT_SECRET="<your_jwt_secret>"
     CLIENT_URL="http://localhost:5173"
     ```

   * **Client `.env`**  

     Create a `.env` file inside the `client` directory and configure the following:  

     ```env
     VITE_BASE_URL="http://localhost:5000"
     ```


4. **Run the application:**

   * Start backend:

     ```bash
     cd server
     npm run dev
     ```

   * Start frontend (runs on port 3000 by default):

     ```bash
     cd ../client
     npm run dev
     ```

5. **Access the app:**

   * Frontend: [http://localhost:5173](http://localhost:3000)
   * Backend API: [http://localhost:5000](http://localhost:4000)

## Folder Structure

```
QuickChat/
├── client/                  # Frontend
│   ├── node_modules/        
│   ├── public/              
│   └── src/                 
│       ├── components/      # Reusable UI components
│       ├── contexts/        # React context providers
│       ├── hooks/           # Custom React hooks
│       ├── pages/           # Page-level components
│       ├── services/        # API service functions
│       ├── types/           # TypeScript type definitions
│       └── App.tsx          
│
├── server/                  # Backend
│   ├── node_modules/        
│   ├── prisma/              # DB schema & migrations
│   └── src/                 
│       ├── controllers/     # Route handlers
│       ├── middlewares/     # Express middlewares
│       ├── routes/          # API route definitions
│       ├── sockets/         # Socket.io event handlers
│       ├── app.ts           # Express app config
│       └── server.ts        # Entry point
│
└── README.md

```

## API Endpoints

### Auth Routes (`/api/auth`)

* `POST /register` → Register a new user
* `POST /login` → Login user and return JWT
* `GET /me` → Get current user (requires authentication)

### User Routes (`/api/users`)

* `GET /` → Search users
* `GET /:id` → Get user by ID

### Chat Routes (`/api/chats`)

* `POST /` → Create a new chat
* `GET /` → Get all chats for authenticated user
* `GET /:id` → Get chat by ID
* `PUT /group` → Update group details
* `PUT /group/add` → Add participant to group
* `PUT /group/remove` → Remove participant from group

### Message Routes (`/api/messages`)

* `POST /` → Send a message
* `GET /:chatId` → Get all messages in a chat

⚡ **Note:** All protected routes require a valid JWT token.
