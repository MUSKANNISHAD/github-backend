import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../model/usermodel.js";

dotenv.config();

let client;

const uri = process.env.MONGO_URL;
async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}

export const signup = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await connectClient();
        const db = client.db("GitHub");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            userId: result.insertedId
        });
    } catch (err) {
        console.error("Error during signup : ", err.message);
        res.status(500).send("Server error");
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("GitHub");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("Server error!");
    }
}

export const getAllUsers = async (req, res) => {

    try {
        await connectClient();
        const db = client.db("GitHub");
        const usersCollection = db.collection("users");

        const allUsers = await usersCollection.find({}).toArray();
        res.json(allUsers);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", err });
    }
};

// export const getUserProfileById = async (req, res) => {
//     const currentId = req.params.id;
//     try {
//         await connectClient();
//         const db = client.db("GitHub");
//         const usersCollection = db.collection("users");

//         const user = await usersCollection.findOne({
//             _id: new ObjectId(currentId),
//         })

//         if (!user) {
//             return res.status(404).json({ message: "user not found" });
//         }

//         res.json(user, { message: "Profile fetched" });
//     } catch (err) {
//         return res.status(500).json({ message: "Internal server error", err });
//     }
// };


export const getUserProfileById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        res.json({ user, message: "Profile fetched" });


    } catch (err) {
        return res.status(500).json({ message: "Internal server err", err });
    }
}

export const updateUserProfileById = async (req, res) => {
    const currentID = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db("GitHub");
        const usersCollection = await db.collection("users");

        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentID) },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        res.json(result);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", err });
    }
};

export const DeleteProfileById = async (req, res) => {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db("GitHub");
        const usersCollection = await db.collection("users");

        const result = await usersCollection.deleteOne({
            _id: new ObjectId(currentID),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        res.json({
            message: "User profile has been deleted"
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", err });
    }
};
