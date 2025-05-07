function applyDynamicRowGap() {
    const rows = document.querySelectorAll('.row');

    rows.forEach((row) => {
        const gapClass = Array.from(row.classList).find(cls => cls.startsWith('gap-'));
        if (!gapClass) return;

        let gapValue = '1rem';

        const tailwindSpacing = {
            '0': '0rem', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem',
            '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem', '4': '1rem', '5': '1.25rem',
            '6': '1.5rem', '7': '1.75rem', '8': '2rem', '9': '2.25rem', '10': '2.5rem',
            '11': '2.75rem', '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem',
            '24': '6rem', '28': '7rem', '32': '8rem', '36': '9rem', '40': '10rem',
            '44': '11rem', '48': '12rem', '52': '13rem', '56': '14rem', '60': '15rem',
            '64': '16rem', '72': '18rem', '80': '20rem', '96': '24rem'
        };

        // Check for custom gap-[value]
        const customGapMatch = gapClass.match(/gap-\[(.+?)\]/);
        if (customGapMatch) {
            gapValue = customGapMatch[1]; // like '18px' or '1.2rem'
        } else {
            // Otherwise try standard Tailwind spacing like gap-4
            const scaleMatch = gapClass.match(/gap-(\d+(\.\d+)?)/);
            if (scaleMatch && tailwindSpacing[scaleMatch[1]]) {
                gapValue = tailwindSpacing[scaleMatch[1]];
            }
        }

        row.style.display = 'flex';
        row.style.flexWrap = 'wrap';
        row.style.gap = `${gapValue}`;

        const columns = Array.from(row.children);
        let totalUnits = 0;

        // Get current screen width
        const screenWidth = window.innerWidth;

        // Determine the applicable breakpoint
        const getActiveColClass = (col) => {
            const breakpoints = [
                { prefix: 'xxl', min: 1400 },
                { prefix: 'xl', min: 1200 },
                { prefix: 'lg', min: 992 },
                { prefix: 'md', min: 768 },
                { prefix: 'sm', min: 640 },
                { prefix: '', min: 0 } 
            ];

            for (const bp of breakpoints) {
                if (screenWidth >= bp.min) {
                    const match = Array.from(col.classList).find(cls => cls === `col-${bp.prefix ? bp.prefix + '-' : ''}` + /\d+/.exec(cls)?.[0]);
                    if (match) return { class: match, units: parseInt(match.split('-').pop()) };
                }
            }
            return null;
        };

        // Compute total units based on active breakpoint
        columns.forEach(col => {
            const activeCol = getActiveColClass(col);
            if (activeCol) totalUnits += activeCol.units;
        });

        const rowWidth = row.clientWidth;
        const gapCount = columns.length - 1;

        let gapInPx = 0;
        if (gapValue.includes('rem')) {
            gapInPx = parseFloat(gapValue) * 16;
        } else if (gapValue.includes('px')) {
            gapInPx = parseFloat(gapValue);
        } else {
            gapInPx = parseFloat(gapValue);
        }

        const totalGapWidth = gapInPx * gapCount;
        const availableWidth = rowWidth - totalGapWidth;

        columns.forEach(col => {
            const activeCol = getActiveColClass(col);
            if (activeCol) {
                const width = (availableWidth * activeCol.units) / totalUnits;
                col.style.flex = `0 0 ${width}px`;
                col.style.maxWidth = `${width}px`;
            } else {
                col.style.flex = '1 1 100%'; 
                col.style.maxWidth = '100%'; 
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyDynamicRowGap();
    const observer = new MutationObserver(applyDynamicRowGap);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', applyDynamicRowGap);
});
