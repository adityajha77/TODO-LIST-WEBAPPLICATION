// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Load tasks from localStorage when the application starts
    loadTasks();

    // Add task when "ADD" button is clicked
    document.querySelector('button').addEventListener('click', addTask);

    // Add task when "Enter" key is pressed
    document.querySelector('#input-box').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Function to add a new task
    function addTask() {
        let inputBox = document.getElementById('input-box');
        let taskText = inputBox.value.trim();

        if (taskText === '') {
            alert("You must write something!");
            return;
        }

        // Get current date and time
        let currentDateTime = getCurrentDateTime();

        // Create new list item
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(taskText));

        // Create span for date and time
        let dateTimeSpan = document.createElement('span');
        dateTimeSpan.className = 'date-time';
        dateTimeSpan.textContent = ` (${currentDateTime})`;
        li.appendChild(dateTimeSpan);

        // Create close (delete) button for the task
        let span = document.createElement('span');
        span.textContent = "\u00D7"; // This is the "×" symbol
        span.className = "close";
        li.appendChild(span);

        // Add the new task to the list
        document.getElementById('list-container').appendChild(li);

        // Clear the input field
        inputBox.value = '';

        // Save task to localStorage
        saveTasks();

        // Add event listeners for the new task (toggle check and delete)
        addListEventListeners(li);
    }

    // Function to get current date and time
    function getCurrentDateTime() {
        let now = new Date();
        let date = now.toLocaleDateString(); // Get current date
        let time = now.toLocaleTimeString(); // Get current time
        return `${date}, ${time}`; // Return formatted date and time
    }

    // Function to toggle check and delete
    function addListEventListeners(li) {
        // Toggle checked class on click
        li.addEventListener('click', function(event) {
            if (event.target.tagName === 'LI') {
                li.classList.toggle('checked');
                saveTasks(); // Save tasks after checking/unchecking
            }
        });

        // Delete the task when the close button is clicked
        let closeButton = li.querySelector('.close');
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent triggering the li click event
            li.remove();
            saveTasks(); // Save tasks after deletion
        });
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        const listItems = document.querySelectorAll('ul li');

        listItems.forEach(item => {
            const taskText = item.childNodes[0].nodeValue; // Get the task text
            const dateTime = item.querySelector('.date-time').textContent; // Get the date and time
            const isChecked = item.classList.contains('checked'); // Check if the task is checked
            tasks.push({ taskText, dateTime, isChecked });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as a JSON string
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from localStorage

        tasks.forEach(task => {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(task.taskText));

            let dateTimeSpan = document.createElement('span');
            dateTimeSpan.className = 'date-time';
            dateTimeSpan.textContent = task.dateTime;
            li.appendChild(dateTimeSpan);

            let span = document.createElement('span');
            span.textContent = "\u00D7"; // This is the "×" symbol
            span.className = "close";
            li.appendChild(span);

            if (task.isChecked) {
                li.classList.add('checked'); // Mark task as checked if needed
            }

            document.getElementById('list-container').appendChild(li);
            addListEventListeners(li); // Add event listeners for the loaded task
        });
    }

    // Apply event listeners to existing list items (if any)
    let listItems = document.querySelectorAll('ul li');
    listItems.forEach(addListEventListeners);
});
