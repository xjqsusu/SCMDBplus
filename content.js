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
                    const versionNumber = parentRow.querySelector('td:nth-child(5)').textContent.trim();
                    const partNumber = parentRow.querySelector('td:nth-child(6)').textContent.trim();
                    const buildNumber = window.location.pathname.split('/')[3];
                    const atpData = document.querySelector('td.atp-title').getAttribute('data-atp');


                    console.log('manifestName:', manifestName);
                    console.log('versionNumber:', versionNumber);
                    console.log('partNumber:', partNumber);
                    console.log('buildNumber:', buildNumber);
                    console.log('atpData:', atpData);

                    // Save to local storage
                    const dataObject = {
                        manifestName: manifestName,
                        versionNumber: versionNumber,
                        partNumber: partNumber,
                        buildNumber: buildNumber,
                        atpData : atpData
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
                    document.getElementById("request-manifest-button").style.display = "inline-block";
                } else {
                    // If unchecked, remove from storage
                    chrome.storage.local.remove(checkbox.dataset.id);

                    const anyChecked = [...document.querySelectorAll('#build_details_table .custom-checkbox')].some(cb => cb.checked);
                    if (!anyChecked) {
                        document.getElementById('request-pn-button').style.display = "none"; // Hide button when no checkboxes are checked
                        document.getElementById("request-manifest-button").style.display = "none";
                    }
                }
            });

            a.insertAdjacentElement('beforebegin', checkbox);
        }
    });
}

function addButton() {
    const button1 = document.createElement('button');
    button1.innerText = "Request new PN";
    button1.type = "button";
    button1.className = "btn btn-xs btn-primary";
    button1.style.marginLeft = "10px";  // Add some space between buttons
    button1.style.display = "none";  // Initially hidden

    const button2 = document.createElement('button');
    button2.innerText = "Request Manifest";
    button2.type = "button";
    button2.className = "btn btn-xs btn-primary";
    button2.style.marginLeft = "10px";
    button2.style.display = "none";

    button1.addEventListener('click', function() {
        // Get the checked checkbox data
        const checkedCheckbox = [...document.querySelectorAll('#build_details_table .custom-checkbox')].find(cb => cb.checked);
        const dataObject = {
            manifestName: checkedCheckbox.closest('tr').querySelector('td:nth-child(4) a').textContent.trim(),
            versionNumber: checkedCheckbox.closest('tr').querySelector('td:nth-child(5)').textContent.trim(),
            partNumber: checkedCheckbox.closest('tr').querySelector('td:nth-child(6)').textContent.trim(),
            buildNumber: window.location.pathname.split('/')[3],
            atpData : document.querySelector('td.atp-title').getAttribute('data-atp')
        };

        // Save data then open new tab
        chrome.storage.local.clear(function() {
            const error = chrome.runtime.lastError;
            if (error) {
                console.log(error);
            } else {
                chrome.storage.local.set({ [checkedCheckbox.dataset.id]: dataObject }, function() {
                    chrome.runtime.sendMessage({
                        action: "requestNewPN"
                    });
                });
            }
        });
    });

    button2.addEventListener('click', function() {
        // Get the checked checkbox data
        const checkedCheckbox = [...document.querySelectorAll('#build_details_table .custom-checkbox')].find(cb => cb.checked);
        const dataObject = {
            manifestName: checkedCheckbox.closest('tr').querySelector('td:nth-child(4) a').textContent.trim(),
            versionNumber: checkedCheckbox.closest('tr').querySelector('td:nth-child(5)').textContent.trim(),
            partNumber: checkedCheckbox.closest('tr').querySelector('td:nth-child(6)').textContent.trim(),
            buildNumber : window.location.pathname.split('/')[3],
            atpData : document.querySelector('td.atp-title').getAttribute('data-atp')
        };

        // Save data then open new tab
        chrome.storage.local.clear(function() {
            const error = chrome.runtime.lastError;
            if (error) {
                console.log(error);
            } else {
                chrome.storage.local.set({ [checkedCheckbox.dataset.id]: dataObject }, function() {
                    chrome.runtime.sendMessage({
                        action: "requestManifest"
                    });
                });
            }
        });
    });

    const targetButton = document.getElementById("check_latest_button");
    if (targetButton && !document.getElementById("request-pn-button") && !document.getElementById("request-manifest-button")) {  // Ensure our button doesn't already exist
        button1.id = "request-pn-button";  // Giving an ID to our new button to identify it
        targetButton.insertAdjacentElement('afterend', button1);

        button2.id = "request-manifest-button";
        button1.insertAdjacentElement('afterend', button2);
    }
}
