# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```


# CS260 Web Programming Study Guide

## HTML & CSS Fundamentals

### What does the link element do?

The **`<link>`** element defines a relationship between the current HTML document and an external resource. It is placed in the `<head>` section and is commonly used to link external CSS stylesheets to HTML pages, but can also be used to import web fonts, define favicons, and reference other resources.

**Syntax:**
```html
<link rel="stylesheet" href="styles.css">
```

The `rel` attribute specifies the relationship type, and the `href` attribute specifies the URL of the resource.

---

### What does a div tag do?

The **`<div>`** element is a generic container that groups HTML elements together. It is a block-level element that takes up the full width available (stretches left and right as much as possible), starts on a new line, and is used for layout and styling purposes. Divs are used to group content into sections that can be styled with CSS or manipulated with JavaScript.

---

### What is the difference between the #title and .grid selector?

- **`#title`** is an **ID selector** that targets a single, unique element with `id="title"`. IDs must be unique within a page and can only be applied to one element. The ID selector has higher specificity than class selectors.

- **`.grid`** is a **class selector** that targets all elements with `class="grid"`. Classes can be applied to multiple elements on a page and are used for general styling across multiple elements.

**Key Difference:** The ID selector targets one specific element, while the class selector targets multiple elements.

---

### What is the difference between padding and margin?

| Property | Padding | Margin |
|----------|---------|--------|
| **Location** | Inside the element, between content and border | Outside the element, beyond the border |
| **Purpose** | Creates space inside an element, increasing its interactive size | Creates space outside an element, separating it from others |
| **Background** | Affected by the element's background color | Always transparent and unaffected |
| **Negative Values** | Cannot be negative | Can be negative |
| **Auto Value** | Cannot be set to auto | Can be set to auto |

**Example:**
- Padding: `padding: 20px;` creates space inside the element
- Margin: `margin: 15px;` creates space outside the element

---

## CSS Box Model

### In the CSS box model, what is the ordering of the box layers starting at the inside and working out?

The ordering from inside to outside is:

1. **Content** – The innermost area where text, images, or other content lives
2. **Padding** – The space between the content and the border
3. **Border** – The line that surrounds the padding and content
4. **Margin** – The space outside the border that separates the element from other elements

---

### By default, the HTML span element has a default CSS display property value of:

The default display property value for a `<span>` element is **`inline`**. This means it only takes up as much width as necessary and does not start on a new line. Unlike block-level elements, inline elements cannot have width and height properties applied to them unless you change the display property.

---

### How would you use CSS to change all the div elements to have a background color of red?

```css
div {
  background-color: red;
}
```

This CSS rule selects all `<div>` elements on the page and applies a red background color to them.

---

## JavaScript Functions & Methods

### What does the following code using arrow syntax function declaration do?

Arrow functions are a concise way to write functions in JavaScript using the `=>` syntax. They allow you to create function expressions with shorter syntax than traditional function declarations.

**Example:**
```javascript
const greetings = (name) => {
  console.log(`Hello, ${name}!`);
};

greetings('John'); // Output: Hello, John!
```

**Key Features:**
- Uses `const` instead of the `function` keyword
- Uses `=>` to indicate it's an arrow function
- Can omit curly braces and return keyword for single-line functions
- Can omit parentheses if there's only one parameter

---

### What does the following code using map with an array output?

The **`.map()`** method creates a new array by applying a callback function to each element of the original array. It does not modify the original array.

**Example:**
```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);
console.log(doubled); // Output: [2, 4, 6, 8]
```

The `map()` method:
- Takes each element from the original array
- Passes it through the callback function
- Creates a new array with the transformed results
- Returns the new array

---

### What does the following code output when executed using a for loop and console.log?

A for loop iterates over a specified range and executes code for each iteration. When combined with `console.log()`, it outputs each iteration's value to the browser console.

**Example:**
```javascript
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// Output:
// 0
// 1
// 2
```

---

## JavaScript DOM Manipulation

### What does the following code output using getElementByID and addEventListener?

**`getElementById()`** selects an element by its unique ID. **`addEventListener()`** attaches an event handler to an element that listens for specific events (like clicks) and executes a function when the event occurs.

