// DOM Elements
const gridContainer = document.getElementById('gridContainer');
const boldIcon = document.getElementById('boldIcon');
const italicIcon = document.getElementById('italicIcon');
const underlineIcon = document.getElementById('underlineIcon');
const leftAlignIcon = document.querySelector('.fa-align-left');
const centerAlignIcon = document.querySelector('.fa-align-center');
const rightAlignIcon = document.querySelector('.fa-align-right');
const fontSizeInput = document.querySelector('.font_size_input');
const fontFamilyInput = document.querySelector('.font_family_input');
const textColorInput = document.getElementById("textColorInput");
const backgroundColorInput = document.getElementById("backgroundColorInput");
const addNoteButton = document.getElementById("addNoteButton");
const deleteAllNotesButton = document.getElementById("deleteNoteButton");
// changes made here is the user defined input of the color in the pin
const pinColorInput = document.getElementById("pinColorInput");


let notes = [];
let selectedText = null;

// Default styles
let defaultStyles = {
    color: "#000000",
    backgroundColor: "#ffffff",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left"
};

// Event listeners for styling
textColorInput.addEventListener("change", function() {
    defaultStyles.color = textColorInput.value;
    applyStyleToSelection("color", textColorInput.value);
});

backgroundColorInput.addEventListener("change", function() {
    defaultStyles.backgroundColor = backgroundColorInput.value;
    applyStyleToSelection("backgroundColor", backgroundColorInput.value);
});

fontSizeInput.addEventListener("change", function() {
    defaultStyles.fontSize = this.value + "px";
    applyStyleToSelection("fontSize", this.value + "px");
});

fontFamilyInput.addEventListener("change", function() {
    defaultStyles.fontFamily = this.value;
    applyStyleToSelection("fontFamily", this.value);
});

// Text formatting buttons
boldIcon.addEventListener("click", () => toggleFormat('fontWeight', 'bold', boldIcon));
italicIcon.addEventListener("click", () => toggleFormat('fontStyle', 'italic', italicIcon));
underlineIcon.addEventListener("click", () => toggleFormat('textDecoration', 'underline', underlineIcon));

// Alignment buttons
leftAlignIcon.addEventListener("click", () => setAlignment('left'));
centerAlignIcon.addEventListener("click", () => setAlignment('center'));
rightAlignIcon.addEventListener("click", () => setAlignment('right'));

// Note management
addNoteButton.addEventListener("click", addNote);
deleteAllNotesButton.addEventListener("click", () => {
    gridContainer.innerHTML = '';
    notes = [];
    renderNotesList();
});

// added  for the color backgound and test


// Show/hide color pickers when icons are clicked
textColorIcon.addEventListener("click", () => {
    textColorInput.click(); // Trigger the hidden color picker input
});

backgroundColorIcon.addEventListener("click", () => {
    backgroundColorInput.click(); // Trigger the hidden color picker input
});

// Apply the selected text color to the selected text
textColorInput.addEventListener("input", function() {
    const selectedColor = textColorInput.value;
    applyStyleToSelection('color', selectedColor); // Apply text color
});

// Apply the selected background color to the selected text
backgroundColorInput.addEventListener("input", function() {
    const selectedBgColor = backgroundColorInput.value;
    applyStyleToSelection('backgroundColor', selectedBgColor); // Apply background color
});
// till here


// Helper Functions
function toggleFormat(property, value, icon) {
    const newValue = defaultStyles[property] === value ? "normal" : value;
    defaultStyles[property] = newValue;
    icon.classList.toggle("selected", newValue === value);
    applyStyleToSelection(property, newValue);
}

function setAlignment(alignment) {
    defaultStyles.textAlign = alignment;
    document.querySelectorAll('.alignment_container i').forEach(icon => {
        icon.classList.remove('selected');
    });
    document.querySelector(`.fa-align-${alignment}`).classList.add('selected');
    applyStyleToSelection('textAlign', alignment);
}


// changes here made for the backgound test and color purpose
function applyStyleToSelection(styleType, styleValue) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText.length === 0) return;

    // Create a span element and apply the style to the selected text
    const span = document.createElement("span");
    span.style[styleType] = styleValue;
    span.textContent = selectedText;

    range.deleteContents(); // Remove the selected text
    range.insertNode(span); // Insert the styled text
}


