import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const postsDirectory = path.resolve(__dirname);

const main = async () => {
    const fileNames = fs.readdirSync(postsDirectory);
    let res = {};
    const allPostsData = fileNames
        .filter((it) => it.endsWith(".mdx"))
        .map((fileName) => {
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            const matterResult = matter(fileContents, {
                engines: {
                    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
                },
            });
            res[fileName] =  matterResult.data;
        });

            console.log(res);
};

(async () => {
    await main();
})().catch(console.error);
