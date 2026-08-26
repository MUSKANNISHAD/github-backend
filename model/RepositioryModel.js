import mongoose from "mongoose";
import { Schema } from "mongoose";

const RepositorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: [
        {
            type: String
        }
    ],
    visibility: {
        type: Boolean
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    issue:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Issues"
            }
        ]
})

const RepoModel = mongoose.model("Repository", RepositorySchema);
export default RepoModel;

