/* ─── State ─────────────────────────────────────────────────── */
const state = {
    devices: {},
    layouts: {},
    languages: {},
    selectedDevice: 'iphone-6.7',
    selectedLang: 'ko',
    selectedLayout: 'center-top-text',
    uploadedFiles: [],       // [{id, filename, ext, width, height, objectUrl}]
    activeFileIndex: 0,
    // For batch: multi-select devices & langs
    batchDevices: new Set(['iphone-6.7']),
    batchLangs: new Set(['ko']),
};

let previewDebounce = null;

/* ─── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadDevices(),
        loadLayouts(),
        loadLanguages(),
    ]);
    setupDragDrop();
    setupColorListeners();
});

async function loadDevices() {
    const res = await fetch('/api/devices');
    state.devices = await res.json();
    renderDevices();
}

async function loadLayouts() {
    const res = await fetch('/api/layouts');
    state.layouts = await res.json();
    renderLayouts();
}

async function loadLanguages() {
    const res = await fetch('/api/languages');
    state.languages = await res.json();
    renderLanguages();
}

/* ─── Render: Devices ──────────────────────────────────────── */
function renderDevices() {
    const el = document.getElementById('deviceList');
    el.innerHTML = '';
    for (const [key, dev] of Object.entries(state.devices)) {
        const chip = document.createElement('div');
        chip.className = `chip ${key === state.selectedDevice ? 'active' : ''} ${state.batchDevices.has(key) ? 'multi-active' : ''}`;
        chip.textContent = dev.display_name;
        chip.dataset.key = key;
        chip.onclick = (e) => {
            if (e.shiftKey) {
                // Multi-select for batch
                if (state.batchDevices.has(key)) {
                    if (state.batchDevices.size > 1) state.batchDevices.delete(key);
                } else {
                    state.batchDevices.add(key);
                }
            }
            state.selectedDevice = key;
            state.batchDevices.add(key);
            renderDevices();
            updatePreviewDeviceInfo();
            debouncedPreview();
        };
        el.appendChild(chip);
    }
}

/* ─── Render: Languages ────────────────────────────────────── */
function renderLanguages() {
    const el = document.getElementById('langList');
    el.innerHTML = '';
    for (const [key, info] of Object.entries(state.languages)) {
        const chip = document.createElement('div');
        chip.className = `chip ${key === state.selectedLang ? 'active' : ''} ${state.batchLangs.has(key) ? 'multi-active' : ''}`;
        chip.textContent = `${info.flag} ${info.name}`;
        chip.dataset.key = key;
        chip.onclick = (e) => {
            if (e.shiftKey) {
                if (state.batchLangs.has(key)) {
                    if (state.batchLangs.size > 1) state.batchLangs.delete(key);
                } else {
                    state.batchLangs.add(key);
                }
            }
            state.selectedLang = key;
            state.batchLangs.add(key);
            renderLanguages();
            debouncedPreview();
        };
        el.appendChild(chip);
    }
}

/* ─── Render: Layouts ──────────────────────────────────────── */
function renderLayouts() {
    const el = document.getElementById('layoutList');
    el.innerHTML = '';
    for (const [key, layout] of Object.entries(state.layouts)) {
        const card = document.createElement('div');
        card.className = `layout-card ${key === state.selectedLayout ? 'active' : ''}`;
        card.innerHTML = `
            <span class="layout-icon">${layout.icon}</span>
            <span class="layout-name">${layout.name}</span>
        `;
        card.title = layout.description;
        card.onclick = () => {
            state.selectedLayout = key;
            renderLayouts();
            debouncedPreview();
        };
        el.appendChild(card);
    }
}

/* ─── Drag & Drop ──────────────────────────────────────────── */
function setupDragDrop() {
    const dz = document.getElementById('dropZone');
    const fi = document.getElementById('fileInput');

    dz.onclick = () => fi.click();

    dz.addEventListener('dragover', (e) => {
        e.preventDefault();
        dz.classList.add('dragover');
    });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fi.addEventListener('change', () => {
        handleFiles(fi.files);
        fi.value = '';
    });
}

