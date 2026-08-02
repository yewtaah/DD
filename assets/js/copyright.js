document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('copyyear');
    if (el) el.textContent = new Date().getFullYear();
});
