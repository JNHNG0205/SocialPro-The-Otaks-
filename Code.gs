// Social Media Automation and Analytics App 

// Global variables

const SHEET_NAME = 'Social Media Data';
const LOG_SHEET_NAME = 'Activity Log'; // Define the log sheet name
const PLATFORMS = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Social Media Automation App')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function schedulePostsUI() {
  // Implement UI for scheduling posts across platforms
}

function generateAIContentUI() {
  // Implement UI for AI-driven content generation
}

function viewAnalyticsUI() {
  // Implement UI for displaying real-time analytics
}

function manageCollaboratorsUI() {
  // Implement UI for managing team collaboration
}

// You'll need to set these values
const ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
const INSTAGRAM_ACCOUNT_ID = 'YOUR_INSTAGRAM_ACCOUNT_ID';

function schedulePosts(formData) {
  try {
    const platform = formData.platform;
    const content = formData.content;
    const datetime = formData.datetime;
    const mediaAttachment = formData.mediaAttachment;

    if (platform !== 'Instagram') {
      return 'This function only supports Instagram posting.';
    }

    // Upload media to Google Drive and get the public URL
    const mediaUrl = getMediaUrl(mediaAttachment);

    // Upload media to Instagram
    const mediaId = uploadMedia(mediaUrl);

    // Schedule the post
    const postId = createPost(content, mediaId, datetime);

    // Log the activity
    logActivity('Schedule Post', `Platform: ${platform}, Content: ${content}, Datetime: ${datetime}, Media URL: ${mediaUrl}`);

    return `Post scheduled successfully. Post ID: ${postId}`;
  } catch (error) {
    Logger.log('Error in schedulePosts: ' + error.toString());
    return 'Error scheduling post: ' + error.toString();
  }
}

