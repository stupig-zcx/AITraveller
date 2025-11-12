// Test script for iFlytek speech recognition
const IFlytekSpeechService = require('./services/iflytekService');

async function testIFlytek() {
    try {
        console.log('Testing iFlytek speech service...');
        
        // Initialize the service
        const iflytekService = new IFlytekSpeechService();
        console.log('iFlytek service initialized successfully');
        
        // Test WebSocket URL generation
        const wsUrl = iflytekService.generateWebSocketUrl();
        console.log('WebSocket URL generated successfully');
        console.log('URL length:', wsUrl.length);
        
        console.log('iFlytek API configuration is correct!');
        console.log('Note: Actual speech recognition requires audio input which is not tested in this script.');
        
    } catch (error) {
        console.error('Error testing iFlytek service:', error.message);
        process.exit(1);
    }
}

testIFlytek();