import { Router } from "express";
import issueRouter from "./issueRoutes.js"
import repoRouter from "./repoRoutes.js";
import userRouter from "./userRoutes.js";


const mainRouter = Router();

mainRouter.use(issueRouter);
mainRouter.use(repoRouter);
mainRouter.use(userRouter);

mainRouter.get("/", (req, res) => {
    res.send("welcome")
})

export default mainRouter;
