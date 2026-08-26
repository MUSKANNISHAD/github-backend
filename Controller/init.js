import fs from "fs/promises";
import path from "path";

async function initRepo() {

    const repoPath = path.resolve(process.cwd(), ".gitDir");
    const commitsPath = path.join(repoPath, "commits");

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET })
        );
        console.log("Repository Initialised");
    } catch (err) {
        console.log("Erros is :", err);
    }


}

export default initRepo;