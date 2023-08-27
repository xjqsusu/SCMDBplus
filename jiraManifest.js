function clickCreateButton() {
    const createBtn = document.getElementById('create_link');
    if (createBtn) {
        console.log("Clicking Create button...");
        createBtn.click();
        
        // Add a delay to ensure the modal pops up before we try to set the project value
        setTimeout(fillProjectField, 2000);  // Adjust the delay as necessary
    }
}

function fillProjectField() {
    const projectInput = document.getElementById("project-field");
    if (projectInput) {
        console.log("Filling Project Field...");
        projectInput.value = "SCM Support Requests (SCM)";
        projectInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Add a delay to let dropdown show up after input value change
        setTimeout(selectDropdownItem, 1000);  // Adjust the delay as necessary
    }
}

function selectDropdownItem() {
    // Find the li element for SCM Support Requests (SCM)
    const scmListItem = document.querySelector('.aui-list-item-li-scm-support-requests-\\(scm\\)');
    if (scmListItem) {
        console.log("Clicking on the dropdown item...");
        scmListItem.querySelector('a').click();
        setTimeout(selectManifestRequest, 1000);
    }
}

function selectManifestRequest() {
    // Wait for the second input box to become available, then type 'Part Number Request' into it
    const issueTypeField = document.getElementById('issuetype-field');
    
    if (issueTypeField) {
        issueTypeField.value = 'Manifest Request';
        issueTypeField.dispatchEvent(new Event('input', { bubbles: true }));  // Trigger any associated input event listeners

        // Select the dropdown option after a delay
        setTimeout(() => {
            const selector = 'li.aui-list-item-li-manifest-request';
            const manifestOption = document.querySelector(selector);
            if (manifestOption) {
                manifestOption.click();
                setTimeout(setInputValue, 1000);
            }
        }, 1000);  // Wait 1 second for the dropdown to show up
    } else {
        // Retry after a short delay if the input box is not yet available
        setTimeout(selectManifestRequest, 500);
    }
}

function setInputValue() {
    const textBox = document.getElementById('summary');
    if (textBox) {
        console.log("Setting text in the Summary field with manifestName:", manifestName);
        textBox.value = "Manifest request for " + manifestName + " for build - " + buildNumber;
    }
    // Call the new function after updating the Summary field
    setTimeout(setInputForTinyMCE, 1000);
}

function setInputForTinyMCE() {
    const iframe = document.querySelector('iframe'); // This assumes there's only one iframe, adjust if necessary
    //const iframe = iframes[iframes.length - 1]; // This will get the last iframe
    if (iframe) {
        const pElement = iframe.contentDocument.querySelector('#tinymce p');
        if (pElement) {
            pElement.textContent = ''; // Clear the current content
            pElement.textContent = "Manifest Name: " + manifestName; // Set the desired text
            console.log("Updated the TinyMCE input field with:", pElement.textContent);

            const versionPElement = document.createElement('p');
            versionPElement.textContent = "Version Number: " + versionNumber;
            pElement.insertAdjacentElement('afterend', versionPElement);

            const pnPElement = document.createElement('p');
            pnPElement.textContent = "Part Number: " + partNumber;
            versionPElement.insertAdjacentElement('afterend', pnPElement);

            // Call the setVersionNumber function after updating the TinyMCE input field
            setTimeout(setInputValue2, 500);  // You can adjust this delay if necessary
        } else {
            console.log("Couldn't find the target <p> element inside TinyMCE.");
        }
    } else {
        console.log("Couldn't find the TinyMCE iframe.");
    }
}

function setInputValue2() {
    const textBox = document.getElementById('customfield_16002');
    if (textBox) {
        console.log("Setting text in the Summary field with manifestName:", atpData);
        textBox.value = atpData;
    }
    // Call the new function after updating the Summary field
    setTimeout(setDateSevenDaysFromNow, 1000);
}

function setDateSevenDaysFromNow() {
    const dateInput = document.getElementById('customfield_10303');
    if (dateInput) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);  // add 7 days to the current date

        // Format the date in the format: DD/Mmm/YY
        const day = String(currentDate.getDate()).padStart(2, '0');  // get the day and pad it to two digits
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[currentDate.getMonth()];  // get the month name
        const year = String(currentDate.getFullYear()).slice(2);  // get the last two digits of the year

        const formattedDate = `${day}/${month}/${year}`;

        console.log("Setting the date to:", formattedDate);
        dateInput.value = formattedDate;

        // Trigger any associated input event listeners
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Call the setBaselineUpdate function after setting the date
        setTimeout(selectKitTest, 500);
    } else {
        console.log("Couldn't find the date input field.");
    }
}

function selectKitTest() {
    const select = document.getElementById('customfield_16006');
    if (select) {
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === 'Kit - Test') {
                select.selectedIndex = i;
                console.log("Selected 'Kit - Test'");
                break;
            }
        }
    } else {
        console.log("Couldn't find the dropdown menu");
    }
}

let manifestName = '';
let versionNumber = '';
let partNumber = '';
let buildNumber = '';
let atpData = '';

// Fetch data from storage
function fetchData() {
    chrome.storage.local.get(null, function(items) {
        if (chrome.runtime.lastError) {
            console.log("Error fetching data from storage:", chrome.runtime.lastError);
            return;
        }

        const keys = Object.keys(items);
        if (keys.length) {
            const mostRecentData = items[keys[keys.length - 1]]; // Fetch the most recent data

            manifestName = mostRecentData.manifestName;
            versionNumber = mostRecentData.versionNumber;
            partNumber = mostRecentData.partNumber;
            buildNumber = mostRecentData.buildNumber;
            atpData = mostRecentData.atpData;

            console.log("Data fetched from storage:");
            console.log("manifestName:", manifestName);
            console.log("versionNumber:", versionNumber);
            console.log("partNumber:", partNumber);
            console.log("buildNumber:", buildNumber);
            console.log("atpData:", atpData);
        }
    });
}

// Call the fetchData function
fetchData();

// Run the function after a delay to ensure the page has fully loaded
// setTimeout(clickCreateButton, 2000);

function waitForElement(selector, callback, timeout = 30000) {
    const startTime = Date.now();

    const interval = setInterval(() => {
        const element = document.querySelector(selector);

        if (element) {
            clearInterval(interval); // Stop the interval
            callback(element);       // Proceed with your logic
            console.log("found create button!!")
        } else if (Date.now() - startTime > timeout) {
            clearInterval(interval); // Stop the interval after timeout
            console.error('Element not found within timeout period:', selector);
        }
    }, 1000); // Check every second
}

waitForElement('#create_link', clickCreateButton);
