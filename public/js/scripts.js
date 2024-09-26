// scripts.js
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('mouseover', () => {
        item.querySelector('.dropdown-content').style.display = 'block';
    });
    item.addEventListener('mouseleave', () => {
        item.querySelector('.dropdown-content').style.display = 'none';
    });
});
