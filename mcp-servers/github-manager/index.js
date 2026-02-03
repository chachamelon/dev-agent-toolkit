#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import "dotenv/config";

const execAsync = promisify(exec);

// Create server instance
const server = new Server(
  {
    name: "github-manager",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to run git commands
async function runGitCommand(command) {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr && !stderr.includes("Already on")) {
      // interactions like 'switched to a new branch' often go to stderr
      // console.error(`Git stderr: ${stderr}`); 
    }
    return stdout.trim();
  } catch (error) {
    throw new Error(`Git command failed: ${error.message}`);
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_branches",
        description: "List all local and remote branches in the current repository",
        inputSchema: zodSchemaToToolSchema(z.object({})),
      },
      {
        name: "create_branch",
        description: "Create a new branch and switch to it",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            branch_name: z.string().describe("The name of the new branch"),
            base_branch: z.string().optional().describe("Optional base branch to start from"),
          })
        ),
      },
      {
        name: "get_diff",
        description: "Get the git diff between two branches or commits",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            target: z.string().describe("The target branch/commit (e.g., main)"),
            source: z.string().describe("The source branch/commit (e.g., feature/login)"),
          })
        ),
      },
      {
        name: "git_push",
        description: "Push changes to a remote repository",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            branch: z.string().describe("The branch to push"),
            remote: z.string().default("origin").describe("The remote name (default: origin)"),
            token: z.string().optional().describe("GitHub Personal Access Token (defaults to GITHUB_TOKEN env var)"),
            repo_url: z.string().optional().describe("Full repository URL (defaults to GITHUB_REPO_URL env var)"),
          })
        ),
      },
      {
        name: "git_status",
        description: "Show the working tree status",
        inputSchema: zodSchemaToToolSchema(z.object({})),
      },
      {
        name: "git_add",
        description: "Add file contents to the index",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            files: z.array(z.string()).describe("List of files to add"),
          })
        ),
      },
      {
        name: "git_commit",
        description: "Record changes to the repository",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            message: z.string().describe("The commit message"),
          })
        ),
      },
      {
        name: "git_pull",
        description: "Fetch from and integrate with another repository or a local branch",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            branch: z.string().optional().describe("The branch to pull (default: current branch)"),
            remote: z.string().default("origin").describe("The remote name (default: origin)"),
          })
        ),
      },
      {
        name: "create_pr",
        description: "Create a Pull Request on GitHub",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            title: z.string().describe("The title of the PR"),
            body: z.string().describe("The body/description of the PR"),
            head: z.string().describe("The name of the branch where your changes are implemented"),
            base: z.string().default("main").describe("The name of the branch you want the changes pulled into"),
            token: z.string().optional().describe("GitHub Personal Access Token (defaults to GITHUB_TOKEN env var)"),
            repo_url: z.string().optional().describe("Full repository URL (defaults to GITHUB_REPO_URL env var)"),
          })
        ),
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "list_branches") {
      const output = await runGitCommand("git branch -a");
      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }

    if (name === "create_branch") {
      const branchName = args.branch_name;
      const baseBranch = args.base_branch;

      let command = `git checkout -b ${branchName}`;
      if (baseBranch) {
        command += ` ${baseBranch}`;
      }

      const output = await runGitCommand(command);
      return {
        content: [
          {
            type: "text",
            text: `Successfully created and switched to branch '${branchName}'\n${output}`,
          },
        ],
      };
    }

    if (name === "get_diff") {
      const output = await runGitCommand(`git diff ${args.target}...${args.source}`);
      return {
        content: [
          {
            type: "text",
            text: output || "No changes detected.",
          },
        ],
      };
    }

    if (name === "git_push") {
      const { branch, remote = "origin" } = args;

      // Prefer args, fallback to env vars
      const token = args.token || process.env.GITHUB_TOKEN;
      const repoUrl = args.repo_url || process.env.GITHUB_REPO_URL;

      let pushTarget = remote;

      // If credentials are provided (via args or env), construct the auth URL
      if (token && repoUrl) {
        try {
          const urlObj = new URL(repoUrl);
          urlObj.username = token;
          pushTarget = urlObj.toString();
        } catch (e) {
          throw new Error(`Invalid repo_url: ${e.message}`);
        }
      } else if (!token && !repoUrl) {
        // No explicit auth provided, rely on system git credentials
        // pushTarget remains 'origin' (or whatever remote was passed)
      } else {
        // Partial info might be ambiguous, but we'll try to proceed or warn?
        // For now, if one is missing, we might fail to form the auth URL correctly
        // but let's just proceed with what we have if it's not complete pair.
        // Actually, if we have a token but no URL, we can't inject it easily without knowing the host.
        // So we only inject if BOTH are present.
        if (token && !repoUrl) {
          // warning: have token but no URL to inject it into
        }
      }

      const output = await runGitCommand(`git push ${pushTarget} ${branch}`);
      return {
        content: [
          {
            type: "text",
            text: `Successfully pushed to ${remote}/${branch}\n${output}`,
          },
        ],
      };
    }

    if (name === "git_status") {
      const output = await runGitCommand("git status");
      return {
        content: [{ type: "text", text: output }],
      };
    }

    if (name === "git_add") {
      const { files } = args;
      // Join files with space, ensuring they are quoted if needed or just rely on simple paths for now.
      // Ideally should escape paths. For simplicity in this agent context, we assume clean paths.
      const fileList = files.join(" ");
      const output = await runGitCommand(`git add ${fileList}`);
      return {
        content: [{ type: "text", text: `Successfully added ${files.length} files.\n${output}` }],
      };
    }

    if (name === "git_commit") {
      const { message } = args;
      // Escape quotes in message? Simplistic approach:
      const safeMessage = message.replace(/"/g, '\\"');
      const output = await runGitCommand(`git commit -m "${safeMessage}"`);
      return {
        content: [{ type: "text", text: output }],
      };
    }

    if (name === "git_pull") {
      const { branch, remote = "origin" } = args;
      // If branch is omitted, git pull origin usually works for current branch if set upstream,
      // or we can try to detect current branch.
      // `git pull origin <branch>`
      let cmd = `git pull ${remote}`;
      if (branch) {
        cmd += ` ${branch}`;
      }
      const output = await runGitCommand(cmd);
      return {
        content: [{ type: "text", text: output }],
      };
    }

    if (name === "create_pr") {
      const { title, body, head, base, token: argToken, repo_url: argRepoUrl } = args;

      const token = argToken || process.env.GITHUB_TOKEN;
      const repoUrl = argRepoUrl || process.env.GITHUB_REPO_URL;

      if (!token) {
        throw new Error("GitHub Token is required for creating a PR. Set GITHUB_TOKEN env var or pass token argument.");
      }
      if (!repoUrl) {
        throw new Error("Repository URL is required for creating a PR. Set GITHUB_REPO_URL env var or pass repo_url argument.");
      }

      // Extract owner and repo from URL
      // Supports formats: https://github.com/owner/repo.git or https://github.com/owner/repo
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
      if (!match) {
        throw new Error("Could not parse 'owner' and 'repo' from the provided repository URL.");
      }
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, "");

      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "mcp-github-manager"
        },
        body: JSON.stringify({ title, body, head, base })
      });

      const respData = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to create PR: ${respData.message} (${JSON.stringify(respData.errors || [])})`);
      }

      return {
        content: [{ type: "text", text: `Successfully created Pull Request: ${respData.html_url}` }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Helper to convert Zod schema to Tool input schema (simplified)
function zodSchemaToToolSchema(zodObj) {
  // This is a simplified conversion for the example. 
  // In a real app, use zod-to-json-schema
  const schema = {
    type: "object",
    properties: {},
  };

  // Basic reflection for demonstration (Zod internals can be complex)
  // For production, install 'zod-to-json-schema'
  for (const [key, value] of Object.entries(zodObj.shape)) {
    schema.properties[key] = {
      type: "string", // Assuming string for this simple example
      description: value.description,
    };
  }

  return schema;
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
