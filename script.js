// Initial Balance (User can change this dynamically)
let totalBalance = parseInt(localStorage.getItem("totalBalance")) || 10000;
let lockedAmount = parseInt(localStorage.getItem("lockedAmount")) || 0;
let spendLimit = parseInt(localStorage.getItem("spendLimit")) || 0;
let otpCode = "";

// Update balance display
function updateBalanceDisplay() {
    let availableBalance = totalBalance - lockedAmount;
    document.getElementById("totalBalance").innerText = totalBalance;
    document.getElementById("lockedAmount").innerText = lockedAmount;
    document.getElementById("availableBalance").innerText = availableBalance;
}

// Load saved values
updateBalanceDisplay();
document.getElementById("lockStatus").innerText = lockedAmount ? `Locked: ₹${lockedAmount}` : "";
document.getElementById("limitStatus").innerText = spendLimit ? `Spending Limit: ₹${spendLimit}` : "";

function setLock() {
    let lockInput = parseInt(document.getElementById("lockAmount").value) || 0;
    
    if (lockInput <= 0) {
        document.getElementById("lockStatus").innerText = "❌ Enter a valid amount!";
        return;
    }
    
    if (lockInput > (totalBalance - lockedAmount)) {
        document.getElementById("lockStatus").innerText = "❌ Not enough balance!";
        return;
    }

    lockedAmount += lockInput;
    localStorage.setItem("lockedAmount", lockedAmount);
    updateBalanceDisplay();
    document.getElementById("lockStatus").innerText = `🔒 ₹${lockedAmount} is locked.`;
}

function setLimit() {
    spendLimit = parseInt(document.getElementById("spendLimit").value) || 0;
    localStorage.setItem("spendLimit", spendLimit);
    document.getElementById("limitStatus").innerText = `📉 Monthly limit: ₹${spendLimit}.`;
}

function makePayment() {
    let payment = parseInt(document.getElementById("paymentAmount").value) || 0;
    let availableBalance = totalBalance - lockedAmount;

    if (payment <= 0) {
        document.getElementById("paymentStatus").innerText = "❌ Enter a valid amount!";
        document.getElementById("paymentStatus").className = "error";
        return;
    }

    if (payment > availableBalance) {
        document.getElementById("paymentStatus").innerText = "❌ Insufficient funds!";
        document.getElementById("paymentStatus").className = "error";
        return;
    }

    if (payment > spendLimit) {
        let confirmPayment = confirm(`⚠ Warning: You are exceeding your limit!\nDo you want to proceed?`);
        if (!confirmPayment) {
            document.getElementById("paymentStatus").innerText = "❌ Payment canceled!";
            document.getElementById("paymentStatus").className = "error";
            return;
        }
    }

    // Process payment
    totalBalance -= payment;
    spendLimit -= payment;
    if (spendLimit < 0) spendLimit = 0;

    // Save updated values
    localStorage.setItem("totalBalance", totalBalance);
    localStorage.setItem("spendLimit", spendLimit);

    // Update UI
    updateBalanceDisplay();
    
    // Show success message
    document.getElementById("paymentStatus").innerText = `✅ Payment of ₹${payment} processed.`;
    document.getElementById("paymentStatus").className = "success";

    // Show remaining limit
    document.getElementById("limitStatus").innerText = `📉 Remaining limit: ₹${spendLimit}.`;
}
function sendOTP() {
    otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    alert(`Your OTP is: ${otpCode}`); // Simulating OTP via alert (Use real SMS API in production)
    document.getElementById("otpInput").disabled = false;
}

function unlockMoney() {
    let enteredOTP = document.getElementById("otpInput").value;
    
    if (enteredOTP === otpCode) {
        lockedAmount = 0;
        localStorage.setItem("lockedAmount", lockedAmount);
        updateBalanceDisplay();
        document.getElementById("otpStatus").innerText = "✅ Money Unlocked!";
        document.getElementById("otpStatus").className = "success";
        document.getElementById("lockStatus").innerText = "🔓 No money locked.";
    } else {
        document.getElementById("otpStatus").innerText = "❌ Incorrect OTP!";
        document.getElementById("otpStatus").className = "error";
    }
}
function clearData() {
    if (confirm("⚠ Are you sure you want to reset all data? This action cannot be undone!")) {
        localStorage.removeItem("totalBalance");
        localStorage.removeItem("lockedAmount");
        localStorage.removeItem("spendLimit");

        // Reset values to default
        totalBalance = 10000;
        lockedAmount = 0;
        spendLimit = 0;

        // Update UI
        updateBalanceDisplay();
        document.getElementById("lockStatus").innerText = "";
        document.getElementById("limitStatus").innerText = "";
        document.getElementById("paymentStatus").innerText = "";
        document.getElementById("otpStatus").innerText = "";
        
        alert("✅ All data has been reset!");
    }
}