# Vercel Clone

This project is a clone of Vercel that allows users to log in and deploy their websites using their GitHub repository URL.

#### You can access the website here: [link]()
#### Login using:
Email: ```Testuser@gmail.com```

Passward: ```TestUser@123```

## Technologies Used

### Backend

- Node.js 
- Express
- MongoDB 
- Redis 
- Supabase 

### Frontend
- React 

### Environment
- Docker 

### Project Architecture

This project consists of three servers:

1. **API Server:**

- Handles user requests such as login and project creation.

- Pushes GitHub repository information to a Redis queue for further processing.

2. **Builder Server:**

- Clones the GitHub repository.

- Builds the project.

- Uploads the built project to a Supabase bucket for hosting.

3. **Deployment Server:**

- Manages web requests.

- Uses reverse proxies to serve the deployed websites.

### Features

1. ***User Authentication:***

    - Users can log in to their accounts.

    - Secure and scalable authentication mechanism.

2. ***Website Deployment:***

    - Users can deploy their websites by providing their GitHub repository URL.

3. ***Automated Build Process:***

    - Repositories are automatically cloned, built, and uploaded to the hosting bucket.

4. ***Reverse Proxy for Web Requests:***

    -Efficient routing and handling of web requests using a reverse proxy system.

## Installation and Setup


### Clone the Repository:
```
git clone https://github.com/your-repo/vercel-clone.git

cd vercel-clone
```
### Set Up Environment Variables:
Create a .env file with the required configuration:

- MongoDB URI

- Redis configuration

- Supabase API keys

- Other necessary credentials


### Access the Application:

Open your browser and go to http://localhost:3000.

### Build Process:

- The API server pushes the repository to a Redis queue.

- The Builder server picks it up, clones the repo, builds it, and uploads the output to Supabase.

### Deployment Process:

- The Deployment server sets up reverse proxies to serve the website from the Supabase bucket.