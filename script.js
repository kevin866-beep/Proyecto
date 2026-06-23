// ===== VIDEO BACKGROUND HERO =====
(function() {
    var videoFiles = [
        'videos/bmw3.mp4',
        'videos/bmw4.mp4',
        'videos/bmw5.mp4',
        'videos/bmw6.mp4',
        'videos/bmw7.mp4',
        'videos/bmw8.mp4',
        'videos/bmw9.mp4',
        'videos/bmw1.mp4',
        'videos/bmw2.mp4'
    ];

    var videoEl = document.getElementById('heroVideo');
    var volumeBtn = document.getElementById('volumeBtn');
    var transitionEl = document.getElementById('videoTransition');
    if (!videoEl || !volumeBtn || videoFiles.length === 0) return;

    var isMuted = true;
    var currentIndex = 0;
    var isTransitioning = false;
    var playbackTimer = null;
    var started = false;

    function pickNext() {
        return (currentIndex + 1) % videoFiles.length;
    }

    function clearPlaybackTimer() {
        if (playbackTimer) {
            clearTimeout(playbackTimer);
            playbackTimer = null;
        }
    }

    function updateVolumeIcon() {
        volumeBtn.classList.toggle('muted', isMuted);
        var icon = volumeBtn.querySelector('i');
        if (icon) {
            icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    }

    function advanceToNext() {
        playVideo(pickNext());
    }

    function playVideo(idx) {
        if (isTransitioning) return;
        isTransitioning = true;
        clearPlaybackTimer();

        // Sync muted state from actual video element (splash may have unmuted it)
        isMuted = videoEl.muted;
        updateVolumeIcon();

        if (transitionEl) transitionEl.classList.add('active');

        setTimeout(function() {
            videoEl.classList.remove('visible', 'fading');
            videoEl.src = videoFiles[idx];
            videoEl.muted = isMuted;

            var readyTimeout = setTimeout(function() {
                if (isTransitioning) {
                    if (transitionEl) transitionEl.classList.remove('active');
                    videoEl.classList.add('visible');
                    videoEl.play().catch(function() {});
                    currentIndex = idx;
                    isTransitioning = false;
                    startPlaybackTimer();
                }
            }, 4000);

            var onCanPlay = function() {
                videoEl.removeEventListener('canplay', onCanPlay);
                clearTimeout(readyTimeout);
                if (transitionEl) transitionEl.classList.remove('active');
                videoEl.classList.add('visible');
                videoEl.muted = isMuted;
                videoEl.play().catch(function() {
                    videoEl.muted = true;
                    isMuted = true;
                    updateVolumeIcon();
                    videoEl.play().catch(function() {});
                });
                currentIndex = idx;
                isTransitioning = false;
                startPlaybackTimer();
            };

            var onError = function() {
                videoEl.removeEventListener('error', onError);
                videoEl.removeEventListener('canplay', onCanPlay);
                clearTimeout(readyTimeout);
                if (transitionEl) transitionEl.classList.remove('active');
                isTransitioning = false;
                setTimeout(advanceToNext, 500);
            };

            videoEl.addEventListener('canplay', onCanPlay);
            videoEl.addEventListener('error', onError);
            videoEl.load();
        }, 500);
    }

    function startPlaybackTimer() {
        clearPlaybackTimer();
        playbackTimer = setTimeout(function() {
            advanceToNext();
        }, 60000);
    }

    function showFirstVideo() {
        if (started) return;
        started = true;
        videoEl.classList.add('visible');
        currentIndex = 0;
        startPlaybackTimer();
    }

    // When the video actually starts playing (from HTML autoplay or JS .play())
    videoEl.addEventListener('playing', function onFirstPlay() {
        videoEl.removeEventListener('playing', onFirstPlay);
        showFirstVideo();
    });

    // Explicitly try to start playback (belt and suspenders for HTML autoplay)
    videoEl.play().then(showFirstVideo).catch(function() {
        // Autoplay blocked by browser (even muted).
        // showFirstVideo() will be called when the 'playing' event fires,
        // or when the user dismisses the splash screen.
    });

    // Rotate to next when video ends
    videoEl.addEventListener('ended', function() {
        clearPlaybackTimer();
        advanceToNext();
    });

    // Volume toggle
    volumeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        isMuted = !isMuted;
        videoEl.muted = isMuted;
        updateVolumeIcon();
    });

})();

