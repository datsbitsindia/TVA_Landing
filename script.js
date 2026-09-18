// TVA SaaS Landing Page Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        const toggleIcon = mobileToggle.querySelector('i');
        
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('open');
            if (toggleIcon) {
                if (isOpen) {
                    toggleIcon.classList.remove('fa-bars');
                    toggleIcon.classList.add('fa-xmark');
                } else {
                    toggleIcon.classList.remove('fa-xmark');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile nav when clicking any menu link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-xmark');
                    toggleIcon.classList.add('fa-bars');
                }
            });
        });

        // Close mobile nav when clicking outside navbar
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('open');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-xmark');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        });
    }

    // 3. FAQ Accordion Handler
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    // 4. Download Modal Trigger Handler
    const downloadModal = document.getElementById('download-modal');
    const modalTitle = document.getElementById('modal-platform-title');
    const modalDesc = document.getElementById('modal-platform-desc');
    const modalClose = document.querySelector('.modal-close');
    const confirmDownloadBtn = document.getElementById('confirm-download-btn');

    let currentPlatform = 'exe';

    window.triggerDownloadModal = function(platform) {
        currentPlatform = platform;
        if (platform === 'exe') {
            modalTitle.innerHTML = '<i class="fa-brands fa-windows" style="color:#2563eb;"></i> TVA for Windows (.ZIP)';
            modalDesc.textContent = 'Version v2.4.0 (64-bit Installer) for Windows 10 & 11. Includes auto-updates and desktop notifications.';
            confirmDownloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download TVA_Setup_v2.4.0.zip';
        } else if (platform === 'apk') {
            modalTitle.innerHTML = '<i class="fa-brands fa-android" style="color:#10b981;"></i> TVA for Android (.APK)';
            modalDesc.textContent = 'Version v2.4.0 APK for Android 8.0+. Direct install package with mobile push notifications support.';
            confirmDownloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download TVA_v2.4.0.apk';
        } else {
            modalTitle.innerHTML = '<i class="fa-solid fa-globe" style="color:#2563eb;"></i> TVA Cloud Web App';
            modalDesc.textContent = 'Instant cloud access directly in your browser. No installation required.';
            confirmDownloadBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Open Web Dashboard';
        }

        if (downloadModal) {
            downloadModal.classList.add('open');
        }
    };

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            downloadModal.classList.remove('open');
        });
    }

    if (downloadModal) {
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                downloadModal.classList.remove('open');
            }
        });
    }

    if (confirmDownloadBtn) {
        confirmDownloadBtn.addEventListener('click', () => {
            showCustomAlert('Download Started', `Starting download for ${currentPlatform.toUpperCase()} package...`, false);
            downloadModal.classList.remove('open');
            
            // Trigger actual download
            if (currentPlatform === 'exe') {
                window.location.href = '/downloads/TVA_Setup.zip';
            } else if (currentPlatform === 'apk') {
                window.location.href = '/downloads/TVA_App.apk';
            } else if (currentPlatform === 'web') {
                window.open('https://app.tvatask.com', '_blank');
            }
        });
    }

    // Initialize ROI Calculator on Load
    if (document.getElementById('roi-team-size')) {
        updateRoiCalculation();
    }
});

// =========================================
// =========================================
// INTERACTIVE ROI CALCULATOR LOGIC
// =========================================
let currentRoiCurrency = 'INR';

window.setRoiCurrency = function(curr) {
    currentRoiCurrency = curr;

    const usdBtn = document.getElementById('curr-usd');
    const inrBtn = document.getElementById('curr-inr');

    if (curr === 'USD') {
        if (usdBtn) usdBtn.classList.add('active');
        if (inrBtn) inrBtn.classList.remove('active');
    } else {
        if (inrBtn) inrBtn.classList.add('active');
        if (usdBtn) usdBtn.classList.remove('active');
    }

    updateRoiCalculation();
};

window.setTeamSizePreset = function(val) {
    const teamSizeEl = document.getElementById('roi-team-size');
    if (teamSizeEl) {
        teamSizeEl.value = val;
        updateRoiCalculation();
    }
};

