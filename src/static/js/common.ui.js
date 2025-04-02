import { resizeFont, debounceResize } from './resize.js';

resizeFont();
window.addEventListener('resize', debounceResize);

const UIhandler = {
    Input(e) {
        if (e.target.matches('.input__text > input')) {
            const inputValue = e.target.value;
            const parent = e.target.closest('.input__text');
            const clearButton = parent.querySelector('.btn-clear');

            if (inputValue.length > 0) {
                clearButton.classList.add('on');
            } else {
                clearButton.classList.remove('on');
            }
        }
    },

    ClearButton(e) {
        if (e.target.matches('.input__wrap .btn-clear')) {
            const parent = e.target.closest('.input__text');

            if (parent) {
                parent.querySelector('input').value = '';
                e.target.classList.remove('on');
            }
        }
    },

    Tabs(e) {
        const button = e.target;
        if (!button.matches('.tab-btn')) return;

        const container = button.closest('.tab-container');
        if (!container) return;

        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');
        const buttonIndex = Array.from(tabButtons).indexOf(button);

        // 활성화된 클래스 제거
        tabButtons.forEach((btn) => btn.classList.remove('on'));
        tabContents.forEach((content) => content.classList.remove('show'));

        // 선택한 탭 활성화
        button.classList.add('on');
        tabContents[buttonIndex].classList.add('show');
    },

    bindEvents() {
        document.addEventListener('keyup', this.Input);
        document.addEventListener('click', this.ClearButton);
        document.addEventListener('click', this.Tabs);
    },

    init() {
        this.bindEvents();
    },
};

// 이벤트 리스너 초기화
UIhandler.init();