**Example:**
```javascript
document.getElementById("myButton").addEventListener("click", function() {
  document.getElementById("demo").innerHTML = "Button was clicked!";
});
```

This code:
1. Selects an element with `id="myButton"`
2. Attaches a click event listener to it
3. When clicked, changes the HTML content of the element with `id="demo"` to "Button was clicked!"

---

### What does the following line of Javascript do using a # selector?

A **`#` selector** in JavaScript selects an element by its ID (the same as CSS ID selectors). It's typically used with `document.querySelector()` or `document.getElementById()`.

**Example:**
```javascript
const element = document.querySelector("#title");
element.style.color = "green";
```

This selects the element with `id="title"` and changes its text color to green.

---

### How would you use JavaScript to select an element with the id of "byu" and change the text color of that element to green?

```javascript
document.getElementById("byu").style.color = "green";
```

Or using `querySelector()`:

```javascript
document.querySelector("#byu").style.color = "green";
```

Both methods select the element with `id="byu"` and change its text color to green.

---

### Given the following HTML, what JavaScript could you use to set the text "animal" to "crow" and leave the "fish" text unaffected?

**HTML Example:**
```html
<p><span id="animal">animal</span> and <span id="fish">fish</span></p>
```

**JavaScript:**
```javascript
document.getElementById("animal").innerText = "crow";
```

Or:

```javascript
document.querySelector("#animal").innerText = "crow";
```

This selects only the element with `id="animal"` and changes its text to "crow", leaving the other text unchanged.

---

### Given the following HTML, what CSS would you use to set the text "trouble" to green and leave the "double" text unaffected?

**HTML Example:**
```html
<p>troublesome and <span id="trouble">trouble</span> and <span id="double">double</span></p>
```

**CSS:**
```css
#trouble {
  color: green;
}
```

This uses the ID selector to target only the element with `id="trouble"` and sets its text color to green.

---

## DOM & JavaScript Concepts

### Which of the following are true? (mark all that are true about the DOM)

**True statements about the DOM:**

1. The DOM (Document Object Model) is a programming interface for HTML and XML documents
2. The DOM represents the page as a tree structure of objects
3. JavaScript can access and modify DOM elements
4. DOM methods allow you to select, create, and delete elements
5. DOM properties allow you to get or set values of HTML elements
6. The DOM enables dynamic changes to page content without reloading
7. All HTML elements are represented as objects in the DOM
8. Event listeners can be attached to DOM elements to respond to user interactions

---

## HTML Tags & Structure

### What is the opening HTML tag for a paragraph, ordered list, unordered list, second level heading, first level heading, third level heading?

| Element | Opening Tag | Purpose |
|---------|-------------|---------|
| Paragraph | `<p>` | Defines a paragraph of text |
| Ordered List | `<ol>` | Defines a numbered list |
| Unordered List | `<ul>` | Defines a bulleted list |
| First Level Heading | `<h1>` | Main page heading (most important) |
| Second Level Heading | `<h2>` | Subheading |
| Third Level Heading | `<h3>` | Sub-subheading |

---

### How do you declare the document type to be html?

```html
<!DOCTYPE html>
```

This declaration must be placed at the very beginning of your HTML document to tell the browser that this is an HTML5 document.

---

### How would you display an image with a hyperlink in HTML?

To display a clickable image (an image that acts as a link), nest the `<img>` tag inside an `<a>` tag:

```html
<a href="https://www.example.com">
  <img src="image.jpg" alt="Clickable image">
</a>
```

When users click the image, they will be directed to the URL specified in the `href` attribute.

---

## JavaScript Control Flow

### What is valid javascript syntax for if, else, for, while, switch statements?

**If Statement:**
```javascript
if (condition) {
  // code to execute if condition is true
} else if (condition) {
  // code to execute if this condition is true
} else {
  // code to execute if no conditions are true
}
```

**For Loop:**
```javascript
for (let i = 0; i < 10; i++) {
  // code to repeat
}
```

**While Loop:**
```javascript
while (condition) {
  // code to repeat while condition is true
}
```

