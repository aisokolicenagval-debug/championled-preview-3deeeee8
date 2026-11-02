(()=>{
'use strict';
const locations={
 moscow:{city:'Москва',type:'ГОЛОВНОЙ ОФИС',name:'«Красносельская»',address:'3-й Красносельский переулок,<br>д. 19, стр. 11',plainAddress:'3-й Красносельский переулок, д. 19, стр. 11',hours:'По будням · 10:00–18:00',phone:'+7 (495) 109-23-00',tel:'+74951092300',email:'order@championled.ru',point:[55.784859,37.656071],photo:'assets/contacts/moscow.webp',mapUrl:'https://yandex.ru/maps/213/moscow/?ll=37.656071%2C55.784859&mode=whatshere&whatshere%5Bpoint%5D=37.656071%2C55.784859&whatshere%5Bzoom%5D=19&z=17'},
 spb:{city:'Санкт-Петербург',type:'ДИСТРИБЬЮТОР',name:'«Василеостровский»',address:'ул. Железноводская, д. 3,<br>секция 37',plainAddress:'ул. Железноводская, д. 3, секция 37',hours:'Ежедневно · 10:00–19:00',phone:'+7 (812) 646-50-88',tel:'+78126465088',email:'spb@championled.ru',point:[59.952638,30.256897],photo:'assets/contacts/spb.webp',mapUrl:'https://yandex.ru/maps/org/ledmonster/1554111611/'}
};
const card=document.getElementById('location-card'),buttons=[...document.querySelectorAll('[data-city]')],photo=document.getElementById('location-photo'),fallback=document.getElementById('map-fallback');
let current=locations[new URLSearchParams(location.search).get('city')]?new URLSearchParams(location.search).get('city'):'moscow',map=null,markers={};
function selectCity(key,{focusMap=true,updateUrl=true}={}){
 if(!locations[key])return;current=key;const d=locations[key];
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.city===key)));
 card.innerHTML=`<p class="eyebrow">${d.type}</p><h2>${d.city}</h2><p class="location-name">${d.name}</p><div class="contact-address"><span>Адрес</span><address>${d.address}</address></div><div class="contact-hours"><span>Режим работы</span><p>${d.hours}</p></div><div class="contact-local-links"><a href="tel:${d.tel}">${d.phone}</a><a href="mailto:${d.email}">${d.email}</a></div><a class="btn dark contact-route" href="${d.mapUrl}" target="_blank" rel="noopener">Открыть в Яндекс Картах <span>↗</span></a><p class="contact-visit-note">Перед поездкой уточните, представлен ли интересующий вас светильник.</p>`;
 photo.src=d.photo;photo.alt=`${key==='moscow'?'Головной офис':'Пространство дистрибьютора'} — ${d.city}. Фото с действующего сайта ChampionLED`;
 document.getElementById('photo-city').textContent=d.city;document.getElementById('photo-location').textContent=d.name;
 document.getElementById('visit-call').href=`tel:${d.tel}`;document.getElementById('map-fallback-link').href=d.mapUrl;
 if(updateUrl){const u=new URL(location.href);u.searchParams.set('city',key);history.replaceState(null,'',u)}
 if(map){Object.entries(markers).forEach(([k,m])=>m.getElement()?.classList.toggle('is-selected',k===key));if(focusMap){Object.values(markers).forEach(m=>m.closeTooltip());map.setView(d.point,16,{animate:false});markers[key].openPopup()}}
}
buttons.forEach(b=>b.addEventListener('click',()=>selectCity(b.dataset.city)));
function showAll(){if(!map)return;map.closePopup();map.fitBounds(Object.values(locations).map(d=>d.point),{padding:[85,85],animate:false});Object.values(markers).forEach(m=>m.openTooltip())}
document.getElementById('map-show-all').addEventListener('click',showAll);
window.addEventListener('popstate',()=>selectCity(new URLSearchParams(location.search).get('city')||'moscow',{updateUrl:false}));
selectCity(current,{updateUrl:false});
if(!window.L){fallback.hidden=false;document.getElementById('map-show-all').hidden=true;return}
map=L.map('contact-map',{scrollWheelZoom:false,zoomControl:false,attributionControl:true}).setView(locations[current].point,16);
L.control.zoom({position:'topright',zoomInTitle:'Приблизить',zoomOutTitle:'Отдалить'}).addTo(map);
const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
let loaded=0,errors=0;tiles.on('tileload',()=>{loaded++;fallback.hidden=true});tiles.on('tileerror',()=>{errors++;if(!loaded&&errors>=3)fallback.hidden=false});
Object.entries(locations).forEach(([key,d],i)=>{
 const icon=L.divIcon({className:'contact-marker'+(key===current?' is-selected':''),html:`<span class="contact-marker-core"><b>${i+1}</b></span>`,iconSize:[42,48],iconAnchor:[21,48],popupAnchor:[0,-45]});
 const marker=L.marker(d.point,{icon,title:`${d.city} — ${d.name}`,alt:`Выбрать локацию: ${d.city}`,keyboard:true}).addTo(map);
 marker.bindPopup(`<strong>${d.city} · ${d.name}</strong>${d.plainAddress}<br>${d.hours}`,{maxWidth:300,autoPan:false});
 marker.on('popupopen',()=>{const close=marker.getPopup()?.getElement()?.querySelector('.leaflet-popup-close-button');if(close){close.setAttribute('aria-label','Закрыть подсказку');close.title='Закрыть подсказку'}});
 marker.bindTooltip(d.city,{direction:'bottom',offset:[0,7]});
 marker.getElement()?.setAttribute('aria-label',`Выбрать локацию: ${d.city}`);
 marker.on('click',()=>selectCity(key));markers[key]=marker;
});
selectCity(current,{updateUrl:false});
new ResizeObserver(()=>map.invalidateSize({animate:false})).observe(document.getElementById('contact-map'));
})();