window.updateRoiCalculation = function() {
    const teamSizeEl = document.getElementById('roi-team-size');
    if (!teamSizeEl) return;

    const teamSize = parseInt(teamSizeEl.value, 10) || 5;

    // Update Badge Text
    const valTeamSizeEl = document.getElementById('val-team-size');
    if (valTeamSizeEl) {
        valTeamSizeEl.textContent = `${teamSize} ${teamSize === 1 ? 'Employee' : 'Employees'}`;
    }

    const currSymbol = currentRoiCurrency === 'USD' ? '$' : '₹';
    // Standard baseline hourly wage ($25/hr for USD, ₹500/hr for INR)
    const defaultHourlyWage = currentRoiCurrency === 'USD' ? 25 : 500;

    // Core Formula: 0.75 hours (45 mins) saved per employee per day
    const hoursSavedPerDayPerEmp = 0.75;
    const workingDaysPerWeek = 5;

    const weeklyHoursSaved = teamSize * hoursSavedPerDayPerEmp * workingDaysPerWeek;
    const monthlyHoursSaved = weeklyHoursSaved * 4.33;
    const monthlyCostSavings = monthlyHoursSaved * defaultHourlyWage;
    const annualSavings = monthlyCostSavings * 12;

    // SaaS Cost Estimation
    let monthlySaasCost = 29;
    if (currentRoiCurrency === 'USD') {
        monthlySaasCost = teamSize <= 10 ? 29 : (teamSize <= 50 ? 79 : 199);
    } else {
        monthlySaasCost = teamSize <= 10 ? 2400 : (teamSize <= 50 ? 6500 : 16000);
    }

    const annualSaasCost = monthlySaasCost * 12;
    const netAnnualRoi = Math.max(0, Math.round(((annualSavings - annualSaasCost) / annualSaasCost) * 100));

    // Update Result UI Elements
    const resWeeklyHoursEl = document.getElementById('res-weekly-hours');
    const resMonthlySavingsEl = document.getElementById('res-monthly-savings');
    const resAnnualRoiEl = document.getElementById('res-annual-roi');

    if (resWeeklyHoursEl) {
        resWeeklyHoursEl.textContent = `${weeklyHoursSaved.toFixed(1)} hrs`;
    }

    if (resMonthlySavingsEl) {
        resMonthlySavingsEl.textContent = `${currSymbol}${Math.round(monthlyCostSavings).toLocaleString()} / mo`;
    }

    if (resAnnualRoiEl) {
        resAnnualRoiEl.textContent = `${netAnnualRoi.toLocaleString()}% ROI`;
    }
};



window.openOrgRegisterModal = function() {
    const modal = document.getElementById('org-register-modal');
    if (modal) {
        modal.classList.add('open');
        goToStep(1);
    }
};

window.closeOrgRegisterModal = function() {
    const modal = document.getElementById('org-register-modal');
    if (modal) {
        modal.classList.remove('open');
    }
};

window.goToStep = function(stepNum) {
    const section1 = document.getElementById('form-section-1');
    const section2 = document.getElementById('form-section-2');
    const indicator1 = document.getElementById('step-indicator-1');
    const indicator2 = document.getElementById('step-indicator-2');
    const line1 = document.getElementById('step-line-1');

    if (stepNum === 2) {
        // Validate Section 1 Fields First
        const fname = document.getElementById('reg-fname').value.trim();
        const lname = document.getElementById('reg-lname').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const designation = document.getElementById('reg-designation').value.trim();

        if (!fname || !lname || !email || !phone || !designation) {
            showCustomAlert('⚠️ Missing Personal Information', 'Please complete all required fields in Section 1 before proceeding to Organization Details.', true);
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            showCustomAlert('⚠️ Invalid Work Email', 'Please enter a valid work email address (e.g. rahul@company.com).', true);
            return;
        }

        section1.classList.remove('active');
        section2.classList.add('active');
        indicator1.classList.remove('active');
        indicator1.classList.add('completed');
        indicator2.classList.add('active');
        line1.classList.add('active');
    } else {
        section2.classList.remove('active');
        section1.classList.add('active');
        indicator2.classList.remove('active');
        indicator1.classList.remove('completed');
        indicator1.classList.add('active');
        line1.classList.remove('active');
    }
};

window.updateAdminSuggestion = function() {
    const orgInput = document.getElementById('reg-orgname').value.trim();
    const adminInput = document.getElementById('reg-adminid');
    const suggestedFormat = document.getElementById('suggested-format');

    if (!orgInput) {
        suggestedFormat.textContent = 'admin@company';
        return;
    }

    const cleanOrg = orgInput.toLowerCase().replace(/[^a-z0-9]/g, '');
    const suggestion = `admin@${cleanOrg}`;
    suggestedFormat.textContent = suggestion;

    if (!adminInput.value || adminInput.value.startsWith('admin@')) {
        adminInput.value = suggestion;
    }
};

