// Generate random OTP for demo purposes
let generatedOTP = '';
let userPhoneForOTP = '';

function sendOTP() {
    const phone = document.getElementById('phone').value;

    // Validate phone number
    if(!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Store phone and generate OTP
    userPhoneForOTP = phone;
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Display masked phone
    const maskedPhone = phone.slice(0, -4) + 'XXXX';
    document.getElementById('displayPhone').innerText = maskedPhone;

    // Switch to OTP step
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';

    console.log(`OTP Sent to ${phone}: ${generatedOTP}`);
    // In production, integrate with Twilio/AWS SNS for actual SMS
}

function verifyOTP() {
    const otp = document.getElementById('otp').value;

    if(!otp || otp.length !== 6) {
        alert("Please enter a valid 6-digit OTP.");
        return;
    }

    if(otp === generatedOTP) {
        // Store user session
        sessionStorage.setItem('userPhone', userPhoneForOTP);
        sessionStorage.setItem('isLoggedIn', 'true');
        alert("✓ Login Successful!");
        window.location.href = "index.html";
    } else {
        alert("❌ Invalid OTP. Please try again.");
    }
}