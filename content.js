const observer = new MutationObserver(mutations => {
    console.log("Mutation observed");
    
    // Instead of waiting for the table to mutate, directly check for any 'a' tags inside the table
    const anchors = document.querySelectorAll('#build_details_table a');
    if (anchors.length) {
        console.log(`Found ${anchors.length} anchor tags in the table.`);
        addCheckboxToRelevantLinks(anchors);
    }
    // Add the custom button
    addButton();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function addCheckboxToRelevantLinks(anchors) {
    anchors.forEach(a => {
        if (a.textContent.trim().startsWith("44") && !a.previousElementSibling?.classList.contains('custom-checkbox')) {
            console.log("Adding checkbox to:", a.textContent);
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'custom-checkbox';
            checkbox.dataset.id = a.textContent.trim();  // Added a unique ID based on the anchor text content

            checkbox.addEventListener('change', function(event) {
                const checkbox = event.target;
                if (checkbox.checked) {
                    const parentRow = checkbox.closest('tr');
                    const manifestName = parentRow.querySelector('td:nth-child(4) a').textContent.trim();
                    const versionNumber = parentRow.querySelector('td:nth-child(5) a').textContent.trim();
                    const partNumber = parentRow.querySelector('td:nth-child(6)').textContent.trim();

                    console.log('manifestName:', manifestName);
                    console.log('versionNumber:', versionNumber);
                    console.log('partNumber:', partNumber);

                    // Save to local storage
                    const dataObject = {
                        manifestName: manifestName,
                        versionNumber: versionNumber,
                        partNumber: partNumber
                    };

                    // chrome.storage.local.set({ [checkbox.dataset.id]: dataObject });
                    // Clear existing data before saving new data
                    chrome.storage.local.clear(function() {
                        const error = chrome.runtime.lastError;
                        if (error) {
                            console.log(error);
                        } else {
                            chrome.storage.local.set({ [checkbox.dataset.id]: dataObject });
                        }
                    });

                    const allCheckboxes = document.querySelectorAll('#build_details_table .custom-checkbox');
                    allCheckboxes.forEach(checkbox => {
                        if (checkbox !== this) {
                            checkbox.checked = false;
                        }
                    });
                    document.getElementById('request-pn-button').style.display = "inline-block"; // Show button when a checkbox is checked
                } else {
                    // If unchecked, remove from storage
                    chrome.storage.local.remove(checkbox.dataset.id);

                    const anyChecked = [...document.querySelectorAll('#build_details_table .custom-checkbox')].some(cb => cb.checked);
                    if (!anyChecked) {
                        document.getElementById('request-pn-button').style.display = "none"; // Hide button when no checkboxes are checked
                    }
                }
            });

            a.insertAdjacentElement('beforebegin', checkbox);
        }
    });
}

function addButton() {
    const button = document.createElement('button');
    button.innerText = "Request new PN";
    button.type = "button";
    button.className = "btn btn-xs btn-primary";
    button.style.marginLeft = "10px";  // Add some space between buttons
    button.style.display = "none";  // Initially hidden
    // button.onclick = function() {
    //     chrome.runtime.sendMessage({
    //         action: "openNewTab",
    //         url: 'https://jira.panasonic.aero/'
    //     });
    // };
    button.onclick = function() {
        // Get the checked checkbox data
        const checkedCheckbox = [...document.querySelectorAll('#build_details_table .custom-checkbox')].find(cb => cb.checked);
        const dataObject = {
            manifestName: checkedCheckbox.closest('tr').querySelector('td:nth-child(4) a').textContent.trim(),
            versionNumber: checkedCheckbox.closest('tr').querySelector('td:nth-child(5) a').textContent.trim(),
            partNumber: checkedCheckbox.closest('tr').querySelector('td:nth-child(6)').textContent.trim()
        };

        // Save data then open new tab
        chrome.storage.local.clear(function() {
            const error = chrome.runtime.lastError;
            if (error) {
                console.log(error);
            } else {
                chrome.storage.local.set({ [checkedCheckbox.dataset.id]: dataObject }, function() {
                    chrome.runtime.sendMessage({
                        action: "openNewTab",
                        url: 'https://jira.panasonic.aero/'
                    });
                });
            }
        });
    };
    const targetButton = document.getElementById("check_latest_button");
    if (targetButton && !document.getElementById("request-pn-button")) {  // Ensure our button doesn't already exist
        button.id = "request-pn-button";  // Giving an ID to our new button to identify it
        targetButton.insertAdjacentElement('afterend', button);
    }
}
