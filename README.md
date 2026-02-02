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
Connect your AI Agent (e.g., Gemini CLI) to these MCP servers.
Once connected, you can give high-level commands like:

> "Create a 'Forgot Password' feature."

The agent will:
1.  **Plan:** Create Epic & Sub-issues in Linear.
2.  **Dev:** Create branches, write code, and self-review.
3.  **Report:** Ask for final approval before merging.

## 🔒 Security Note
- **`.env` files are git-ignored.** Never commit your API keys.
- **SSH Manager is Read-Only** by default to prevent accidental damage.

## 📜 License
MIT
