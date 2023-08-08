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
        setTimeout(selectPartNumberRequest, 1000);
    }
}

function selectPartNumberRequest() {
    // Wait for the second input box to become available, then type 'Part Number Request' into it
    const issueTypeField = document.getElementById('issuetype-field');
    
    if (issueTypeField) {
        issueTypeField.value = 'Part Number Request';
        issueTypeField.dispatchEvent(new Event('input', { bubbles: true }));  // Trigger any associated input event listeners

        // Select the dropdown option after a delay
        setTimeout(() => {
            const selector = 'li.aui-list-item-li-part-number-request';
            const partNumberOption = document.querySelector(selector);
            if (partNumberOption) {
                partNumberOption.click();
                setTimeout(setInputValue, 1000);
            }
        }, 1000);  // Wait 1 second for the dropdown to show up
    } else {
        // Retry after a short delay if the input box is not yet available
        setTimeout(selectPartNumberRequest, 500);
    }
}

function setInputValue() {
    const textBox = document.getElementById('summary');
    if (textBox) {
        console.log("Setting text in the Summary field with manifestName:", manifestName);
        textBox.value = "Part number is needed for " + manifestName;
    }
    // Call the new function after updating the Summary field
    setTimeout(setInputForTinyMCE, 1000);
}

function setInputForTinyMCE() {
    const iframe = document.querySelector('iframe'); // This assumes there's only one iframe, adjust if necessary
    if (iframe) {
        const pElement = iframe.contentDocument.querySelector('#tinymce p');
        if (pElement) {
            pElement.textContent = ''; // Clear the current content
            pElement.textContent = "Part number is needed for " + manifestName; // Set the desired text
            console.log("Updated the TinyMCE input field with:", pElement.textContent);
            // Call the setVersionNumber function after updating the TinyMCE input field
            setTimeout(setVersionNumber, 500);  // You can adjust this delay if necessary
        } else {
            console.log("Couldn't find the target <p> element inside TinyMCE.");
        }
    } else {
        console.log("Couldn't find the TinyMCE iframe.");
    }
}

function setVersionNumber() {
    const versionInput = document.getElementById('customfield_16003');
    if (versionInput) {
        console.log("Setting versionNumber in the input field:", versionNumber);
        versionInput.value = versionNumber;

        // Trigger any associated input event listeners
        versionInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Call the setPartNumber function after setting the versionNumber
        setTimeout(setPartNumber, 500); 
    } else {
        console.log("Couldn't find the version input field.");
    }
}

function setPartNumber() {
    const partNumberInput = document.getElementById('customfield_16004');
    if (partNumberInput) {
        console.log("Setting partNumber in the input field:", partNumber);
        partNumberInput.value = partNumber;

        // Trigger any associated input event listeners
        partNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Call the setDateSevenDaysFromNow function after setting the partNumber
        setTimeout(setDateSevenDaysFromNow, 500);
    } else {
        console.log("Couldn't find the part number input field.");
    }
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
        setTimeout(setBaselineUpdate, 500);
    } else {
        console.log("Couldn't find the date input field.");
    }
}

function setBaselineUpdate() {
    const baselineTextarea = document.getElementById('customfield_16005');
    if (baselineTextarea) {
        console.log("Setting 'baseline update' in the textarea field...");
        baselineTextarea.value = 'baseline update';
        
        // Trigger any associated input event listeners
        baselineTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        console.log("Couldn't find the 'baseline update' textarea.");
    }
}


let manifestName = '';
let versionNumber = '';
let partNumber = '';

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

            console.log("Data fetched from storage:");
            console.log("manifestName:", manifestName);
            console.log("versionNumber:", versionNumber);
            console.log("partNumber:", partNumber);
        }
    });
}

// Call the fetchData function
fetchData();

// Run the function after a delay to ensure the page has fully loaded
setTimeout(clickCreateButton, 2000);
