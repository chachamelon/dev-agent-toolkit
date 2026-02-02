# Dev Agent Toolkit 🤖🛠️

**Turn your AI into a Senior Developer.**
A collection of **MCP Servers (Tools)** and **Workflow Skills (Knowledge)** designed to empower AI agents to perform autonomous software engineering tasks—from planning and coding to reviewing and debugging.

## 📂 Project Structure

### 🧠 Skills (`/skills/workflow/`)
Defines the "Brain" of the agent. These markdown files instruct the AI on *how* to work.

- **`planning.md`**: How to decompose tasks, create Linear issues, and get user approval.
- **`development.md`**: Epic Branch strategy, coding conventions, and self-review with `get_diff`.
- **`review.md`**: Pre-review checklists (Test, Lint, Docs) and PR guidelines.
- **`troubleshooting.md`**: Protocols for handling merge conflicts, test failures, and errors.
- **`context-aware.md`**: Instructions to scan project context (Stack, Style, CI/CD) before working.

### 🛠️ MCP Servers (`/mcp-servers/`)
Defines the "Hands" of the agent. Node.js-based Model Context Protocol servers.

- **`linear-manager`**:
  - Manage Linear Issues (Create, Update, List).
  - Auto-assign to user & Auto-labeling.
  - Env: `LINEAR_API_KEY`, `LINEAR_DEFAULT_TEAM_ID`
- **`github-manager`**:
  - Manage Local Git (Branch, Checkout, Diff).
  - No API Key required (uses local git config).
- **`ssh-manager`**:
  - Read-only Remote Server Debugging.
  - Safe commands (`docker logs`, `tail`, `ls`) only.
  - Env: `SSH_HOST`, `SSH_KEY_PATH`, etc.

## 🔄 Workflow Diagram

```mermaid
graph TD
    User([User]) -->|1. Request Feature| AI[AI Agent]

    subgraph "Phase 1: Planning (Brain)"
        AI -->|2. Scan Context & Team| Context{Context}
        AI -->|3. Create Epic & Sub-issues| Linear[Linear]
        Linear -->|4. Plan Created| AI
        AI -->|5. ✋ Request Approval| User
    end

    subgraph "Phase 2: Development (Hands)"
        User -->|6. Approve| AI
        AI -->|7. Create Epic Branch| Git[Git / Local]
        
        subgraph "Dev Cycle (Repeat for Sub-tasks)"
            Git -.->|8. Create Task Branch| Code[Coding]
            Code -->|9. Agent Self-Review (get_diff)| Code
            Code -->|10. Merge to Epic Branch| Git
        end
    end

    subgraph "Phase 3: Review & Close"
        Git -->|11. Run Tests & Report| AI
        AI -->|12. ✋ Request Final Review| User
        User -->|13. Approve Merge| AI
        AI -->|14. Merge to Main| Git
        AI -->|15. Update Status: Done| Linear
    end
```

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies for each server.

```bash
# Install Linear Manager
cd mcp-servers/linear-manager
npm install
cp .env.example .env # Add your API Key

# Install GitHub Manager
cd ../github-manager
npm install

# Install SSH Manager (Optional)
cd ../ssh-manager
npm install
cp .env.example .env # Add your Server Info
```

### 2. Usage
Connect your AI Agent (e.g., Gemini CLI, Claude Desktop) to these MCP servers.
Once connected, you can give high-level commands like:

> "Create a 'Forgot Password' feature."

The agent will:
1.  **Plan:** Create Epic & Sub-issues in Linear.
2.  **Dev:** Create branches, write code, and self-review.
3.  **Report:** Ask for final approval before merging.

## 🐳 Docker Support

You can run all MCP servers using Docker Compose for a clean, isolated environment.

1.  **Configure Environments:** Ensure all `.env` files in `mcp-servers/*` are set up.
2.  **Run Containers:**
    ```bash
    docker-compose up -d --build
    ```
3.  **Connect Agent:**
    Configure your AI client to connect via `docker exec`.
    Example (Claude Desktop Config):
    ```json
    "mcpServers": {
      "linear": {
        "command": "docker",
        "args": ["exec", "-i", "skills-linear-manager-1", "node", "mcp-servers/linear-manager/index.js"]
      }
    }
    ```

## ♊ Integration with Gemini CLI

To use these tools and skills directly with the **Gemini CLI**, you need to register them in your Gemini config file.

1.  **Open Config:**
    Run `gemini config edit` in your terminal to open the configuration file.

2.  **Add MCP Servers:**
    Add the following to your `mcpServers` section:
    ```json
    "mcpServers": {
      "linear": {
        "command": "node",
        "args": ["/path/to/dev-agent-toolkit/mcp-servers/linear-manager/index.js"]
      },
      "github": {
        "command": "node",
        "args": ["/path/to/dev-agent-toolkit/mcp-servers/github-manager/index.js"]
      },
      "ssh": {
        "command": "node",
        "args": ["/path/to/dev-agent-toolkit/mcp-servers/ssh-manager/index.js"]
      }
    }
    ```

3.  **Add Skills:**
    Register the skills directory so the agent can load your workflow rules:
    ```json
    "skillPaths": [
      "/path/to/dev-agent-toolkit/skills/workflow"
    ]
  }
    ```

## 🔌 Integration Guide (How to use in other projects)

### Option 1: Path Reference (Recommended)
Simply point your AI Agent configuration to this toolkit's path while working on any project.
- **MCP Config:** Add absolute paths to the `index.js` files of this toolkit.
- **Context:** Instruct the AI to "Read skills from `/path/to/dev-agent-toolkit/skills`".

### Option 2: Git Submodule (Embedded)
Embed this toolkit directly into your new project.

```bash
cd my-new-project
git submodule add https://github.com/your-username/dev-agent-toolkit.git .ai-tools
```
Then, tell the AI: *"My workflow rules are in `.ai-tools/skills`."*

## 🔒 Security Note
- **`.env` files are git-ignored.** Never commit your API keys.
- **SSH Manager is Read-Only** by default to prevent accidental damage.

## 📜 License
MIT