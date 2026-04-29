function setTab(btn, cls) {
    document.querySelectorAll('.status-tab').forEach(t => t.className = 'status-tab');
    btn.classList.add(cls);
    const map = { 'active-waiting': 'Waiting', 'active-inprogress': 'In Progress', 'active-complete': 'Complete', 'active-canceled': 'Canceled' };
    const colorMap = { 'active-waiting': '#c06020', 'active-inprogress': 'var(--crimson)', 'active-complete': '#2d7a3a', 'active-canceled': 'var(--rose)' };
    const el = document.getElementById('statusDisplay');
    el.textContent = map[cls];
    el.style.color = colorMap[cls];
}
function updateProgress(val) {
    const circ = document.getElementById('progressCircle');
    const r = 46; const full = 2 * Math.PI * r;
    circ.style.strokeDasharray = full;
    circ.style.strokeDashoffset = full - (val / 100) * full;
    document.querySelector('.progress-pct').textContent = val + '%';
}
function toggleEdit() {
    alert('Edit mode — coming soon!');
}
function deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) window.location.href = 'dashboard.html';
}
const c = document.getElementById('progressCircle');
const r = 46; const full = 2 * Math.PI * r;
c.style.strokeDasharray = full;
c.style.strokeDashoffset = full - (68 / 100) * full;