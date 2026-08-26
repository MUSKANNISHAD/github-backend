import fs from "fs/promises";
import path from "path";

async function addRepo(filePath) {
    const repoPath = path.resolve(process.cwd(), ".gitDir");
    const stagingPath = path.join(repoPath, "staging");


    try {
        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath, fileName));

        console.log(`file ${fileName} has added to stagged area`);
    } catch (err) {
        console.log(`error is : ${err}`);
    }


}

export default addRepo;