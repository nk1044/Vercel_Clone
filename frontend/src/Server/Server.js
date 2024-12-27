import axios from "axios";
axios.defaults.withCredentials = true;

const backend_url = String(import.meta.env.VITE_BACKEND_URI);
const deplyment_url = String(import.meta.env.VITE_DEPLOYMENT_URI);


const LoginUser = async function(user) {
    try {
        const LoggedInUser = await axios.post(`${backend_url}/user/login-user`, {...user}, {withCredentials: true});
        // console.log(LoggedInUser);
        return LoggedInUser.data.user;
    } catch (error) {
        console.log("Failed to log in user: ", error);
        return null;
    }
}

const RegisterUser = async function(user) {
    try {
        const RegisteredUser = await axios.post(`${backend_url}/user/register-user`, {...user}, {withCredentials: true});
        console.log(RegisteredUser);
        return RegisteredUser.data.user;
    } catch (error) {
        console.log("Failed to register user in server.js: ", error);
        return null
    }
}

const GetCurrentUser = async function() {
    try {
        const User = await axios.post(`${backend_url}/user/current-user`, {}, {withCredentials: true});
        console.log("current user in server: ", User);
        return User.data.user;
    } catch (error) {
        console.log("Failed to get user in server.js: ", error);
        return null;
    }
}

const logoutUser = async function() {
    try {
        const message = await axios.post(`${backend_url}/user/logout-user`, {}, {withCredentials: true});
        console.log(message.data.message);
        return true;
    } catch (error) {
        console.log("Failed to logout user in server.js: ", error);
        return null;
    }
}

const UpdateTokens = async function() {
    try {
        const User = await axios.post(`${backend_url}/user/update-tokens`, {}, {withCredentials: true});
        // console.log(User);
        return User.data.user;
    } catch (error) {
        console.log("Failed to update tokens in server.js: ", error);
        return null;    
    }
}

const GetProjects = async function() {
    try {
        console.log(`${backend_url}/project/all-projects`);
        const Projects = await axios.post(`${backend_url}/project/all-projects`, {}, {withCredentials: true});
        // console.log("projects in server: ", Projects);
        return Projects.data.projects;
    } catch (error) {
        console.log("Failed to get projects in server.js: ", error);
        return null;
    }
}


const CreateProject = async function(project) {
    try {
        const Project = await axios.post(`${backend_url}/project/queue-url`, {...project}, {withCredentials: true});
        // console.log("project in server: ", Project?.data?._doc);
        return Project?.data?._doc;
    } catch (error) {
        console.log("Failed to create project in server.js: ", error);
        return null;
    }
}

const getProjectStatus = async function(projectId) {
    try {
        const status = await axios.post(`${backend_url}/project/project-status`, {...projectId}, {withCredentials: true});
        // console.log("status in server: ", status.data.status);
        return status.data.status;
    } catch (error) {
        console.log("Failed to get project status in server.js: ", error);
        return null;
    }
}

const StartDeployment = async function() {
    try {
        const status = await axios.get(`${deplyment_url}/health-check`);
        // console.log("status in server: ", status.data.status);
        console.log("Deployment started");
    } catch (error) {
        console.log("Failed to get project status in server.js: ", error);
    }
}
const StartApibackend = async function() {
    try {
        const status = await axios.get(`${backend_url}/health-check`);
        // console.log("status in server: ", status.data.status);
        console.log("Backend server status:", status.data);
        return status.data;
    } catch (error) {
        console.log("Failed to get project status in server.js: ", error);
    }
}

export {
    LoginUser,
    RegisterUser,
    GetCurrentUser,
    logoutUser,
    UpdateTokens,
    GetProjects,
    CreateProject,
    getProjectStatus,
    StartDeployment,
    StartApibackend
}