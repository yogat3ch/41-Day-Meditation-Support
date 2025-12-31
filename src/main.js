/**
 * Main function to be triggered daily.
 * Fetches content from Google Drive and sends it to Pumble.
 * Runs for the first 41 days of the year.
 */
function dailyPumbleUpdate() {
  try {
    const dayOfYear = getDayOfYear();
    
    // According to the plan: first 41 days of the year
    if (dayOfYear >= 1 && dayOfYear <= 41) {
      console.log(`Processing Day ${dayOfYear}...`);
      const content = getMarkdownContent(dayOfYear);
      sendPumbleMessage(content);
      console.log(`Successfully sent Day ${dayOfYear} to Pumble.`);
    } else {
      console.log(`Day of year is ${dayOfYear}. Outside the 1-41 range. No action taken.`);
    }
  } catch (error) {
    console.error(`Error in dailyPumbleUpdate: ${error.message}`);
  }
}

/**
 * Test function to verify Pumble integration.
 * Sends a 300-character excerpt of Day 1 content with a # TEST header.
 */
function testPumbleMessage() {
  try {
    console.log('Running Pumble integration test...');
    const content = getMarkdownContent(1);
    sendPumbleMessage(content, true);
    console.log('Test message sent successfully.');
  } catch (error) {
    console.error(`Error in testPumbleMessage: ${error.message}`);
  }
}
