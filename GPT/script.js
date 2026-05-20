/* ========================= */
/* GLOBAL ARRAY STORAGE */
/* ========================= */

/*
    The data is stored ONLY in a simple string array,
    as required in the instructions.
*/

let projectList = [
    "Notes App",
    "Dev E-commerce",
    "Discord Bot"
];

/* ========================= */
/* LOGIN FUNCTION */
/* ========================= */

/*
    Validates the user credentials
    and controls the application flow.
*/

function authenticateUser() {

    // Get input values
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Message element
    let loginMessage = document.getElementById("loginMessage");

    // Empty field validation
    if (username === "" || password === "") {

        loginMessage.innerHTML =
            "ERROR: ALL FIELDS MUST BE FILLED.";

        return;
    }

    // Static credentials validation
    if (username === "aluno" && password === "fiap2025") {

        // Clear error message
        loginMessage.innerHTML = "";

        // Hide login section
        document
            .getElementById("loginSection")
            .classList.add("hidden");

        // Show CRUD section
        document
            .getElementById("crudSection")
            .classList.remove("hidden");

        // Render initial list
        renderList();

    } else {

        // Wrong credentials message
        loginMessage.innerHTML =
            "ACCESS DENIED: INVALID CREDENTIALS.";
    }
}

/* ========================= */
/* RENDER LIST FUNCTION */
/* ========================= */

/*
    Dynamically creates the HTML
    for all array items.
*/

function renderList() {

    // UL container
    let listContainer =
        document.getElementById("projectListContainer");

    // Clear old HTML
    listContainer.innerHTML = "";

    // Loop through the array
    for (let index = 0; index < projectList.length; index++) {

        // Create LI element
        let itemHTML = `
            <li class="project-item">

                <span>${projectList[index]}</span>

                <div class="item-buttons">

                    <button
                        class="edit-button"
                        onclick="editItem(${index})"
                    >
                        EDIT
                    </button>

                    <button
                        class="remove-button"
                        onclick="removeItem(${index})"
                    >
                        REMOVE
                    </button>

                </div>

            </li>
        `;

        // Add item to UL
        listContainer.innerHTML += itemHTML;
    }
}

/* ========================= */
/* ADD ITEM TO END */
/* ========================= */

/*
    Inserts a new item at the end
    of the array using push().
*/

function addItemToEnd() {

    // Get input value
    let input =
        document.getElementById("projectInput");

    let newProject = input.value;

    // Message area
    let crudMessage =
        document.getElementById("crudMessage");

    // Validation for empty input
    if (newProject === "") {

        crudMessage.innerHTML =
            "ERROR: PROJECT NAME CANNOT BE EMPTY.";

        return;
    }

    // Add item to end
    projectList.push(newProject);

    // Clear message
    crudMessage.innerHTML = "";

    // Clear input
    input.value = "";

    // Update screen
    renderList();
}

/* ========================= */
/* ADD ITEM TO BEGINNING */
/* ========================= */

/*
    Inserts a new item at the beginning
    using unshift().
*/

function addItemToBeginning() {

    // Get input value
    let input =
        document.getElementById("projectInput");

    let newProject = input.value;

    // Message area
    let crudMessage =
        document.getElementById("crudMessage");

    // Validation
    if (newProject === "") {

        crudMessage.innerHTML =
            "ERROR: PROJECT NAME CANNOT BE EMPTY.";

        return;
    }

    // Add item to beginning
    projectList.unshift(newProject);

    // Clear message
    crudMessage.innerHTML = "";

    // Clear input
    input.value = "";

    // Re-render list
    renderList();
}

/* ========================= */
/* EDIT ITEM */
/* ========================= */

/*
    Allows the user to edit an item.
    Uses prompt() for simplicity.
*/

function editItem(index) {

    // Current value
    let currentProject = projectList[index];

    // Ask user for new value
    let updatedProject =
        prompt(
            "Edit the project:",
            currentProject
        );

    /*
        Validation Rules:
        - If user clicks Cancel -> keep original
        - If empty string -> keep original
    */

    if (
        updatedProject === null ||
        updatedProject === ""
    ) {

        return;
    }

    // Update item
    projectList[index] = updatedProject;

    // Update screen
    renderList();
}

/* ========================= */
/* REMOVE ITEM */
/* ========================= */

/*
    Removes an item strictly by index
    using splice(index, 1).
*/

function removeItem(index) {

    // Remove item using index
    projectList.splice(index, 1);

    // Re-render list
    renderList();
}

/* ========================= */
/* EVENT LISTENERS */
/* ========================= */

/*
    All button events are organized here.
*/

function configureEvents() {

    // Login button
    document
        .getElementById("loginButton")
        .addEventListener(
            "click",
            authenticateUser
        );

    // Add to end
    document
        .getElementById("addEndButton")
        .addEventListener(
            "click",
            addItemToEnd
        );

    // Add to beginning
    document
        .getElementById("addBeginningButton")
        .addEventListener(
            "click",
            addItemToBeginning
        );
}

/* ========================= */
/* INITIALIZATION */
/* ========================= */

/*
    Initial function call
    allowed by the requirements.
*/

configureEvents();