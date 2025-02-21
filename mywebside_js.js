// 滑鼠跟隨效果
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursorFollower');
const cursorimg = document.querySelector('.custom-cursor img');
const cursorFollowerimg = document.querySelector('.custom-cursorFollower img');
const trails = [];
const numTrails = 10;
const bodytop = document.getElementById('bodytop_');
const parentDiv = document.getElementById('bodytop');
// 動畫的起始和結束狀態
const startX = 0;
const startY = 0;
const endX = 150;
const endY = 100;
const startRotation = 0;
const endRotation = 20;

// 動畫持續時間
const duration = 500;
let startTime = null;

let mobile = null;

function checkScreen() {
    if (window.innerWidth < 768) {
        mobile = true;
    } else {
        mobile = false;
    }
}

checkScreen();

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
    cursorFollowerimg.style.transform = 'scale(100)';
    setTimeout(() => {
        cursorFollowerimg.style.transform = 'scale(1)';
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

document.addEventListener('DOMContentLoaded', () => {
    const boxLid = document.getElementById('boxLid');
    const giftText = document.getElementById('giftText');
    const giftBox = document.getElementById('boxBase');
    const ribbon = document.getElementById('ribbon');
    const resetHint = document.getElementById('resetHint');
    const setHint = document.getElementById('setHint');
    let isLidDropped = false;
    let isDragging = false;
    let initialX = 0, initialY = 0;
    let xOffset = 0;
    let yOffset = 0;
    let currentX = 0;
    let currentY = 0;
    let firstDrog = false;

    giftBox.addEventListener('click', () => {
        if (!isLidDropped && !isDragging) {
            ribbon.classList.add('untied');
            setTimeout(() => {
                boxLid.style.transform = '';
                boxLid.classList.remove('dropped');
                void boxLid.offsetWidth;
                boxLid.classList.add('dropped');
                createConfetti();
                giftText.style.opacity = '1';
                resetHint.classList.add('visible');
                setHint.classList.remove('visible');
                resetdropLid();
                requestAnimationFrame(dropLid);
            }, 500);
            isLidDropped = true;
            document.getElementById('bg-music').play();
        }
    });

    boxLid.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    boxLid.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDragging(e.touches[0]);
    });
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        drag(e.touches[0]);
    });
    document.addEventListener('touchend', stopDragging);

    function startDragging(e) {
        if (!isLidDropped) return;
        isDragging = true;
        boxLid.classList.add('dragging');
        boxLid.classList.remove('dropped');

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        // 保存當前位置
        // const rect = boxLid.getBoundingClientRect();
        // currentTransform = window.getComputedStyle(boxLid).transform;
        // if (currentTransform !== 'none') {
        //     boxLid.style.transform = currentTransform;
        // }
    }

    function drag(e) {
        if (!isDragging) return;
        console.log(firstDrog);
        if (!firstDrog) {
            currentX = e.clientX - initialX + 150;
            currentY = e.clientY - initialY + 100;
        }
        else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        xOffset = currentX;
        yOffset = currentY;

        boxLid.style.transform = `translate(${currentX}px, ${currentY}px)`;

        if (Math.abs(currentX) < 50 && Math.abs(currentY) < 50) {
            resetHint.style.color = '#4CAF50';
        } else {
            resetHint.style.color = 'white';
        }
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        firstDrog = true;
        boxLid.classList.remove('dragging');

        initialX = currentX;
        initialY = currentY;

        const boxLidtransform = new DOMMatrix(getComputedStyle(boxLid).transform);
        const x = boxLidtransform.m41;
        const y = boxLidtransform.m42;

        if (Math.abs(x) < 50 && Math.abs(y) < 50) {
            document.getElementById('bg-music').pause();
            resetGiftBox();
        }
    }

    function dropLid(timestamp) {

        if (!startTime) startTime = timestamp; // 記錄動畫開始時間

        const elapsedTime = timestamp - startTime; // 計算已經過的時間

        // 以進度計算當前的 X, Y 和旋轉角度
        const progress = Math.min(elapsedTime / duration, 1); // 進度值在 0 到 1 之間

        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        const currentRotation = startRotation + (endRotation - startRotation) * progress;

        // 設置 transform 屬性
        boxLid.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;

        // 如果動畫還沒完成，繼續請求下一幀
        if (elapsedTime < duration) {
            requestAnimationFrame(dropLid); // 繼續動畫
        }
    }

    function resetdropLid() {
        firstDrog = false;
        startTime = null;
    }

    function resetGiftBox() {
        // 移除所有transform和動畫相關的樣式
        boxLid.style.transform = '';
        boxLid.style.animation = '';
        boxLid.classList.remove('dropped');
        ribbon.classList.remove('untied');
        giftText.style.opacity = '0';
        isLidDropped = false;
        resetHint.classList.remove('visible');
        setHint.classList.add('visible');

        // 強制重繪
        void boxLid.offsetWidth;
        // location.reload();
    }

    function createConfetti() {
        document.querySelectorAll('.confetti').forEach(el => el.remove());

        const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            confetti.style.left = `${Math.random() * window.innerWidth}px`;
            confetti.style.top = `${Math.random() * window.innerHeight / 2}px`;

            const size = Math.floor(Math.random() * 10) + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;

            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.classList.add('active-confetti');
            }, 10);

            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }
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
const navLinksAside = document.querySelectorAll('.nav-aside a');
const indicator = document.querySelector('.nav-indicator');
const scrollProgress = document.querySelector('.scroll-progress');

