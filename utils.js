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
 * Handles content exceeding the 10,000 character limit by splitting it into multiple messages.
 * @param {string} content The message content to send.
 * @param {boolean} [isTest=false] Whether this is a test message.
 */
function sendPumbleMessage(content, isTest = false) {
  if (isTest) {
    content = `# TEST\n\n${content}`;
  }

  const MAX_LENGTH = 10000;
  const ELLIPSIS = '...';
  const CHUNK_LIMIT = MAX_LENGTH - ELLIPSIS.length;

  if (content.length <= MAX_LENGTH) {
    _postToPumble(content);
    return;
  }

  let remainingContent = content;
  while (remainingContent.length > 0) {
    let chunk;
    if (remainingContent.length <= MAX_LENGTH) {
      chunk = remainingContent;
      remainingContent = '';
    } else {
      // Find the last space within the CHUNK_LIMIT
      let splitIndex = remainingContent.lastIndexOf(' ', CHUNK_LIMIT);
      
      // If no space found, force split at CHUNK_LIMIT
      if (splitIndex === -1) {
        splitIndex = CHUNK_LIMIT;
      }

      chunk = remainingContent.substring(0, splitIndex).trimEnd() + ELLIPSIS;
      remainingContent = remainingContent.substring(splitIndex).trimStart();
    }
    _postToPumble(chunk);
  }
}

/**
 * Internal helper to perform the actual Pumble API POST request.
 * @param {string} content The content to post.
 * @private
 */
function _postToPumble(content) {
  const apiKey = getPumbleApiKey();
  const url = 'https://pumble-api-keys.addons.marketplace.cake.com/sendMessage';
  
  const channelId = PropertiesService.getScriptProperties().getProperty('PUMBLE_CHANNEL_ID');
  if (!channelId) {
    throw new Error('PUMBLE_CHANNEL_ID not found in Script Properties. Please set it manually.');
  }

  const payload = {
    'channel': channelId,
    'text': content,
    'asBot': false
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Api-Key': apiKey
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
