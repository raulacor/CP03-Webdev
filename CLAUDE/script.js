/* ============================================================
   script.js — PROJECT::MATRIX
   Application Logic — Vanilla JS (no frameworks, no libraries)

   ARCHITECTURE OVERVIEW:
   ┌─────────────────────────────────────────────────────┐
   │  GLOBAL VARIABLES  (top of file — accessible to all │
   │                     named functions below)           │
   ├─────────────────────────────────────────────────────┤
   │  initMatrixRain()   — Canvas animation              │
   │  showError()        — UI helper                     │
   │  hideError()        — UI helper                     │
   │  updateStatusBar()  — UI helper                     │
   │  escapeHTML()       — Security helper               │
   │  renderList()       — READ / re-render              │
   │  addToEnd()         — CREATE via Array.push()       │
   │  addToBeginning()   — CREATE via Array.unshift()    │
   │  editItem(index)    — UPDATE via prompt()           │
   │  removeItem(index)  — DELETE via Array.splice()     │
   │  authenticateUser() — Login handler                 │
   │  logoutUser()       — Logout handler                │
   │  setupEventListeners() — Centralized event wiring   │
   │  init()             — Application entry point       │
   ├─────────────────────────────────────────────────────┤
   │  document.addEventListener("DOMContentLoaded", init)│
   │  — The ONLY call in global scope (besides variables)│
   └─────────────────────────────────────────────────────┘
   ============================================================ */


/* ── GLOBAL VARIABLE DECLARATIONS ────────────────────────────── */

/*
 * projectList — The core data structure.
 * A simple string array. ALL CRUD operations read from and write to
 * this array, then call renderList() to sync the UI with the data.
 *
 * RESTRICTIONS enforced throughout this file:
 *  - No objects, no unique IDs, no LocalStorage.
 *  - Only: push(), unshift(), splice(), and direct index access.
 */
let projectList = ["Notes App", "Dev E-commerce", "Discord Bot"];

/* Static credentials — hardcoded for this academic SPA */
const VALID_USER = "aluno";
const VALID_PASS = "fiap2025";

/* Stores the requestAnimationFrame ID so we could cancel the rain if needed */
let matrixRainAnimationId = null;


/* ============================================================
   SECTION A — MATRIX RAIN ANIMATION
   ============================================================ */

/**
 * initMatrixRain()
 *
 * Creates the iconic falling-character rain effect on the <canvas> element.
 *
 * HOW IT WORKS:
 *  1. Resize the canvas to fill the entire viewport.
 *  2. Divide the canvas width into columns (one per character width).
 *  3. Each column tracks a "drop" Y position.
 *  4. Every frame: paint a semi-transparent black rect over the canvas
 *     (this fades older characters, creating the trail effect), then
 *     draw a new random character at each column's current Y.
 *  5. When a drop reaches the bottom, reset it to the top with
 *     a small random chance (so columns reset at different times).
 */
function initMatrixRain() {
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");

    /* Resize canvas to exactly match the browser viewport */
    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* Character pool: katakana + Latin + numbers + symbols */
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>[]{}";
    const charArray = chars.split("");

    const fontSize = 14; /* Pixel size of each rain character */

    /* Array tracking the Y position (in rows) of each falling column */
    let drops = [];

    /* Populate the drops array — one entry per column */
    function initDrops() {
        const columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            /* Random starting Y so all columns don't start together */
            drops[i] = Math.random() * -(canvas.height / fontSize);
        }
    }
    initDrops();
    window.addEventListener("resize", initDrops);

    /* drawRain() — the animation loop, called via requestAnimationFrame */
    function drawRain() {
        /*
         * Semi-transparent black fill creates the "fade trail" effect.
         * Lower alpha = longer, more visible trails.
         * Higher alpha = shorter trails (characters disappear faster).
         */
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Draw one character per column */
        for (let i = 0; i < drops.length; i++) {
            /* Pick a random character from the pool */
            const char = charArray[Math.floor(Math.random() * charArray.length)];

            /* Vary brightness: occasional bright white "head" character */
            if (Math.random() > 0.97) {
                ctx.fillStyle = "rgba(180, 255, 200, 0.9)"; /* Bright flash */
            } else {
                /* Random alpha creates depth variation across the rain */
                const alpha = Math.random() * 0.4 + 0.4;
                ctx.fillStyle = "rgba(0, 200, 50, " + alpha + ")";
            }

            ctx.font = fontSize + "px 'Share Tech Mono', monospace";
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            /* Reset this column to the top with a random chance once it exits the screen */
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++; /* Move the drop down by one row each frame */
        }

        /* Schedule the next frame */
        matrixRainAnimationId = requestAnimationFrame(drawRain);
    }

    drawRain(); /* Kick off the animation loop */
}


