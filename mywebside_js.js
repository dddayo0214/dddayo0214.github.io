// // 滑鼠跟隨效果
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursorFollower');
const cursorimg = document.querySelector('.custom-cursor img');
const cursorFollowerimg = document.querySelector('.custom-cursorFollower img');
const trails = [];
const numTrails = 10;
const bodytop = document.getElementById('bodytop_');
const parentDiv = document.getElementById('bodytop');

// 創建拖尾效果
for (let i = 0; i < numTrails; i++) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    document.body.appendChild(trail);
    parentDiv.insertBefore(trail, bodytop);
    trails.push({
        element: trail,
        x: 0,
        y: 0
    });
}

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let rotationAngle = 0;
let currentRotation = 0;
let targetRotation = 0;
let isMoving = false;
let moveTimeout;

document.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        targetRotation = Math.atan2(dy, dx) * (180 / Math.PI);
    }

    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        // 開始移動
        if (!isMoving) {
            cursor.classList.add('moving');
            isMoving = true;
        }

        // 重置超時計時器
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            cursor.classList.remove('moving');
            isMoving = false;
        }, 150); // 停止移動150ms後恢復原本動畫
    }
});

// 使用 requestAnimationFrame 實現更平滑的移動
function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.1;
    cursorY += dy * 0.1;

    let rotationDiff = targetRotation - currentRotation;

    if (rotationDiff > 180) {
        rotationDiff -= 360;
    } else if (rotationDiff < -180) {
        rotationDiff += 360;
    }

    currentRotation += rotationDiff * 0.1;

    cursorimg.style.transform = `rotate(${currentRotation}deg)`;
    cursorFollowerimg.style.transform = `rotate(${currentRotation}deg)`;
    cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
    cursorFollower.style.transform = `translate(${cursorX - 100}px, ${cursorY - 100}px)`;

    // 更新拖尾效果
    for (let i = 0; i < trails.length; i++) {
        const trail = trails[i];
        const nextTrail = trails[i + 1];

        if (i != trails.length - 1) {
            trail.x = nextTrail.x;
            trail.y = nextTrail.y;
        } else {
            trail.x = cursorX;
            trail.y = cursorY;
        }

        trail.element.style.transform = `translate(${trail.x + 30 - cursorX}px, ${trail.y + 30 - cursorY}px) scale(${1 - (i / trails.length)})`;
        trail.element.style.opacity = 1 - (i / trails.length);
    }

    requestAnimationFrame(updateCursor);
}

updateCursor();

// 滑鼠互動效果
const links = document.querySelectorAll('a, button');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('link-hover');
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-hover');
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// 點擊效果
document.addEventListener('click', () => {
    const icon = document.querySelector('.custom-cursorFollower img');
    icon.style.transform = 'scale(1.5)';
    setTimeout(() => {
        icon.style.transform = 'scale(1)';
    }, 200);
});

// 處理頁面載入和離開視窗的情況
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = 1;
    cursorFollower.style.opacity = 1;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    cursorFollower.style.opacity = 0;
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

function toggleDescription(tool) {
    const description = document.getElementById(`${tool}-description`);
    const allDescriptions = document.querySelectorAll('.tool-description');

    allDescriptions.forEach(desc => {
        if (desc.id !== `${tool}-description`) {
            desc.classList.remove('active');
        }
    });

    description.classList.toggle('active');
}

function toggleAchievements(achievement) {
    const overlay = document.getElementById(achievement);
    if (!overlay) return;

    const closeBtn = overlay.querySelector('.close-btn');

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const fullImage = overlay.querySelector('.fullImage');
    if (fullImage) {
        fullImage.onclick = function (e) {
            e.stopPropagation();
        };
    }

    const handleClose = function () {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    overlay.onclick = function (e) {
        if (e.target === overlay || e.target === closeBtn) {
            handleClose();
        }
    };

    const escHandler = function (e) {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            handleClose();
            document.removeEventListener('keydown', escHandler);
        }
    };

    document.addEventListener('keydown', escHandler);
}

document.addEventListener('DOMContentLoaded', () => {
    const giftBox = document.getElementById('giftBox');
    const giftText = document.getElementById('giftText');

    // 設置可自定義的文字
    let customMessage = '感謝你的陪伴與支持！';

    // 可以在這裡更改文字內容
    giftText.textContent = customMessage;

    giftBox.addEventListener('click', () => {
        // 開啟禮物盒
        giftBox.classList.add('open');

        // 生成彩花
        createConfetti();
    });

    function createConfetti() {
        // 移除舊的彩花
        document.querySelectorAll('.confetti').forEach(el => el.remove());

        // 彩花顏色
        const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];

        // 創建30個彩花
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            // 隨機位置
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${Math.random() * 100}px`;

            // 隨機大小
            const size = Math.floor(Math.random() * 10) + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;

            // 隨機形狀（方形或圓形）
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

            // 隨機顏色
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // 隨機動畫延遲
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;

            document.body.appendChild(confetti);

            // 加入動畫類別
            setTimeout(() => {
                confetti.classList.add('active-confetti');
            }, 10);
        }
    }
});