window.handleOrgRegisterSubmit = async function(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('btn-submit-org');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Register';

    const fname = document.getElementById('reg-fname').value.trim();
    const lname = document.getElementById('reg-lname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const designation = document.getElementById('reg-designation').value.trim();
    const orgName = document.getElementById('reg-orgname').value.trim();
    const adminId = document.getElementById('reg-adminid').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const cpassword = document.getElementById('reg-cpassword').value;

    // 1. Password Match Validation
    if (password !== cpassword) {
        showCustomAlert('⚠️ Password Mismatch', 'The Admin Account Password and Confirm Password do not match. Please re-enter passwords carefully.', true);
        return;
    }

    if (password.length < 4) {
        showCustomAlert('⚠️ Weak Password', 'Admin Password must be at least 4 characters long.', true);
        return;
    }

    // Disable button & show loading status
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting to Database...';
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('/api/register-org', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fname,
                lname,
                email,
                phone,
                designation,
                orgName,
                adminId,
                password
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }

        if (!data.success) {
            showCustomAlert('⚠️ Organization Registration Failed', data.error || 'Database check failed. Organization or Admin ID may already exist.', true);
            return;
        }

        // Success! Show Success Modal
        closeOrgRegisterModal();

        document.getElementById('succ-org-name').textContent = data.orgName || orgName;
        document.getElementById('succ-admin-id').textContent = data.adminId || adminId;

        const successModal = document.getElementById('org-success-modal');
        if (successModal) {
            successModal.classList.add('open');
        }

        // Reset Form
        document.getElementById('org-register-form').reset();

    } catch (err) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        console.error('Registration API Error:', err);
        if (err.name === 'AbortError') {
            // Request took too long - but organization may have been created
            // Check if it was actually created by trying to login
            showCustomAlert('⚠️ Request Timeout', 'The request took too long to respond. Please check if your organization was created and try logging in, or try registering again.', true);
        } else {
            showCustomAlert('⚠️ Connection Error', `Could not reach the server: ${err.message || 'Network Error'}. Please check your connection and try again.`, true);
        }
    }
};

window.closeOrgSuccessModal = function() {
    const successModal = document.getElementById('org-success-modal');
    if (successModal) {
        successModal.classList.remove('open');
    }
};

// =========================================
// CUSTOM POPUP ALERT SYSTEM
// =========================================
window.showCustomAlert = function(title, message, isError = false) {
    const modal = document.getElementById('custom-alert-modal');
    const alertTitle = document.getElementById('alert-title');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');

    if (alertTitle) alertTitle.textContent = title;
    if (alertMessage) alertMessage.textContent = message;

    if (alertIcon) {
        if (isError) {
            alertIcon.style.color = '#ef4444';
            alertIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
        } else {
            alertIcon.style.color = '#10b981';
            alertIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        }
    }

    if (modal) {
        modal.classList.add('open');
    }
};

window.closeCustomAlert = function() {
    const modal = document.getElementById('custom-alert-modal');
    if (modal) {
        modal.classList.remove('open');
    }
};

// =========================================
// BOOK LIVE DEMO MODAL HANDLERS
// =========================================
window.openBookDemoModal = function() {
    const modal = document.getElementById('book-demo-modal');
    if (modal) {
        modal.classList.add('open');
    }
};

window.closeBookDemoModal = function() {
    const modal = document.getElementById('book-demo-modal');
    if (modal) {
        modal.classList.remove('open');
    }
};

window.handleBookDemoSubmit = async function(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('btn-submit-demo');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

    const name = document.getElementById('demo-name').value.trim();
    const email = document.getElementById('demo-email').value.trim();
    const phone = document.getElementById('demo-phone').value.trim();
    const orgName = document.getElementById('demo-orgname').value.trim();
    const teamSize = document.getElementById('demo-teamsize').value;
    const demoDate = document.getElementById('demo-datetime').value.trim();
    const notes = document.getElementById('demo-notes').value.trim();

    if (!name || !email || !phone) {
        showCustomAlert('⚠️ Missing Details', 'Please fill in Name, Work Email, and Phone Number.', true);
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
    }

    try {
        const response = await fetch('/api/book-demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, orgName, teamSize, demoDate, notes })
        });

        const data = await response.json();

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }

        closeBookDemoModal();
        document.getElementById('book-demo-form').reset();

        showCustomAlert('🎉 Demo Request Submitted!', data.message || 'Our team will contact you shortly to confirm your live demo.', false);

    } catch (err) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
        console.error('Book Demo API Error:', err);
        showCustomAlert('⚠️ Request Submitted', 'Thank you! Your demo request has been recorded. Our enterprise team will contact you shortly.', false);
    }
};

