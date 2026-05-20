Act as a senior web developer, UX/UI expert, and programming teacher. My task is to create a simple academic web application (conceptual Single Page Application) using ONLY pure HTML, CSS, and JavaScript (Vanilla JS), without any external framework or library. Apply your UX and UI skills to create an immersive experience.

Strictly follow all instructions, restrictions, and validations below to build the code.

1. CONTEXT AND THEME
The application's theme will be a "Project Ideas List". The design must be heavily inspired by "The Matrix" movie. Apply a very dark aesthetic, using predominantly black backgrounds and neon green colors, simulating hacker terminals, glowing text, and the visual style of the film. Upon loading, the list must start with 3 predefined items (strings) already visible on the screen (once logged in).

2. ARCHITECTURE AND TECHNICAL REQUIREMENTS (MANDATORY)
Separated Files: Provide the structured solution strictly divided into three separate files: index.html, style.css, and script.js. Do not put them all in a single file.

Data Storage: Data MUST be stored strictly in a basic string array (e.g., let projectList = ["Notes App", "Dev E-commerce", "Discord Bot"];). The use of object arrays, complex unique IDs, or LocalStorage is strictly FORBIDDEN.

Code Organization: All JavaScript logic must be organized within named functions (e.g., function renderList(), function authenticateUser()). There should be no loose code in the global scope, except for global variable declarations and the initial call to render the page.

Allowed Features: Use only fundamental JavaScript features for DOM manipulation (like document.getElementById, addEventListener, innerHTML, push, unshift, splice). Avoid overly complex higher-order methods or modern syntaxes that require advanced explanations.

3. APPLICATION FLOW AND FEATURES
A) Login Screen (Initial State)
The application must start by showing only the login form. The list area must start hidden (use visibility CSS classes or display manipulation via JS).

The correct static credentials are:

User: aluno

Password: fiap2025

Validation: If the user tries to submit empty fields, display an error message on the screen. If the credentials are wrong, display a visible error message on the screen (do not just use console.log or alert). Make these error messages fit the hacker/Matrix theme visually.

If the login is successful, hide the login form and display the CRUD screen.

B) List with Full CRUD (Post-Login)
After authenticating, the user must be able to perform the following operations that update the array and the screen automatically:

Add to End: A text field and a button to insert a new item at the end of the array.

Add to Beginning: A button or option to insert the new item at the beginning of the array.

View (Read): Display the array items dynamically on the screen in a list.

Edit (Update): When clicking "Edit" on an item, the system must allow changing it (it can be via a browser prompt() to simplify).

Remove (Delete): When clicking "Remove", the item must be deleted from the array.

4. MANDATORY CRUD VALIDATIONS
Empty Fields: No item can be added or saved if it is empty. An error message must be displayed on the user's screen.

Edit Rule: When editing an item, if the user clicks "Cancel" in the prompt or clears the text leaving it empty, the original item MUST remain intact in the array, without undergoing changes.

Index-Based Removal Rule: The removal of the item must be done strictly based on its index in the array (using the splice(index, 1) method), and NEVER by the text value. This ensures that if there are two items with the same name in the list, only the clicked item is removed.

OUTPUT FORMAT
Provide the clean code across the three requested files. Ensure the code is well-commented, explaining the function of each block (which will help me explain the code in my academic video). Focus on an interface that applies strong UI/UX principles while strictly adhering to the dark Matrix aesthetic.