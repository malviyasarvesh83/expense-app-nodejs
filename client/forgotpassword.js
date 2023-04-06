const login = () => {
    location.href = 'login.html';
}

// Function to Validate Form

const validateForm = () => {
    let email = document.getElementById('email').value;
    if (email == '') {
        alert('Email is Required');
        return false;
    }
    return true;
}

// Function to send Mail

const forgotMail = async () => {
    try {
        if (validateForm() == true) {
            let email = document.getElementById('email').value;
            const token = localStorage.getItem('token');
            let response = await axios.post('http://localhost:8000/password/forgotpassword', { email: email });
            console.log(response);
            document.getElementById("message").textContent = response.data.message;
        }
    } catch (error) {
        console.log(error);
    }
}