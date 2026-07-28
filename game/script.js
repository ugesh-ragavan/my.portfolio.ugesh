// Gamified Retro Portfolio Controller Loop

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Gaming Crosshair Cursor
  // ----------------------------------------------------
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    const addHoverClass = () => {
      if (typeof GameAudio !== 'undefined') GameAudio.playTick();
    };

    const attachCursorHovers = () => {
      const hovers = document.querySelectorAll('button, a, input, textarea, .quest-card, .lobby-btn, #mascot-viewport');
      hovers.forEach(el => {
        el.removeEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseenter', addHoverClass);
      });
    };
    attachCursorHovers();
    setInterval(attachCursorHovers, 1500);
  }

  // ----------------------------------------------------
  // 2. XP & RPG Progression Engine
  // ----------------------------------------------------
  let xp = 0;
  let level = 1;
  const xpBar = document.getElementById('xp-bar-inner');
  const xpText = document.getElementById('xp-value');
  const levelBadge = document.getElementById('hud-level-badge');
  const levelUpOverlay = document.getElementById('level-up-overlay');
  const levelUpText = document.getElementById('level-up-text');
  const levelUpOkBtn = document.getElementById('level-up-ok-btn');
  
  // Keep track of actions that already gave XP to prevent spamming
  const xpLoggedActions = {};

  function addXp(amount, actionId) {
    if (actionId && xpLoggedActions[actionId]) return; // Already rewarded
    if (actionId) xpLoggedActions[actionId] = true;

    xp += amount;
    if (typeof GameAudio !== 'undefined') GameAudio.playTalk();

    if (xp >= 100) {
      const overflow = xp - 100;
      xp = 0;
      level++;
      triggerLevelUp(level);
      xp = overflow; // apply overflow after Level Up finishes
    }

    updateXpBar();
  }

  function updateXpBar() {
    if (xpBar) xpBar.style.width = `${xp}%`;
    if (xpText) xpText.textContent = `${xp}/100`;
    if (levelBadge) levelBadge.textContent = `LVL ${level}`;
  }

  function triggerLevelUp(newLvl) {
    if (typeof GameAudio !== 'undefined') {
      GameAudio.playLevelUp();
    }
    
    // Animate mascot
    setMascotExpression('happy', `LEVEL UP! Outstanding! Your clearance upgraded to Level ${newLvl}! 🎉`);
    
    if (levelUpOverlay && levelUpText) {
      levelUpText.textContent = `Your operational clearance has upgraded to Level ${newLvl}!`;
      setTimeout(() => {
        levelUpOverlay.classList.add('active');
      }, 500);
    }
    
    // Restore HP / MP bars to show level health boost
    const hpVal = document.getElementById('hp-value');
    const mpVal = document.getElementById('mp-value');
    if (hpVal) hpVal.textContent = "100/100";
    if (mpVal) mpVal.textContent = `${80 + newLvl * 5}/${80 + newLvl * 5}`;
  }

  if (levelUpOkBtn && levelUpOverlay) {
    levelUpOkBtn.addEventListener('click', () => {
      levelUpOverlay.classList.remove('active');
      if (typeof GameAudio !== 'undefined') GameAudio.playSelect();
      setMascotExpression('normal', `Back to the dashboard grid! What's our next mission?`);
    });
  }

  // ----------------------------------------------------
  // 3. Interactive 3D CSS Mascot ("Cuby")
  // ----------------------------------------------------
  const mascotViewport = document.getElementById('mascot-viewport');
  const mascotCube = document.getElementById('mascot-cube');
  const speechBubble = document.getElementById('speech-bubble');

  if (mascotViewport && mascotCube && speechBubble) {
    
    // 3D Mouse orbit track
    mascotViewport.addEventListener('mousemove', (e) => {
      const rect = mascotViewport.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2; // offset from center
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -20 - (y / rect.height) * 40; // Max 40 deg pitch
      const rotateY = 35 + (x / rect.width) * 50;  // Max 50 deg yaw
      
      // Apply 3D rotation
      mascotCube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Reset rotation on mouseleave
    mascotViewport.addEventListener('mouseleave', () => {
      mascotCube.style.transform = `rotateX(-20deg) rotateY(35deg)`;
      setMascotExpression('normal');
    });

    // Mascot expressions changer helper
    window.setMascotExpression = function(expression, customText = null) {
      mascotCube.classList.remove('happy', 'dizzy');
      
      if (expression === 'happy') {
        mascotCube.classList.add('happy');
      } else if (expression === 'dizzy') {
        mascotCube.classList.add('dizzy');
      }

      if (customText) {
        speechBubble.textContent = customText;
      }
    };

    // Spin mascot on click
    mascotViewport.addEventListener('click', () => {
      if (mascotCube.classList.contains('dizzy')) return;
      
      // Award click XP
      addXp(10, 'click_mascot_' + Math.floor(xpLoggedActions.length / 5));

      // Trigger rapid 3D spins
      mascotCube.style.transition = 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
      mascotCube.style.transform = 'rotateX(720deg) rotateY(-720deg)';
      setMascotExpression('dizzy', "Wheee! Stop spinning me, I'm getting dizzy! 😵");

      setTimeout(() => {
        // Restore transition
        mascotCube.style.transition = 'transform 0.5s ease-out';
        mascotCube.style.transform = 'rotateX(-20deg) rotateY(35deg)';
        setMascotExpression('normal', "Phew! Gravity parameters restored. Click me again if you dare! 😉");
      }, 1500);
    });

    // Dynamic mascot hover commentary quotes
    const quotes = [
      "I love living in this CSS layout. It's warm here! ☀️",
      "Did you check Ugesh's acrylic paintings in the Creative Sandbox? Extremely cool!",
      "Fun fact: Ugesh can solve a Rubik's cube in about 15 seconds! 🧩",
      "Need big data? Ugesh can spin up Hadoop clusters like a wizard. 🧙‍♂️",
      "My 3D rendering uses pure CSS 3D transforms. Zero heavy libraries! 🚀",
      "Wait... Did you drink water today? System hydration levels are important! 💧",
      "Check out Ugesh's professional campaigns in the quest log tab!"
    ];

    mascotViewport.addEventListener('mouseenter', () => {
      const randQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setMascotExpression('happy', randQuote);
    });
  }

  // ----------------------------------------------------
  // 4. Hydration Alert & Quest Loop
  // ----------------------------------------------------
  const waterAlert = document.getElementById('water-alert');
  const waterCloseBtn = document.getElementById('water-close-btn');

  if (waterAlert && waterCloseBtn) {
    
    function triggerHydrationAlert() {
      if (typeof GameAudio !== 'undefined') {
        GameAudio.playWater();
      }
      setMascotExpression('happy', "Hydration Alert! Grab a glass of water to restore system fluid stats! 💧");
      waterAlert.classList.add('open');
    }

    // Trigger hydration alarm every 60 seconds
    setInterval(triggerHydrationAlert, 60000);

    // Initial testing delay (alert user after 15 seconds on initial load so they see it instantly!)
    setTimeout(triggerHydrationAlert, 15000);

    waterCloseBtn.addEventListener('click', () => {
      waterAlert.classList.remove('open');
      if (typeof GameAudio !== 'undefined') GameAudio.playSelect();
      
      // Award XP for completing water break!
      addXp(20, 'quest_hydration_' + Date.now());
      setMascotExpression('normal', "Hydration Quest Complete! +20 XP awarded. Stay healthy, player!");
    });
  }

  // ----------------------------------------------------
  // 5. RPG Character Tab Shifter
  // ----------------------------------------------------
  const tabBtns = document.querySelectorAll('.game-tab-btn');
  const tabContents = document.querySelectorAll('.game-tab-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // play select sound
        if (typeof GameAudio !== 'undefined') GameAudio.playSelect();

        // Toggle active button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle content
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === tabId) {
            content.classList.add('active');
          }
        });

        // Award XP on exploring tabs
        addXp(15, 'explore_tab_' + tabId);

        // Mascot custom tab dialogue
        if (tabId === 'quest_log') {
          setMascotExpression('happy', "A list of completed quests! Ugesh worked at Cognizant, TRS systems, and SNS tech college. 🎓");
        } else if (tabId === 'active_quests' || tabId === 'exhibition') {
          setMascotExpression('normal', "Look! Decrypting these cards yields massive XP rewards! Check them out.");
        } else if (tabId === 'transmission') {
          setMascotExpression('happy', "Uplink prompt! Send Ugesh a message directly through the data stack.");
        } else {
          setMascotExpression('normal');
        }
      });
    });
  }

  // ----------------------------------------------------
  // 6. Decrypter Quest Card Modal Loader
  // ----------------------------------------------------
  const questCards = document.querySelectorAll('.quest-card-interact');
  const modal = document.getElementById('decrypt-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalMedia = document.getElementById('modal-media-frame');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalLinkBtn = document.getElementById('visit-project-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (questCards.length > 0 && modal) {
    questCards.forEach(card => {
      card.addEventListener('click', () => {
        // play click
        if (typeof GameAudio !== 'undefined') GameAudio.playSelect();

        const title = card.getAttribute('data-title') || 'Quest Node';
        const desc = card.getAttribute('data-desc') || 'Logs decrypting...';
        const link = card.getAttribute('data-link') || '#';
        const mediaType = card.getAttribute('data-media-type') || 'image';
        const mediaSource = card.getAttribute('data-media') || '';

        // Populate modal
        modalTitle.textContent = `QUEST DETAILED: ${title.toUpperCase()}`;
        modalDesc.textContent = desc;
        modalLinkBtn.href = link;

        modalMedia.innerHTML = '';
        if (mediaType === 'video' && mediaSource) {
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${mediaSource}?autoplay=1&mute=1`;
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          iframe.allowFullscreen = true;
          modalMedia.appendChild(iframe);
        } else if (mediaSource) {
          const img = document.createElement('img');
          img.src = mediaSource;
          img.alt = title;
          modalMedia.appendChild(img);
        }

        // Display modal
        modal.classList.add('open');

        // Award card decryption XP
        addXp(25, 'decrypt_card_' + title);
        setMascotExpression('happy', `Decrypting Quest: ${title}. High tech data successfully fetched!`);
      });
    });

    const closeModal = () => {
      modal.classList.remove('open');
      modalMedia.innerHTML = '';
      if (typeof GameAudio !== 'undefined') GameAudio.playSelect();
      setMascotExpression('normal');
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ----------------------------------------------------
  // 7. RPG Character Stat Hover Commentary
  // ----------------------------------------------------
  const statBoxes = document.querySelectorAll('.stat-box');
  if (statBoxes.length > 0) {
    statBoxes.forEach(box => {
      box.addEventListener('mouseenter', () => {
        const abbrev = box.querySelector('.stat-abbrev').textContent;
        addXp(5, 'hover_stat_' + abbrev);
        
        if (abbrev.includes('DEX')) {
          setMascotExpression('happy', "Dexterity: Ugesh builds responsive mobile widgets using React Native and Flutter! 📱");
        } else if (abbrev.includes('CHA')) {
          setMascotExpression('happy', "Charisma: Video editing and logo artwork capabilities are off the charts! 🎨");
        } else if (abbrev.includes('STR')) {
          setMascotExpression('normal', "Strength: Deployed ETL modules, MapReduce, Hadoop arrays and HBase database tables. 💪");
        } else if (abbrev.includes('INT')) {
          setMascotExpression('happy', "Intelligence: CSE systems grad core parameters. Fast problem solver!");
        } else if (abbrev.includes('CUB')) {
          setMascotExpression('happy', "Speedcubing: CFOP algorithm averages sub-18s speeds. Extremely high reflex dexterity! 🧩");
        } else if (abbrev.includes('ART')) {
          setMascotExpression('happy', "Artistic acrylics: impressionistic sunset scenes. Very creative! 🎨");
        } else if (abbrev.includes('GAM')) {
          setMascotExpression('dizzy', "Strategy gaming logs: high speeds, reflex benchmarks. Level 95 config! 🎮");
        } else if (abbrev.includes('SND')) {
          setMascotExpression('happy', "Sound synthesizers: composing procedural loops and soundwaves. 🎹");
        }
      });
    });
  }

  // ----------------------------------------------------
  // 8. Contact Form Diagnostic uplink
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-gamified-form');
  const formDiagnostics = document.getElementById('form-diagnostics');
  if (contactForm && formDiagnostics) {
    contactForm.addEventListener('submit', (e) => {
      addXp(50, 'submit_contact_form');
      formDiagnostics.style.display = 'block';
      formDiagnostics.textContent = "DISPATCHING PACKETS TO CLOUD STACK... ENCRYPTION: SECURE. DISPATCHED!";
      
      setTimeout(() => {
        formDiagnostics.textContent = "SIGNAL TRANSMITTED SUCCESSFULLY. TARGET CORE WILL ACQUIRE DATA PACKET SHORTLY.";
        formDiagnostics.style.color = "#39ff14";
      }, 1500);
    });
  }

  // ----------------------------------------------------
  // 9. Shard Mode Switch Visuals
  // ----------------------------------------------------
  const shardSwapBtn = document.getElementById('shard-swap-btn');
  if (shardSwapBtn) {
    shardSwapBtn.addEventListener('click', () => {
      if (typeof GameAudio !== 'undefined') {
        GameAudio.playReboot();
      }
    });
  }

  // ----------------------------------------------------
  // 10. Mute Switcher integration
  // ----------------------------------------------------
  const muteBtn = document.getElementById('mute-btn');
  if (muteBtn) {
    const updateMuteBtnUI = (muted) => {
      muteBtn.textContent = muted ? "AUDIO: MUTED" : "AUDIO: ACTIVE";
      muteBtn.style.color = muted ? "#64748b" : "var(--neon-accent)";
    };

    if (typeof GameAudio !== 'undefined') {
      updateMuteBtnUI(GameAudio.isMuted);

      muteBtn.addEventListener('click', () => {
        const isMutedNow = GameAudio.toggleMute();
        if (!isMutedNow) GameAudio.playSelect();
      });

      window.addEventListener('game_mute_toggled', (e) => {
        updateMuteBtnUI(e.detail);
      });
    }
  }

  // Initial lobby buttons chime logic
  const btnCampaign = document.getElementById('btn-campaign');
  const btnSandbox = document.getElementById('btn-sandbox');
  if (btnCampaign && btnSandbox && typeof GameAudio !== 'undefined') {
    btnCampaign.addEventListener('click', () => GameAudio.playSelect());
    btnSandbox.addEventListener('click', () => GameAudio.playSelect());
  }
});
