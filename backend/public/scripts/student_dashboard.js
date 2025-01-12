document.addEventListener('DOMContentLoaded', function() {
    const subjectList = document.getElementById('subject-list');
    const teacherList = document.getElementById('teacher-list');
    const teachersSection = document.getElementById('teachers-section');

    // Fetch and display available subjects
    fetch('/available_subjects')
        .then(response => response.json())
        .then(data => {
            data.forEach(subject => {
                const li = document.createElement('li');
                li.textContent = subject;
                li.addEventListener('click', () => {
                    fetchTeachers(subject);
                });
                subjectList.appendChild(li);
            });
        });

    // Fetch and display teachers for selected subject
    function fetchTeachers(subject) {
        fetch(`/teachers?subject=${encodeURIComponent(subject)}`)
            .then(response => response.json())
            .then(data => {
                teacherList.innerHTML = '';
                data.forEach(teacher => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <h4>${teacher.name}</h4>
                        <p>Classes: ${teacher.classes}</p>
                        <p>Time: ${teacher.time}</p>
                        <a href="${teacher.youtube}" target="_blank">Watch Trial Video</a>
                        <button onclick="enroll('${teacher.id}')">Pay & Enroll</button>
                    `;
                    teacherList.appendChild(li);
                });
                teachersSection.style.display = 'block';
            });
    }

    // Handle enrollment
    window.enroll = function(teacherId) {
        fetch('/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teacherId })
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
            if (result === 'Enrollment successful!') {
                location.reload(); // Reload to show the updated link and time
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error enrolling!');
        });
    };
});