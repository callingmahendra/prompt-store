// Simple debug script to test the extension
const axios = require('axios');

async function testAPI() {
    try {
        console.log('Testing API connection...');
        const response = await axios.get('http://localhost:3000/api/prompts');
        console.log('✅ API is working!');
        console.log(`Found ${response.data.prompts?.length || response.data.length} prompts`);
        
        if (response.data.prompts && response.data.prompts.length > 0) {
            console.log('Sample prompt:', response.data.prompts[0].title);
        }
    } catch (error) {
        console.error('❌ API Error:', error.message);
        console.log('Make sure the backend server is running: npm run dev');
    }
}

testAPI();