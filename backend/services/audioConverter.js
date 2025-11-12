// Import wavefile correctly
const WaveFile = require('wavefile').WaveFile;

/**
 * Convert WebM audio data to PCM format
 * @param {Buffer} webmBuffer - The WebM audio data buffer
 * @returns {Promise<Buffer>} - Promise that resolves to PCM audio data buffer
 */
async function convertWebMToPCM(webmBuffer) {
  return new Promise((resolve, reject) => {
    try {
      // In a full implementation, we would use a library like ffmpeg to decode WebM to PCM
      // For now, we'll just return the buffer as is with a warning
      console.warn('WebM to PCM conversion is not fully implemented. Sending data as is.');
      resolve(webmBuffer);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Convert audio buffer to WAV format with proper headers
 * @param {Buffer} audioBuffer - The raw audio data buffer
 * @param {number} sampleRate - Sample rate in Hz (default: 16000)
 * @param {number} bitDepth - Bit depth (default: 16)
 * @returns {Buffer} - WAV format audio buffer
 */
function convertToWav(audioBuffer, sampleRate = 16000, bitDepth = 16) {
  try {
    // Create a new WAV file
    const wav = new WaveFile();
    
    // Set the audio data with parameters
    wav.fromScratch(1, sampleRate, bitDepth, audioBuffer);
    
    // Return the WAV buffer
    return wav.toBuffer();
  } catch (error) {
    console.error('Error converting to WAV:', error);
    throw error;
  }
}

/**
 * Extract raw PCM data from WAV buffer
 * @param {Buffer} wavBuffer - The WAV format audio buffer
 * @returns {Buffer} - Raw PCM data buffer
 */
function extractRawPCMFromWav(wavBuffer) {
  try {
    const wav = new WaveFile(wavBuffer);
    // Get the raw PCM data
    const pcmData = wav.getSamples();
    
    // Convert Float32Array to Int16Array if needed
    let int16Array;
    if (pcmData instanceof Float32Array) {
      int16Array = new Int16Array(pcmData.length);
      for (let i = 0; i < pcmData.length; i++) {
        int16Array[i] = Math.max(-32768, Math.min(32767, Math.round(pcmData[i] * 32767)));
      }
    } else {
      int16Array = new Int16Array(pcmData);
    }
    
    // Convert to Buffer
    return Buffer.from(int16Array.buffer);
  } catch (error) {
    console.error('Error extracting PCM from WAV:', error);
    throw error;
  }
}

module.exports = {
  convertWebMToPCM,
  convertToWav,
  extractRawPCMFromWav
};