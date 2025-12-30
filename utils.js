/**
 * Retrieves the Pumble API key from Script Properties.
 * @returns {string} The Pumble API key.
 * @throws {Error} If the API key is not found in Script Properties.
 */
function getPumbleApiKey() {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('PUMBLE_API_KEY');
  if (!apiKey) {
    throw new Error('PUMBLE_API_KEY not found in Script Properties. Please set it manually.');
  }
  return apiKey;
}

/**
 * Fetches the markdown content for a specific day from Google Drive.
 * @param {number} dayNumber The day number (e.g., 1 for "Day 1.md").
 * @returns {string} The content of the markdown file.
 * @throws {Error} If the folder or file is not found.
 */
function getMarkdownContent(dayNumber) {
  const folderId = '1xVKuHZnqPFPmBJBeHTusb55Vrpx5QCa8';
  const fileName = `Day ${dayNumber}.md`;
  
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByName(fileName);
  
  if (files.hasNext()) {
    const file = files.next();
    return file.getBlob().getDataAsString();
  } else {
    throw new Error(`File "${fileName}" not found in folder ${folderId}`);
  }
}

/**
 * Sends a message to a Pumble channel using the Pumble API.
 * @param {string} content The message content to send.
 * @param {boolean} [isTest=false] Whether this is a test message.
 */
function sendPumbleMessage(content, isTest = false) {
  const apiKey = getPumbleApiKey();
  const url = 'https://pumble-api-keys.addons.marketplace.cake.com/sendMessage';
  
  const channelId = PropertiesService.getScriptProperties().getProperty('PUMBLE_CHANNEL_ID');
  if (!channelId) {
    throw new Error('PUMBLE_CHANNEL_ID not found in Script Properties. Please set it manually.');
  }
  
  if (isTest) {
    content = `# TEST\n\n${content.substring(0, 300)}...`;
  }

  const payload = {
    'channel': channelId,
    'text': content,
    'asBot': false // User mentioned Pumble API key, typically used with the addon to send as bot or user.
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Api-Key': apiKey // Research indicates x-api-key might be used for this addon
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  
  if (responseCode !== 200 && responseCode !== 201) {
    console.error(`Failed to send Pumble message. Status: ${responseCode}, Body: ${response.getContentText()}`);
    throw new Error(`Pumble API error: ${responseCode}`);
  }
}

/**
 * Calculates the current day of the year (1-366).
 * @returns {number} The current day of the year.
 */
function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
