(()=>{
'use strict';
const dialog=document.getElementById('purchase-materials-dialog');if(!dialog)return;
const form=dialog.querySelector('[data-purchase-form]'),result=dialog.querySelector('[data-purchase-result]');
const docs=[['Победа Про','pobeda-pro'],['Победа Эко','pobeda-eco'],['Олимпика','olimpika']];
let trigger=null;
function showForm(){form.hidden=false;result.hidden=true;result.replaceChildren();form.querySelector('input').focus({preventScroll:true});}
function showMaterials(){
 form.hidden=true;result.hidden=false;
 result.innerHTML='<h3 tabindex="-1">Каталоги и инструкции</h3><p>Выберите серию и документ. Если нужны дополнительные сведения по изделию, их можно указать в форме обращения.</p><div class="purchase-open-documents">'+docs.flatMap(([title,key])=>[['Каталог',key],['Инструкция',key+'-manual']].map(([kind,file])=>'<a href="docs/'+file+'.pdf" target="_blank" rel="noopener"><span class="partner-pdf-icon" aria-hidden="true">PDF</span><span><strong>'+title+'</strong><small>'+kind+' ↗</small></span></a>')).join('')+'</div><p>Это демонстрация доступа к материалам. Данные формы никуда не отправлены и не сохранены.</p><button type="button" class="text-link" data-purchase-return>Вернуться к форме ↗</button>';
 result.querySelector('h3').focus({preventScroll:true});
}
document.addEventListener('click',e=>{
 const opener=e.target.closest('[data-purchase-materials]');
 if(opener){trigger=opener;if(!dialog.open)dialog.showModal();showForm();}
 if(e.target.closest('[data-purchase-close]'))dialog.close();
 if(e.target.closest('[data-purchase-return]'))showForm();
});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
document.addEventListener('submit',e=>{if(!e.target.matches('[data-purchase-form]'))return;e.preventDefault();e.stopImmediatePropagation();if(form.reportValidity())showMaterials();},true);
})();