**Switch Statement:**
```javascript
switch (expression) {
  case value1:
    // code if expression === value1
    break;
  case value2:
    // code if expression === value2
    break;
  default:
    // code if no cases match
}
```

---

## JavaScript Objects

### What is the correct syntax for creating a javascript object?

```javascript
const myObject = {
  property1: "value1",
  property2: "value2",
  method1: function() {
    // function code
  }
};
```

Or using more modern syntax:

```javascript
const myObject = {
  property1: "value1",
  property2: "value2",
  method1() {
    // function code
  }
};
```

**Accessing properties:**
```javascript
myObject.property1; // "value1"
myObject["property2"]; // "value2"
```

---

### Is it possible to add new properties to javascript objects?

**Yes**, it is possible to add new properties to JavaScript objects at any time after they are created.

**Example:**
```javascript
const myObject = { name: "John" };
myObject.age = 30; // Adding a new property
myObject.city = "New York"; // Adding another property
```

---

## HTML & JavaScript Integration

### If you want to include JavaScript on an HTML page, which tag do you use?

The **`<script>`** tag is used to include JavaScript on an HTML page.

**Syntax:**
```html
<script>
  // JavaScript code here
  console.log("Hello, World!");
</script>
```

Or link to an external JavaScript file:

```html
<script src="script.js"></script>
```

The `<script>` tag is typically placed at the end of the `<body>` section to ensure the HTML loads before the JavaScript executes.

---

## JSON & Data Formats

### Which of the following correctly describes JSON?

**Correct descriptions of JSON:**

1. JSON stands for JavaScript Object Notation
2. JSON is a lightweight, text-based data format
3. JSON is language-independent and widely used for data interchange
4. JSON data is written as name/value pairs (key/value pairs)
5. JSON objects are enclosed in curly braces `{}`
6. JSON arrays are enclosed in square brackets `[]`
7. JSON strings must be enclosed in double quotes (not single quotes)
8. JSON supports data types: strings, numbers, objects, arrays, booleans, and null
9. JSON is commonly used to send data between servers and clients
10. JSON files typically have a `.json` extension

**Example JSON:**
```json
{
  "name": "John",
  "age": 30,
  "hobbies": ["reading", "gaming"],
  "isStudent": true
}
```

---

## Command-Line & System Commands

### What do the following console commands do: chmod, pwd, cd, ls, vim, nano, mkdir, mv, rm, man, ssh, ps, wget, sudo?

| Command | Purpose |
|---------|---------|
| **chmod** | Changes file and directory permissions |
| **pwd** | Prints the current working directory |
| **cd** | Changes the current directory |
| **ls** | Lists directory contents |
| **vim** | Text editor for creating/editing files |
| **nano** | Simple text editor for creating/editing files |
| **mkdir** | Creates a new directory |
| **mv** | Moves or renames files and directories |
| **rm** | Removes (deletes) files |
| **man** | Displays manual pages for commands |
| **ssh** | Creates a secure shell connection to a remote computer |
| **ps** | Displays running processes |
| **wget** | Downloads files from the internet |
| **sudo** | Runs commands with superuser (administrator) privileges |

---

### Which of the following console command creates a remote shell session?

**`ssh`** (Secure Shell) is the command that creates a remote shell session.

**Syntax:**
```bash
ssh user@hostname
```

Example:
```bash
ssh john@192.168.1.100
```

This creates a secure connection to the remote computer where you can execute commands as if you were logged in locally.

---

### Which of the following is true when the -la parameter is specified for the ls console command?

When using `ls -la`:

- **`-l`** displays files and directories in long format with detailed information (file permissions, ownership, size, date, etc.)
- **`-a`** shows all files, including hidden files (files starting with a dot)

Together, `ls -la` shows all files (including hidden ones) with complete details.

**Example output:**
```
drwxr-xr-x  5 user group  4096 Oct 22 12:34 Documents
-rw-r--r--  1 user group  1024 Oct 22 10:15 file.txt
-rw-r--r--  1 user group  2048 Oct 22 09:00 .hidden
```

---

## DNS & Domain Names

### For the domain name banana.fruit.bozo.click, which is the top level domain, which is a subdomain, which is the root domain?

