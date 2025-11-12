const fs = require('fs');
const path = require('path');
const IflytekServiceClass = require('./services/newIflytekService');

async function testWithFile() {
    try {
        console.log('Testing iFlytek service with actual audio file...');
        
        // Read the provided WebM file
        const filePath = path.join(__dirname, '../ex.webm');
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            process.exit(1);
        }
        
        const audioBuffer = fs.readFileSync(filePath);
        console.log(`Audio file loaded, size: ${audioBuffer.length} bytes`);
        
        // Create instance of the service
        const iflytekService = new IflytekServiceClass();
        
        // Test the speechToText method
        console.log('Calling speechToText method...');
        const result = await iflytekService.speechToText(audioBuffer);
        console.log('Voice recognition result:', result);
        
    } catch (error) {
        console.error('Error testing with file:', error);
        process.exit(1);
    }
}

testWithFile();