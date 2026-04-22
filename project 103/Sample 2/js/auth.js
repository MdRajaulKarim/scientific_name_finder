function sendOTP() {
    const phone = document.getElementById('phone').value;
    if(phone.length === 10) {
        document.getElementById('displayPhone').innerText = phone;
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        console.log("OTP Sent to:", phone); // Integrate your SMS API here
    } else {
        alert("Please enter a valid 10-digit number.");
    }
}

function verifyOTP() {
    const otp = document.getElementById('otp').value;
    if(otp === "123456") { // Dummy OTP for testing
        alert("Login Successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid OTP. Try 123456");
    }
}