// 初始化導航指示器位置
function initIndicator() {
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
        moveIndicator(activeLink);
    }
}

const mathInput = document.getElementById('math-input');

function editAnimation() {
    if (mathInput.classList.contains('not-visible')) {
        mathInput.classList.remove('not-visible');
    } else {
        mathInput.classList.add('not-visible');
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

navLinksAside.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: 'smooth'
        });

        // 更新活動狀態和移動指示器
        navLinksAside.forEach(l => l.classList.remove('active'));
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

    let start = null;
    const duration = 1000; // 動畫持續時間 (毫秒)

    function scaleIn(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const scale = 0.95 + 0.05 * progress;
        description.style.transform = `scale(${scale})`;

        if (progress < 1) {
            requestAnimationFrame(scaleIn);
        }
    }
    requestAnimationFrame(scaleIn);
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

const counterUp = window.counterUp.default

const callback = entries => {
    entries.forEach(entry => {
        const el = entry.target
        if (entry.isIntersecting && !el.classList.contains('is-visible')) {
            counterUp(el, {
                duration: 2000,
                delay: 16,
            })
            el.classList.add('is-visible')
        }
    })
}

const IO = new IntersectionObserver(callback, { threshold: 1 })

const el = document.querySelector('.counter')
IO.observe(el)

window.addEventListener('load', function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);
});

// 數學公式動畫
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sigma = 10, rho = 28, beta = 2.67;
const attractors = [];
const maxAttractors = 20;
const scale = 10;
let time = 0;

document.querySelectorAll("input").forEach(input => input.addEventListener("input", () => {
    sigma = parseFloat(document.getElementById("sigma").value);
    rho = parseFloat(document.getElementById("rho").value);
    beta = parseFloat(document.getElementById("beta").value);
}));

function resetValues() {
    sigma = 10;
    rho = 28;
    beta = 2.67;
    document.getElementById('sigma').value = '10';
    document.getElementById('rho').value = '28';
    document.getElementById('beta').value = '2.67';
}

function closeEffect() {
    canvas.width = 0;
    canvas.height = 0;
}

function startEffect() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const createAttractor = (x, y) => ({
    x: Math.random() * 10,
    y: Math.random() * 10,
    z: Math.random() * 10,
    trail: [],
    posX: x,
    posY: y
});

const update = (attractor) => {
    const dt = 0.01;
    attractor.x += sigma * (attractor.y - attractor.x) * dt;
    attractor.y += (attractor.x * (rho - attractor.z) - attractor.y) * dt;
    attractor.z += (attractor.x * attractor.y - beta * attractor.z) * dt;
    attractor.trail.push({ x: attractor.x, y: attractor.y, z: attractor.z, time: performance.now() });
    if (attractor.trail.length > 300) attractor.trail.shift();
};

const draw = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1.5;

    // 洛倫茲吸子效果
    if (!mobile) {
        attractors.forEach(attractor => {
            ctx.beginPath();
            attractor.trail.forEach((p, i) => {
                const px = attractor.posX + p.x * scale;
                const py = attractor.posY - p.z * scale;
                const hue = (p.time / 10) % 360;
                ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();
        });
    }

    // 波浪效果
    for (let i = 0; i < canvas.width; i += 20) {
        let y = Math.sin((i + time) * 0.01) * 20 + canvas.height / 2;
        ctx.fillStyle = `rgba(0, ${255 - (i / 10)}, ${255 - (i / 10)}, 0.3)`;
        ctx.fillRect(i, y, 5, 5);
    }

    // 流體粒子效果
    // for (let i = 0; i < 50; i++) {
    //     let x = Math.random() * canvas.width;
    //     let y = Math.random() * canvas.height;
    //     ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
    //     ctx.beginPath();
    //     ctx.arc(x, y, 3, 0, Math.PI * 2);
    //     ctx.fill();
    // }

    // 圓形波浪效果
    for (let i = 0; i < 10; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        ctx.strokeStyle = "rgba(0, 9, 133, 0.6)";
        ctx.beginPath();
        // ctx.arc(canvas.width / 2, canvas.height / 2, (time % 100) * i, 0, Math.PI * 2);
        ctx.arc(x, y, (time % 100) * i, 0, Math.PI * 2);
        ctx.stroke();
    }
};

const animate = () => {
    time += 1;
    attractors.forEach(update);
    draw();
    requestAnimationFrame(animate);
};
animate();

window.addEventListener("mousemove", (event) => {
    attractors.push(createAttractor(event.clientX, event.clientY));
    if (attractors.length > maxAttractors) attractors.shift();
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// GA
// window.dataLayer = window.dataLayer || [];
// function gtag() { dataLayer.push(arguments); }
// gtag('js', new Date());

// gtag('config', 'G-YB0RS7N314');

// async function getVisitorCount() {
//     const response = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runReport', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             "dateRanges": [{ "startDate": "2024-01-01", "endDate": "today" }],
//             "metrics": [{ "name": "activeUsers" }]
//         })
//     });
//     const data = await response.json();
//     document.getElementById('visitor-count').innerText = data.rows?.[0]?.metricValues?.[0]?.value || '無法取得資料';
// }

// 呼叫 API 以取得瀏覽人數
// getVisitorCount().catch(console.error);