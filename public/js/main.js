

setTimeout(() => {
    const alert = document.querySelector('.alert.js-auto-dismiss');
    if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }
}, 5000);
