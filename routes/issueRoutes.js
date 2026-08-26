import { Router } from "express";
import { createIssue, deleteIssueById, updateIssueById, getAllIssues, getIssueById } from "../Controller/IssueController.js"

const router = Router();

router.route("/Issue/Create").post(createIssue);
router.route("/Issue/updateIssueById").post(updateIssueById);
router.route("/Issue/deleteIssueById").delete(deleteIssueById);
router.route("/Issue.FetchAllIssue").get(getAllIssues);
router.route("/Issue/:id").get(getIssueById);

export default router;