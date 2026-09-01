import { Router } from "express";
import { getUserProfileById, getAllUsers, login, updateUserProfileById, DeleteProfileById, signup } from "../Controller/userController.js";



const router = Router();

router.route("/login").post(login);
router.route("/signUp").post(signup);
router.route("/get_All_Users").get(getAllUsers);
router.route("/getUserProfileById/:id").get(getUserProfileById);
router.route("/updatUserProfile/:id").post(updateUserProfileById);
router.route("/deleteProfile/:id").delete(DeleteProfileById);

export default router;
