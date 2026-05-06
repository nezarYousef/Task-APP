
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}
function filterByStatus(val) {
    document.querySelectorAll('.task-card').forEach(card => {
        card.style.display = (!val || card.dataset.status === val) ? '' : 'none';
    });
}
function filterStatus(val, el) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
    filterByStatus(val);
}