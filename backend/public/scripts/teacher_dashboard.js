document.addEventListener('DOMContentLoaded', function() {
    const sessionForm = document.getElementById('sessionForm');
    const studentList = document.getElementById('student-list');

    // Fetch and display enrolled students
    fetch('/enrolled_students')
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                const li = document.createElement('li');
                li.textContent = `${student.name} (${student.email})`;
                studentList.appendChild(li);
            });
        });

    // Handle session update form submission
    sessionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const time = document.getElementById('session-time').value;
        const meetLink = document.getElementById('meet-link').value;

        fetch('/update_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ time, meetLink })
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating session details!');
        });
    });
});