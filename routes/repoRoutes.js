import { Router } from "express";

import { toggleRepo, CreateRepository, getAllRepository, FetchRepositoryById, FetchRepositoryByName } from "../Controller/RepoController.js"
import { FetchAllRepositoryForCurrentUser, updateRepositoryById, deleteRepositioryById } from "../Controller/RepoController.js"

const router = Router();


router.route("/repo/CreateRepo").post(CreateRepository)
router.route("/repo/getAllRepository").get(getAllRepository)
router.route("/repo/FetchRepositoryById/:id").get(FetchRepositoryById)
router.route("/repo/FetchRepoByName/:name").get(FetchRepositoryByName)
router.route("/repo/fetchAllrepoForCurrentUser/:id").get(FetchAllRepositoryForCurrentUser)
router.route("/repo/updateRepoById/:id").put(updateRepositoryById)
router.route("/repo/deleteRepoById/:id").delete(deleteRepositioryById);
router.route("repo/toggel/:id").patch(toggleRepo);

export default router;
