// Example showing more advanced usage patterns for the AgentAiClient

const { AgentAiClient } = require('agentai');

// Replace with your actual Bearer token
const BEARER_TOKEN = process.env.AGENT_API_KEY || 'YOUR_BEARER_TOKEN_HERE';

// Initialize with custom configuration
const client = new AgentAiClient(BEARER_TOKEN, {
  timeout: 60000, // 60 seconds timeout
  headers: {
    'X-Custom-Header': 'CustomValue' // Additional headers if needed
  }
});

// Helper function to wrap API calls with error handling
async function performAction(actionId, params) {
  try {
    const response = await client.action(actionId, params);
    
    if (response.status === 200) {
      return {
        success: true,
        data: response.results,
        metadata: response.metadata
      };
    }
    
    return {
      success: false,
      error: response.error,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: null
    };
  }
}

// Example: Chain multiple actions together
async function getNewsAndAnalyze(topic, location = 'US', days = '7d') {
  // First, get news on the topic
  console.log(`Fetching news about "${topic}" in ${location} from the last ${days}...`);
  const newsResult = await performAction('getGoogleNews', {
    query: topic,
    date_range: days,
    location
  });
  
  if (!newsResult.success) {
    console.error(`Failed to get news: ${newsResult.error}`);
    return;
  }
  
  console.log(`Found ${newsResult.data.length} news articles.`);
  
  // Extract titles for analysis
  const titles = newsResult.data.map(article => article.title).join('\n');
  
  // Now analyze the news titles with an LLM
  console.log('\nAnalyzing news headlines...');
  const prompt = `I've collected these news headlines about ${topic}:\n\n${titles}\n\nPlease provide a brief analysis of the current trends and sentiment around this topic based on these headlines.`;
  
  const analysisResult = await performAction('invokeLlm', {
    instructions: prompt,
    llm_engine: 'gpt4o'
  });
  
  if (!analysisResult.success) {
    console.error(`Failed to analyze headlines: ${analysisResult.error}`);
    return;
  }
  
  console.log('\n--- Analysis Results ---');
  console.log(analysisResult.data);
  console.log('------------------------');
  
  return {
    articles: newsResult.data,
    analysis: analysisResult.data
  };
}

// Example: Batch multiple web requests
async function batchFetchWebsites(urls) {
  console.log(`Fetching content from ${urls.length} websites...`);
  
  // Process URLs in parallel with Promise.all
  const results = await Promise.all(
    urls.map(url => 
      performAction('grabWebText', { url })
        .then(result => ({
          url,
          success: result.success,
          content: result.success ? result.data : null,
          error: result.success ? null : result.error
        }))
    )
  );
  
  // Count successes and failures
  const successful = results.filter(r => r.success).length;
  console.log(`Successfully fetched ${successful} of ${urls.length} websites.`);
  
  return results;
}

// Run examples
async function runExamples() {
  try {
    // Example 1: News analysis
    await getNewsAndAnalyze('artificial intelligence', 'New York', '7d');
    
    console.log('\n' + '-'.repeat(50) + '\n');
    
    // Example 2: Batch web fetching
    const websites = [
      'https://agent.ai',
      'https://openai.com',
      'https://anthropic.com',
      'https://huggingface.co'
    ];
    
    await batchFetchWebsites(websites);
    
  } catch (error) {
    console.error('Example execution failed:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runExamples().then(() => {
    console.log('\nAll examples completed!');
  });
}

// Export functions for reuse
module.exports = {
  getNewsAndAnalyze,
  batchFetchWebsites
};