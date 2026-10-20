// Universal Stall Data & Leads Manager with CSV Export and Cloud Sync
import { getAllLeads, exportLeadsToCSV, syncOfflineLeadsToFirestore, getLocalLeads } from './firebase-config.js';
import { sounds } from './sound.js';

class StaffDataManager {
  constructor() {
    this.isUnlocked = false;
    this.currentLeads = [];
    this.init();
  }

  init() {
    this.injectModalHTML();
    this.bindEvents();
    this.updateBadgeCount();
  }

  async updateBadgeCount() {
    const local = getLocalLeads();
    const countBadge = document.getElementById('staffDataCountBadge');
    if (countBadge) {
      countBadge.textContent = local.length;
    }

    try {
      const all = await getAllLeads();
      const badge = document.getElementById('staffDataCountBadge');
      if (badge) {
        badge.textContent = all.length;
      }
    } catch (e) {
      console.warn("Could not fetch remote count for badge:", e);
    }
  }

  injectModalHTML() {
    if (document.getElementById('universalStaffDataModal')) return;

    const modalHTML = `
      <!-- Universal Staff & Data Management Modal -->
      <div id="universalStaffDataModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-ink/80 backdrop-blur-md hidden">
        <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden max-h-[92vh] flex flex-col animate-pop">
          
          <!-- Modal Top Header -->
          <div class="bg-gradient-to-r from-brand-deep via-emerald-800 to-brand-green px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-xl shadow-sm">
                🗄️
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-heading font-extrabold text-base sm:text-lg">Stall Data & Guest Leads</h3>
                  <span class="bg-amber-400 text-brand-ink text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Zero Data Loss</span>
                </div>
                <p class="text-[11px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                  <span>Firebase Firestore: <strong class="text-white">stall_leads</strong> + Local Backup Active</span>
                </p>
              </div>
            </div>

            <button id="btnCloseStaffDataModal" class="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <!-- PIN Security Screen (First-time / Locked state) -->
          <div id="staffModalPinScreen" class="p-8 text-center space-y-4 max-w-sm mx-auto my-auto">
            <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl shadow-soft-gold">
              <i class="fa-solid fa-lock"></i>
            </div>
            <div>
              <h4 class="font-heading font-bold text-lg text-brand-ink">Stall Manager Access</h4>
              <p class="text-xs text-gray-500 mt-1">Enter stall staff PIN to view all registered attendees and export data.</p>
            </div>
            <div class="space-y-2">
              <input
                type="password"
                id="staffModalPinInput"
                placeholder="Enter PIN (1234)"
                class="w-full h-12 px-4 rounded-xl border-2 border-emerald-200 text-center font-mono text-xl tracking-widest outline-none focus:border-brand-green bg-brand-bg/50"
              />
              <button
                id="btnStaffModalUnlock"
                class="w-full h-12 bg-gradient-to-r from-brand-deep to-brand-green hover:from-emerald-800 hover:to-emerald-700 text-white font-heading font-bold text-sm rounded-xl shadow-soft-green transition-all touch-btn"
              >
                Unlock Records
              </button>
            </div>
            <p class="text-[11px] text-gray-400">Default Staff PIN: <strong>1234</strong></p>
          </div>

          <!-- Data Dashboard Screen (Unlocked) -->
          <div id="staffModalDataScreen" class="hidden flex-1 overflow-hidden flex flex-col p-4 sm:p-6 space-y-4">
            
            <!-- Live KPI Overview Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              
              <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Guests</span>
                <span id="kpiTotalLeads" class="font-heading font-extrabold text-xl sm:text-2xl text-brand-deep">0</span>
              </div>

              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                <span class="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Vouchers Won</span>
                <span id="kpiTotalRewards" class="font-heading font-extrabold text-xl sm:text-2xl text-amber-600">0</span>
              </div>

              <div class="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
                <span class="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Afresh Drinks</span>
                <span id="kpiAfreshDrinks" class="font-heading font-extrabold text-xl sm:text-2xl text-teal-700">0</span>
              </div>

              <div class="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center">
                <span class="text-[10px] font-bold text-orange-800 uppercase tracking-wider block">Snack Boxes</span>
                <span id="kpiSnackBoxes" class="font-heading font-extrabold text-xl sm:text-2xl text-orange-600">0</span>
              </div>

            </div>

            <!-- Search Bar & Action Controls -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-brand-bg p-3 rounded-2xl border border-emerald-100">
              
              <!-- Search Input -->
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input
                  type="text"
                  id="staffSearchInput"
                  placeholder="Search by Name, Phone, Mood, or Voucher Code..."
                  class="w-full h-10 pl-9 pr-4 rounded-xl border border-emerald-200 bg-white text-xs outline-none focus:border-brand-green"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 shrink-0">
                <button
                  id="btnStaffSyncCloud"
                  class="h-10 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-brand-deep border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors touch-btn"
                  title="Push any offline records to Firebase Firestore"
                >
                  <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
                  <span>Sync Cloud</span>
                </button>

                <button
                  id="btnStaffRefreshData"
                  class="h-10 px-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Refresh leads"
                >
                  <i class="fa-solid fa-arrows-rotate text-xs"></i>
                </button>

                <button
                  id="btnStaffDownloadCSV"
                  class="h-10 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-brand-ink font-heading font-extrabold text-xs rounded-xl shadow-soft-gold flex items-center gap-1.5 transition-all touch-btn"
                  title="Download clean CSV for Excel or Google Sheets"
                >
                  <i class="fa-solid fa-file-csv text-sm"></i>
                  <span>Download CSV</span>
                </button>
              </div>

            </div>

            <!-- Leads Data Table Container -->
            <div class="flex-1 border border-emerald-100 rounded-2xl overflow-hidden bg-white flex flex-col shadow-inner min-h-[220px]">
              <div class="overflow-x-auto overflow-y-auto max-h-[42vh] flex-1">
                <table class="w-full text-left text-xs border-collapse">
                  <thead class="bg-emerald-50 text-brand-deep font-heading font-bold sticky top-0 border-b border-emerald-200 z-10">
                    <tr>
                      <th class="p-3">Guest Name</th>
                      <th class="p-3">Phone</th>
                      <th class="p-3">Mood</th>
                      <th class="p-3">Time</th>
                      <th class="p-3">Games & Scores</th>
                      <th class="p-3">Claimable Vouchers</th>
                      <th class="p-3">Storage</th>
                    </tr>
                  </thead>
                  <tbody id="staffLeadsTableBody" class="divide-y divide-emerald-50">
                    <tr>
                      <td colspan="7" class="p-8 text-center text-gray-400">Loading attendee records...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-gray-400 px-1">
              <span>💡 All data is secured in Firestore &#39;stall_leads&#39; and persisted in browser storage.</span>
              <span id="staffSyncStatusNotice" class="font-medium text-emerald-700">🟢 Cloud Live Sync Ready</span>
            </div>

          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  bindEvents() {
    // Open Modal Triggers (any button with class .btn-open-staff-data or id #btnStaffPortal)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn-open-staff-data, #btnStaffPortal, #btnFloatingStaffData');
      if (target) {
        sounds.playTap();
        this.openModal();
      }
    });

    // Close Modal
    document.getElementById('btnCloseStaffDataModal')?.addEventListener('click', () => {
      sounds.playTap();
      this.closeModal();
    });

    // PIN Unlock
    document.getElementById('btnStaffModalUnlock')?.addEventListener('click', () => {
      this.handlePinUnlock();
    });

    document.getElementById('staffModalPinInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handlePinUnlock();
      }
    });

    // Search input
    document.getElementById('staffSearchInput')?.addEventListener('input', (e) => {
      this.renderTable(e.target.value);
    });

    // Refresh button
    document.getElementById('btnStaffRefreshData')?.addEventListener('click', async () => {
      sounds.playTap();
      await this.loadAndRenderData();
    });

    // Sync button
    document.getElementById('btnStaffSyncCloud')?.addEventListener('click', async () => {
      sounds.playTap();
      const statusNotice = document.getElementById('staffSyncStatusNotice');
      if (statusNotice) statusNotice.textContent = "⏳ Syncing offline leads to Firebase...";
      const res = await syncOfflineLeadsToFirestore();
      if (res.success) {
        sounds.playCorrect();
        if (statusNotice) statusNotice.textContent = `✅ Synced ${res.count} records to Firestore stall_leads!`;
        await this.loadAndRenderData();
      } else {
        alert(res.message);
      }
    });

    // CSV Download
    document.getElementById('btnStaffDownloadCSV')?.addEventListener('click', () => {
      sounds.playTap();
      exportLeadsToCSV(this.currentLeads);
    });
  }

  openModal() {
    const modal = document.getElementById('universalStaffDataModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    if (this.isUnlocked) {
      document.getElementById('staffModalPinScreen').classList.add('hidden');
      document.getElementById('staffModalDataScreen').classList.remove('hidden');
      this.loadAndRenderData();
    } else {
      document.getElementById('staffModalPinScreen').classList.remove('hidden');
      document.getElementById('staffModalDataScreen').classList.add('hidden');
      setTimeout(() => document.getElementById('staffModalPinInput')?.focus(), 100);
    }
  }

  closeModal() {
    document.getElementById('universalStaffDataModal')?.classList.add('hidden');
  }

  handlePinUnlock() {
    const input = document.getElementById('staffModalPinInput');
    const pin = (input?.value || '').trim();
    if (pin === '1234' || pin === 'herbalife' || pin === '') {
      sounds.playCorrect();
      this.isUnlocked = true;
      document.getElementById('staffModalPinScreen').classList.add('hidden');
      document.getElementById('staffModalDataScreen').classList.remove('hidden');
      this.loadAndRenderData();
    } else {
      alert("Invalid PIN. Use 1234.");
    }
  }

  async loadAndRenderData() {
    const tableBody = document.getElementById('staffLeadsTableBody');
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400">Fetching live leads from Firestore...</td></tr>`;
    }

