# Agent.ai JavaScript Library

[![npm version](https://img.shields.io/npm/v/agentai.svg)](https://www.npmjs.com/package/agentai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern JavaScript library for interacting with the [Agent.ai Actions API](https://agent.ai/actions).

## Installation

```bash
# Using npm
npm install agentai

# Using yarn
yarn add agentai

# Using pnpm
pnpm add agentai
```

## Example Usage

Before you can start using the library, you'll need to sign up for an account at [Agent.ai](https://agent.ai) and obtain a Bearer token from [https://agent.ai/user/settings#credits](https://agent.ai/user/settings#credits).

### JavaScript

```javascript
// Using CommonJS
const { AgentAiClient } = require('agentai');

// Create a client instance with your bearer token
const client = new AgentAiClient('YOUR_BEARER_TOKEN_HERE');

// Example: Grab web text
async function fetchWebText() {
  try {
    const webTextResponse = await client.action(
      'grabWebText',
      { url: 'https://agent.ai' }
    );

    if (webTextResponse.status === 200) {
      console.log("Web Text Response Status:", webTextResponse.status);
      console.log("First 100 chars of Response:", webTextResponse.results.substring(0, 100) + "...");
    } else {
      console.error(`Error: Status Code: ${webTextResponse.status}, Message: ${webTextResponse.error}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Example: Chat with an LLM
async function chatWithLlm() {
  try {
    const chatResponse = await client.chat(
      "What is an AI agent?", 
      { model: "gpt4o" }
    );

    if (chatResponse.status === 200) {
      console.log("Chat Response:", chatResponse.results);
    } else {
      console.error(`Error: ${chatResponse.error}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Example: Get Google News
async function getGoogleNews() {
  try {
    const googleNewsResponse = await client.action(
      'getGoogleNews',
      {
        query: "AI advancements",
        date_range: "7d",
        location: "Boston"
      }
    );

    if (googleNewsResponse.status === 200) {
      console.log("Google News Location:", googleNewsResponse.metadata.search_information.location_used);
      console.log("Number of articles:", googleNewsResponse.results.length);
    } else {
      console.error(`Error: ${googleNewsResponse.error}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the examples
fetchWebText();
chatWithLlm();
getGoogleNews();
```



## API Reference

### Creating a Client

```javascript
// Method 1: Using API key only
const client = new AgentAiClient('YOUR_API_KEY');

// Method 2: Using API key with config object
const client = new AgentAiClient('YOUR_API_KEY', {
  timeout: 60000, // Optional: custom timeout in ms
  baseUrl: 'https://custom-url.com', // Optional: custom base URL
  headers: {
    'X-Custom-Header': 'value' // Optional: additional headers
  }
});
```

### Methods

#### `client.action(actionId, params)`

Execute an AI action by its ID.

- `actionId` (string): The ID of the action to execute (e.g., 'grabWebText')
- `params` (object): Parameters for the action
- Returns: Promise<AgentResponse>

#### `client.chat(prompt, options)`

Use the invokeLlm action to generate text based on a prompt.

- `prompt` (string): The text prompt for the LLM
- `options` (object, optional):
  - `model` (string, default: 'gpt4o'): LLM model to use
  - Additional parameters for the invokeLlm action
- Returns: Promise<AgentResponse>

### Response Structure

All methods return a Promise that resolves to an object with the following structure:

```javascript
{
  status: 200,           // HTTP status code
  error: null,           // Error message (if any)
  results: {...},        // API response data (if successful)
  metadata: {...}        // Metadata from the API response (if available)
}
```

## Error Handling

All methods return Promises that may reject with errors. It's recommended to use try/catch blocks when calling these methods:

```javascript
try {
  const response = await client.action('grabWebText', { url: 'https://agent.ai' });
  if (response.status !== 200) {
    console.error(`API Error: ${response.error}`);
  }
} catch (error) {
  console.error('Network or client error:', error);
}
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for feature requests or bug reports.

## License

This project is licensed under the MIT License.