async function handleFiles(fileList) {
    const fd = new FormData();
    for (const f of fileList) {
        fd.append('files', f);
    }

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();

        for (const f of data.files) {
            // Create local object URL for thumbnail
            const blob = fileList[state.uploadedFiles.length] || fileList[0];
            f.objectUrl = URL.createObjectURL(blob);
            state.uploadedFiles.push(f);
        }

        renderUploadedFiles();
        if (state.uploadedFiles.length === data.files.length) {
            state.activeFileIndex = 0;
        }
        debouncedPreview();
        toast(`${data.files.length} file(s) uploaded`, 'success');
    } catch (err) {
        toast('Upload failed', 'error');
    }
}

function renderUploadedFiles() {
    const el = document.getElementById('uploadedFiles');
    el.innerHTML = '';
    state.uploadedFiles.forEach((f, i) => {
        const pill = document.createElement('div');
        pill.className = `file-pill ${i === state.activeFileIndex ? 'active' : ''}`;
        pill.innerHTML = `
            <img class="thumb" src="${f.objectUrl}" alt="">
            <span>${f.filename.length > 15 ? f.filename.slice(0, 12) + '…' : f.filename}</span>
            <span class="remove" onclick="removeFile(${i}); event.stopPropagation();">✕</span>
        `;
        pill.onclick = () => {
            state.activeFileIndex = i;
            renderUploadedFiles();
            debouncedPreview();
        };
        el.appendChild(pill);
    });
}

function removeFile(index) {
    state.uploadedFiles.splice(index, 1);
    if (state.activeFileIndex >= state.uploadedFiles.length) {
        state.activeFileIndex = Math.max(0, state.uploadedFiles.length - 1);
    }
    renderUploadedFiles();
    debouncedPreview();
}

/* ─── Background ───────────────────────────────────────────── */
function onBgTypeChange() {
    const type = document.getElementById('bgType').value;
    document.getElementById('bgGradientSection').style.display = type === 'gradient' ? '' : 'none';
    document.getElementById('bgSolidSection').style.display = type === 'solid' ? '' : 'none';
    debouncedPreview();
}

function setupColorListeners() {
    ['bgColor1', 'bgColor2', 'bgColor3', 'bgSolidColor'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => debouncedPreview());
    });
}

function getBackgroundConfig() {
    const type = document.getElementById('bgType').value;
    if (type === 'solid') {
        return { type: 'solid', color: document.getElementById('bgSolidColor').value };
    }
    return {
        type: 'gradient',
        colors: [
            document.getElementById('bgColor1').value,
            document.getElementById('bgColor2').value,
            document.getElementById('bgColor3').value,
        ],
        angle: parseInt(document.getElementById('bgAngle').value),
    };
}

function applyBgPreset(colors, angle) {
    document.getElementById('bgType').value = 'gradient';
    onBgTypeChange();
    document.getElementById('bgColor1').value = colors[0];
    document.getElementById('bgColor2').value = colors[1] || colors[0];
    document.getElementById('bgColor3').value = colors[2] || colors[1] || colors[0];
    document.getElementById('bgAngle').value = angle;
    document.getElementById('bgAngleVal').textContent = angle;
    debouncedPreview();
}

/* ─── Preview ──────────────────────────────────────────────── */
function debouncedPreview() {
    clearTimeout(previewDebounce);
    previewDebounce = setTimeout(updatePreview, 400);
}

function updatePreviewDeviceInfo() {
    const dev = state.devices[state.selectedDevice];
    if (dev) {
        document.getElementById('previewDeviceInfo').textContent =
            `${dev.display_name} — ${dev.width}×${dev.height}`;

        // Update aspect ratio of preview frame
        const frame = document.getElementById('previewFrame');
        frame.style.aspectRatio = `${dev.width} / ${dev.height}`;
    }
}

