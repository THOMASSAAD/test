// Security scan XSS-render test
const userBioPayload = "<img src=x onerror=alert(document.domain)>";
function renderUserBio(bio) { document.getElementById('bio').innerHTML = bio; }
renderUserBio(userBioPayload);
