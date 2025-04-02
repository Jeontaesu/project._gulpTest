let resizeTimeout;

export function resizeFont(divide = 'init') {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const referenceRatio = 1200 / 860;

    if (width >= 1200 && height >= 860) {
        document.documentElement.style.fontSize = '';
    } else if (aspectRatio > referenceRatio) {
        document.documentElement.style.fontSize = '1.15vh';
    } else {
        document.documentElement.style.fontSize = '0.8vw';
    }

    if (divide !== 'init') {
        if (window.currentSection === 6) window.currentSection = 5;

        const bullet = document.querySelector(
            `.pagination-bullet[data-idx="${window.currentSection}"]`,
        );
        if (bullet) bullet.click();
    }
}

export function debounceResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => resizeFont('resize'), 300);
}

// 초기 실행
resizeFont();
window.addEventListener('resize', debounceResize);