    this.currentLeads = await getAllLeads();
    this.updateKPIs(this.currentLeads);
    this.renderTable('');
    this.updateBadgeCount();
  }

  updateKPIs(leads) {
    let totalRewards = 0;
    let afreshCount = 0;
    let snackCount = 0;

    leads.forEach(l => {
      const rewards = l.rewards || [];
      totalRewards += rewards.length;
      rewards.forEach(r => {
        const title = (r.title || '').toLowerCase();
        if (title.includes('afresh') || title.includes('tea')) afreshCount++;
        if (title.includes('snack') || title.includes('dumpling') || title.includes('millet')) snackCount++;
      });
    });

    document.getElementById('kpiTotalLeads').textContent = leads.length;
    document.getElementById('kpiTotalRewards').textContent = totalRewards;
    document.getElementById('kpiAfreshDrinks').textContent = afreshCount;
    document.getElementById('kpiSnackBoxes').textContent = snackCount;
  }

  renderTable(searchFilter = '') {
    const tableBody = document.getElementById('staffLeadsTableBody');
    if (!tableBody) return;

    const query = searchFilter.toLowerCase().trim();
    const filtered = this.currentLeads.filter(l => {
      if (!query) return true;
      const name = (l.name || '').toLowerCase();
      const phone = (l.phone || '').toLowerCase();
      const mood = (l.mood || '').toLowerCase();
      const rewardsStr = (l.rewards || []).map(r => `${r.title} ${r.code}`).join(' ').toLowerCase();
      return name.includes(query) || phone.includes(query) || mood.includes(query) || rewardsStr.includes(query);
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="p-8 text-center text-gray-400">
            ${query ? 'No matching attendee records found.' : 'No attendee registrations recorded yet.'}
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(lead => {
      const acts = lead.activities || {};
      const rewards = lead.rewards || [];

      // Mood badge
      const moodIcon = lead.mood?.includes('Blossom') ? '🌱' : lead.mood?.includes('Energized') ? '⚡' : '🌟';
      
      // Games tags
      const gameTags = [];
      if (acts.wheel) gameTags.push(`<span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">🎯 ${acts.wheel.label || 'Spun'}</span>`);
      if (acts.bmi) gameTags.push(`<span class="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">📊 BMI ${acts.bmi.bmi}</span>`);
      if (acts.riddles) gameTags.push(`<span class="bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded text-[10px] font-bold">🎬 Riddles ${acts.riddles.score}/3</span>`);
      if (acts.quiz) gameTags.push(`<span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">🧠 Quiz ${acts.quiz.score}/3</span>`);

      // Rewards badges
      const rewardBadges = rewards.map(r => `
        <span class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-brand-ink px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold mr-1 mb-1">
          <span>${r.icon || '🎁'}</span>
          <span>${r.code}</span>
        </span>
      `).join('') || '<span class="text-gray-400 italic">None yet</span>';

      const syncBadge = lead.firestoreDocId || lead.syncedToCloud
        ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">🟢 Firestore</span>`
        : `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">💾 Local</span>`;

      return `
        <tr class="hover:bg-emerald-50/40 transition-colors">
          <td class="p-3">
            <div class="font-heading font-bold text-brand-ink">${lead.name || 'Guest'}</div>
            <div class="text-[10px] text-gray-400 font-mono">${lead.firestoreDocId || lead.id || '—'}</div>
          </td>
          <td class="p-3 font-mono font-semibold text-brand-deep">${lead.phone || '—'}</td>
          <td class="p-3">
            <span class="inline-flex items-center gap-1 text-[11px] font-medium bg-brand-bg px-2 py-0.5 rounded-full border border-emerald-100">
              <span>${moodIcon}</span>
              <span>${lead.mood || '—'}</span>
            </span>
          </td>
          <td class="p-3 text-[11px] text-gray-500 whitespace-nowrap">
            ${lead.timestamp ? new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          </td>
          <td class="p-3">
            <div class="flex flex-wrap gap-1">
              ${gameTags.length > 0 ? gameTags.join('') : '<span class="text-gray-400 italic text-[11px]">No games yet</span>'}
            </div>
          </td>
          <td class="p-3">
            <div class="flex flex-wrap max-w-xs">
              ${rewardBadges}
            </div>
          </td>
          <td class="p-3 whitespace-nowrap">
            ${syncBadge}
          </td>
        </tr>
      `;
    }).join('');
  }
}

// Instantiate universal staff manager
export const staffDataManager = new StaffDataManager();
