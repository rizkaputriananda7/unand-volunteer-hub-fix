/* File: public/js/main.js */
/* Deskripsi: Skrip utama untuk interaktivitas front-end Unand Volunteer Hub. */

// Menjalankan skrip setelah seluruh halaman HTML dimuat.
document.addEventListener('DOMContentLoaded', function() {
    
    // Variabel global untuk menyimpan state aplikasi
    let currentUserRole = 'guest'; 
    let selectedRoleForLogin = null;

    // Menyeleksi elemen-elemen DOM yang sering digunakan
    const sidebarNavLinksContainer = document.getElementById('sidebar-nav-links');
    const contentSections = document.querySelectorAll('.content-section');
    const mainSidebar = document.getElementById('main-sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const sidebarRoleDisplay = document.getElementById('sidebar-role-display');
    const loginTitleEl = document.getElementById('login-title');
    const loginSubtitleEl = document.getElementById('login-subtitle');
    const customNotificationEl = document.getElementById('custom-notification');

    // Mendefinisikan link navigasi untuk setiap peran
    const navLinks = {
        'guest': [],
        'mahasiswa': [
            { text: 'Dashboard', sectionId: 'dashboard-mahasiswa', icon: 'fas fa-home' },
            { text: 'Program Volunteer', sectionId: 'mahasiswa-view-programs-section', icon: 'fas fa-bullhorn' },
            { text: 'Status Aplikasi', sectionId: 'mahasiswa-track-application-section', icon: 'fas fa-clipboard-list' },
            { text: 'Kalender Kegiatan', sectionId: 'mahasiswa-view-calendar-section', icon: 'fas fa-calendar-alt' },
            { text: 'Notifikasi', sectionId: 'mahasiswa-view-announcements-section', icon: 'fas fa-bell' },
            { text: 'Dokumen Saya', sectionId: 'mahasiswa-document-status-section', icon: 'fas fa-file-alt' },
            { text: 'Bantuan Surat Motivasi ✨', sectionId: 'mahasiswa-motivation-letter-section', icon: 'fas fa-magic' },
        ],
        'pengurus': [
            { text: 'Dashboard', sectionId: 'dashboard-pengurus', icon: 'fas fa-tachometer-alt' },
            { text: 'Buat Program Baru', sectionId: 'pengurus-create-program-section', icon: 'fas fa-plus-circle' },
            { text: 'Manajemen Seleksi', sectionId: 'pengurus-update-selection-section', icon: 'fas fa-users-cog' },
            { text: 'Detail Program', sectionId: 'pengurus-view-edit-program-section', icon: 'fas fa-info-circle' },
            { text: 'Jadwal Seleksi', sectionId: 'pengurus-view-schedule-section', icon: 'fas fa-calendar-check' },
            { text: 'Kirim Pengumuman', sectionId: 'pengurus-send-announcement-section', icon: 'fas fa-paper-plane' },
            { text: 'Validasi Dokumen', sectionId: 'pengurus-validate-documents-section', icon: 'fas fa-check-double' },
            { text: 'Statistik & Analitik', sectionId: 'pengurus-analytics-report-section', icon: 'fas fa-chart-bar' },
        ],
        'admin': [
            { text: 'Dashboard Admin', sectionId: 'dashboard-admin', icon: 'fas fa-cogs' },
            { text: 'Manajemen Program', sectionId: 'admin-program-overview-section', icon: 'fas fa-tasks' },
            { text: 'Overview Seleksi', sectionId: 'admin-selection-overview-section', icon: 'fas fa-user-check' },
            { text: 'Manajemen Jadwal Global', sectionId: 'admin-global-schedule-section', icon: 'fas fa-calendar-plus' },
            { text: 'Log Pengumuman', sectionId: 'admin-announcement-log-section', icon: 'fas fa-history' },
            { text: 'Overview Validasi Dokumen', sectionId: 'admin-document-validation-overview-section', icon: 'fas fa-file-contract' },
            { text: 'Analitik Komprehensif', sectionId: 'admin-comprehensive-analytics-section', icon: 'fas fa-chart-line' },
            { text: 'Saran Konten FAQ ✨', sectionId: 'admin-faq-management-section', icon: 'fas fa-lightbulb' },
        ]
    };

    /**
     * Menampilkan notifikasi kustom (toast).
     * @param {string} message - Pesan yang akan ditampilkan.
     * @param {string} [type='info'] - Tipe notifikasi ('success', 'error', 'info').
     * @param {number} [duration=3500] - Durasi notifikasi dalam milidetik.
     */
    function showNotification(message, type = 'info', duration = 3500) {
        if (!customNotificationEl) return;
        customNotificationEl.className = 'hidden'; 
        void customNotificationEl.offsetWidth; 
        customNotificationEl.classList.add(type); 
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        else if (type === 'error') iconClass = 'fa-exclamation-triangle';
        customNotificationEl.innerHTML = `<div><i class="fas ${iconClass}"></i><span>${message}</span></div>`;
        customNotificationEl.classList.remove('hidden');
        setTimeout(() => { customNotificationEl.classList.add('show'); }, 50);
        setTimeout(() => {
            customNotificationEl.classList.remove('show');
            customNotificationEl.addEventListener('transitionend', function handler() {
                customNotificationEl.classList.add('hidden');
                customNotificationEl.removeEventListener('transitionend', handler);
            }, { once: true });
        }, duration);
    }

    /**
     * Menampilkan 'halaman' atau section tertentu dan menyembunyikan yang lain.
     * @param {string} sectionId - ID dari elemen section yang akan ditampilkan.
     * @param {boolean} [isAuthPage=false] - Tandai jika ini adalah halaman otentikasi (login/role).
     */
    function showSection(sectionId, isAuthPage = false) {
        contentSections.forEach(section => section.classList.add('hidden'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        } else {
            console.error('Section not found:', sectionId);
        }

        document.querySelectorAll('.sidebar-nav-item').forEach(item => item.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar-nav-item[data-section-id="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Logika untuk menampilkan/menyembunyikan sidebar dan tombol toggle
        if (isAuthPage) {
            mainSidebar.classList.add('hidden');
            toggleSidebarBtn.classList.add('hidden');
            document.body.classList.add('auth-active');
        } else {
            document.body.classList.remove('auth-active');
            if (currentUserRole !== 'guest') {
                mainSidebar.classList.remove('hidden');
                if (window.innerWidth < 1024) {
                    toggleSidebarBtn.classList.remove('hidden');
                    mainSidebar.classList.remove('open');
                } else {
                    toggleSidebarBtn.classList.add('hidden');
                    mainSidebar.classList.add('open');
                }
            } else {
                mainSidebar.classList.add('hidden');
                toggleSidebarBtn.classList.add('hidden');
            }
        }
        if (window.innerWidth < 1024 && mainSidebar.classList.contains('open') && !isAuthPage) {
            toggleSidebar();
        }
    }
    
    /**
     * Fungsi untuk membuka/menutup sidebar pada mode mobile.
     */
    function toggleSidebar() {
        if (!mainSidebar) return;
        const isOpen = mainSidebar.classList.toggle('open');
        if (window.innerWidth < 1024) {
            toggleSidebarBtn.classList.toggle('hidden', isOpen);
        }
    }

    /**
     * Memperbarui konten sidebar berdasarkan peran pengguna.
     * @param {string} role - Peran pengguna saat ini ('mahasiswa', 'pengurus', 'admin').
     */
    function updateSidebar(role) {
        if (!sidebarNavLinksContainer || !sidebarRoleDisplay || !mainSidebar || !toggleSidebarBtn) return;
        sidebarNavLinksContainer.innerHTML = '';
        const links = navLinks[role] || [];
        links.forEach(link => {
            const div = document.createElement('div');
            div.className = 'sidebar-nav-item';
            div.dataset.sectionId = link.sectionId;
            div.innerHTML = `<i class="${link.icon}"></i> <span>${link.text}</span>`;
            div.onclick = (e) => { e.preventDefault(); showSection(link.sectionId); };
            sidebarNavLinksContainer.appendChild(div);
        });
        sidebarRoleDisplay.textContent = role !== 'guest' ? `Login sebagai: ${role.charAt(0).toUpperCase() + role.slice(1)}` : '';
    }

    /**
     * Fungsi yang dipanggil saat tombol peran dipilih.
     * @param {string} role - Peran yang dipilih.
     */
    window.selectRole = function(role) {
        selectedRoleForLogin = role;
        if(loginTitleEl) loginTitleEl.textContent = `Login sebagai ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        if(loginSubtitleEl) loginSubtitleEl.textContent = `Silakan masukkan kredensial ${role} Anda.`;
        showSection('login-section', true);
    }
    
    /**
     * Fungsi yang dipanggil saat tombol logout ditekan.
     */
    window.logout = function() {
        currentUserRole = 'guest';
        selectedRoleForLogin = null;
        updateSidebar(currentUserRole);
        showSection('role-selection-section', true);
        showNotification('Anda telah berhasil logout.', 'info');
    }

    // Event listener untuk form login (simulasi)
    document.getElementById('login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        currentUserRole = selectedRoleForLogin;
        updateSidebar(currentUserRole);
        showSection(`dashboard-${currentUserRole}`);
        showNotification(`Selamat datang, ${currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}!`, 'success');
    });

    // Event listener untuk form signup (simulasi)
    document.getElementById('signup-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Pendaftaran berhasil! Silakan login.', 'success');
        selectRole(selectedRoleForLogin || 'mahasiswa');
    });

    // Event listener untuk resize window untuk mengatur ulang tampilan sidebar
    window.addEventListener('resize', () => {
        if (currentUserRole === 'guest' || ['role-selection-section', 'login-section', 'signup-section'].includes(document.querySelector('.content-section:not(.hidden)')?.id)) {
            mainSidebar.classList.add('hidden');
            toggleSidebarBtn.classList.add('hidden');
        } else {
            mainSidebar.classList.remove('hidden');
            if (window.innerWidth < 1024) {
                toggleSidebarBtn.classList.remove('hidden');
                if (!mainSidebar.classList.contains('open')) { 
                    mainSidebar.classList.remove('open');
                }
            } else {
                toggleSidebarBtn.classList.add('hidden');
                mainSidebar.classList.add('open');
            }
        }
    });

    // --- Gemini API & Fungsi Spesifik Komponen ---
    const apiKey = ""; // Masukkan API Key Anda di sini jika diperlukan

    async function callGeminiAPI(prompt, outputElementId, loadingElementId) {
        // ... (Fungsi ini tetap sama)
    }
    window.generateMotivationLetter = async function() {
        const draft = document.getElementById('motivation-letter-draft')?.value;
        if (!draft?.trim()) { showNotification('Draf surat motivasi kosong.', 'info'); return; }
        const prompt = `Perbaiki dan sempurnakan draf surat motivasi berikut untuk volunteer perpustakaan Unand: "${draft}"`;
        await callGeminiAPI(prompt, 'motivation-letter-output', 'motivation-letter-loading');
    }
    window.generateAnnouncementDraft = async function() {
        const keywords = document.getElementById('announcement-keywords')?.value;
        if (!keywords?.trim()) { showNotification('Kata kunci pengumuman kosong.', 'info'); return; }
        const prompt = `Buat draf pengumuman resmi untuk volunteer Unand berdasarkan: "${keywords}"`;
        await callGeminiAPI(prompt, 'announcement-output', 'announcement-loading');
    }
    window.sendPengurusAnnouncement = function() {
        const subject = document.getElementById('pengurus_subject')?.value;
        const message = document.getElementById('pengurus_message')?.value;
        if(!subject || !message) {
            showNotification('Subjek dan isi pesan tidak boleh kosong.', 'error');
            return;
        }
        console.log("Mengirim pengumuman:", {subject, message});
        showNotification('Pengumuman berhasil dikirim (simulasi).', 'success');
        document.getElementById('pengurus_subject').value = '';
        document.getElementById('pengurus_message').value = '';
        document.getElementById('announcement-keywords').value = '';
        document.getElementById('announcement-response')?.classList.add('hidden');
    }
    window.generateFaqAnswer = async function() {
        const question = document.getElementById('faq-question-input')?.value;
        if (!question?.trim()) { showNotification('Pertanyaan FAQ kosong.', 'info'); return; }
        const prompt = `Berikan jawaban komprehensif untuk pertanyaan FAQ terkait volunteer Unand: "${question}"`;
        await callGeminiAPI(prompt, 'faq-output', 'faq-loading');
    }

    // --- Logika Kalender ---
    const currentMonthYearEl = document.getElementById('current-month-year');
    const calendarGridEl = document.querySelector('.calendar-grid');
    const calendarLegendEl = document.getElementById('calendar-legend');
    let currentDisplayedDate = new Date();

    function renderCalendar(date) {
        if (!currentMonthYearEl || !calendarGridEl || !calendarLegendEl) return;
        const year = date.getFullYear();
        const month = date.getMonth();
        currentMonthYearEl.textContent = `${date.toLocaleString('id-ID', { month: 'long' })} ${year}`;
        calendarGridEl.innerHTML = '';
        ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].forEach(day => {
            const dayHeaderDiv = document.createElement('div');
            dayHeaderDiv.className = 'day-header';
            dayHeaderDiv.textContent = day;
            calendarGridEl.appendChild(dayHeaderDiv);
        });
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const events = {
            '2023-11-05': { title: 'Pengumuman Seleksi Tahap 1', color: 'var(--primary-teal)'},
            '2023-11-10': { title: 'Wawancara Sesi 1', color: 'var(--accent-purple)'},
        };
        calendarLegendEl.innerHTML = '<h4 class="font-semibold text-sm mb-1">Legenda:</h4><ul class="list-none text-xs space-y-1">';
        Object.values(events).forEach(event => {
            calendarLegendEl.innerHTML += `<li><span style="background-color:${event.color};" class="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle"></span>${event.title}</li>`;
        });
        calendarLegendEl.innerHTML += '</ul>';
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGridEl.appendChild(document.createElement('div'));
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCellDiv = document.createElement('div');
            dayCellDiv.className = 'day-cell';
            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.className = 'day-number';
            dayNumberSpan.textContent = day;
            dayCellDiv.appendChild(dayNumberSpan);
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCellDiv.classList.add('current-day');
            }
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (events[dateString]) {
                dayCellDiv.classList.add('has-event');
                const eventDotDiv = document.createElement('div');
                eventDotDiv.className = 'event-dot';
                eventDotDiv.style.backgroundColor = events[dateString].color;
                eventDotDiv.title = events[dateString].title;
                dayCellDiv.appendChild(eventDotDiv);
            }
            calendarGridEl.appendChild(dayCellDiv);
        }
    }

    document.getElementById('prev-month-btn')?.addEventListener('click', () => {
        currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() - 1);
        renderCalendar(currentDisplayedDate);
    });
    document.getElementById('next-month-btn')?.addEventListener('click', () => {
        currentDisplayedDate.setMonth(currentDisplayedDate.getMonth() + 1);
        renderCalendar(currentDisplayedDate);
    });
    
    // --- Inisialisasi Aplikasi ---
    // Di aplikasi nyata, Anda akan memeriksa status login di sini.
    // Untuk simulasi ini, kita mulai dari halaman pemilihan peran.
    updateSidebar('guest'); // Mulai tanpa sidebar
    // Cek URL untuk menentukan halaman mana yang akan ditampilkan
    // Ini adalah simulasi routing sisi klien yang sangat sederhana
    // Dalam aplikasi Express nyata, routing akan menangani ini di sisi server
    const initialSection = document.querySelector('.content-section:not(.hidden)')?.id || 'role-selection-section';
    showSection(initialSection, true);

    // Render kalender jika elemennya ada di halaman awal
    if (document.getElementById('mahasiswa-view-calendar-section')) {
        renderCalendar(currentDisplayedDate);
    }

    // Membuat fungsi global untuk diakses dari HTML (onclick)
    window.toggleSidebar = toggleSidebar;
});