**Given domain:** `banana.fruit.bozo.click`

Breaking it down from right to left:

- **Top Level Domain (TLD):** `.click` (the rightmost part, the highest level)
- **Root Domain:** `bozo.click` (the main domain)
- **Subdomains:** `fruit.bozo.click` and `banana.fruit.bozo.click`
  - `fruit` is a subdomain of `bozo.click`
  - `banana` is a subdomain of `fruit.bozo.click`

---

## Network & Security

### Is a web certificate necessary to use HTTPS?

**Yes**, a web certificate (SSL/TLS certificate) is necessary to use HTTPS. 

The SSL/TLS certificate:
- Enables encryption of data transmitted between the browser and server
- Authenticates that the website is legitimate
- Ensures data integrity so it cannot be tampered with during transmission
- Must be issued by a trusted Certificate Authority (CA)

Without a certificate, HTTPS cannot establish a secure connection.

---

### Can a DNS A record point to an IP address or another A record?

**A DNS A record can point to an IP address**, but **not to another A record**.

- An **A record** maps a domain name to an IPv4 address (e.g., `example.com` → `192.168.1.1`)
- A **CNAME record** (Canonical Name) can point to another domain name
- A **CNAME cannot point to an A record directly**, but can point to the domain that the A record points to

**Example:**
```
example.com       A record    → 192.168.1.1
www.example.com   CNAME       → example.com
```

---

### Port 443, 80, 22 is reserved for which protocol?

- **Port 80:** Reserved for **HTTP** (Hypertext Transfer Protocol) - unencrypted web traffic
- **Port 443:** Reserved for **HTTPS** (Hypertext Transfer Protocol Secure) - encrypted web traffic with SSL/TLS
- **Port 22:** Reserved for **SSH** (Secure Shell) - secure remote command-line access

---

## Asynchronous JavaScript

### What will the following code using Promises output when executed?

**Promises** are objects in JavaScript that represent the eventual completion of an asynchronous operation.

**Basic Example:**
```javascript
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

myPromise.then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
```

**Output after 1 second:**
```
Success!
```

**Using async/await (modern syntax):**
```javascript
async function myFunction() {
  const result = await myPromise;
  console.log(result);
}

myFunction();
```

**Promise States:**
- **Pending:** Initial state, operation hasn't completed yet
- **Fulfilled:** Operation completed successfully (resolved)
- **Rejected:** Operation failed (rejected)

---

## Flexbox Layout

### Given HTML and CSS, how will the images be displayed using flex?

**Basic Flexbox Example:**

```html
<div class="gallery">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
  <img src="image3.jpg" alt="Image 3">
</div>
```

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.gallery img {
  width: 100%;
  height: auto;
  flex: 1 1 calc(33.33% - 10px);
}
```

**How images display with flex:**
- Images are arranged horizontally in a row
- `flex-wrap: wrap` allows images to wrap to the next line if there's not enough space
- `gap: 10px` creates space between images
- `justify-content: center` centers images horizontally
- Each image takes up approximately 33.33% width (responsive)
- `flex: 1 1 calc(33.33% - 10px)` makes images flexible and responsive

**Responsive with media queries:**
```css
@media (max-width: 900px) {
  .gallery img {
    flex: 1 1 calc(50% - 10px);  /* 2 columns */
  }
}

