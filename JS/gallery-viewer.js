(() => {
    const viewer = document.createElement('dialog');
    if (typeof viewer.showModal !== 'function') return;

    viewer.className = 'gif-viewer';
    viewer.setAttribute('aria-label', 'Expanded gameplay GIF');
    viewer.innerHTML = `
        <div class="gif-viewer-toolbar">
            <button type="button" class="gif-viewer-close" autofocus>
                Close ✕
            </button>
        </div>
        <img class="gif-viewer-image" alt="">
    `;
    document.body.append(viewer);

    const image = viewer.querySelector('.gif-viewer-image');
    let opener = null;
    let previousOverflow = '';

    document.addEventListener('click', (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey ||
            event.shiftKey || event.altKey) return;

        const link = event.target.closest('.project-gallery a[href]');
        if (!link || !/\.gif$/i.test(new URL(link.href).pathname)) return;

        event.preventDefault();
        opener = link;
        image.src = link.href;
        image.alt = link.querySelector('img')?.alt || 'Gameplay GIF';
        previousOverflow = document.documentElement.style.overflow;
        viewer.showModal();
        document.documentElement.style.overflow = 'hidden';
    });

    viewer.querySelector('.gif-viewer-close').addEventListener('click', () => {
        viewer.close();
    });

    // Click outside the dialog to return to the project page.
    viewer.addEventListener('click', (event) => {
        if (event.target !== viewer) return;
        const box = viewer.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right ||
            event.clientY < box.top || event.clientY > box.bottom) {
            viewer.close();
        }
    });

    // Escape closes a native dialog automatically, triggering this cleanup.
    viewer.addEventListener('close', () => {
        image.removeAttribute('src');
        document.documentElement.style.overflow = previousOverflow;
        opener?.focus({ preventScroll: true });
    });
})();