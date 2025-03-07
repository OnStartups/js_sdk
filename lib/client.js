"use strict";

const axios = require('axios');

/**
 * A JavaScript client for the Agent.ai Actions API (Action-Based Interface).
 */
class AgentAiClient {
  /**
   * Creates a new AgentAiClient instance.
   * 
   * @param {string} apiKey - Your Agent.ai API key or bearer token
   * @param {Object} [config={}] - Optional configuration options
   * @param {string} [config.baseUrl] - Custom base URL
   * @param {number} [config.timeout] - Request timeout in milliseconds
   * @param {Object} [config.headers] - Additional headers to include
   */
  constructor(apiKey) {
    let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.baseUrl = config.baseUrl || 'https://api-lr.agent.ai/v1';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(config.headers || {})
    };
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers,
      timeout: config.timeout || 30000
    });

    // Map of action IDs to their corresponding API endpoints
    this.ACTION_ENDPOINTS = {
      grabWebText: '/action/grab_web_text',
      grabWebScreenshot: '/action/grab_web_screenshot',
      getYoutubeTranscript: '/action/get_youtube_transcript',
      getYoutubeChannel: '/action/get_youtube_channel',
      getTwitterUsers: '/action/get_twitter_users',
      getGoogleNews: '/action/get_google_news',
      runYoutubeSearch: '/action/run_youtube_search',
      getSearchResults: '/action/get_search_results',
      getRecentTweets: '/action/get_recent_tweets',
      getLinkedinProfile: '/action/get_linkedin_profile',
      getLinkedinActivity: '/action/get_linkedin_activity',
      getCompanyObject: '/action/get_company_object',
      getBlueskyPosts: '/action/get_bluesky_posts',
      searchBlueskyPosts: '/action/search_bluesky_posts',
      getInstagramProfile: '/action/get_instagram_profile',
      getInstagramFollowers: '/action/get_instagram_followers',
      outputAudio: '/action/output_audio',
      invokeLlm: '/action/invoke_llm',
      generateImage: '/action/generate_image',
      storeVariableToDatabase: '/action/store_variable_to_database',
      getVariableFromDatabase: '/action/get_variable_from_database',
      invokeAgent: '/action/invoke_agent',
      restCall: '/action/rest_call',
      convertFile: '/action/convert_file',
      convertFileOptions: '/action/convert_file_options'
    };
  }

  /**
   * Handles API responses and returns a consistent object structure.
   * 
   * @param {Object} response - The axios response object
   * @returns {Object} A standardized response object
   * @private
   */
  _handleResponse(response) {
    var _response$data, _response$data2;
    return {
      status: response.status,
      error: null,
      results: ((_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.response) || null,
      metadata: ((_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.metadata) || null
    };
  }

  /**
   * Executes an AI action by its ID.
   * 
   * @param {string} actionId - The ID of the action to execute
   * @param {Object} params - Parameters for the action
   * @returns {Promise<Object>} A promise that resolves to the API response
   */
  async action(actionId, params) {
    const endpoint = this.ACTION_ENDPOINTS[actionId];
    if (!endpoint) {
      return {
        status: 400,
        error: `Invalid action_id: ${actionId}`,
        results: null,
        metadata: null
      };
    }
    try {
      const response = await this.axiosInstance.post(endpoint, params);
      return this._handleResponse(response);
    } catch (error) {
      if (error.response) {
        var _error$response$data;
        return {
          status: error.response.status,
          error: ((_error$response$data = error.response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.error) || error.message,
          results: null,
          metadata: null
        };
      }
      return {
        status: 500,
        error: error.message || 'Unknown error',
        results: null,
        metadata: null
      };
    }
  }

  /**
   * Use the invokeLlm action to generate text based on a prompt.
   * 
   * @param {string} prompt - The text prompt for the LLM
   * @param {Object} [options={}] - Additional options including model selection
   * @param {string} [options.model='gpt4o'] - LLM model to use
   * @returns {Promise<Object>} A promise that resolves to the API response
   */
  async chat(prompt) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const {
      model = 'gpt4o',
      ...otherOptions
    } = options;
    const params = {
      instructions: prompt,
      llm_engine: model,
      ...otherOptions
    };
    return this.action('invokeLlm', params);
  }
}
module.exports = AgentAiClient;