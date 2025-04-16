// import { resizeFont, debounceResize } from './resize.js';

// resizeFont();
// window.addEventListener('resize', debounceResize);

const UIhandler = {
    // Input 함수
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

    // Input ClearButton 함수
    ClearButton(e) {
        if (e.target.matches('.btn-clear')) {
            const parent = e.target.closest('.input__text');

            if (parent) {
                parent.querySelector('input').value = '';
                e.target.classList.remove('on');
            }
        }
    },

    // Tab 함수
    Tabs(e) {
        const button = e.target;
        if (!button.matches('.tabs__btn')) return;

        const container = button.closest('.tabs');
        if (!container) return;

        const tabButtons = container.querySelectorAll('.tabs__btn');
        const tabContents = container.querySelectorAll('.tabs__content');
        const buttonIndex = Array.from(tabButtons).indexOf(button);

        // 활성화된 클래스 제거
        tabButtons.forEach((btn) => btn.classList.remove('on'));
        tabContents.forEach((content) => content.classList.remove('show'));

        // 선택한 탭 활성화
        button.classList.add('on');
        tabContents[buttonIndex].classList.add('show');
    },

    // Custom SelectBox 함수
    CustomSelect() {
        document
            .querySelectorAll('.input__selectBox')
            .forEach((selectWrapper) => {
                const selectElement = selectWrapper.querySelector('select');
                const customSelect = document.createElement('div');
                customSelect.className = 'custom-select';

                const selectedOption = document.createElement('div');
                selectedOption.className = 'selected-option';
                selectedOption.textContent =
                    selectElement.options[selectElement.selectedIndex].text;
                selectedOption.setAttribute('tabindex', '0');

                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'options-container';

                Array.from(selectElement.options).forEach((option, index) => {
                    const customOption = document.createElement('div');
                    customOption.className = 'custom-option';
                    customOption.textContent = option.text;
                    customOption.dataset.value = option.value;
                    customOption.setAttribute('tabindex', '0');

                    customOption.addEventListener('click', () => {
                        selectElement.selectedIndex = index;
                        selectedOption.textContent = option.text;
                        customSelect.classList.remove('open');
                        selectElement.dispatchEvent(
                            new Event('change', { bubbles: true }),
                        );
                        selectedOption.focus();
                    });

                    optionsContainer.appendChild(customOption);
                });

                selectElement.style.display = 'none';
                customSelect.append(selectedOption, optionsContainer);
                selectWrapper.appendChild(customSelect);

                selectedOption.addEventListener('click', (e) => {
                    e.stopPropagation();
                    customSelect.classList.toggle('open');
                });

                selectedOption.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        customSelect.classList.toggle('open');
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        optionsContainer
                            .querySelector('.custom-option')
                            ?.focus();
                    }
                });

                optionsContainer.addEventListener('keydown', (e) => {
                    const options = [
                        ...optionsContainer.querySelectorAll('.custom-option'),
                    ];
                    let currentIndex = options.indexOf(document.activeElement);

                    if (
                        e.key === 'ArrowDown' &&
                        currentIndex < options.length - 1
                    ) {
                        e.preventDefault();
                        options[currentIndex + 1].focus();
                    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                        e.preventDefault();
                        options[currentIndex - 1].focus();
                    } else if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        options[currentIndex]?.click();
                    } else if (e.key === 'Escape') {
                        customSelect.classList.remove('open');
                        selectedOption.focus();
                    }
                });

                document.addEventListener('click', () =>
                    customSelect.classList.remove('open'),
                );

                selectedOption.addEventListener('blur', () => {
                    setTimeout(() => {
                        if (!customSelect.contains(document.activeElement)) {
                            customSelect.classList.remove('open');
                        }
                    }, 100);
                });

                optionsContainer.addEventListener('blur', () => {
                    setTimeout(() => {
                        if (!customSelect.contains(document.activeElement)) {
                            customSelect.classList.remove('open');
                        }
                    }, 100);
                });
            });
    },

    // GNB 함수
    GNB() {
        fetch('/static/data/menu.json')
            .then((response) => response.json())
            .then((menuItems) => {
                const gnb = document.querySelector('.gnb__list');
                if (!gnb) return;

                menuItems.forEach((item) => {
                    const li = document.createElement('li');
                    li.classList.add('gnb__item');

                    const a = document.createElement('a');
                    a.href = item.href;
                    a.textContent = item.title;
                    a.classList.add('gnb__link');

                    li.appendChild(a);

                    // 2depth가 있으면 추가
                    if (item.sub && item.sub.length > 0) {
                        const subUl = document.createElement('ul');
                        subUl.classList.add('gnb__sub');

                        item.sub.forEach((subItem) => {
                            const subLi = document.createElement('li');
                            subLi.classList.add('gnb__sub-item');

                            const subA = document.createElement('a');
                            subA.href = subItem.href;
                            subA.textContent = subItem.title;
                            subA.classList.add('gnb__sub-link');

                            subLi.appendChild(subA);
                            subUl.appendChild(subLi);
                        });

                        li.appendChild(subUl);
                    }

                    gnb.appendChild(li);
                });
            })
            .catch((error) => {
                console.error(
                    'GNB 메뉴 데이터를 불러오는 데 실패했습니다:',
                    error,
                );
            });
    },

    // 테이블 행 추가 함수
    AddTableRow(e) {
        if (!e.target.matches('.add-btn')) return;

        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td>
                <div class="input__selectBox">                
                  <select name="selectBox1" id="selectBox">
                    <option value="option1">선택</option>
                    <option value="option1">동거</option>
                    <option value="option1">비동거</option>
                  </select>
                </div>
            </td>
            <td><input type="text"></td>
            <td><input type="text"></td>
        `;

        tbody.appendChild(newRow);

        // 새로 추가된 행에 있는 select 요소에 대해 CustomSelect 적용
        const selectElement = newRow.querySelector('select');
        if (selectElement && selectElement.closest('.input__selectBox')) {
            this.applyCustomSelectToElement(
                selectElement.closest('.input__selectBox'),
            );
        }
    },

    // 테이블 행 삭제 함수
    RemoveTableRow(e) {
        if (!e.target.matches('.remove-btn')) return;

        const tbody = document.querySelector('tbody');
        if (tbody && tbody.children.length > 1) {
            tbody.removeChild(tbody.lastElementChild);
        }
    },

    // 단일 요소에 CustomSelect 적용
    applyCustomSelectToElement(selectWrapper) {
        if (!selectWrapper) return;

        const selectElement = selectWrapper.querySelector('select');
        if (!selectElement) return;

        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';

        const selectedOption = document.createElement('div');
        selectedOption.className = 'selected-option';
        selectedOption.textContent =
            selectElement.options[selectElement.selectedIndex].text;
        selectedOption.setAttribute('tabindex', '0');

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';

        Array.from(selectElement.options).forEach((option, index) => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.text;
            customOption.dataset.value = option.value;
            customOption.setAttribute('tabindex', '0');

            customOption.addEventListener('click', () => {
                selectElement.selectedIndex = index;
                selectedOption.textContent = option.text;
                customSelect.classList.remove('open');
                selectElement.dispatchEvent(
                    new Event('change', { bubbles: true }),
                );
                selectedOption.focus();
            });

            optionsContainer.appendChild(customOption);
        });

        selectElement.style.display = 'none';
        customSelect.append(selectedOption, optionsContainer);
        selectWrapper.appendChild(customSelect);

        // 이벤트 리스너 설정
        this.setupCustomSelectEvents(
            customSelect,
            selectedOption,
            optionsContainer,
        );
    },

    // CustomSelect 이벤트 설정
    setupCustomSelectEvents(customSelect, selectedOption, optionsContainer) {
        selectedOption.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });

        selectedOption.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                customSelect.classList.toggle('open');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                optionsContainer.querySelector('.custom-option')?.focus();
            }
        });

        optionsContainer.addEventListener('keydown', (e) => {
            const options = [
                ...optionsContainer.querySelectorAll('.custom-option'),
            ];
            let currentIndex = options.indexOf(document.activeElement);

            if (e.key === 'ArrowDown' && currentIndex < options.length - 1) {
                e.preventDefault();
                options[currentIndex + 1].focus();
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                options[currentIndex - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                options[currentIndex]?.click();
            } else if (e.key === 'Escape') {
                customSelect.classList.remove('open');
                selectedOption.focus();
            }
        });

        selectedOption.addEventListener('blur', () => {
            setTimeout(() => {
                if (!customSelect.contains(document.activeElement)) {
                    customSelect.classList.remove('open');
                }
            }, 100);
        });

        optionsContainer.addEventListener('blur', () => {
            setTimeout(() => {
                if (!customSelect.contains(document.activeElement)) {
                    customSelect.classList.remove('open');
                }
            }, 100);
        });
    },

    // 이벤트 바인딩 함수
    bindEvents() {
        document.addEventListener('keyup', this.Input);
        document.addEventListener('click', this.ClearButton);
        document.addEventListener('click', this.Tabs);
        document.addEventListener('click', this.AddTableRow.bind(this));
        document.addEventListener('click', this.RemoveTableRow);

        this.CustomSelect();
    },

    init() {
        this.bindEvents();
        this.GNB();
    },
};

// 이벤트 리스너 초기화
document.addEventListener('DOMContentLoaded', () => {
    UIhandler.init();
});
