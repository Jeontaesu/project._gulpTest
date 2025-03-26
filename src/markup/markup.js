document.addEventListener('DOMContentLoaded', function () {
    let target;
    const tabLinks = document.querySelectorAll('.tab-a a');
    const urlList = document.querySelector('.urlList');
    const totalCntEl = document.getElementById('totalCnt');
    const endCntEl = document.getElementById('endCnt');
    const endCntPEl = document.getElementById('endCntP');
    const depth1CntEl = document.getElementById('depth1Cnt');

    function handleTabClick(event) {
        // Remove 'on' class from all tab links
        tabLinks.forEach((link) => link.classList.remove('on'));

        // Add 'on' class to clicked tab
        event.target.classList.add('on');

        // Remove existing list items except header
        const existingItems = urlList.querySelectorAll('li:not(.head)');
        existingItems.forEach((item) => item.remove());

        // Select target list based on tab index
        target = event.target.index === 0 ? markupPcList : null;

        let pageCnt = 0;

        target.forEach((a) => {
            const depth1 = Object.keys(a);
            const obj = a[depth1];

            const li = document.createElement('li');
            const ul = document.createElement('ul');
            ul.classList.add(`sub${depth1[0] === '공통' ? ' guide' : ''}`);

            obj.forEach((item, i) => {
                if (depth1[0] !== '공통') {
                    pageCnt++;
                }

                const subLi = document.createElement('li');
                subLi.className = item.state || '';

                subLi.innerHTML = `
        <div class="depth_1">${i === 0 ? depth1 : ''}</div>
        <div class="depth_2">${item.depth2 || ''}</div>
        <div class="depth_3">${item.depth3 || ''}</div>
        <div class="info">${item.info || ''}</div>
        <div class="fileName">
          <a href="${
              item.src === 'main'
                  ? 'main/main.html'
                  : `html/${item.src.split('?')[0]}.html${
                        item.src.split('?')[1]
                            ? '?' + item.src.split('?')[1]
                            : ''
                    }`
          }" target="_blank">
            ${item.src.split('?')[0]}
          </a>
        </div>
      `;

                ul.appendChild(subLi);
            });

            li.appendChild(ul);
            urlList.appendChild(li);
        });

        // Update counters
        totalCntEl.innerHTML = pageCnt;

        const endItems = document.querySelectorAll('.sub:not(.guide) .end');
        endCntEl.innerHTML = endItems.length;
        endCntPEl.innerHTML = ((endItems.length / pageCnt) * 100).toFixed(1);

        depth1CntEl.textContent = markupPcList.length - 1; // Exclude common

        // Check for all ended sections
        const subSections = document.querySelectorAll('.sub');
        subSections.forEach((section) => {
            const allListItems = section.querySelectorAll('li');
            const endListItems = section.querySelectorAll('.end');

            if (allListItems.length === endListItems.length) {
                section.parentElement.classList.add('allEnd');
            }
        });
    }

    // Add click event listeners to tab links
    tabLinks.forEach((link, index) => {
        link.index = index; // Add index property for easier access
        link.addEventListener('click', handleTabClick);
    });

    // Trigger first tab click on page load
    tabLinks[0].click();
});
