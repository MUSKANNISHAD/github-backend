import express from "express";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import initRepo from "./Controller/init.js";
import addRepo from "./Controller/add.js";
import pullRepo from "./Controller/pull.js";
import pushRepo from "./Controller/push.js";
import commitRepo from "./Controller/commit.js";
import revertRepo from "./Controller/revert.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mainRouter from "./routes/mainRoutes.js";


dotenv.config();

yargs(hideBin(process.argv))
    .command(
        "start",
        "start a new Server",
        {},
        startServer)
    .command(
        "init",
        "Initialise a new Repo",
        {},
        initRepo)
    .command("add <file>",
        "file added to the Repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "file is to add to a Staging Area",
                type: "string"
            })
        },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command("commit <message>",
        "commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                describe: "commit message",
                type: "string"
            })
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
    .command("push", "push files to s3 ", {}, pushRepo)
    .command("pull", "pull  files from s3", {}, pullRepo)
    .command("revert <commitId>",
        "revert to the specific commit",
        (yargs) => {
            yargs.positional("commitId", {
                describe: "commit ID to revert to",
                type: "string"
            })
        },
        (argv) => {
            revertRepo(argv.commitId);
        }
    )

    .demand(1, "need atleast One Command")
    .help().argv;

async function startServer() {
    const app = express();
    const Port = process.env.PORT || 5000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongo_Url = process.env.MONGO_URL;

    await mongoose.connect(mongo_Url).then(() =>
        console.log("Connected to DB"))
        .catch((err) =>
            console.log(`connection failed because : ${err}`));

    app.use(cors({ origin: "*" }));

    app.use("/", mainRouter);

    let user = "muskanTest"
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID,
                console.log("=====");
            console.log("user :", user);
            console.log("=====");
            socket.join(userID);
        })
    });

    const db = mongoose.connection;
    db.once("open", async () => {
        console.log("Crud operation called")
    });

    httpServer.listen(Port, () => {
        console.log(`server is listening on PORT ${Port}`);
    });

}