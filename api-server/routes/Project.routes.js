import { Router } from "express";
import { GetUrl, GetCurrentProjectStatus, GetAllProjects} from '../controller/Project.controller.js';
import {VerifyToken} from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/queue-url').post(VerifyToken, GetUrl);
router.route('/project-status').post(VerifyToken, GetCurrentProjectStatus);
router.route('/all-projects').post(VerifyToken, GetAllProjects);


export default router;