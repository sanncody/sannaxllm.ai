// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const indexName = pc.Index('sannaxllm-ai');

const createMemory = async ({ vectors, metadata, messageId }) => {
    // Implementation of LTM
    await indexName.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])
};

const queryMemory = async ({ queryVector, limit = 5, metadata }) => {
    const data = await indexName.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    });

    return data.matches;
};

module.exports = { createMemory, queryMemory };