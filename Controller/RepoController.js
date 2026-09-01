import mongoose from "mongoose";
import RepoModel from "../model/RepositioryModel.js";
import IssueModel from "../model/issueModel.js";
import User from "../model/usermodel.js";

export const CreateRepository = async (req, res) => {
    const { name, description, content, visibility, owner, issue } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Repository name is Required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "user not found" });
        }

        const newUser = new RepoModel({
            name,
            description,
            content,
            visibility,
            owner,
            issue
        })

        const result = await newUser.save();
        return res.status(201).json({ message: "Repository has created", repositoryId: result._id });

    } catch (err) {
        console.log("err", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const getAllRepository = async (req, res) => {
    try {
        const allRepo = await RepoModel
            .find({})
            .populate("owner", "-password -token")
            .populate("issue");

        return res.status(200).json({
            message: "all Repo fetched",
            allRepo
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server err",
            err
        });
    }
};

export const FetchRepositoryById = async (req, res) => {
    const { id } = req.params;
    try {

        const Repository = await RepoModel.find({ owner: id }).populate("owner").populate("issue");

        return res.status(200).json({ message: `fetched all repositor of id ${id}`, Repository });

    } catch (err) {
        console.error("error is : ", err.message);
        return res.status(500).json({ message: "Internal server err", err })
    }

};

export const FetchRepositoryByName = async (req, res) => {
    const { name } = req.params;
    try {
        const fetchedRepo = await RepoModel.findOne({ name }).populate("owner").populate("issue");

        return res.status(200).json({ message: `fetched all repositor of name ${name}`, fetchedRepo });

    } catch (err) {
        console.error("error is : ", err.message);
        return res.status(500).json({ message: "Internal server err", err })
    }
};

export const FetchAllRepositoryForCurrentUser = async (req, res) => {
    const { id } = req.params;
    try {
        const fetchedRepository = await RepoModel.find({ owner: id }).populate("owner").populate("issue");

        if (!fetchedRepository || fetchedRepository.length == 0) {
            return res.status(400).json({ message: "you don't have any Repository yet" });
        }

        return res.status(200).json({ fetchedRepository });

    } catch (err) {
        console.error("error is : ", err.message);
        return res.status(500).json({ message: "Internal server err", err })
    }

};

export const updateRepositoryById = async (req, res) => {
    const { id } = req.params;
    const { content, description } = req.body;
    try {
        const repository = await RepoModel.findById({ _id: id });
        if (!repository) {
            return res.status(404).json({ message: "repository not found" });
        }

        repository.content = content;
        repository.description = description;

        const updatedRepository = await repository.save();

        return res.status(200).json({ message: "repository updated :", updatedRepository });

    } catch (err) {
        console.error("Error during updating repository : ", err.message);
        res.status(500).send("Server error");
    }

};

export const deleteRepositioryById = async (req, res) => {
    const { id } = req.params;
    try {

        const repo = await RepoModel.findByIdAndDelete({ _id: id });
        if (!repo) {
            return res.status(404).json({ message: "repository not found" });
        }

        return res.json({ message: "Repository deleted" })
    } catch (err) {
        console.error("Error during updating repository : ", err.message);
        res.status(500).send("Server error");
    }
};

export const toggleRepo = async (req, res) => {
    const { id } = req.params;
    try {
        const repository = await RepoModel.findById({ _id: id });
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }
        repository.visibility = !repository.visibility;
        const toggledvisibility = await repository.save();

        return res.json({ message: "Repository has been toggled", toggledvisibility });

    } catch (err) {
        console.error("Error during updating repository : ", err.message);
        res.status(500).send("Server error");
    };
}