# Pumble 30 Day Message Automation

## Overview

This is a plan for writing a Google Apps Script that will: 
1. Run daily at a specific time each morning
2. Fetch markdown content from Google Drive corresponding to the day of the year for the first 41 days of the year.
3. Send the markdown content as a message to Pumble using the Pumble API with a provided API key

### Notes
- The markdown content is in the Google Drive folder with id: `1xVKuHZnqPFPmBJBeHTusb55Vrpx5QCa8`
- The Pumble API key is stored in the @.env file but needs to be stored in Google Apps Script using the Properties Service.  This service stores key-value pairs outside the source code, which is better than hard-coding them.
`ScriptProperties` are shared by all users of a script and are set by the developer (owner). This is useful for a static key that all script executions should use. 
- The script will be set to run daily at 6:40 AM ET
- The script will use the Google Drive API to fetch the markdown content corresponding to the day of the yearfrom the Google Drive folder.
- Each markdown file will be named in the format: `Day 1.md`, `Day 2.md`, etc.
- The script will need a feature flag to send a test message to Pumble to verify that the script is working correctly. This test should pull the markdown file for Day 1 from the Google Drive folder and send it to Pumble as 300 character excerpt with the header `# TEST`.