/* ============================================================
   SECTION B — UI HELPER FUNCTIONS
   ============================================================ */

/**
 * showError(elementId, message)
 *
 * Displays a themed error message INSIDE the page (never alert/console.log).
 * The CSS class .error-message automatically prepends "⚠ ERROR :: ".
 *
 * @param {string} elementId - The ID of the <div> that will show the error.
 * @param {string} message   - The error description to display.
 */
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;   /* Set the text content safely */
    el.style.display = "block"; /* Make it visible */

    /* Auto-dismiss the error after 4.5 seconds for a clean terminal feel */
    setTimeout(function() {
        el.style.display = "none";
    }, 4500);
}

/**
 * hideError(elementId)
 *
 * Immediately hides an error message container.
 * Called after a successful operation to clear any lingering error.
 *
 * @param {string} elementId - The ID of the error container to hide.
 */
function hideError(elementId) {
    document.getElementById(elementId).style.display = "none";
}

/**
 * updateStatusBar(message)
 *
 * Updates the status bar at the top of the CRUD panel with a
 * contextual system message, and always syncs the live item count
 * with the current length of projectList.
 *
 * @param {string} message - The status text to display on the left side.
 */
function updateStatusBar(message) {
    document.getElementById("statusText").textContent = message;
    /* Always computed from the real array length — never a manual counter */
    document.getElementById("itemCount").textContent = "ITEMS: " + projectList.length;
}

/**
 * escapeHTML(str)
 *
 * Security function: converts special HTML characters in user-typed
 * strings into their safe HTML entity equivalents before inserting
 * into innerHTML. This prevents Cross-Site Scripting (XSS) attacks.
 *
 * Example: <script> becomes &lt;script&gt;
 *
 * HOW IT WORKS: Creates a temporary <div>, sets its text content
 * (which is always treated as plain text by the browser), then
 * reads back the innerHTML (which the browser has already escaped).
 *
 * @param {string} str - The raw user-provided string to sanitize.
 * @returns {string}   - The HTML-safe version of the string.
 */
function escapeHTML(str) {
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(document.createTextNode(str));
    return tempDiv.innerHTML;
}


/* ============================================================
   SECTION C — READ (renderList)
   ============================================================ */

/**
 * renderList()
 *
 * The central READ function. Clears the entire list in the DOM, then
 * re-builds it from scratch by iterating over the projectList array.
 *
 * This "full re-render" approach is simple and predictable:
 * after ANY operation (add, edit, remove), just call renderList()
 * and the screen will always perfectly reflect the array's state.
 *
 * DOM elements created per item:
 *  <li class="list-item">
 *    <span class="item-index">[00]</span>
 *    <span class="item-text">Project Name</span>
 *    <div class="item-actions">
 *      <button onclick="editItem(i)">EDIT</button>
 *      <button onclick="removeItem(i)">DEL</button>
 *    </div>
 *  </li>
 */
