function handleTagInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = e.target.value.trim().replace(',', '');
        if (!val) return;
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = val + ' <button class="tag-remove" onclick="removeTag(this)">×</button>';
        e.target.parentNode.insertBefore(tag, e.target);
        e.target.value = '';
    }
}
function removeTag(btn) {
    btn.parentNode.remove();
}
function setPriority(btn, cls) {
    document.querySelectorAll('.priority-btn').forEach(b => b.className = 'priority-btn');
    btn.classList.add(cls);
}
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('uploadPreview').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function submitTask() {
    const btn = document.querySelector('.btn-primary');
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Task Created!';
    setTimeout(() => window.location.href = 'dashboard.html', 1000);
}
const zone = document.getElementById('uploadZone');
zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
});
zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) {
        document.getElementById('fileInput').files = e.dataTransfer.files;
        previewImage(document.getElementById('fileInput'));
    }
});