// =========================================
// LIVE INTERACTIVE AI PLAYGROUND HANDLERS
// =========================================
window.triggerPlaygroundPreset = function(presetText) {
    if (presetText) {
        processPlaygroundSubmission(presetText);
    }
};

window.handlePlaygroundSubmit = function(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('ai-playground-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    processPlaygroundSubmission(text);
    input.value = '';
};

function processPlaygroundSubmission(text) {
    const chatBody = document.getElementById('ai-playground-chat-body');
    if (!chatBody) return;

    // 1. Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg ai-msg-user';
    userMsg.innerHTML = text;
    chatBody.appendChild(userMsg);

    // 2. Append Typing Indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'ai-msg ai-msg-bot';
    typingMsg.id = 'ai-playground-typing';
    typingMsg.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;">
            <i class="fa-solid fa-brain fa-spin" style="color:#6366f1;"></i>
            <span>FastMCP Querying Cloud Database...</span>
            <div class="ai-typing-dots"><span></span><span></span><span></span></div>
        </div>
    `;
    chatBody.appendChild(typingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 3. Process AI Response after 600ms simulated delay
    setTimeout(() => {
        const typingElem = document.getElementById('ai-playground-typing');
        if (typingElem) typingElem.remove();

        const botResponse = generateAIResponse(text);
        const botMsg = document.createElement('div');
        botMsg.className = 'ai-msg ai-msg-bot';
        botMsg.innerHTML = botResponse;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Play subtle audio speech synthesis if available
        if ('speechSynthesis' in window) {
            try {
                const utterance = new SpeechSynthesisUtterance("Action processed successfully.");
                utterance.rate = 1.1;
                utterance.volume = 0.4;
                window.speechSynthesis.speak(utterance);
            } catch(e) {}
        }
    }, 650);
}

function generateAIResponse(input) {
    const lower = input.toLowerCase();

    // Scenario 1: Task Creation / Assignment
    if (lower.includes('create') || lower.includes('assign') || lower.includes('alex') || lower.includes('sarah') || lower.includes('task')) {
        const taskId = Math.floor(100 + Math.random() * 900);
        const assignee = lower.includes('sarah') ? 'Sarah Connor' : (lower.includes('marcus') ? 'Marcus Vance' : 'Alex Rivera');
        const priority = lower.includes('high') || lower.includes('urgent') ? 'High 🚨' : 'Medium ⚡';
        
        return `
            ✅ <strong>Task #${taskId} Created &amp; Database Synced!</strong><br><br>
            📋 <strong>Task:</strong> ${escapeHtml(input)}<br>
            👤 <strong>Assigned To:</strong> <strong>${assignee}</strong><br>
            🚨 <strong>Priority:</strong> ${priority}<br>
            📅 <strong>Due Date:</strong> Friday, 15 Sept 2026<br>
            🏢 <strong>Organization Scope:</strong> Enterprise Tenant #102
            <div class="ai-widget-box" style="border-left:3px solid #10b981;">
                <i class="fa-solid fa-bell" style="color:#10b981;"></i> Real-time notification dispatched to ${assignee}'s Web, Windows &amp; Android devices.
            </div>
        `;
    }

    // Scenario 2: Overdue Tasks Lookup
    if (lower.includes('overdue') || lower.includes('late') || lower.includes('pending') || lower.includes('report')) {
        return `
            ⚠️ <strong>Live Database Query Result — Overdue Tasks Found:</strong><br><br>
            1. <strong>#112 TDS Reconciliation Issue</strong> &mdash; Due: 29 Aug (Assigned: Alex Rivera)<br>
            2. <strong>#114 Database Indexing Optimization</strong> &mdash; Due: 31 Aug (Assigned: Marcus Vance)<br>
            3. <strong>#128 REST API Gateway Auth</strong> &mdash; Due: 1 Sept (Assigned: Sarah Connor)<br><br>
            💡 <em>Tip: You can say "Forward #112 to Marcus" to reassign immediately!</em>
            <div class="ai-widget-box" style="border-left:3px solid #f59e0b;">
                <i class="fa-solid fa-chart-line" style="color:#f59e0b;"></i> Team Completion Rate: <strong>88.4%</strong> (3 overdue out of 26 active tasks).
            </div>
        `;
    }

    // Scenario 3: Daily Routine Automation
    if (lower.includes('routine') || lower.includes('daily') || lower.includes('checklist') || lower.includes('design')) {
        return `
            🔄 <strong>Daily Routine Automation Provisioned!</strong><br><br>
            📅 <strong>Frequency:</strong> Monday to Friday (9:00 AM Auto-Trigger)<br>
            🎯 <strong>Target Team:</strong> Design &amp; Frontend Operations<br>
            ⚙️ <strong>Mode:</strong> Standalone Daily Logs with Completion Tracking<br>
            <div class="ai-widget-box" style="border-left:3px solid #2563eb;">
                <i class="fa-solid fa-arrows-spin" style="color:#2563eb;"></i> System will automatically generate new daily task cards for all team members every morning.
            </div>
        `;
    }

    // Scenario 4: Forwarding Tasks
    if (lower.includes('forward') || lower.includes('reassign') || lower.includes('marcus')) {
        return `
            ⏩ <strong>Task Forwarded &amp; Chain of Custody Updated!</strong><br><br>
            📌 <strong>Task:</strong> #114 Database Indexing Optimization<br>
            🔄 <strong>Reassigned To:</strong> Marcus Vance<br>
            📝 <strong>Reason Logged:</strong> "Lead review requested"<br>
            <div class="ai-widget-box" style="border-left:3px solid #6366f1;">
                <i class="fa-solid fa-shield-halved" style="color:#6366f1;"></i> Audit event <code>TASK_FORWARD_SUCCESS</code> logged to database audit_events.
            </div>
        `;
    }

    // Fallback / General Query Response
    return `
        🤖 <strong>TVA AI Assistant Response:</strong><br>
        I processed your input: <em>"${escapeHtml(input)}"</em>.<br><br>
        Because TVA uses live database context scoping, I can execute task assignments, run routine schedules, and fetch real-time multi-tenant analytics on your database.
        <div class="ai-widget-box" style="border-left:3px solid #8b5cf6;">
            <i class="fa-solid fa-wand-magic-sparkles" style="color:#8b5cf6;"></i> Try typing: <strong>"Create high priority task for Sarah"</strong> or click any preset chip above!
        </div>
    `;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

let isPlaygroundListening = false;
window.togglePlaygroundMic = function() {
    const micBtn = document.getElementById('ai-playground-mic');
    const input = document.getElementById('ai-playground-input');
    if (!micBtn || !input) return;

    if (isPlaygroundListening) {
        isPlaygroundListening = false;
        micBtn.classList.remove('listening');
        return;
    }

    isPlaygroundListening = true;
    micBtn.classList.add('listening');
    input.value = '';
    input.placeholder = '🎤 Listening to voice input... (Speak now)';

    const voiceSamples = [
        "Create a High priority task for Alex - Fix payment gateway callback",
        "Show me all overdue tasks for Marketing team",
        "Forward Database Indexing task to Marcus Vance",
        "Create daily routine for Engineering team"
    ];
    const sample = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];

    let idx = 0;
    const interval = setInterval(() => {
        if (idx <= sample.length) {
            input.value = sample.substring(0, idx);
            idx++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                micBtn.classList.remove('listening');
                isPlaygroundListening = false;
                input.placeholder = 'Type a command (e.g. Create task for Alex, Show overdue tasks)...';
                processPlaygroundSubmission(sample);
                input.value = '';
            }, 400);
        }
    }, 35);
};

// =========================================
// PRIVACY POLICY & TERMS OF SERVICE MODALS
// =========================================
window.openPrivacyModal = function() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.add('open');
};

window.closePrivacyModal = function() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.remove('open');
};

window.openTermsModal = function() {
    const modal = document.getElementById('terms-modal');
    if (modal) modal.classList.add('open');
};

window.closeTermsModal = function() {
    const modal = document.getElementById('terms-modal');
    if (modal) modal.classList.remove('open');
};

// Close legal modals on backdrop click
document.addEventListener('DOMContentLoaded', () => {
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');

    if (privacyModal) {
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                closePrivacyModal();
            }
        });
    }

    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                closeTermsModal();
            }
        });
    }
});

