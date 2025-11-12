const fs = require('fs');
const { convertToWav, extractRawPCMFromWav } = require('./services/audioConverter');

// Test audio conversion functions
async function testAudioConversion() {
  try {
    console.log('Testing audio conversion functions...');
    
    // Read a test audio file if it exists
    if (fs.existsSync('test-audio.webm')) {
      console.log('Found test-audio.webm, testing conversion...');
      const webmBuffer = fs.readFileSync('test-audio.webm');
      console.log('WebM buffer size:', webmBuffer.length);
      
      // Try to convert to WAV
      try {
        const wavBuffer = convertToWav(webmBuffer);
        console.log('Converted to WAV, buffer size:', wavBuffer.length);
        fs.writeFileSync('test-output.wav', wavBuffer);
        console.log('WAV file saved as test-output.wav');
      } catch (error) {
        console.error('Error converting to WAV:', error.message);
      }
    } else {
      console.log('No test-audio.webm found, creating a simple test...');
      
      // Create a simple test buffer
      const testBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      console.log('Test buffer size:', testBuffer.length);
      
      try {
        const wavBuffer = convertToWav(testBuffer);
        console.log('Converted to WAV, buffer size:', wavBuffer.length);
        fs.writeFileSync('test-output.wav', wavBuffer);
        console.log('WAV file saved as test-output.wav');
      } catch (error) {
        console.error('Error converting to WAV:', error.message);
      }
    }
    
    console.log('Test completed.');
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAudioConversion();