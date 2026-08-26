import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    repository: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "Repository"
        }
    ],
    following: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "User"

        }
    ],
    staredRepository: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "Repository"
        }
    ],
    token: {
        type: String,
        default: ''
    }
})

const User = mongoose.model("User", userSchema);

export default User;
