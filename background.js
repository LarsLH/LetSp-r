const INTERNAL_BLOCKED_PAGE = chrome.runtime.getURL('blocked.html');

let blockedSitesConfig = []; 
let dailyCsvUrl = '';
let examCsvUrl = '';
let specialCsvUrl = '';
let blockedPageMode = 'internal';
let blockedPageUrl = '';
let updateInterval = 1800000; 

function fetchConfig() {
 chrome.storage.managed.get(
  ['dailyCsvUrl', 'examCsvUrl', 'specialCsvUrl', 'blockedPageMode', 'blockedPageUrl', 'updateInterval'],
  function(data) {
   dailyCsvUrl = data.dailyCsvUrl || '';
   examCsvUrl = data.examCsvUrl || '';
   specialCsvUrl = data.specialCsvUrl || '';
   blockedPageMode = data.blockedPageMode || 'internal';
   blockedPageUrl = data.blockedPageUrl || '';
   updateInterval = data.updateInterval || 1800000;
   updateBlockedSites();
  }
 );
}

function fetchBlockedSites(csvUrl) {
 if (!csvUrl) {
  console.error('CSV-URL mangler.');
  blockedSitesConfig = []; 
  return;
 }
 fetch(csvUrl)
  .then(response => response.text())
  .then(csv => {
   const lines = csv.split('\n').map(line => line.trim()).filter(line => line !== '');
   
   const dataLines = lines.slice(1); 

   blockedSitesConfig = dataLines.map(line => {
    const parts = line.split(',');
    
    const site = (parts[0] || '').trim();
    
    const tempAllowString = (parts[1] || '').trim();
    const tempAllow = tempAllowString === 'x' || tempAllowString === 'X' || tempAllowString === 'TRUE' || tempAllowString === 'true' || tempAllowString === 'SAND' || tempAllowString === 'sand'; 
    
    return {
     site: site,
     tempAllow: tempAllow
    };
   }).filter(config => config.site !== ''); 
   
   console.log(`Hentede ${blockedSitesConfig.length} webstedskonfigurationer.`);
  })
  .catch(error => console.error('Fejl ved hentning af websteder:', error));
}

function updateBlockedSites() {
 chrome.storage.managed.get('sheetMode', function(data) {
  const sheetMode = data.sheetMode || 'daily';
  
  if (sheetMode === 'exam') {
   fetchBlockedSites(examCsvUrl);
  } else if (sheetMode === 'special') {
   fetchBlockedSites(specialCsvUrl);
  } else {
   fetchBlockedSites(dailyCsvUrl);
  }
 });
}

fetchConfig();
setInterval(fetchConfig, updateInterval);

chrome.webRequest.onBeforeRequest.addListener(function(details) {
 if (isBlocked(details.url)) {
  let redirectUrl = INTERNAL_BLOCKED_PAGE;
  if (blockedPageMode === 'external' && blockedPageUrl) {
   redirectUrl = blockedPageUrl;
  }
  return { redirectUrl: redirectUrl };
 }
 return { cancel: false };
}, { urls: ['<all_urls>'] }, ['blocking']);

function isBlocked(url) {
 
 for (let config of blockedSitesConfig) {

  let regexSite = config.site.replace(/\*/g, '.*');
  let regex = new RegExp(regexSite, 'i'); 
  
  if (regex.test(url)) {

   if (config.tempAllow) {
    return false; 
   }
   
   
   return true; 
  }
 }
 return false;  
}