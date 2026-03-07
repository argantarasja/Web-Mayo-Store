// Sticky Header Shadow on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Smooth scroll active state update
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('.nav-links a[href*=' + id + ']').classList.add('active');
            });
        };
    });
};

const wrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

// Auto Slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

let slideInterval = setInterval(nextSlide, 3000);

function updateSlider() {
    currentTranslate = currentIndex * -wrapper.offsetWidth;
    prevTranslate = currentTranslate;
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

wrapper.addEventListener('mousedown', dragStart);
wrapper.addEventListener('touchstart', dragStart);
wrapper.addEventListener('mouseup', dragEnd);
wrapper.addEventListener('touchend', dragEnd);
wrapper.addEventListener('mousemove', dragAction);
wrapper.addEventListener('touchmove', dragAction);

function dragStart(e) {
    clearInterval(slideInterval);
    isDragging = true;
    startPos = getPositionX(e);
    animationID = requestAnimationFrame(animation);
}

function dragAction(e) {
    if (isDragging) {
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function dragEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

    updateSlider();
    slideInterval = setInterval(nextSlide, 3000);
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function animation() {
    if (isDragging) {
        wrapper.style.transform = `translateX(${currentTranslate}px)`;
        requestAnimationFrame(animation);
    }
}

window.addEventListener('resize', updateSlider);

// Logika Slider Produk
const pWrapper = document.getElementById('productWrapper');
const pCards = document.querySelectorAll('.product-card');

// 1. Duplikasi konten untuk efek infinite
pWrapper.innerHTML += pWrapper.innerHTML;

let pCurrentPos = 0;
let pSpeed = 1; // Kecepatan geser (pixel per frame)
let isPaused = false;
let startX, scrollLeft;

// Fungsi Animasi Utama
function animate() {
    if (!isPaused) {
        pCurrentPos -= pSpeed;
        
        // Reset posisi ke tengah jika sudah bergeser setengah dari total lebar (setelah duplikasi)
        if (Math.abs(pCurrentPos) >= pWrapper.scrollWidth / 2) {
            pCurrentPos = 0;
        }
        
        pWrapper.style.transform = `translateX(${pCurrentPos}px)`;
    }
    requestAnimationFrame(animate);
}

// Mulai Animasi
animate();

// 2. Logika Geser Manual (Mouse & Touch)
const startDragging = (e) => {
    isPaused = true;
    startX = (e.pageX || e.touches[0].pageX) - pWrapper.offsetLeft;
    scrollLeft = pCurrentPos;
    pWrapper.style.cursor = 'grabbing';
};

const stopDragging = () => {
    isPaused = false;
    pWrapper.style.cursor = 'grab';
};

const moveDragging = (e) => {
    if (!isPaused) return;
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - pWrapper.offsetLeft;
    const walk = (x - startX); 
    pCurrentPos = scrollLeft + walk;
};

// Event Listeners
pWrapper.addEventListener('mousedown', startDragging);
pWrapper.addEventListener('touchstart', startDragging);

window.addEventListener('mouseup', stopDragging);
window.addEventListener('touchend', stopDragging);

pWrapper.addEventListener('mousemove', moveDragging);
pWrapper.addEventListener('touchmove', moveDragging);

// Pause saat hover (Optional, biar user enak pilih produk)
pWrapper.addEventListener('mouseenter', () => isPaused = true);
pWrapper.addEventListener('mouseleave', () => isPaused = false);

// Logika Aktif Button Navigasi Produk
const productNavBtns = document.querySelectorAll('.prod-link');

productNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Hapus class active dari semua button navigasi produk
        productNavBtns.forEach(nav => nav.classList.remove('active'));
        
        // Tambahkan class active ke button yang diklik
        this.classList.add('active');
        
        // Opsional: Jika Anda ingin memfilter produk berdasarkan kategori, 
        // Anda bisa menambahkan logikanya di sini nanti.
    });
});

// Logika Menu Mobile Toggle
const menuIcon = document.querySelector('.menu-icon');
const navLinksContainer = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    // Toggle class active untuk memunculkan menu
    navLinksContainer.classList.toggle('active');
    
    // Opsional: Ubah icon menu menjadi 'X' saat diklik
    const icon = menuIcon.querySelector('i');
    if (navLinksContainer.classList.contains('active')) {
        icon.classList.replace('bx-menu', 'bx-x');
    } else {
        icon.classList.replace('bx-x', 'bx-menu');
    }
});

// Tutup menu otomatis saat salah satu link diklik
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuIcon.querySelector('i').classList.replace('bx-x', 'bx-menu');
    });
});