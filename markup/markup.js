document.addEventListener('DOMContentLoaded', function () {
    let target;
    const tabLinks = document.querySelectorAll('.tab-a a');
    const urlList = document.querySelector('.urlList');
    const totalCnt = document.getElementById('totalCnt');
    const endCnt = document.getElementById('endCnt');
    const endCntP = document.getElementById('endCntP');
    const depth1Cnt = document.getElementById('depth1Cnt');

    function handleTabClick(event) {
        tabLinks.forEach((link) => link.classList.remove('on'));
        event.target.classList.add('on');

        document
            .querySelectorAll('.urlList li:not(.head)')
            .forEach((li) => li.remove());

        target = event.target.index === 0 ? markupPcList : null;
        let pageCnt = 0;
        let str = '';

        target.forEach((a) => {
            let depth1 = Object.keys(a)[0];
            let obj = a[depth1];
            str += `<li>`;
            str += `<ul class="sub${depth1 === '공통' ? ' guide' : ''}">`;

            obj.forEach((item, i) => {
                if (depth1 !== '공통') pageCnt++;
                str += `<li class="${item.state || ''}">`;
                str += `<div class="depth_1">${i === 0 ? depth1 : ''}</div>`;
                str += `<div class="depth_2">${item.depth2 || ''}</div>`;
                str += `<div class="depth_3">${item.depth3 || ''}</div>`;
                str += `<div class="info">${item.info || ''}</div>`;
                const [fileName, query] = item.src.split('?');
                str += `<div class="fileName"><a href="${
                    fileName === 'main' ? './main/' : './pages/'
                }${fileName}.html${query ? `?${query}` : ''}" target="_blank">${fileName}</a></div>`;
                str += `</li>`;
            });
            str += `</ul>`;
            str += `</li>`;
        });

        urlList.insertAdjacentHTML('beforeend', str);
        totalCnt.textContent = pageCnt;
        endCnt.textContent = document.querySelectorAll(
            '.sub:not(.guide) .end',
        ).length;
        endCntP.textContent = (
            (document.querySelectorAll('.sub:not(.guide) .end').length /
                pageCnt) *
            100
        ).toFixed(1);
        depth1Cnt.textContent = markupPcList.length - 1; // 공통 제외

        document.querySelectorAll('.sub').forEach((sub) => {
            if (
                sub.querySelectorAll('li').length ===
                sub.querySelectorAll('.end').length
            ) {
                sub.parentElement.classList.add('allEnd');
            }
        });
    }

    tabLinks.forEach((link, index) => {
        link.index = index;
        link.addEventListener('click', handleTabClick);
    });

    tabLinks[0].click();
});
