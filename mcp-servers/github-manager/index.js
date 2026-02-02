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
