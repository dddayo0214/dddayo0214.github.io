// 滑鼠跟隨效果
// const cursor = document.querySelector('.cursor');
// const cursorFollower = document.querySelector('.cursor-follower');

// document.addEventListener('mousemove', (e) => {
//     cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
//     cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
// });

// // 鼠標hover效果
// const links = document.querySelectorAll('a');
// links.forEach(link => {
//     link.addEventListener('mouseenter', () => {
//         cursor.style.transform = 'scale(1.5)';
//         cursorFollower.style.transform = 'scale(1.5)';
//     });
//     link.addEventListener('mouseleave', () => {
//         cursor.style.transform = 'scale(1)';
//         cursorFollower.style.transform = 'scale(1)';
//     });
// });

// 更新游標移動邏輯
const cursor = document.querySelector('.custom-cursor');

// 平滑跟隨滑鼠
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 使用 requestAnimationFrame 實現更平滑的移動
function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.1; // 調整這個數值可以改變跟隨速度
    cursorY += dy * 0.1;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    requestAnimationFrame(updateCursor);
}

updateCursor();

// 滑鼠互動效果
const links = document.querySelectorAll('a, button');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('link-hover');
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-hover');
    });
});

// 處理頁面載入和離開視窗的情況
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = 1;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
});

// 添加時間軸動畫
const timelineItems = document.querySelectorAll('.timeline-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.5
});

timelineItems.forEach(item => {
    observer.observe(item);
});

// 導航欄動畫
const navLinks = document.querySelectorAll('.nav-links a');
const indicator = document.querySelector('.nav-indicator');
const scrollProgress = document.querySelector('.scroll-progress');

// 初始化導航指示器位置
function initIndicator() {
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
        moveIndicator(activeLink);
    }
}

// 移動導航指示器
function moveIndicator(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - parentRect.left}px`;
}

// 平滑滾動
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: 'smooth'
        });

        // 更新活動狀態和移動指示器
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        moveIndicator(link);
    });
});

// 滾動監聽
window.addEventListener('scroll', () => {
    // 更新滾動進度條
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;

    // 更新當前活動項目
    const sections = document.querySelectorAll('section');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
            currentSection = `#${section.id}`;
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentSection) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            moveIndicator(link);
        }
    });
});

// 初始化
window.addEventListener('load', initIndicator);
window.addEventListener('resize', initIndicator);