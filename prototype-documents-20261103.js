(()=>{
'use strict';
const files={
 'pobeda-pro.pdf':['Победа Про','Каталог'],
 'pobeda-pro-manual.pdf':['Победа Про','Инструкция по монтажу'],
 'pobeda-eco.pdf':['Победа Эко','Каталог'],
 'pobeda-eco-manual.pdf':['Победа Эко','Инструкция по монтажу'],
 'olimpika.pdf':['Олимпика','Каталог'],
 'olimpika-manual.pdf':['Олимпика','Инструкция по монтажу']
};
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const previous=new WeakMap();
function prepare(){
 document.querySelectorAll('a[href]').forEach(a=>{
  const href=a.getAttribute('href'),match=href?.match(/(?:^|\/)docs\/([^/?#]+\.pdf)(?:[?#].*)?$/);
  if(!match||!files[match[1]])return;
  a.dataset.prototypeDocument=match[1];a.setAttribute('href','#document-'+match[1].replace('.pdf',''));a.removeAttribute('target');a.removeAttribute('download');
  a.querySelectorAll('small,span').forEach(s=>{if(s.children.length===0&&s.textContent.includes('Открыть PDF'))s.textContent=s.textContent.replace('Открыть PDF','Посмотреть документ');});
 });
}
prepare();new MutationObserver(prepare).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{
 const back=e.target.closest('[data-prototype-document-back]');
 if(back){e.preventDefault();const host=back.closest('[data-material-result],#dialog-content');const saved=previous.get(host);if(saved){host.innerHTML=saved;previous.delete(host);}return;}
 const link=e.target.closest('[data-prototype-document]');if(!link)return;
 e.preventDefault();e.stopImmediatePropagation();
 const doc=files[link.dataset.prototypeDocument];if(!doc)return;
 let host=link.closest('[data-material-result],#dialog-content');
 if(!host){host=document.getElementById('dialog-content');const dialog=document.getElementById('dialog');if(!host||!dialog)return;if(!dialog.open)dialog.showModal();}
 previous.set(host,host.innerHTML);
 host.innerHTML='<h3 tabindex="-1">'+E(doc[0])+' · '+E(doc[1])+'</h3><p>В прототипе показан сценарий получения материала. Файл будет подключён при наполнении сайта.</p><button type="button" class="text-link" data-prototype-document-back>К списку материалов ↗</button>';
 host.querySelector('h3').focus({preventScroll:true});
},true);
})();