function addNote() {
    if (notes.length >= 30) {
        alert("You cannot add more than 30 notes. Please delete some notes to continue.");
        return;
    }

    const noteContainer = document.createElement("div");
    noteContainer.className = 'note-container';

    const note = document.createElement('div');
    note.className = 'note';
    note.setAttribute('contenteditable', 'true');
    note.innerHTML = 'Write your note here...'; // Default content

    // Apply current styles to the new note
    applyCurrentStyles(note);

    // Create the pin button
    const pinButton = document.createElement('i');
    pinButton.className = 'fas fa-thumbtack pin-button';
    pinButton.addEventListener('click', () => togglePin(noteContainer, pinButton));

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', () => {
        noteContainer.remove();
        notes = notes.filter(n => n.content !== note.innerHTML);
        renderNotesList();
    });

    // Add event listener for highlighting terms
    note.addEventListener('blur', () => {
        highlightTerms(note);
    });

    // Create the "Read More" link
    const readMoreLink = document.createElement('a');
    readMoreLink.className = 'read-more-link';
    readMoreLink.innerHTML = 'Read More';
    readMoreLink.href = '#'; // Placeholder, will be changed later
    readMoreLink.addEventListener('click', (event) => {
        event.preventDefault();
        viewFullNote(note.innerHTML); // Show full note on another page
    });

    // Truncate note content to the first 15 words
    const fullContent = note.innerHTML; // Preserve the full content
    note.innerHTML = truncateText(fullContent, 15); // Display only the truncated content

    // Append elements to the note container
    noteContainer.appendChild(pinButton);
    noteContainer.appendChild(note);
    noteContainer.appendChild(readMoreLink);
    noteContainer.appendChild(deleteButton);

    // Append the note container to the grid
    gridContainer.appendChild(noteContainer);
    
    // Store the full note content in the notes array
    notes.push({ content: fullContent, pinned: false });
    renderNotesList();
}


// Function to truncate the text to a certain word count
function truncateText(text, wordCount) {
    const words = text.split(' ');
    return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : text;
}



// Function to view the full note (redirect to another page)
function viewFullNote(fullContent) {
    // Store the full note content in sessionStorage or localStorage
    sessionStorage.setItem('fullNoteContent', fullContent);

    // Redirect to the full note page (you'll need to create this page)
    window.location.href = 'fullnote.html';
}

// changes here are made for the user defined color of the pin 
function togglePin(noteContainer, pinButton) {
    noteContainer.classList.toggle("pinned");
    pinButton.classList.toggle("pinned-icon");

    const noteContent = noteContainer.querySelector('.note').innerHTML;
    const noteIndex = notes.findIndex(note => note.content === noteContent);

    if (noteIndex !== -1) {
        notes[noteIndex].pinned = !notes[noteIndex].pinned;
    }

    if (noteContainer.classList.contains("pinned")) {
        // Apply the user-selected color to the note background or text
        const selectedPinColor = pinColorInput.value;  // Get the chosen color
        noteContainer.style.backgroundColor = selectedPinColor;  // Apply as background color
        gridContainer.insertBefore(noteContainer, gridContainer.firstChild);
    } else {
        // Reset to default or previous color when unpinned (optional)
        noteContainer.style.backgroundColor = "";  // Reset background color
    }

    renderNotesList();
}

function applyCurrentStyles(noteContent) {
    Object.entries(defaultStyles).forEach(([property, value]) => {
        noteContent.style[property] = value;
    });
}

// Keywords highlighting functionality
const keywords = ['AI', 'machine learning', 'deep learning', 'data science', 'neural networks', 'computer vision'];

async function highlightTerms(note) {
    let content = note.innerHTML;
    
    for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        content = content.replace(regex, `<span class="highlighted" data-keyword="${keyword}">${keyword}</span>`);
    }
    
    note.innerHTML = content;
    
    note.querySelectorAll('.highlighted').forEach(element => {
        element.addEventListener('mouseenter', async () => {
            const keyword = element.getAttribute('data-keyword');
            const definition = await getKeywordDefinition(keyword);
            
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = definition;
            tooltip.style.display = 'block';
            tooltip.style.top = `${element.getBoundingClientRect().top + window.scrollY}px`;
            tooltip.style.left = `${element.getBoundingClientRect().left + window.scrollX}px`;
        });
        
        element.addEventListener('mouseleave', () => {
            document.getElementById('tooltip').style.display = 'none';
        });
    });
}

async function getKeywordDefinition(keyword) {
    try {
        const response = await fetch('http://localhost:5000/get-definition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: keyword }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.definition;
    } catch (error) {
        console.error('Error fetching definition:', error);
        return 'Definition not available';
    }
}

function renderNotesList() {
    const notesList = document.getElementById("notesList");
    if (!notesList) return;
    
    notesList.innerHTML = "";
    
    const sortedNotes = notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    
    sortedNotes.forEach(note => {
        const listItem = document.createElement("li");
        listItem.textContent = truncateText(note.content.replace(/<[^>]*>/g, ''), 5);
        listItem.classList.add(note.pinned ? "pinned" : "unpinned");
        notesList.appendChild(listItem);
    });
}

// Initialize
addNote();