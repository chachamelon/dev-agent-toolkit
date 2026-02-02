#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { LinearClient } from "@linear/sdk";

// Initialize Linear Client
// User must provide LINEAR_API_KEY in environment variables
const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

const server = new Server(
  {
    name: "linear-manager",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_teams",
        description: "List all teams in the Linear workspace to get Team IDs",
        inputSchema: zodSchemaToToolSchema(z.object({})),
      },
      {
        name: "create_issue",
        description: "Create a new issue in Linear (supports Sub-issues via parentId)",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            teamId: z.string().describe("The ID of the team to assign the issue to"),
            title: z.string().describe("The title of the issue"),
            description: z.string().optional().describe("Markdown description of the issue"),
            priority: z.number().optional().describe("Priority (0: No Priority, 1: Urgent, 2: High, 3: Medium, 4: Low)"),
            parentId: z.string().optional().describe("The ID of the parent issue to create this as a sub-issue"),
          })
        ),
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!process.env.LINEAR_API_KEY) {
    return {
      content: [
        {
          type: "text",
          text: "Error: LINEAR_API_KEY environment variable is not set.",
        },
      ],
      isError: true,
    };
  }

  try {
    if (name === "list_teams") {
      const teams = await linearClient.teams();
      const teamList = teams.nodes.map(t => `[${t.name}] ID: ${t.id}`).join("\n");
      
      return {
        content: [
          {
            type: "text",
            text: teamList || "No teams found.",
          },
        ],
      };
    }

    if (name === "create_issue") {
      const issuePayload = await linearClient.createIssue({
        teamId: args.teamId,
        title: args.title,
        description: args.description,
        priority: args.priority,
        parentId: args.parentId, 
      });

      const issue = await issuePayload.issue;
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully created issue ${issue.identifier}\nURL: ${issue.url}\nTitle: ${issue.title}\nID: ${issue.id}`,
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
          text: `Error executing ${name}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Helper to convert Zod schema to Tool input schema
function zodSchemaToToolSchema(zodObj) {
  const schema = {
    type: "object",
    properties: {},
  };
  
  for (const [key, value] of Object.entries(zodObj.shape)) {
    schema.properties[key] = {
        type: value instanceof z.ZodString ? "string" : "number", 
        description: value.description,
    };
  }
  
  return schema;
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Linear Manager MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});