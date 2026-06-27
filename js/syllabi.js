// js/syllabi.js
import { supabase } from './supabase.js';

export function initSyllabi() {
  const syllabiContainer = document.getElementById('syllabi-content-area');
  async function loadSyllabusMapping() {
    if (!supabase || !syllabiContainer) return;
    try {
      const { data, error } = await supabase.from('syllabus_mapping').select('*').order('id', { ascending: true });
      if (error) throw error;
      
      if (data && data.length > 0) {
        let html = '';
        data.forEach((item) => {
          if (item.status === 'unavailable') {
            html += `<div class="syllabi-circle-card unavailable" onclick="alert('The syllabus mapping for ${item.name} is currently unavailable.')"><div class="circle-logo"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div><p>${item.name}<br><span class="unavailable-text">(Unavailable)</span></p></div>`;
          } else if (item.status === 'coming_soon') {
            html += `<div class="syllabi-circle-card unavailable" onclick="alert('The syllabus mapping for ${item.name} is Coming Soon.')"><div class="circle-logo"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div><p>${item.name}<br><span class="unavailable-text">(Coming Soon)</span></p></div>`;
          } else {
            html += `<a href="${item.url}" target="_blank" class="syllabi-circle-card"><div class="circle-logo"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div><p>${item.name}</p></a>`;
          }
        });
        syllabiContainer.innerHTML = html;
      }
    } catch (error) {
      console.error("Error fetching syllabus mapping:", error);
    }
  }
  loadSyllabusMapping();
}
