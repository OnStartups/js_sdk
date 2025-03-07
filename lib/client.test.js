"use strict";

const axios = require('axios');
const AgentAiClient = require('./client');

// Mock axios
jest.mock('axios');
describe('AgentAiClient', () => {
  const API_KEY = 'test-api-key';
  let client;
  beforeEach(() => {
    client = new AgentAiClient(API_KEY);
    jest.clearAllMocks();

    // Setup default mocked axios create implementation
    axios.create.mockReturnValue(axios);
  });
  describe('constructor', () => {
    it('should initialize with default options', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api-lr.agent.ai/v1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
    });
    it('should initialize with custom options', () => {
      const customClient = new AgentAiClient(API_KEY, {
        baseUrl: 'https://custom-url.com',
        timeout: 60000,
        headers: {
          'X-Custom-Header': 'value'
        }
      });
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom-url.com',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
          'X-Custom-Header': 'value'
        },
        timeout: 60000
      });
    });
  });
  describe('action', () => {
    it('should successfully call an action and return formatted response', async () => {
      const mockResponse = {
        status: 200,
        data: {
          response: 'test result',
          metadata: {
            test: 'metadata'
          }
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);
      const result = await client.action('grabWebText', {
        url: 'https://example.com'
      });
      expect(axios.post).toHaveBeenCalledWith('/action/grab_web_text', {
        url: 'https://example.com'
      });
      expect(result).toEqual({
        status: 200,
        error: null,
        results: 'test result',
        metadata: {
          test: 'metadata'
        }
      });
    });
    it('should handle errors from the API', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            error: 'Bad Request'
          }
        }
      };
      axios.post.mockRejectedValueOnce(mockError);
      const result = await client.action('grabWebText', {
        url: 'https://example.com'
      });
      expect(result).toEqual({
        status: 400,
        error: 'Bad Request',
        results: null,
        metadata: null
      });
    });
    it('should handle non-API errors', async () => {
      const mockError = new Error('Network Error');
      axios.post.mockRejectedValueOnce(mockError);
      const result = await client.action('grabWebText', {
        url: 'https://example.com'
      });
      expect(result).toEqual({
        status: 500,
        error: 'Network Error',
        results: null,
        metadata: null
      });
    });
    it('should reject invalid action IDs', async () => {
      const result = await client.action('invalidAction', {});
      expect(result).toEqual({
        status: 400,
        error: 'Invalid action_id: invalidAction',
        results: null,
        metadata: null
      });
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
  describe('chat', () => {
    it('should call invokeLlm with the prompt and default model', async () => {
      const mockResponse = {
        status: 200,
        data: {
          response: 'AI response',
          metadata: null
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);
      const result = await client.chat('What is AI?');
      expect(axios.post).toHaveBeenCalledWith('/action/invoke_llm', {
        instructions: 'What is AI?',
        llm_engine: 'gpt4o'
      });
      expect(result).toEqual({
        status: 200,
        error: null,
        results: 'AI response',
        metadata: null
      });
    });
    it('should call invokeLlm with custom model and options', async () => {
      const mockResponse = {
        status: 200,
        data: {
          response: 'AI response',
          metadata: null
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);
      const result = await client.chat('What is AI?', {
        model: 'claude3opus',
        max_tokens: 500
      });
      expect(axios.post).toHaveBeenCalledWith('/action/invoke_llm', {
        instructions: 'What is AI?',
        llm_engine: 'claude3opus',
        max_tokens: 500
      });
      expect(result).toEqual({
        status: 200,
        error: null,
        results: 'AI response',
        metadata: null
      });
    });
  });
});