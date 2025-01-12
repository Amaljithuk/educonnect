document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('teacher-name').value;
    const email = document.getElementById('teacher-email').value;
    const password = document.getElementById('teacher-password').value;
    const confirmPassword = document.getElementById('teacher-confirm-password').value;
    const classes = Array.from(document.querySelectorAll('input[name="classes"]:checked')).map(checkbox => checkbox.value);
    const subject = document.getElementById('teacher-subject').value;
    const youtube = document.getElementById('teacher-youtube').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const data = {
        name,
        email,
        password,
        classes,
        subject,
        youtube
    };

    fetch('/teacher_signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        alert(result); // Show the result in an alert box
        if (result === 'Signup successful!') {
            window.location.href = 'teacher_login.html'; // Redirect to the login page
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error signing up!');
    });
});