function uploadMedia(mediaUrl) {
  const url = `https://graph.facebook.com/v12.0/${INSTAGRAM_ACCOUNT_ID}/media`;
  
  const formData = {
    'access_token': ACCESS_TOKEN,
    'image_url': mediaUrl,
  };

  const options = {
    'method': 'post',
    'payload': formData,
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseData = JSON.parse(response.getContentText());

  if (responseData.error) {
    throw new Error(`Error uploading media: ${responseData.error.message}`);
  }

  return responseData.id;
}

function createPost(caption, mediaId, publishTime) {
  const url = `https://graph.facebook.com/v12.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`;
  
  const formData = {
    'access_token': ACCESS_TOKEN,
    'creation_id': mediaId,
    'caption': caption,
    'published': false,
    'scheduled_publish_time': Math.floor(new Date(publishTime).getTime() / 1000)
  };

  const options = {
    'method': 'post',
    'payload': formData,
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseData = JSON.parse(response.getContentText());

  if (responseData.error) {
    throw new Error(`Error creating post: ${responseData.error.message}`);
  }

  return responseData.id;
}


function getMediaUrl(blob) {
  return uploadToGoogleDrive(blob);
}

function uploadToGoogleDrive(blob) {
  try {
    // Create a folder in Google Drive to store the media files
    const folderName = 'Instagram Media Files';
    let folder = DriveApp.getFoldersByName(folderName).next();
    if (!folder) {
      folder = DriveApp.createFolder(folderName);
    }

    // Create a unique file name
    const fileName = `instagram_media_${new Date().getTime()}.${getFileExtension(blob.getName())}`;

    // Create the file in Google Drive
    const file = folder.createFile(blob);
    file.setName(fileName);

    // Set the file to be publicly accessible
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Get the file's URL
    const url = file.getDownloadUrl();

    return url;
  } catch (error) {
    Logger.log('Error in uploadToGoogleDrive: ' + error.toString());
    throw new Error('Failed to upload file to Google Drive: ' + error.toString());
  }
}

function getFileExtension(filename) {
  return filename.split('.').pop();
}



function generateAIContent(prompt, platform) {
  const apiKey = 'LL-oss0jLpI5otFW9H7wQiK1Qq34KJ3iv7C8K8ejie0HEExD8hNaosaQlX0lSO4DOUJ';  // Replace with your LLaMA API key
  const apiEndpoint = 'https://api.llama-api.com/chat/completions';  // Example endpoint
  
    const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  const payload = {
    "messages": [
      {"role": "user", "content": prompt}
    ],
    "functions": [],
    "stream": false
  };
  
  const options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  
  try {
    const response = UrlFetchApp.fetch(apiEndpoint, options);
    const responseData = JSON.parse(response.getContentText());
    
    // Log the entire response for debugging
    Logger.log(`Response Data: ${JSON.stringify(responseData)}`);
    
    // Adjust based on the actual response structure
    const aiContent = responseData.choices && responseData.choices[0] && responseData.choices[0].message ? responseData.choices[0].message.content : 'No content returned';
    
    // Log the activity
    logActivity('Generate AI Content', `Platform: ${platform}, Prompt: ${prompt}, Response: ${aiContent}`);
    
    return aiContent;
  } catch (e) {
    Logger.log(`Error generating AI content: ${e.message}`);
    logActivity('Generate AI Content Error', `Platform: ${platform}, Prompt: ${prompt}, Error: ${e.message}`);
    return `Error: Unable to generate content for ${platform}`;
  }
}

function fetchAnalytics() {
  // Fetch analytics data from various social media APIs
  // This is a placeholder. You'll need to implement actual API calls.
  logActivity('Fetch Analytics', 'Fetched analytics data');
  return {
    "Twitter": { "followers": 1000, "engagements": 500 },
    "Facebook": { "followers": 2000, "engagements": 750 },
    "Instagram": { "followers": 1500, "engagements": 1000 },
    "LinkedIn": { "followers": 500, "engagements": 250 }
  };
}

function optimizePostTiming() {
  // Analyze best posting times based on engagement data
}

function syncCollaborators(collaborators) {
  // Manage permissions and sync collaborator data
}

function createAnalyticsChart() {
  const sheet = getSheet();
  const chartRange = sheet.getRange("A1:C5");
  
  // Sample data - replace this with actual data from fetchAnalytics() function
  const data = [
    ['Platform', 'Followers', 'Engagements'],
    ['Twitter', 1000, 500],
    ['Facebook', 2000, 750],
    ['Instagram', 1500, 1000],
    ['LinkedIn', 500, 250]
  ];
  
  // Set the data in the sheet
  chartRange.setValues(data);
  
  // Create and configure the chart
  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(chartRange)
    .setPosition(5, 5, 0, 0)
    .setOption('title', 'Social Media Analytics')
    .setOption('width', 600)
    .setOption('height', 400)
    .setOption('legend', {position: 'top', textStyle: {fontSize: 12}})
    .setOption('hAxis', {title: 'Platform', textStyle: {fontSize: 10}})
    .setOption('vAxis', {title: 'Count', textStyle: {fontSize: 10}})
    .setOption('colors', ['#4285F4', '#34A853'])  // Google blue and green colors
    .build();
  
  // Insert the chart into the sheet
  sheet.insertChart(chart);
}

// Helper functions
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function logActivity(action, details) {
  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET_NAME);
  if (!logSheet) {
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(LOG_SHEET_NAME);
  }
  const timestamp = new Date();
  logSheet.appendRow([timestamp, action, details]);
}

function parseDate(dateStr) {
  // Example input: "25/07/2024 14:13:49"
  if (typeof dateStr !== 'string' || !dateStr) {
    Logger.log('Invalid date string: ' + dateStr);
    return null;
  }
  
  try {
    const [day, month, yearTime] = dateStr.split('/');
    if (!yearTime) {
      Logger.log('Invalid year-time part in date string: ' + dateStr);
      return null;
    }
    
    const [year, time] = yearTime.split(' ');
    if (!time) {
      Logger.log('Invalid time part in date string: ' + dateStr);
      return null;
    }
    
    // Construct ISO 8601 format string
    const isoDateStr = `${year}-${month}-${day}T${time}:00Z`;
    
    // Parse ISO string into a Date object
    const date = new Date(isoDateStr);
    
    if (isNaN(date.getTime())) {
      Logger.log('Invalid date format: ' + isoDateStr);
      return null;
    }
    
    return date;
  } catch (e) {
    Logger.log('Error parsing date: ' + e.message);
    return null;
  }
}

function fetchLogEntries() {
  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET_NAME);
  if (!logSheet) {
    Logger.log('Log sheet not found.');
    return [];
  }

  const logEntries = logSheet.getDataRange().getValues();
  Logger.log('Log entries retrieved: ' + JSON.stringify(logEntries));
  
  // Assuming the first row contains headers and subsequent rows contain data
  return logEntries.length > 1 ? logEntries.slice(1).map(row => {
    // Check if row[0] contains a valid date string
    const date = new Date(row[0]);
    // Validate and format the date
    row[0] = isNaN(date.getTime()) ? 'Invalid Date' : formatDateTime(date);
    return row;
  }) : [];
}


function formatDateTime(date) {
  if (isNaN(date.getTime())) {
    return 'Invalid Date'; // Return a placeholder if date is invalid
  }
  
  // Format the date as DD/MM/YYYY HH:mm
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
  const year = date.getFullYear();
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}





