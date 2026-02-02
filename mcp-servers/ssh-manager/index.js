#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { Client } from "ssh2";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Allowed Commands Whitelist (Read-Only)
const ALLOWED_COMMANDS = [
  "ls", "dir", 
  "cat", "head", "tail", "grep", 
  "pwd", "whoami", "date", "uptime", "free", "df",
  "docker ps", "docker logs", "docker inspect", "docker images",
  "git status", "git log", "git diff"
];

// Dangerous patterns to block even if command is allowed
const BLOCKED_PATTERNS = [
  ">", ">>", "|", // Redirection/Piping (Potential write risk)
  ";", "&&",      // Chaining (Could hide malicious commands)
  "rm ", "mv ", "cp ", "kill ", "sudo ", "nano ", "vim "
];

const server = new Server(
  {
    name: "ssh-manager",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper to validate command
function validateCommand(cmd) {
  const baseCmd = cmd.trim().split(" ")[0];
  
  // 1. Check if base command is allowed
  const isAllowed = ALLOWED_COMMANDS.some(allowed => 
    cmd.startsWith(allowed) // Simple check, can be improved with regex
  );

  if (!isAllowed) {
    return { valid: false, reason: `Command '${baseCmd}' is not in the allowed whitelist.` };
  }

  // 2. Check for dangerous patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (cmd.includes(pattern)) {
      return { valid: false, reason: `Command contains blocked pattern: '${pattern}'` };
    }
  }

  return { valid: true };
}

// Helper to execute SSH command
function executeRemoteCommand(command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        
        let stdout = "";
        let stderr = "";

        stream.on('close', (code, signal) => {
          conn.end();
          resolve({ stdout, stderr, code });
        }).on('data', (data) => {
          stdout += data;
        }).stderr.on('data', (data) => {
          stderr += data;
        });
      });
    }).on('error', (err) => {
      reject(new Error(`SSH Connection Failed: ${err.message}`));
    }).connect({
      host: process.env.SSH_HOST,
      port: Number(process.env.SSH_PORT) || 22,
      username: process.env.SSH_USERNAME,
      privateKey: process.env.SSH_KEY_PATH ? fs.readFileSync(process.env.SSH_KEY_PATH) : undefined,
      password: process.env.SSH_PASSWORD // Fallback
    });
  });
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_command",
        description: "Execute a read-only command on the remote server",
        inputSchema: zodSchemaToToolSchema(
          z.object({
            command: z.string().describe("The command to execute (e.g., 'docker logs my-app')"),
          })
        ),
      },
      {
        name: "list_allowed_commands",
        description: "Show the list of allowed commands",
        inputSchema: zodSchemaToToolSchema(z.object({})),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_allowed_commands") {
    return {
      content: [{ type: "text", text: `Allowed:\n${ALLOWED_COMMANDS.join(", ")}\n\nBlocked Patterns:\n${BLOCKED_PATTERNS.join(", ")}` }]
    };
  }

  if (name === "run_command") {
    const validation = validateCommand(args.command);
    if (!validation.valid) {
      return {
        content: [{ type: "text", text: `❌ Security Block: ${validation.reason}` }],
        isError: true
      };
    }

    try {
      const result = await executeRemoteCommand(args.command);
      return {
        content: [{ 
          type: "text", 
          text: `Output:\n${result.stdout}\n\nErrors:\n${result.stderr || "(none)"}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `SSH Error: ${error.message}` }],
        isError: true
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Helper to convert Zod schema
function zodSchemaToToolSchema(zodObj) {
  const schema = { type: "object", properties: {} };
  for (const [key, value] of Object.entries(zodObj.shape)) {
    schema.properties[key] = { type: "string", description: value.description };
  }
  return schema;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SSH Manager (Read-Only) running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