function renderList() {
    const ul = document.getElementById("projectList");

    /* Wipe existing items before rebuilding from the array */
    ul.innerHTML = "";

    /* Edge case: show a placeholder when the array has no items */
    if (projectList.length === 0) {
        ul.innerHTML = '<li class="empty-state">// NO PROJECTS FOUND — ARRAY IS EMPTY //</li>';
        updateStatusBar("ARRAY EMPTY — INJECT A PROJECT TO BEGIN");
        return;
    }

    /* Build one <li> for each string in the array */
    for (let i = 0; i < projectList.length; i++) {
        const li = document.createElement("li");
        li.className = "list-item";

        /*
         * The index `i` is baked into the onclick strings.
         * This means buttons always call editItem/removeItem with
         * the EXACT position of this item in the array at render time.
         *
         * escapeHTML() is called on the text to prevent XSS.
         */
        li.innerHTML =
            '<span class="item-index">[' + String(i).padStart(2, "0") + ']</span>' +
            '<span class="item-text">' + escapeHTML(projectList[i]) + '</span>' +
            '<div class="item-actions">' +
                '<button class="terminal-btn btn-accent btn-small" onclick="editItem(' + i + ')">EDIT</button>' +
                '<button class="terminal-btn btn-danger btn-small" onclick="removeItem(' + i + ')">DEL</button>' +
            '</div>';

        ul.appendChild(li);
    }

    /* Sync status bar after every render */
    updateStatusBar("SYSTEM READY — " + projectList.length + " PROJECT(S) LOADED");
}


/* ============================================================
   SECTION D — CREATE (Add Operations)
   ============================================================ */

/**
 * addToEnd()
 *
 * Reads the value from #newItemInput, validates it is not empty,
 * then appends it to the END of the projectList array using push().
 *
 * Array.push(value) → adds to position [length] (the last index).
 *
 * After modifying the array, calls renderList() to sync the UI.
 */
function addToEnd() {
    const input = document.getElementById("newItemInput");

    /*
     * .trim() removes leading and trailing whitespace.
     * This prevents items like "   " (only spaces) from being added.
     */
    const value = input.value.trim();

    /* VALIDATION: reject empty input */
    if (value === "") {
        showError("crudError", "FIELD CANNOT BE EMPTY — ENTER A PROJECT NAME TO PROCEED");
        return; /* Stop execution here — do NOT modify the array */
    }

    /* Add to END of array */
    projectList.push(value);

    /* Clear input field and dismiss any previous error */
    input.value = "";
    hideError("crudError");

    /* Re-render the list to show the updated array */
    renderList();
    updateStatusBar("PROJECT INJECTED AT END — INDEX [" + (projectList.length - 1) + "] ASSIGNED");
}

/**
 * addToBeginning()
 *
 * Reads the value from #newItemInput, validates it, then inserts it
 * at the BEGINNING (index 0) of the projectList array using unshift().
 *
 * Array.unshift(value) → shifts all existing elements up by one index,
 * and inserts the new value at index [0].
 *
 * After modifying the array, calls renderList() to sync the UI.
 */
function addToBeginning() {
    const input = document.getElementById("newItemInput");
    const value = input.value.trim();

    /* VALIDATION: reject empty input */
    if (value === "") {
        showError("crudError", "FIELD CANNOT BE EMPTY — ENTER A PROJECT NAME TO PROCEED");
        return;
    }

    /* Add to BEGINNING of array (index 0) */
    projectList.unshift(value);

    input.value = "";
    hideError("crudError");

    /* Re-render to reflect the new first item */
    renderList();
    updateStatusBar("PROJECT INJECTED AT TOP — SHIFTED ALL EXISTING INDICES UP");
}


/* ============================================================
   SECTION E — UPDATE (Edit Operation)
   ============================================================ */

/**
 * editItem(index)
 *
 * Prompts the user to modify the string at the given array index.
 * Uses browser's native prompt() dialog as specified (keeps logic simple
 * for academic explanation purposes).
 *
 * VALIDATION RULES enforced:
 *  1. If the user clicks "Cancel" → prompt() returns null → do nothing.
 *     The original value at projectList[index] is preserved unchanged.
 *  2. If the user clicks "OK" with an empty (or whitespace-only) field
 *     → reject the change and show an error. Original value preserved.
 *  3. Only update the array when a valid non-empty string is confirmed.
 *
 * @param {number} index - The exact position in projectList to update.
 */
