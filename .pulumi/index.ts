import * as pulumi from "@pulumi/pulumi";
import * as vercel from "@pulumiverse/vercel";
import * as fs from "fs";


const packageJson = JSON.parse(fs.readFileSync("../package.json", "utf-8"));

const packageName = packageJson.name;
const config = new pulumi.Config();

// const vercelToken = config.requireSecret("apiToken")
const vercelTeam = config.requireSecret("team")
const branchName = config.get("branchName") || process.env.GITHUB_REF_NAME || "main";

const project = new vercel.Project(packageName, {
  name: packageName,
  buildCommand: "bun run build",
  installCommand: "bun install",
  framework: "nextjs",
  rootDirectory: undefined,
  gitRepository: {
    repo: "rek3000/n8n-demo-vercel",
    type: "github"
  },
  environments: [],
}, { ignoreChanges: ["name"] });

const deployment = new vercel.Deployment(packageName, {
  projectId: project.id,
  production: true,
  teamId: vercelTeam,
  ref: branchName,
});

export const deploymentUrl = deployment.url;