async function updatePreview() {
    const frame = document.getElementById('previewFrame');
    const img = document.getElementById('previewImage');
    const placeholder = document.getElementById('previewPlaceholder');

    const activeFile = state.uploadedFiles[state.activeFileIndex];

    const body = {
        device: state.selectedDevice,
        lang: state.selectedLang,
        layout: state.selectedLayout,
        headline: document.getElementById('headline').value,
        subheadline: document.getElementById('subheadline').value,
        screenshot_id: activeFile ? activeFile.id : '',
        background: getBackgroundConfig(),
        frame: {
            show: document.getElementById('frameShow').checked,
            shadow: document.getElementById('frameShadow').checked,
        },
    };

    frame.classList.add('loading');
    updatePreviewDeviceInfo();

    try {
        const res = await fetch('/api/preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error('Preview failed');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        img.src = url;
        img.style.display = '';
        placeholder.style.display = 'none';
    } catch (err) {
        console.error('Preview error:', err);
    } finally {
        frame.classList.remove('loading');
    }
}

/* ─── Generate Single ──────────────────────────────────────── */
async function generateSingle() {
    const activeFile = state.uploadedFiles[state.activeFileIndex];
    if (!activeFile) {
        toast('Upload a screenshot first', 'error');
        return;
    }

    const body = {
        device: state.selectedDevice,
        lang: state.selectedLang,
        layout: state.selectedLayout,
        headline: document.getElementById('headline').value,
        subheadline: document.getElementById('subheadline').value,
        screenshot_id: activeFile.id,
        background: getBackgroundConfig(),
        frame: {
            show: document.getElementById('frameShow').checked,
            shadow: document.getElementById('frameShadow').checked,
        },
        format: 'png',
    };

    try {
        toast('Generating...', 'success');
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Generation failed');
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screenshot-${state.selectedDevice}-${state.selectedLang}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast('Downloaded!', 'success');
    } catch (err) {
        toast(err.message, 'error');
    }
}

/* ─── Batch Generate ───────────────────────────────────────── */
async function generateBatch() {
    if (state.uploadedFiles.length === 0) {
        toast('Upload screenshots first', 'error');
        return;
    }

    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    progressContainer.style.display = '';
    progressFill.style.width = '10%';
    progressText.textContent = 'Preparing...';

    const screenshots = state.uploadedFiles.map((f, i) => ({
        id: f.id,
        headline: document.getElementById('headline').value,
        subheadline: document.getElementById('subheadline').value,
        layout: state.selectedLayout,
    }));

    const body = {
        devices: Array.from(state.batchDevices),
        langs: Array.from(state.batchLangs),
        screenshots,
        background: getBackgroundConfig(),
        frame: {
            show: document.getElementById('frameShow').checked,
            shadow: document.getElementById('frameShadow').checked,
        },
        format: 'png',
    };

    const total = body.devices.length * body.langs.length * screenshots.length;
    progressText.textContent = `Generating ${total} screenshots...`;
    progressFill.style.width = '30%';

    try {
        const res = await fetch('/api/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        progressFill.style.width = '90%';
        progressText.textContent = 'Creating ZIP...';

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Batch failed');
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.headers.get('Content-Disposition')?.match(/filename=(.+)/)?.[1] || 'screenshots.zip';
        a.click();
        URL.revokeObjectURL(url);

        progressFill.style.width = '100%';
        progressText.textContent = `Done! ${total} screenshots generated.`;
        toast(`${total} screenshots generated!`, 'success');

        setTimeout(() => { progressContainer.style.display = 'none'; }, 3000);
    } catch (err) {
        progressText.textContent = `Error: ${err.message}`;
        progressFill.style.width = '100%';
        progressFill.style.background = 'var(--danger)';
        toast(err.message, 'error');
        setTimeout(() => {
            progressContainer.style.display = 'none';
            progressFill.style.background = '';
        }, 3000);
    }
}

/* ─── Reset ────────────────────────────────────────────────── */
function resetAll() {
    state.uploadedFiles = [];
    state.activeFileIndex = 0;
    state.selectedDevice = 'iphone-6.7';
    state.selectedLang = 'ko';
    state.selectedLayout = 'center-top-text';
    state.batchDevices = new Set(['iphone-6.7']);
    state.batchLangs = new Set(['ko']);

    document.getElementById('headline').value = '';
    document.getElementById('subheadline').value = '';
    document.getElementById('bgType').value = 'gradient';
    document.getElementById('bgColor1').value = '#1a1a2e';
    document.getElementById('bgColor2').value = '#16213e';
    document.getElementById('bgColor3').value = '#0f3460';
    document.getElementById('bgAngle').value = 135;
    document.getElementById('bgAngleVal').textContent = '135';
    document.getElementById('frameShow').checked = true;
    document.getElementById('frameShadow').checked = true;

    onBgTypeChange();
    renderDevices();
    renderLanguages();
    renderLayouts();
    renderUploadedFiles();

    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('previewPlaceholder').style.display = '';
    updatePreviewDeviceInfo();

    toast('Reset!', 'success');
}

/* ─── Toast ────────────────────────────────────────────────── */
function toast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = message;
    container.appendChild(t);

    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(100%)';
        t.style.transition = '0.3s ease';
        setTimeout(() => t.remove(), 300);
    }, 2500);
}
