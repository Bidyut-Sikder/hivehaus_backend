# HiveHaus Backend

## Overview
HiveHaus is a backend service for managing office house rentals. Built with TypeScript and Express.js, it provides secure authentication using JSON Web Tokens (JWT), database integration with MongoDB, and cloud storage for media assets. JWT is used to authenticate users and maintain session security, ensuring only authorized access to protected routes.

## Features
- User authentication with JWT and bcrypt
- Secure API endpoints with Helmet, CORS, and rate limiting
- Cloud image storage with Cloudinary
- Payment integration using SSLCommerz
- Data validation with Zod
- MongoDB connection with Mongoose

## Installation
Clone the repository and navigate into the project folder:
```sh
git clone <repository-url>
cd hivehaus-backend
```

Install dependencies:
```sh
npm install
```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
    PORT=
    MONGODB_CONNECTION_STRING_DEV=
    MONGODB_CONNECTION_STRING=

    FRONTEND_URL=
    BACKEND_API=

    JWT_SECRET_KEY=
    BCRYPT_SALT_ROUNDS= 10
    NODE_VERSION=
  

    #cloudinary variables

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=


    STORE_ID=
    STORE_PASSWORD=
```

## Running the Application
To run the project in development mode:
```sh
npm run start:dev
```

To build the project:
```sh
npm run build
```

To start the production server:
```sh
npm start
```

## Folder Structure
```
hivehaus-backend/src
│── app/
│   ├── config/           
│   ├── errors/    
│   ├── middlewares/      
│   ├── modules/          
│   ├── utils/           
│   ├── services/        
│   ├── utils/                                    
│── app.ts          
│── main.ts          
│── .gitignore          
│── package.json         
│── tsconfig.json       
│── README.md            
```

## API Documentation
TBD - You can use Postman or Swagger for API testing.

## Code Style
The project follows ESLint and Prettier configurations. To check for linting issues, run:
```sh
npm run lint
```