@media (max-width: 600px) {
  .gallery img {
    flex: 1 1 100%;  /* 1 column */
  }
}
```

---

### What does the following padding CSS do?

**Padding properties control the space inside an element, between its content and border.**

**Examples:**

**Single value (all sides):**
```css
padding: 20px;  /* 20px on all sides */
```

**Two values (vertical and horizontal):**
```css
padding: 10px 20px;  /* 10px top/bottom, 20px left/right */
```

**Four values (top, right, bottom, left):**
```css
padding: 10px 20px 10px 20px;  /* clockwise from top */
```

**Individual sides:**
```css
padding-top: 10px;
padding-right: 20px;
padding-bottom: 10px;
padding-left: 20px;
```

Padding is filled with the element's background color and increases the element's total size (unless `box-sizing: border-box` is used).

---

## Summary

This study guide covers the major topics in CS260:
- **HTML basics:** Tags, elements, structure
- **CSS:** Selectors, box model, layout properties
- **JavaScript:** Functions, DOM manipulation, control flow, asynchronous programming
- **Data formats:** JSON
- **Command line:** Common Linux/Unix commands
- **Web infrastructure:** DNS, HTTPS, ports, security
- **Advanced layouts:** Flexbox, responsive design



# MongoDB Database Integration

## What I Learned
- MongoDB is a NoSQL database that stores data as JSON documents
- Connection strings use mongodb+srv:// format for Atlas
- Async/await is essential for database operations
- Collections are like tables, documents are like rows

## Changes Made
- Created `service/database.js` with all MongoDB operations
- Updated `service/index.js` to use database functions instead of in-memory arrays
- All user data now persists in MongoDB
- Authentication uses hashed passwords (bcryptjs)
- Bounties and submissions store in MongoDB collections

## Key Files
- `service/database.js` - All database operations
- `service/index.js` - API endpoints using MongoDB
- `service/dbConfig.json` - MongoDB credentials (gitignored)

## How It Works
1. User signs up → password hashed → stored in `users` collection
2. User posts bounty → stored in `bounties` collection
3. User submits → stored in `submissions` collection
4. All data persists even after server restart

CS260 Final Exam Study Guide
Network Protocols & Ports
Default Ports:

HTTP: 80

HTTPS: 443

SSH: 22

Ports are like apartment numbers for services

HTTP Status Codes
Range	Meaning	Examples
2xx	Success	200 OK, 201 Created
3xx	Redirection	301 Permanent, 302 Found
4xx	Client Error	400 Bad Request, 401 Unauthorized, 404 Not Found
5xx	Server Error	500 Internal, 503 Unavailable
Key: 300/400/500 = PROBLEMS

HTTP Headers
Content-Type
text
Content-Type: application/json
Content-Type: text/html
Content-Type: image/png
Purpose: Tells receiver how to parse the body data.

Example:

js
fetch('/api/users', {
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(user)
});
Cookie Security Flags
Flag	Purpose	Effect
Secure	HTTPS only	❌ HTTP, ✅ HTTPS
HttpOnly	Block JS access	document.cookie can't read
SameSite	CSRF protection	Strict = same site only
Your Bounty Hunter backend:

js
res.cookie('token', token, {
  secure: true,
  httpOnly: true,
  sameSite: 'strict'
});
Express Middleware Flow
GET /api/document with:

js
app.use(express.json());
app.use('/api', apiRouter);
apiRouter.get('/document', (req, res) => console.log('handler'));
Order: json() → /api match → document handler
Output: handler

Fetch Response Pattern
Backend:

js
app.post('/api/users', (req, res) => res.json({id: 1, name: 'Mark'}));
Frontend:

js
const res = await fetch('/api/users');
const data = await res.json(); // {id: 1, name: 'Mark'}
MongoDB Queries
Exact match:

js
db.users.find({ name: "Mark" })
Matches:

js
{ name: "Mark", age: 25 }     ✅
{ name: "mark", age: 30 }     ❌ (case-sensitive)
Fuzzy:

js
db.users.find({ name: { $regex: /Mark/i } })
Password Storage
✅ Correct:

js
const hash = await bcrypt.hash(password, 10);
db.users.insertOne({ email, password: hash });
❌ Never: Plain text passwords

WebSocket Flow
Backend:

js
wss.on('connection', ws => ws.send('Welcome!'));
Frontend:

js
ws.onmessage = e => console.log(e.data); // "Welcome!"
WebSocket Purpose
HTTP: Request → Response → Disconnect
WebSocket: Persistent bidirectional connection

Use cases: Chat, live notifications, gaming

Acronyms
Acronym	Full Form
JSX	JavaScript XML
JS	JavaScript
AWS	Amazon Web Services
NPM	Node Package Manager
NVM	Node Version Manager
React useState Hook
Before:

jsx
class Counter extends React.Component {
  state = { count: 0 };
  render() { return <div>{this.state.count}</div>; }
