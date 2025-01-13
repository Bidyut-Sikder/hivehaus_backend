# Backend Management System for Nexus Co-Working Space Reservations
*This project is a backend management system designed for an agency that offers co-working spaces for meetings and discussions. The system streamlines the booking process by providing a web application for managing room reservations. The backend is built using Node.js, Express, MongoDB, and other supporting libraries.*

#### Live Link - https://nexus-workspace.vercel.app/

### Features

- User authentication and authorization
- Room management
- Reservation management
- Integration with MongoDB for data storage
- Input validation using Zod

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14 or later)
- npm (Node Package Manager)
- MongoDB (version 4.4 or later)
- Installation

1.Clone the repository

```
git clone https://github.com/SAIKOT-ROY/Nexus-Workspace-Backend_Management.git
cd your-repository-name
```

2.Install dependencies:

```
npm install
```

3.Create a .env file in the root directory and add the following environment variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coworking
JWT_SECRET=your_jwt_secret_key
```

4.Run the development server:

```
npm run start:dev
```

## Project Structure
```
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── utils
│   └── server.ts
├── .env
├── .eslintrc.json
├── package.json
└── README.md
```


