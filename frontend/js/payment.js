$(document).ready(function () {
    // Initially hide UPI details
    $('.upi-details').hide();

    // Toggle UPI details on UPI option checkbox click
    $('#upioption').click(function () {
        const isChecked = $(this).prop('checked');
        $('.upi-details').toggle(isChecked); // Show or hide UPI details based on checkbox state
        $('#cardCheck').prop('disabled', isChecked); // Disable card option if UPI is selected
    });

    // Toggle Credit/Debit Card details on checkbox click
    $('#cardCheck').click(function () {
        const isChecked = $(this).prop('checked');
        $('.card-details').toggle(isChecked); // Show or hide card details based on checkbox state
        $('#upioption').prop('disabled', isChecked); // Disable UPI option if card is selected
    });
});

// Validate payment form before proceeding
function validatePaymentForm() {
    if ($('#cardCheck').prop('checked')) {
        if (!$('.card-details input').val()) {
            alert("Please fill in all card details.");
            return false;
        }
    } else if ($('#upioption').prop('checked')) {
        const upiMethod = $('#upiMethod').val();
        const upiID = $('#upiID').val();
        
        if (!upiMethod || !upiID) {
            alert("Please select a UPI method and provide a UPI ID.");
            return false;
        }

        // Additional validation based on selected UPI method
        if (upiMethod === "paytm" && !upiID.includes('@paytm')) {
            alert("Please enter a valid Paytm UPI ID.");
            return false;
        } else if (upiMethod === "phonepay" && !upiID.includes('@ybl')) {
            alert("Please enter a valid PhonePe UPI ID.");
            return false;
        } else if(upiMethod === "mobikwik" && !upiID.includes('@ikwik')){
            alert("Please enter a valid MobiKwik UPI ID.");
            return false;
        } else if(upiMethod === "other" && !upiID.includes('')){
            alert("Please enter a valid UPI ID.");
            return false;
        }
    }
    alert("your payment in process.....!") // Replace this with actual payment request handling
    return true;
}