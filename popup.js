chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    
    if (activeTab.url && !activeTab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: getAtpValueFromPage,
        }, (injectionResults) => {
            if (injectionResults && injectionResults.length > 0) {
                const dataAtpValue = injectionResults[0].result;
                
                if (dataAtpValue) {
                    document.getElementById('data-atp').textContent = ` ${dataAtpValue}`;
                    fetchDataFromAPI(dataAtpValue);
                } else {
                    document.getElementById('data-atp').textContent = 'Data-ATP value not found';
                }
            }
        });
    }

});

function getAtpValueFromPage() {
    const element = document.querySelector("td[data-atp]");
    return element ? element.getAttribute("data-atp") : null;
}

function fetchDataFromAPI(dataAtpValue) {
    const apiUrl = `http://scmdb.mascorp.com/py/api/synergy/cr_data?crid=${dataAtpValue}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('integration-date').textContent = formatTimestamp(data.data.integration_date);
            document.getElementById('dry-run-date').textContent = formatTimestamp(data.data.dry_run_date);
            document.getElementById('custcmtsw-on-dock-date').textContent = formatTimestamp(data.data.custcmtsw_on_dock_date);
        })
        .catch(error => {
            // You can have a separate error field or reuse one of the existing ones to display the error
            document.getElementById('integration-date').textContent = 'Error fetching API data: ' + error.message;
        });
}

function formatTimestamp(epoch) {
    if (!epoch) return 'N/A';

    const date = new Date(epoch * 1000); // convert to milliseconds

    // Extracting month, day, and year
    const month = date.getMonth() + 1;  // getMonth returns month index, so we add 1 to get the actual month number
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

function isCheckboxChecked() {
    const checkbox = document.querySelector('#build_details_table input[type="checkbox"]:checked');
    return !!checkbox;
}