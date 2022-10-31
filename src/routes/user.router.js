import {Router} from "express";
import {login,create_user, login_c} from "../controllers/user.controller.js";

const router = Router()

router.post('/login', login)
router.post('/sigin', create_user)
router.get('/login/:id',login_c)


export default router