// ===== SPLASH SCREEN =====
(function() {
    var splash = document.getElementById('splash');
    if (!splash) return;

    var dismissed = false;

    function dismissSplash() {
        if (dismissed) return;
        dismissed = true;

        splash.classList.add('hidden');
        setTimeout(function() {
            splash.style.display = 'none';
        }, 600);

        // Now we have user gesture, unmute and show the video
        var videoEl = document.getElementById('heroVideo');
        var volumeBtn = document.getElementById('volumeBtn');
        if (videoEl) {
            videoEl.muted = false;
            videoEl.classList.add('visible');
            videoEl.play().catch(function() {
                // Retry once in case the gesture wasn't registered yet
                setTimeout(function() {
                    videoEl.play().catch(function() {});
                }, 200);
            });
        }
        if (volumeBtn) {
            volumeBtn.classList.remove('muted');
            var icon = volumeBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-volume-up';
        }

        document.body.style.overflow = '';
    }

    splash.addEventListener('click', dismissSplash);
})();

// ===== MODAL =====
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('active');
    document.body.style.overflow = '';
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function submitForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
        alert('Gracias. Nos pondremos en contacto pronto.');
        e.target.reset();
        btn.textContent = txt;
        btn.disabled = false;
    }, 1000);
}

function submitTestDrive(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.textContent = 'Confirmando...';
    btn.disabled = true;
    setTimeout(() => {
        alert('Prueba confirmada. Recibira un email con los detalles.');
        e.target.reset();
        btn.textContent = txt;
        btn.disabled = false;
        closeModal('contactModal');
    }, 1200);
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const m = document.querySelector('.modal.active');
        if (m) closeModal(m.id);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== SCROLL REVEAL =====
(function() {
    const els = document.querySelectorAll(
        '.feature-card, .spec-card, .number-item, .timeline-card, .color-card, .gallery-item, .spec-banner-item, .showcase-block, .mosaic-item'
    );
    els.forEach(function(el) { el.classList.add('reveal'); });

    const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function(el) { obs.observe(el); });
})();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    if (window.scrollY > heroBottom - 80) {
        nav.classList.add('light');
    } else {
        nav.classList.remove('light');
    }
    if (window.scrollY > 16) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ===== ACTIVE NAV LINK =====
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(function(s) {
        const top = s.offsetTop;
        if (window.scrollY >= top - 200) current = s.getAttribute('id');
    });
    links.forEach(function(l) {
        l.style.color = l.getAttribute('href') === '#' + current ? 'var(--primary)' : '';
    });
});

// ===== MOBILE NAV TOGGLE =====
(function() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navLinks');
    var overlay = document.getElementById('navOverlay');
    if (!toggle || !menu) return;

    function openMenu() {
        toggle.classList.add('active');
        menu.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    toggle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (menu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }, { passive: false });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
        link.addEventListener('touchstart', function(e) {
            closeMenu();
        }, { passive: true });
    });

    // Close menu on overlay click/touch
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
        overlay.addEventListener('touchstart', function(e) {
            closeMenu();
        }, { passive: true });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            closeMenu();
        }
    });
})();

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        const r = document.createElement('span');
        r.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        r.style.width = r.style.height = size + 'px';
        r.style.left = (e.clientX - rect.left - size / 2) + 'px';
        r.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(r);
        setTimeout(function() { r.remove(); }, 600);
    });
});

// ===== CURSOR & TOUCH PARTICLES =====
(function() {
    var moveThrottle;
    var burstCooldown = 0;
    var wasTouch = false;

    function spawnScatter(x, y) {
        var count = 1 + Math.floor(Math.random() * 2);
        for (var i = 0; i < count; i++) {
            var p = document.createElement('div');
            p.className = 'cp';
            var size = 2 + Math.random() * 4;
            var offsetX = (Math.random() - 0.5) * 40;
            var offsetY = (Math.random() - 0.5) * 40;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = (x + offsetX - size / 2) + 'px';
            p.style.top = (y + offsetY - size / 2) + 'px';
            p.style.setProperty('--dx', (Math.random() - 0.5) * 30 + 'px');
            p.style.setProperty('--dy', (Math.random() - 0.5) * 30 + 'px');
            p.style.animationDuration = (1.5 + Math.random() * 2) + 's';
            document.body.appendChild(p);
            setTimeout(function() { p.remove(); }, 1200);
        }
    }

    function spawnBurst(x, y) {
        var now = Date.now();
        if (now - burstCooldown < 200) { return; }
        burstCooldown = now;
        var count = 14 + Math.floor(Math.random() * 8);
        for (var i = 0; i < count; i++) {
            var p = document.createElement('div');
            p.className = 'cp';
            var size = 2 + Math.random() * 3;
            var angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            var dist = 40 + Math.random() * 80;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = (x - size / 2) + 'px';
            p.style.top = (y - size / 2) + 'px';
            p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            p.style.animation = 'cpBurst 0.7s ease-out forwards';
            p.style.animationDuration = (0.5 + Math.random() * 0.4) + 's';
            document.body.appendChild(p);
            setTimeout(function() { p.remove(); }, 1000);
        }
    }

    // Desktop: move -> scatter
    document.addEventListener('mousemove', function(e) {
        if (moveThrottle) return;
        moveThrottle = setTimeout(function() { moveThrottle = null; }, 40);
        spawnScatter(e.clientX, e.clientY);
    });

    // Desktop/click -> burst (skip if already handled by touchstart)
    document.addEventListener('click', function(e) {
        if (wasTouch) { wasTouch = false; return; }
        spawnBurst(e.clientX, e.clientY);
    });

    // Mobile: drag -> scatter
    document.addEventListener('touchmove', function(e) {
        if (moveThrottle) return;
        moveThrottle = setTimeout(function() { moveThrottle = null; }, 40);
        if (e.touches.length > 0) {
            var t = e.touches[0];
            spawnScatter(t.clientX, t.clientY);
        }
    });

    // Mobile: tap -> burst
    document.addEventListener('touchstart', function(e) {
        wasTouch = true;
        setTimeout(function() { wasTouch = false; }, 400);
        if (e.touches.length > 0) {
            var t = e.touches[0];
            spawnBurst(t.clientX, t.clientY);
        }
    });
})();

