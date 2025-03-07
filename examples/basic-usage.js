// Example JavaScript file showing basic usage of the AgentAiClient

const { AgentAiClient } = require('agentai');

// Replace with your actual Bearer token
const BEARER_TOKEN = process.env.AGENT_API_KEY || 'YOUR_BEARER_TOKEN_HERE';

// Initialize the client
const client = new AgentAiClient(BEARER_TOKEN);