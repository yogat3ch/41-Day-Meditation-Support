# Pumble 30-Day Message Automation

This Google Apps Script automates sending daily markdown content from Google Drive to a Pumble channel.

## Features
- Fetches markdown files named `Day 1.md`, `Day 2.md`, etc., from a designated Google Drive folder.
- Sends content to Pumble using the Marketplace API Key Addon.
- Runs automated daily updates for the first 41 days of the year.
- Includes a test mode to verify integration.

## Setup Instructions

### 1. Google Drive
- Ensure your markdown files are in the folder with ID `1xVKuHZnqPFPmBJBeHTusb55Vrpx5QCa8`.
- Files should be named exactly like `Day 1.md`, `Day 2.md`, etc.

### 2. Pumble API
- Generate an API key in Pumble by typing `/api-keys generate`.
- Create an "Incoming Webhook" and note the channel ID (or use the channel ID from the URL/Info).

### 3. Script Properties
In the Google Apps Script project, go to **Project Settings** > **Script Properties** and add the following keys:
- `PUMBLE_API_KEY`: Your generated Pumble API key.
- `PUMBLE_CHANNEL_ID`: The ID of the channel where messages should be sent.

### 4. Triggers
- Set up a time-driven trigger for the `dailyPumbleUpdate` function.
- Configuration: Daily, 6:40 AM ET (or your preferred time).

## Usage
- **Testing**: Run the `testPumbleMessage` function in the Apps Script editor to send a 300-character excerpt of Day 1 to Pumble.
- **Production**: The `dailyPumbleUpdate` function will automatically handle message delivery when triggered.
