// ==========================================
// GLOBAL VARIABLES (Data Store)
// ==========================================
// Strictly an array of strings, pre-populated with 3 items as requested.
let projectList = ["Notes App", "Dev E-commerce", "Discord Bot"];

// ==========================================
// INITIALIZATION
// ==========================================
// This is the only loose code in the global scope: calling the setup function.
initializeApplication();

function initializeApplication() {
    // Attach event listeners to our static HTML buttons
    document.getElementById("btn-login").addEventListener("click", authenticateUser);
    document.getElementById("btn-add-end").addEventListener("click", addItemToEnd);
    document.getElementById("btn-add-start").addEventListener("click", addItemToStart);
    
    // Initial render of the hidden list (so it's ready when we log in)
    renderList();
}

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
function authenticateUser() {
    // 1. Capture the input values
    let userValue = document.getElementById("username").value;
    let passValue = document.getElementById("password").value;
    let errorContainer = document.getElementById("login-error");

    // 2. Validate empty fields
    if (userValue === "" || passValue === "") {
        errorContainer.innerHTML = "> SYSTEM_ERROR: CREDENTIAL_FIELDS_CANNOT_BE_EMPTY";
        return; // Stop execution
    }

    // 3. Validate correct credentials
    if (userValue === "aluno" && passValue === "fiap2025") {
        // Clear errors
        errorContainer.innerHTML = "";
        
        // Hide login screen, show main app container
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
    } else {
        // Show invalid credentials error
        errorContainer.innerHTML = "> ACCESS_DENIED: INVALID_USER_OR_PASSWORD";
    }
}

// ==========================================
// CRUD OPERATIONS (CREATE)
// ==========================================
function addItemToEnd() {
    let inputField = document.getElementById("new-project");
    let newItemText = inputField.value.trim();
    let errorContainer = document.getElementById("app-error");

    // Validate empty string
    if (newItemText === "") {
        errorContainer.innerHTML = "> ERROR: CANNOT_INJECT_EMPTY_DATA";
        return;
    }

    // Clear error, add item to the END of array, render, and clear input
    errorContainer.innerHTML = "";
    projectList.push(newItemText);
    renderList();
    inputField.value = "";
}

function addItemToStart() {
    let inputField = document.getElementById("new-project");
    let newItemText = inputField.value.trim();
    let errorContainer = document.getElementById("app-error");

    // Validate empty string
    if (newItemText === "") {
        errorContainer.innerHTML = "> ERROR: CANNOT_INJECT_EMPTY_DATA";
        return;
    }

    // Clear error, add item to the START of array, render, and clear input
    errorContainer.innerHTML = "";
    projectList.unshift(newItemText);
    renderList();
    inputField.value = "";
}

// ==========================================
// CRUD OPERATIONS (READ / RENDER)
// ==========================================
function renderList() {
    let ulElement = document.getElementById("project-list-ui");
    
    // Clear the current list in the DOM
    ulElement.innerHTML = "";

    // Loop over our simple string array and build the HTML dynamically
    for (let i = 0; i < projectList.length; i++) {
        let currentItem = projectList[i];
        
        // Create the HTML structure for the list item.
        // We inject the array index (i) directly into the inline onclick handlers 
        // to ensure strict index-based operations.
        ulElement.innerHTML += `
            <li>
                <span class="item-text">> ${currentItem}</span>
                <div class="item-actions">
                    <button onclick="editItem(${i})">[ EDIT ]</button>
                    <button class="btn-remove" onclick="removeItem(${i})">[ REMOVE ]</button>
                </div>
            </li>
        `;
    }
}

// ==========================================
// CRUD OPERATIONS (UPDATE)
// ==========================================
function editItem(indexToEdit) {
    let errorContainer = document.getElementById("app-error");
    
    // Use the native prompt to ask for new value, defaulting to the current value
    let updatedText = prompt("OVERRIDE DATA:", projectList[indexToEdit]);

    // Validation: If user clicks Cancel (null) or types nothing (empty string after trim)
    if (updatedText === null || updatedText.trim() === "") {
        // Array remains completely intact, display a warning
        errorContainer.innerHTML = "> WARNING: UPDATE_ABORTED_OR_EMPTY";
        return;
    }

    // Update the array exactly at that index and re-render
    errorContainer.innerHTML = "";
    projectList[indexToEdit] = updatedText.trim();
    renderList();
}

// ==========================================
// CRUD OPERATIONS (DELETE)
// ==========================================
function removeItem(indexToRemove) {
    let errorContainer = document.getElementById("app-error");
    
    // STRICT INDEX REMOVAL: Removes exactly 1 item starting at the given index.
    // This guarantees that identical text strings aren't mistakenly deleted.
    projectList.splice(indexToRemove, 1);
    
    errorContainer.innerHTML = "> NOTIFICATION: DATA_PURGED";
    
    // Re-render the UI to reflect the updated array
    renderList();
}