const galleryToggle = document.querySelector('.gallery-toggle');
const galleryPanel = document.getElementById('gallery-panel');

function openGalleryPanel() {
    galleryPanel.classList.add('is-open');
    galleryPanel.setAttribute('aria-hidden', 'false');
    galleryToggle.setAttribute('aria-expanded', 'true');
}

function closeGalleryPanel() {
    galleryPanel.classList.remove('is-open');
    galleryPanel.setAttribute('aria-hidden', 'true');
    galleryToggle.setAttribute('aria-expanded', 'false');
}

galleryToggle.addEventListener('click', () => {
    if (galleryPanel.classList.contains('is-open')) {
        closeGalleryPanel();
    } else {
        openGalleryPanel();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeGalleryPanel();
    }
});

document.addEventListener('click', (event) => {
    if (!galleryPanel.classList.contains('is-open')) return;
    if (galleryPanel.contains(event.target) || galleryToggle.contains(event.target)) return;
    closeGalleryPanel();
});

const galleryImages = galleryPanel.querySelectorAll('.gallery-panel-list img');
const greeting = document.querySelector('.greeting');

const bgLayers = [document.getElementById('bg-layer-a'), document.getElementById('bg-layer-b')];
let activeBgLayer = 0;

// 非表示レイヤーに次の画像を仕込んでからopacityを入れ替えることでクロスフェードさせる
function setBackgroundImage(src, { animate = true } = {}) {
    const currentLayer = bgLayers[activeBgLayer];
    const nextLayer = bgLayers[1 - activeBgLayer];

    if (!animate) {
        currentLayer.style.backgroundImage = `url('${src}')`;
        currentLayer.classList.add('is-visible');
        nextLayer.classList.remove('is-visible');
        return;
    }

    nextLayer.style.backgroundImage = `url('${src}')`;
    void nextLayer.offsetWidth; // transitionを効かせるための強制リフロー
    nextLayer.classList.add('is-visible');
    currentLayer.classList.remove('is-visible');
    activeBgLayer = 1 - activeBgLayer;

    greeting.classList.add('is-hidden');
}

function selectGalleryImage(image, options) {
    galleryImages.forEach((img) => img.classList.remove('is-active'));
    image.classList.add('is-active');
    setBackgroundImage(image.getAttribute('src'), options);
}

galleryImages.forEach((image) => {
    image.addEventListener('click', () => selectGalleryImage(image));
});

// スマホなどの縦画面では、横画面用の05.webpの代わりに04.webpを初期表示にする
if (window.matchMedia('(orientation: portrait)').matches) {
    const portraitDefault = Array.from(galleryImages).find(
        (img) => img.getAttribute('src') === 'Asset/Gallery/04.webp'
    );
    if (portraitDefault) {
        selectGalleryImage(portraitDefault, { animate: false });
    }
}