function editItem(index) {
    const currentValue = projectList[index]; /* Read the current item for display in prompt */

    /*
     * prompt() opens a native browser dialog with a text field.
     * Returns: the string the user typed (if OK clicked)
     *          OR null (if Cancel clicked or Esc pressed).
     *
     * We pre-fill the field with the current value so the user
     * can see what they're editing.
     */
    const newValue = prompt(
        "[ EDIT PROJECT — INDEX " + index + " ]\n" +
        "Current: " + currentValue + "\n\n" +
        "Enter new project name:",
        currentValue /* Pre-fills the input with the existing value */
    );

    /* RULE 1: User clicked Cancel → null returned → abort silently */
    if (newValue === null) {
        updateStatusBar("EDIT CANCELLED — INDEX [" + index + "] UNCHANGED");
        return;
    }

    const trimmedValue = newValue.trim();

    /* RULE 2: User submitted empty string → reject → show error */
    if (trimmedValue === "") {
        showError("crudError", "EDIT ABORTED — VALUE CANNOT BE EMPTY — ORIGINAL VALUE PRESERVED");
        return;
    }

    /* RULE 3: Valid input → update this exact index in the array */
    projectList[index] = trimmedValue;

    /* Re-render to show the updated value */
    renderList();
    updateStatusBar("INDEX [" + index + "] UPDATED — ARRAY SYNCHRONIZED");
}


/* ============================================================
   SECTION F — DELETE (Remove Operation)
   ============================================================ */

/**
 * removeItem(index)
 *
 * Removes exactly ONE item from the projectList array at the
 * specified index position using Array.splice().
 *
 * WHY INDEX-BASED REMOVAL (not text-based)?
 * If the list contains duplicate values like:
 *   ["Notes App", "Notes App", "Discord Bot"]
 * A text search would be ambiguous — which "Notes App" to remove?
 * Using the index guarantees ONLY the clicked item is deleted,
 * even if other items have identical text content.
 *
 * Array.splice(startIndex, deleteCount):
 *   - startIndex  = where to begin removing
 *   - deleteCount = how many elements to remove (always 1 here)
 *
 * @param {number} index - The exact position in projectList to remove.
 */
function removeItem(index) {
    /* Capture the name before deletion for the status bar message */
    const removedName = projectList[index];

    /*
     * splice(index, 1) mutates the array in-place:
     *   - Removes the element at `index`
     *   - Shifts all subsequent elements down by one position
     *   - Returns an array of the removed elements (unused here)
     */
    projectList.splice(index, 1);

    /* Re-render — array is now one item shorter */
    renderList();
    updateStatusBar("DELETED: '" + removedName + "' — ARRAY REINDEXED");
}


/* ============================================================
   SECTION G — AUTHENTICATION
   ============================================================ */

/**
 * authenticateUser(event)
 *
 * Handles form submission on the login screen.
 * Validates the entered credentials against the static constants.
 *
 * FLOW:
 *  1. Prevent page reload (event.preventDefault).
 *  2. Read username and password from the DOM inputs.
 *  3. VALIDATION A: Reject if any field is empty.
 *  4. VALIDATION B: Reject if credentials don't match constants.
 *  5. SUCCESS: Hide login section → show app section → render list.
 *
 * Error messages are shown ON SCREEN inside #loginError div,
 * never via alert() or console.log() as per project requirements.
 *
 * @param {Event} event - The form's "submit" event object.
 */
