// Dynamic row scrpt 
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
        
        const customGapMatch = gapClass.match(/gap-\[(.+?)\]/);
        if (customGapMatch) {
            gapValue = customGapMatch[1]; 
        } else { 
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
 
        const screenWidth = window.innerWidth;
 
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


// Open modal
document.querySelectorAll('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-target');
      document.querySelector(modalId).classList.add('show');
    });
  });

  // Close modal
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-close');
      document.querySelector(modalId).classList.remove('show');
    });
  });

//  Tabs script 
  document.querySelectorAll('[data-tab-toggle]').forEach(tab => {
    tab.addEventListener('click', function () {
      const parentId = this.closest('[data-tab-group]').getAttribute('data-tab-group');
      const targetId = this.getAttribute('data-tab-toggle');
 
      document.querySelectorAll(`[data-tab-group="${parentId}"] .nav-link`).forEach(el => {
        el.classList.remove('active');
      });
 
      document.querySelectorAll(`[data-tab-group="${parentId}"] .tab-pane`).forEach(el => {
        el.classList.remove('active');
      });
 
      setTimeout(() => {
        this.classList.add('active');
        document.getElementById(targetId).classList.add('active');
      }, 10);
    });
  }); 


//   Toggling The Dropdown 

document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = dropdownButton.nextElementSibling;  
     
    dropdownButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('show');  
    });
   
    document.addEventListener('click', (event) => {
      if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('show');  
      }
    });
  });
  
// Tooltip 

document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggers = document.querySelectorAll('[data-toggle="tooltip"]');
  
    tooltipTriggers.forEach(trigger => {
      const tooltipText = document.createElement('div');
      tooltipText.classList.add('tooltip-inner');
      tooltipText.textContent = trigger.getAttribute('title');
   
      document.body.appendChild(tooltipText);
   
      trigger.addEventListener('mouseenter', () => {
        const rect = trigger.getBoundingClientRect();
        const tooltipWidth = tooltipText.offsetWidth;
        const tooltipHeight = tooltipText.offsetHeight;
   
        tooltipText.style.left = `${rect.left + rect.width / 2 - tooltipWidth / 2}px`;
        tooltipText.style.top = `${rect.top - tooltipHeight - 8}px`;  
  
        tooltipText.classList.add('show');
      });
   
      trigger.addEventListener('mouseleave', () => {
        tooltipText.classList.remove('show');
      });
    });
  });
  


//   Accordion Toggle 
document.addEventListener('DOMContentLoaded', () => {
    const accordionButtons = document.querySelectorAll('.accordion-button');
  
    accordionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetSelector = button.getAttribute('data-bs-target');
        const content = document.querySelector(targetSelector);
        const isExpanded = content.classList.contains('show');
  
        const parentAccordion = button.closest('.accordion');
   
        parentAccordion.querySelectorAll('.accordion-collapse').forEach(el => {
          el.classList.remove('show');
          el.style.height = '0px';
        });
  
        parentAccordion.querySelectorAll('.accordion-button').forEach(el => {
          el.classList.add('collapsed');
        });
   
        if (!isExpanded) {
          content.classList.add('show');
          content.style.height = content.scrollHeight + 'px';
          button.classList.remove('collapsed');
   
          setTimeout(() => {
            content.style.height = 'auto';
          }, 300);  
        }
      });
    });
  });
  

// Toast

document.querySelectorAll('[data-bs-dismiss="toast"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const toast = btn.closest('.toast');
      toast.classList.remove('show');
    });
  });


//   Off Canvas 

document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetSelector = trigger.getAttribute('data-bs-target');
      const offcanvas = document.querySelector(targetSelector);
      offcanvas.classList.add('show');
    });
  });
  
  document.querySelectorAll('[data-bs-dismiss="offcanvas"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const offcanvas = btn.closest('.offcanvas');
      offcanvas.classList.remove('show');
    });
  });
  
  
//   Progress 
document.getElementById('startProgress').addEventListener('click', () => {
    let progress = 0;
    const progressBar = document.querySelector('.progress-bar');
  
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        return;
      }
  
      progress += 10;
      progressBar.style.width = progress + '%';
      progressBar.innerText = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
    }, 500);
  });
  