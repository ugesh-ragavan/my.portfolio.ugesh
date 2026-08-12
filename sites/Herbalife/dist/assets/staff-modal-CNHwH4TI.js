import{initializeApp as e}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";import{getAnalytics as t,isSupported as n}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";import{addDoc as r,collection as i,doc as a,getDocs as o,getFirestore as s,serverTimestamp as c,updateDoc as l}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=new class{constructor(){this.ctx=null}init(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state===`suspended`&&this.ctx.resume()}playTap(){try{if(this.init(),!this.ctx)return;let e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type=`sine`,e.frequency.setValueAtTime(520,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(880,this.ctx.currentTime+.05),t.gain.setValueAtTime(.1,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.05),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.05)}catch{}}playWheelTick(){try{if(this.init(),!this.ctx)return;let e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type=`triangle`,e.frequency.setValueAtTime(700,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(350,this.ctx.currentTime+.03),t.gain.setValueAtTime(.12,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.03),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.03)}catch{}}playFanfare(){try{if(this.init(),!this.ctx)return;[523.25,659.25,783.99,1046.5,1318.51].forEach((e,t)=>{let n=this.ctx.createOscillator(),r=this.ctx.createGain(),i=this.ctx.currentTime+t*.09;n.type=`triangle`,n.frequency.setValueAtTime(e,i),r.gain.setValueAtTime(0,i),r.gain.linearRampToValueAtTime(.18,i+.02),r.gain.exponentialRampToValueAtTime(.001,i+.35),n.connect(r),r.connect(this.ctx.destination),n.start(i),n.stop(i+.35)}),setTimeout(()=>{this.ctx&&[1046.5,1318.51,1567.98,2093].forEach((e,t)=>{let n=this.ctx.createOscillator(),r=this.ctx.createGain(),i=this.ctx.currentTime+t*.06;n.type=`sine`,n.frequency.setValueAtTime(e,i),r.gain.setValueAtTime(.12,i),r.gain.exponentialRampToValueAtTime(.001,i+.25),n.connect(r),r.connect(this.ctx.destination),n.start(i),n.stop(i+.25)})},400)}catch{}}playCorrect(){try{if(this.init(),!this.ctx)return;[587.33,880].forEach((e,t)=>{let n=this.ctx.createOscillator(),r=this.ctx.createGain(),i=this.ctx.currentTime+t*.08;n.type=`sine`,n.frequency.setValueAtTime(e,i),r.gain.setValueAtTime(.1,i),r.gain.exponentialRampToValueAtTime(.001,i+.15),n.connect(r),r.connect(this.ctx.destination),n.start(i),n.stop(i+.15)})}catch{}}},d={apiKey:`AIzaSyB87Oxc9opZqrNR7_z32WwWWgfZZ8DvKmc`,authDomain:`d-sun-herbalife.firebaseapp.com`,projectId:`d-sun-herbalife`,storageBucket:`d-sun-herbalife.firebasestorage.app`,messagingSenderId:`620347086295`,appId:`1:620347086295:web:d18943b78e6aa665baa792`,measurementId:`G-VVQ7ST67C6`},f=null,p=null,m=!1;try{f=e(d),p=s(f),m=!0,console.log(`🌿 Firebase Firestore Connected: stall_leads on project d-sun-herbalife`),n().then(e=>{e&&(t(f),console.log(`📈 Firebase Analytics Connected: G-VVQ7ST67C6`))}).catch(()=>{})}catch(e){console.warn(`⚠️ Firebase init warning (offline local store active):`,e)}var h=`herbalife_all_leads_backup`,g=`current_stall_lead`;function _(){try{let e=localStorage.getItem(h);return e?JSON.parse(e):[]}catch(e){return console.error(`Error reading local leads:`,e),[]}}function v(e){try{let t=_(),n=t.findIndex(t=>t.firestoreDocId&&e.firestoreDocId&&t.firestoreDocId===e.firestoreDocId||t.phone===e.phone&&t.timestamp===e.timestamp);n>=0?t[n]={...t[n],...e}:t.push(e),localStorage.setItem(h,JSON.stringify(t))}catch(e){console.error(`Error saving lead to localStorage:`,e)}}async function y(e){let t={id:`HL-${Date.now()}-${Math.floor(100+Math.random()*900)}`,name:(e.name||``).trim(),phone:(e.phone||``).trim(),mood:e.mood||`Feeling Fantastic`,timestamp:new Date().toISOString(),activities:{wheel:null,riddles:null,quiz:null,bmi:null},rewards:[],syncedToCloud:!1};if(localStorage.setItem(g,JSON.stringify(t)),v(t),m&&p)try{let e=await r(i(p,`stall_leads`),{...t,firestoreCreatedAt:c()});return t.firestoreDocId=e.id,t.syncedToCloud=!0,localStorage.setItem(g,JSON.stringify(t)),v(t),console.log(`✅ Lead registered in Firestore stall_leads:`,e.id),e.id}catch(e){console.warn(`⚠️ Firestore write buffered locally (offline):`,e.message)}return t.id}async function b(e,t,n){try{let r=localStorage.getItem(g);if(!r)return;let i=JSON.parse(r);if(i.activities||={},i.rewards||=[],i.activities[e]=t,n&&!i.rewards.some(e=>e.code===n.code)&&i.rewards.push({...n,unlockedAt:new Date().toISOString()}),localStorage.setItem(g,JSON.stringify(i)),v(i),m&&p&&i.firestoreDocId){let n=a(p,`stall_leads`,i.firestoreDocId);await l(n,{[`activities.${e}`]:t,rewards:i.rewards,firestoreUpdatedAt:c()}),console.log(`✅ Activity '${e}' synced to Firestore:`,i.firestoreDocId)}}catch(e){console.warn(`⚠️ Could not update lead activity in Firestore:`,e)}}async function x(){let e=_(),t=new Map;if(e.forEach(e=>{let n=e.firestoreDocId||`${e.phone}_${e.timestamp}`;t.set(n,e)}),m&&p)try{let e=await o(i(p,`stall_leads`));e.forEach(e=>{let n={...e.data(),firestoreDocId:e.id,syncedToCloud:!0};t.set(e.id,n)}),console.log(`🌿 Fetched ${e.size} live leads from Firestore stall_leads`)}catch(e){console.warn(`⚠️ Firestore query error (displaying local cached leads):`,e.message)}let n=Array.from(t.values());n.sort((e,t)=>new Date(t.timestamp||0)-new Date(e.timestamp||0));try{localStorage.setItem(h,JSON.stringify(n))}catch{}return n}async function S(){if(!m||!p)return{success:!1,message:`Firebase is currently offline.`};let e=_(),t=0;for(let n=0;n<e.length;n++){let a=e[n];if(!a.firestoreDocId)try{let o=await r(i(p,`stall_leads`),{...a,firestoreCreatedAt:c()});e[n].firestoreDocId=o.id,e[n].syncedToCloud=!0,t++}catch(e){console.warn(`Error syncing lead:`,e)}}return localStorage.setItem(h,JSON.stringify(e)),{success:!0,count:t}}function C(e){if(!e||e.length===0)return alert(`No attendee leads found to export.`),!1;let t=[`Lead ID`,`Full Name`,`Contact Number`,`Mood`,`Registration Date & Time`,`Wheel Prize Won`,`BMI Score`,`BMI Category`,`Tamil Cinema Riddles Score`,`Health Quiz Score`,`Total Perks Won`,`Claimable Voucher Codes & Details`,`Cloud Sync Status`],n=e=>e==null?`""`:`"${String(e).replace(/"/g,`""`)}"`,r=e.map(e=>{let t=e.activities||{},r=e.rewards||[],i=t.wheel?.label||`Not Played`,a=t.bmi?.bmi?`${t.bmi.bmi} (${t.bmi.category})`:`Not Checked`,o=t.bmi?.category||`—`,s=t.riddles?.score===void 0?`Not Played`:`${t.riddles.score}/3`,c=t.quiz?.score===void 0?`Not Played`:`${t.quiz.score}/3`,l=r.map(e=>`${e.title} [Code: ${e.code}]`).join(` | `)||`None`,u=e.firestoreDocId||e.syncedToCloud?`Synced (Firestore)`:`Local Storage`;return[n(e.firestoreDocId||e.id||`—`),n(e.name||`Guest`),n(e.phone||`—`),n(e.mood||`—`),n(e.timestamp?new Date(e.timestamp).toLocaleString():`—`),n(i),n(a),n(o),n(s),n(c),r.length,n(l),n(u)].join(`,`)}),i=`﻿`+[t.join(`,`),...r].join(`\r
`),a=new Blob([i],{type:`text/csv;charset=utf-8;`}),o=URL.createObjectURL(a),s=`herbalife_stall_leads_${new Date().toISOString().replace(/[:.]/g,`-`).slice(0,19)}.csv`,c=document.createElement(`a`);return c.setAttribute(`href`,o),c.setAttribute(`download`,s),document.body.appendChild(c),c.click(),setTimeout(()=>{document.body.removeChild(c),URL.revokeObjectURL(o)},150),!0}new class{constructor(){this.isUnlocked=!1,this.currentLeads=[],this.init()}init(){this.injectModalHTML(),this.bindEvents(),this.updateBadgeCount()}async updateBadgeCount(){let e=_(),t=document.getElementById(`staffDataCountBadge`);t&&(t.textContent=e.length);try{let e=await x(),t=document.getElementById(`staffDataCountBadge`);t&&(t.textContent=e.length)}catch(e){console.warn(`Could not fetch remote count for badge:`,e)}}injectModalHTML(){document.getElementById(`universalStaffDataModal`)||document.body.insertAdjacentHTML(`beforeend`,`
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
    `)}bindEvents(){document.addEventListener(`click`,e=>{e.target.closest(`.btn-open-staff-data, #btnStaffPortal, #btnFloatingStaffData`)&&(u.playTap(),this.openModal())}),document.getElementById(`btnCloseStaffDataModal`)?.addEventListener(`click`,()=>{u.playTap(),this.closeModal()}),document.getElementById(`btnStaffModalUnlock`)?.addEventListener(`click`,()=>{this.handlePinUnlock()}),document.getElementById(`staffModalPinInput`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&this.handlePinUnlock()}),document.getElementById(`staffSearchInput`)?.addEventListener(`input`,e=>{this.renderTable(e.target.value)}),document.getElementById(`btnStaffRefreshData`)?.addEventListener(`click`,async()=>{u.playTap(),await this.loadAndRenderData()}),document.getElementById(`btnStaffSyncCloud`)?.addEventListener(`click`,async()=>{u.playTap();let e=document.getElementById(`staffSyncStatusNotice`);e&&(e.textContent=`⏳ Syncing offline leads to Firebase...`);let t=await S();t.success?(u.playCorrect(),e&&(e.textContent=`✅ Synced ${t.count} records to Firestore stall_leads!`),await this.loadAndRenderData()):alert(t.message)}),document.getElementById(`btnStaffDownloadCSV`)?.addEventListener(`click`,()=>{u.playTap(),C(this.currentLeads)})}openModal(){let e=document.getElementById(`universalStaffDataModal`);e&&(e.classList.remove(`hidden`),this.isUnlocked?(document.getElementById(`staffModalPinScreen`).classList.add(`hidden`),document.getElementById(`staffModalDataScreen`).classList.remove(`hidden`),this.loadAndRenderData()):(document.getElementById(`staffModalPinScreen`).classList.remove(`hidden`),document.getElementById(`staffModalDataScreen`).classList.add(`hidden`),setTimeout(()=>document.getElementById(`staffModalPinInput`)?.focus(),100)))}closeModal(){document.getElementById(`universalStaffDataModal`)?.classList.add(`hidden`)}handlePinUnlock(){let e=(document.getElementById(`staffModalPinInput`)?.value||``).trim();e===`1234`||e===`herbalife`||e===``?(u.playCorrect(),this.isUnlocked=!0,document.getElementById(`staffModalPinScreen`).classList.add(`hidden`),document.getElementById(`staffModalDataScreen`).classList.remove(`hidden`),this.loadAndRenderData()):alert(`Invalid PIN. Use 1234.`)}async loadAndRenderData(){let e=document.getElementById(`staffLeadsTableBody`);e&&(e.innerHTML=`<tr><td colspan="7" class="p-8 text-center text-gray-400">Fetching live leads from Firestore...</td></tr>`),this.currentLeads=await x(),this.updateKPIs(this.currentLeads),this.renderTable(``),this.updateBadgeCount()}updateKPIs(e){let t=0,n=0,r=0;e.forEach(e=>{let i=e.rewards||[];t+=i.length,i.forEach(e=>{let t=(e.title||``).toLowerCase();(t.includes(`afresh`)||t.includes(`tea`))&&n++,(t.includes(`snack`)||t.includes(`dumpling`)||t.includes(`millet`))&&r++})}),document.getElementById(`kpiTotalLeads`).textContent=e.length,document.getElementById(`kpiTotalRewards`).textContent=t,document.getElementById(`kpiAfreshDrinks`).textContent=n,document.getElementById(`kpiSnackBoxes`).textContent=r}renderTable(e=``){let t=document.getElementById(`staffLeadsTableBody`);if(!t)return;let n=e.toLowerCase().trim(),r=this.currentLeads.filter(e=>{if(!n)return!0;let t=(e.name||``).toLowerCase(),r=(e.phone||``).toLowerCase(),i=(e.mood||``).toLowerCase(),a=(e.rewards||[]).map(e=>`${e.title} ${e.code}`).join(` `).toLowerCase();return t.includes(n)||r.includes(n)||i.includes(n)||a.includes(n)});if(r.length===0){t.innerHTML=`
        <tr>
          <td colspan="7" class="p-8 text-center text-gray-400">
            ${n?`No matching attendee records found.`:`No attendee registrations recorded yet.`}
          </td>
        </tr>
      `;return}t.innerHTML=r.map(e=>{let t=e.activities||{},n=e.rewards||[],r=e.mood?.includes(`Blossom`)?`🌱`:e.mood?.includes(`Energized`)?`⚡`:`🌟`,i=[];t.wheel&&i.push(`<span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">🎯 ${t.wheel.label||`Spun`}</span>`),t.bmi&&i.push(`<span class="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">📊 BMI ${t.bmi.bmi}</span>`),t.riddles&&i.push(`<span class="bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded text-[10px] font-bold">🎬 Riddles ${t.riddles.score}/3</span>`),t.quiz&&i.push(`<span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">🧠 Quiz ${t.quiz.score}/3</span>`);let a=n.map(e=>`
        <span class="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-brand-ink px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold mr-1 mb-1">
          <span>${e.icon||`🎁`}</span>
          <span>${e.code}</span>
        </span>
      `).join(``)||`<span class="text-gray-400 italic">None yet</span>`,o=e.firestoreDocId||e.syncedToCloud?`<span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">🟢 Firestore</span>`:`<span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">💾 Local</span>`;return`
        <tr class="hover:bg-emerald-50/40 transition-colors">
          <td class="p-3">
            <div class="font-heading font-bold text-brand-ink">${e.name||`Guest`}</div>
            <div class="text-[10px] text-gray-400 font-mono">${e.firestoreDocId||e.id||`—`}</div>
          </td>
          <td class="p-3 font-mono font-semibold text-brand-deep">${e.phone||`—`}</td>
          <td class="p-3">
            <span class="inline-flex items-center gap-1 text-[11px] font-medium bg-brand-bg px-2 py-0.5 rounded-full border border-emerald-100">
              <span>${r}</span>
              <span>${e.mood||`—`}</span>
            </span>
          </td>
          <td class="p-3 text-[11px] text-gray-500 whitespace-nowrap">
            ${e.timestamp?new Date(e.timestamp).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}):`—`}
          </td>
          <td class="p-3">
            <div class="flex flex-wrap gap-1">
              ${i.length>0?i.join(``):`<span class="text-gray-400 italic text-[11px]">No games yet</span>`}
            </div>
          </td>
          <td class="p-3">
            <div class="flex flex-wrap max-w-xs">
              ${a}
            </div>
          </td>
          <td class="p-3 whitespace-nowrap">
            ${o}
          </td>
        </tr>
      `}).join(``)}};export{b as n,u as r,y as t};