function authenticateUser(event) {
    /* Prevent the browser from reloading the page on form submit */
    event.preventDefault();

    const usernameInput = document.getElementById("usernameInput").value.trim();
    const passwordInput = document.getElementById("passwordInput").value; /* Don't trim passwords */

    /* VALIDATION A: One or both fields are empty */
    if (usernameInput === "" || passwordInput === "") {
        showError("loginError", "ALL FIELDS REQUIRED — PROVIDE USER_ID AND PASSKEY");
        return;
    }

    /* VALIDATION B: Credentials don't match */
    if (usernameInput !== VALID_USER || passwordInput !== VALID_PASS) {
        showError("loginError", "ACCESS DENIED — INVALID CREDENTIALS — UNAUTHORIZED ENTITY DETECTED");
        /* Clear password field after failed attempt (security UX best practice) */
        document.getElementById("passwordInput").value = "";
        return;
    }

    /* ── LOGIN SUCCESS ── */

    /* Hide the login section from view */
    document.getElementById("loginSection").style.display = "none";

    /* Reveal the app section */
    document.getElementById("appSection").style.display = "flex";

    /*
     * Render the predefined projectList for the first time.
     * This is deliberately NOT called before login — the list area
     * should only appear after successful authentication.
     */
    renderList();
}

/**
 * logoutUser()
 *
 * Reverses the login flow: hides the app, shows the login screen,
 * and clears all form inputs for a clean state.
 * The projectList array is intentionally preserved in memory
 * (data would persist if the user logs back in during the same session).
 */
function logoutUser() {
    /* Hide the CRUD panel */
    document.getElementById("appSection").style.display = "none";

    /* Show the login screen again */
    document.getElementById("loginSection").style.display = "flex";

    /* Clear both input fields */
    document.getElementById("usernameInput").value = "";
    document.getElementById("passwordInput").value = "";

    /* Hide any lingering error messages */
    hideError("loginError");
}


/* ============================================================
   SECTION H — EVENT LISTENER SETUP
   ============================================================ */

/**
 * setupEventListeners()
 *
 * Attaches all event listeners to their DOM elements in one place.
 * Centralizing event wiring here keeps the code clean and easy to
 * audit — you can see every interactive element at a glance.
 *
 * NOTE: The EDIT and DEL buttons in the list use inline onclick=""
 * attributes (added dynamically in renderList()) rather than
 * addEventListener, because those elements don't exist at page load —
 * they're created dynamically with each renderList() call.
 */
function setupEventListeners() {
    /* ── Login Screen ── */

    /* Form submit → runs the authentication logic */
    document.getElementById("loginForm")
        .addEventListener("submit", authenticateUser);


    /* ── App Screen ── */

    /* Logout button → returns to login screen */
    document.getElementById("logoutBtn")
        .addEventListener("click", logoutUser);

    /* ADD_END button → appends to array tail */
    document.getElementById("addEndBtn")
        .addEventListener("click", addToEnd);

    /* ADD_TOP button → prepends to array head */
    document.getElementById("addBeginBtn")
        .addEventListener("click", addToBeginning);

    /*
     * Allow pressing ENTER in the new-item input to trigger addToEnd().
     * This is a UX improvement — users expect Enter to submit in a
     * terminal-style interface.
     */
    document.getElementById("newItemInput")
        .addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                addToEnd();
            }
        });
}


/* ============================================================
   SECTION I — APPLICATION ENTRY POINT
   ============================================================ */

/**
 * init()
 *
 * The single entry point for the entire application.
 * Called once by the DOMContentLoaded listener below.
 *
 * ORDER OF OPERATIONS:
 *  1. Start the Matrix rain canvas animation (visual layer).
 *  2. Wire all event listeners to their DOM targets.
 *  3. The login screen is shown by default (from HTML structure).
 *  4. renderList() is NOT called here — it runs after login success.
 */
function init() {
    initMatrixRain();       /* Start background animation */
    setupEventListeners();  /* Attach all interactive event handlers */
}


/* ── SINGLE GLOBAL CALL ─────────────────────────────────────── */
/*
 * This is the ONLY statement that executes in the global scope
 * (other than variable declarations at the top of this file).
 *
 * DOMContentLoaded fires once the HTML is fully parsed, ensuring
 * all getElementById() calls inside init() will find their elements.
 */
document.addEventListener("DOMContentLoaded", init);
