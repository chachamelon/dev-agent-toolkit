#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file in the same directory
dotenv.config({ path: path.join(__dirname, ".env") });

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
        name: "get_viewer",
        description: "Get information about the authenticated user (Me)",
        inputSchema: zodSchemaToToolSchema(z.object({})),
      },
      {
        name: "get_labels",
        description: "List all labels for a team to get Label IDs",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            teamId: z.string().optional().describe("The ID of the team (optional if LINEAR_DEFAULT_TEAM_ID is set)"),
          })
        ),
      },
      {
        name: "create_issue",
        description: "Create a new issue in Linear (supports Sub-issues via parentId)",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            teamId: z.string().optional().describe("The ID of the team (optional if LINEAR_DEFAULT_TEAM_ID is set)"),
            title: z.string().describe("The title of the issue"),
            description: z.string().optional().describe("Markdown description of the issue"),
            priority: z.number().optional().describe("Priority (0: No Priority, 1: Urgent, 2: High, 3: Medium, 4: Low)"),
            parentId: z.string().optional().describe("The ID of the parent issue to create this as a sub-issue"),
            assigneeId: z.string().optional().describe("The ID of the user to assign the issue to"),
            labelIds: z.array(z.string()).optional().describe("Array of Label IDs to attach to the issue"),
          })
        ),
      },
      {
        name: "get_states",
        description: "List all workflow states (e.g., Todo, In Progress, Done) for a team to get State IDs",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            teamId: z.string().optional().describe("The ID of the team (optional if LINEAR_DEFAULT_TEAM_ID is set)"),
          })
        ),
      },
      {
        name: "update_issue",
        description: "Update an existing issue (e.g., change status, assignee)",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            issueId: z.string().describe("The ID or Key of the issue to update (e.g., PRO-123 or uuid)"),
            stateId: z.string().optional().describe("The ID of the new state (use get_states to find this)"),
            assigneeId: z.string().optional().describe("The ID of the user to assign"),
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

    if (name === "get_viewer") {
      const viewer = await linearClient.viewer;
      return {
        content: [
          {
            type: "text",
            text: `[User] ${viewer.name} (ID: ${viewer.id}, Email: ${viewer.email})`,
          },
        ],
      };
    }

    if (name === "get_labels") {
      const teamId = args.teamId || process.env.LINEAR_DEFAULT_TEAM_ID;
      if (!teamId) throw new Error("teamId is required.");

      const team = await linearClient.team(teamId);
      const labels = await team.labels();
      const labelList = labels.nodes.map(l => `[${l.name}] ID: ${l.id}`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: labelList || "No labels found.",
          },
        ],
      };
    }

    if (name === "create_issue") {
      const teamId = args.teamId || process.env.LINEAR_DEFAULT_TEAM_ID;

      if (!teamId) {
        throw new Error("teamId is required. Please provide it as an argument or set LINEAR_DEFAULT_TEAM_ID in .env");
      }

      const issuePayload = await linearClient.createIssue({
        teamId: teamId,
        title: args.title,
        description: args.description,
        priority: args.priority,
        parentId: args.parentId,
        assigneeId: args.assigneeId,
        labelIds: args.labelIds,
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

    if (name === "get_states") {
      const teamId = args.teamId || process.env.LINEAR_DEFAULT_TEAM_ID;
      if (!teamId) throw new Error("teamId is required.");

      const team = await linearClient.team(teamId);
      const states = await team.states();
      const stateList = states.nodes.map(s => `[${s.name}] ID: ${s.id} (Type: ${s.type})`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: stateList || "No states found.",
          },
        ],
      };
    }

    if (name === "update_issue") {
      const issue = await linearClient.issue(args.issueId);
      const updatePayload = await issue.update({
        stateId: args.stateId,
        assigneeId: args.assigneeId
      });

      const success = await updatePayload.success;

      return {
        content: [
          {
            type: "text",
            text: success ? `Successfully updated issue ${args.issueId}` : `Failed to update issue ${args.issueId}`,
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
    let type = "string";
    if (value instanceof z.ZodNumber) type = "number";
    if (value instanceof z.ZodArray) type = "array";

    schema.properties[key] = {
      type: type,
      description: value.description,
    };

    if (type === "array") {
      schema.properties[key].items = { type: "string" };
    }
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