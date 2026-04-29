/* ── STATE ── */
let mode = 'signin';

/* ── SWITCH MODE ── */
function switchMode(m) {
    mode = m;
    const isSignup = m === 'signup';

    document.getElementById('tabSignIn').classList.toggle('active', !isSignup);
    document.getElementById('tabSignUp').classList.toggle('active', isSignup);

    document.getElementById('cardEyebrow').textContent = isSignup ? 'Join Momen Task' : 'Welcome back';
    document.getElementById('cardTitle').textContent = isSignup ? 'Create your account' : 'Sign in to your workspace';
    document.getElementById('cardSub').innerHTML = isSignup
        ? 'Already have an account? <a href="#" onclick="switchMode(\'signin\');return false;">Sign in</a>'
        : 'New here? <a href="#" onclick="switchMode(\'signup\');return false;">Create a free account</a>';

    document.querySelectorAll('.signup-only').forEach(el => el.classList.toggle('visible', isSignup));
    document.getElementById('strengthWrap').classList.toggle('show', isSignup);
    document.getElementById('rememberRow').style.display = isSignup ? 'none' : '';
    document.getElementById('submitBtn').textContent = isSignup ? 'Create Account' : 'Sign In';

    clearAllErrors();
}

/* ── TOGGLE PASSWORD VISIBILITY ── */
function togglePass(inputId, btnId) {
    const input = document.getElementById(inputId);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    document.getElementById(btnId).innerHTML = isText
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

/* ── VALIDATORS ── */
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function isValidName(v) { return v.trim().length >= 2; }
function calcStrength(v) {
    let s = 0;
    if (v.length >= 8) s++;
    if (v.length >= 12) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
}

/* ── FIELD STATE HELPERS ── */
function getInputEl(id) {
    return id === 'confirm'
        ? document.getElementById('confirmInput')
        : document.getElementById(id + 'Input');
}

function setFieldError(id, msg) {
    const input = getInputEl(id);
    const wrap = document.getElementById('wrap-' + id);
    const err = document.getElementById('err-' + id);
    const msgEl = document.getElementById('err-' + id + '-msg');
    if (input) { input.classList.add('error'); input.classList.remove('success'); }
    if (wrap) { wrap.classList.add('show-err'); wrap.classList.remove('show-ok'); }
    if (err) { err.classList.add('show'); }
    if (msgEl && msg) msgEl.textContent = msg;
}

function setFieldOk(id) {
    const input = getInputEl(id);
    const wrap = document.getElementById('wrap-' + id);
    const err = document.getElementById('err-' + id);
    if (input) { input.classList.remove('error'); input.classList.add('success'); }
    if (wrap) { wrap.classList.remove('show-err'); wrap.classList.add('show-ok'); }
    if (err) { err.classList.remove('show'); }
}

function clearField(id) {
    const input = getInputEl(id);
    const wrap = document.getElementById('wrap-' + id);
    const err = document.getElementById('err-' + id);
    if (input) { input.classList.remove('error', 'success'); }
    if (wrap) { wrap.classList.remove('show-err', 'show-ok'); }
    if (err) { err.classList.remove('show'); }
}

function clearAllErrors() {
    ['name', 'email', 'password', 'confirm', 'terms'].forEach(clearField);
    const hint = document.getElementById('matchHint');
    hint.className = 'match-hint';
    hint.textContent = '';
    updateStrengthBar('');
}

/* ── LIVE VALIDATION ── */
function liveValidate(field) {
    if (field === 'name' && mode === 'signup') {
        const v = document.getElementById('nameInput').value;
        if (!v) { clearField('name'); return; }
        isValidName(v)
            ? setFieldOk('name')
            : setFieldError('name', 'Name must be at least 2 characters');
    }

    if (field === 'email') {
        const v = document.getElementById('emailInput').value;
        if (!v) { clearField('email'); return; }
        isValidEmail(v)
            ? setFieldOk('email')
            : setFieldError('email', 'Enter a valid email — e.g. you@example.com');
    }

    if (field === 'password') {
        const v = document.getElementById('passInput').value;
        if (!v) { clearField('password'); updateStrengthBar(''); return; }
        if (mode === 'signup') updateStrengthBar(v);
        v.length >= 8
            ? setFieldOk('password')
            : setFieldError('password', 'Password must be at least 8 characters');
        // re-check confirm
        if (mode === 'signup' && document.getElementById('confirmInput').value)
            liveValidate('confirm');
    }

    if (field === 'confirm' && mode === 'signup') {
        const pass = document.getElementById('passInput').value;
        const conf = document.getElementById('confirmInput').value;
        const hint = document.getElementById('matchHint');
        if (!conf) { clearField('confirm'); hint.className = 'match-hint'; hint.textContent = ''; return; }
        if (conf === pass) {
            setFieldOk('confirm');
            hint.className = 'match-hint show ok';
            hint.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38a169" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Passwords match`;
        } else {
            setFieldError('confirm', 'Passwords do not match');
            hint.className = 'match-hint show bad';
            hint.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Passwords don't match`;
        }
    }

    if (field === 'terms' && mode === 'signup') {
        const ok = document.getElementById('termsCheck').checked;
        document.getElementById('err-terms').classList.toggle('show', !ok);
    }
}

/* ── STRENGTH BAR ── */
function updateStrengthBar(v) {
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (!v) { fill.style.width = '0%'; label.textContent = 'Strength: —'; label.style.color = 'var(--text-muted)'; return; }
    const s = calcStrength(v);
    const levels = [
        { w: '20%', bg: '#e53e3e', txt: 'Very Weak' },
        { w: '40%', bg: '#dd6b20', txt: 'Weak' },
        { w: '60%', bg: '#d69e2e', txt: 'Fair' },
        { w: '80%', bg: '#38a169', txt: 'Strong' },
        { w: '100%', bg: '#276749', txt: 'Very Strong' },
    ];
    const lvl = levels[Math.min(s - 1, 4)] || levels[0];
    fill.style.width = lvl.w;
    fill.style.background = lvl.bg;
    label.textContent = 'Strength: ' + lvl.txt;
    label.style.color = lvl.bg;
}

/* ── VALIDATE ALL ON SUBMIT ── */
function validateAll() {
    let valid = true;

    if (mode === 'signup') {
        const name = document.getElementById('nameInput').value.trim();
        if (!name) { setFieldError('name', 'Full name is required'); valid = false; }
        else if (!isValidName(name)) { setFieldError('name', 'Name must be at least 2 characters'); valid = false; }
        else setFieldOk('name');
    }

    const email = document.getElementById('emailInput').value.trim();
    if (!email) { setFieldError('email', 'Email address is required'); valid = false; }
    else if (!isValidEmail(email)) { setFieldError('email', 'Enter a valid email — e.g. you@example.com'); valid = false; }
    else setFieldOk('email');

    const pass = document.getElementById('passInput').value;
    if (!pass) { setFieldError('password', 'Password is required'); valid = false; }
    else if (pass.length < 8) { setFieldError('password', 'Password must be at least 8 characters'); valid = false; }
    else setFieldOk('password');

    if (mode === 'signup') {
        const conf = document.getElementById('confirmInput').value;
        if (!conf) { setFieldError('confirm', 'Please confirm your password'); valid = false; }
        else if (conf !== pass) { setFieldError('confirm', 'Passwords do not match'); valid = false; }
        else setFieldOk('confirm');

        const terms = document.getElementById('termsCheck').checked;
        if (!terms) {
            document.getElementById('err-terms').classList.add('show');
            valid = false;
        }
    }

    return valid;
}

/* ── SUBMIT ── */
function handleSubmit() {
    const btn = document.getElementById('submitBtn');
    if (!validateAll()) {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 400);
        showToast('Please fix the highlighted errors', 'error');
        return;
    }
    btn.disabled = true;
    btn.textContent = mode === 'signup' ? 'Creating account…' : 'Signing in…';
    btn.style.opacity = '0.8';
    showToast(mode === 'signup' ? 'Account created! Redirecting…' : 'Welcome back! Redirecting…', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1400);
}

/* ── TOAST ── */
let toastTimer = null;
function showToast(msg, type) {
    const toast = document.getElementById('toast');
    document.getElementById('toastDot').className = 'toast-dot ' + (type === 'error' ? 'red' : 'green');
    document.getElementById('toastMsg').textContent = msg;
    toast.className = 'toast show' + (type === 'error' ? ' error-toast' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3200);
}