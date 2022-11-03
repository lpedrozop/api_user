import {Router} from "express";
import {login,create_user} from "../controllers/user.controller.js";

const router = Router()

router.post('/login', login)
router.post('/sigin', create_user)


export default router