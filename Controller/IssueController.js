import mongoose from "mongoose";
import IssueModel from "../model/issueModel.js";

export const createIssue = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    try {
        const Issue = new IssueModel({
            title,
            description,
            repository: id
        })

        const issue = await Issue.save();

        return res.json({ message: "Issue created" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", message: err.message });
    }
}

export const updateIssueById = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const issue = await IssueModel.findById({ id });
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }
        issue.title = title;
        issue.description = description;
        issue.status = status;

        const result = await issue.save();

        return res.status(200).json({ message: "Issue has been Updated", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", message: err.message });
    }

}

export const deleteIssueById = async (req, res) => {
    const { id } = req.params;
    try {
        const issue = await IssueModel.findByIdAndDelete(id);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.json({ message: "Issue deleted" })

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", message: err.message });
    }
}

export const getAllIssues = async (req, res) => {
    try {
        const allIssue = await IssueModel({});

        res.json({ allIssue });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", message: err.message });
    }
}

export const getIssueById = async (req, res) => {

    const { id } = req.params;

    try {
        const getIssue = await IssueModel.findById(id);
        if (!getIssue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        return res.status(200).json({ message: "Issue fetched", getIssue });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", message: err.message });
    }
}