// ===== AUDIO INTERACTION =====
(function() {
    var audioCtx;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function playTone(freq, vol, dur, type) {
        try {
            var ctx = getCtx();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + dur);
        } catch (e) {}
    }

    function playClick() {
        playTone(1047, 0.06, 0.05);
        playTone(784, 0.04, 0.07);
        playTone(523, 0.025, 0.09);
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('button, .btn, a, .nav-toggle, .carousel-arrow, #volumeBtn')) {
            playClick();
        }
    });

    var lastY = window.scrollY;
    var scrollTimeout;

    window.addEventListener('scroll', function() {
        if (scrollTimeout) return;
        var delta = Math.abs(window.scrollY - lastY);
        if (delta < 30) return;
        scrollTimeout = setTimeout(function() { scrollTimeout = null; }, 80);
        var vol = Math.min(0.015, delta * 0.00006);
        if (vol > 0.003) playTone(180 + delta * 0.25, vol, 0.05);
        lastY = window.scrollY;
    });
})();

// ===== CAROUSEL NAVIGATION =====
(function() {
    var carousel = document.getElementById('colorsCarousel');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');

    if (carousel && prevBtn && nextBtn) {
        function scrollCarousel(dir) {
            var card = carousel.querySelector('.color-card');
            if (!card) return;
            var scrollAmount = card.offsetWidth + parseFloat(getComputedStyle(carousel).gap);
            carousel.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
        }

        prevBtn.addEventListener('click', function() { scrollCarousel(-1); });
        nextBtn.addEventListener('click', function() { scrollCarousel(1); });

        var isDown = false;
        var startX;
        var scrollLeft;

        carousel.addEventListener('mousedown', function(e) {
            isDown = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', function() {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseup', function() {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - carousel.offsetLeft;
            var walk = (x - startX) * 1.5;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }
})();

// ===== BACKGROUND FLOATING PARTICLES =====
(function() {
    var canvas = document.getElementById('bgParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -1000, y: -1000 };
    var W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = Math.min(120, Math.floor(W * H / 8000));

    for (var i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3 - 0.08,
            size: 1.5 + Math.random() * 3,
            alpha: 0.3 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            var dx = p.x - mouse.x;
            var dy = p.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                var force = (120 - dist) / 120 * 2;
                p.vx += dx / dist * force * 0.08;
                p.vy += dy / dist * force * 0.08;
            }

            p.vx += (Math.random() - 0.5) * 0.02;
            p.vy += (Math.random() - 0.5) * 0.02;

            p.vy *= 0.99;
            p.vx *= 0.99;

            if (Math.abs(p.vx) > 1.5) p.vx *= 0.95;
            if (Math.abs(p.vy) > 1.5) p.vy *= 0.95;

            p.x += p.vx;
            p.y += p.vy;

            if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
            if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
            if (p.x > W + 10) p.x = -10;
            if (p.x < -10) p.x = W + 10;

            var pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.001 + p.phase);
            var a = p.alpha * pulse;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

            var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            gradient.addColorStop(0, 'rgba(255,255,255,' + (a * 0.95) + ')');
            gradient.addColorStop(0.3, 'rgba(230,232,240,' + (a * 0.55) + ')');
            gradient.addColorStop(0.6, 'rgba(200,202,214,' + (a * 0.2) + ')');
            gradient.addColorStop(1, 'rgba(200,202,214,0)');

            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.shadowColor = 'rgba(255,255,255,' + (a * 0.6) + ')';
            ctx.shadowBlur = p.size * 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + (a * 0.9) + ')';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', function() {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    draw();
})();
