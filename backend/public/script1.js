document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-email').value;
    const password = document.getElementById('student-password').value;
    const confirmPassword = document.getElementById('student-confirm-password').value;
    const studentClass = document.getElementById('student-class').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const data = {
        name,
        email,
        password,
        class: studentClass
    };
    
    fetch('/student_signup', {
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
            window.location.href = 'student_login.html'; // Redirect to the login page
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error signing up!');
    });
});