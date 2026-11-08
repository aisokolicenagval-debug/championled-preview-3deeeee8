(()=>{
'use strict';
const dialog=document.getElementById('designer-access-dialog');if(!dialog)return;
const form=dialog.querySelector('[data-designer-form]'),result=dialog.querySelector('[data-designer-result]');
const title=dialog.querySelector('h2'),intro=dialog.querySelector('[data-designer-intro]'),submit=form.querySelector('[data-designer-submit]');
let trigger=null,intent='materials';
const docs=[['Победа Про','pobeda-pro'],['Победа Эко','pobeda-eco'],['Олимпика','olimpika']];
function showForm(){
 form.hidden=false;result.hidden=true;result.replaceChildren();
 const cooperation=intent==='cooperation';
 title.textContent=cooperation?'Сотрудничество с ChampionLED':'Материалы для вашего проекта';
 intro.textContent=cooperation?'Расскажите о своей практике и задачах. Обсудим формат взаимодействия и материалы по продукции.':'Укажите серию или артикулы и материалы, которые нужны для проекта.';
 submit.textContent=cooperation?'Отправить обращение':'Получить материалы';
 const label=form.querySelector('textarea').parentElement;
 label.querySelector('.designer-field-title').firstChild.textContent=cooperation?'Ваш вопрос о сотрудничестве':'Серия или артикулы и необходимые материалы';
 form.querySelector('textarea').placeholder=cooperation?'Расскажите, как вы работаете и какой формат сотрудничества вам интересен.':'Например: серия, артикул и нужные чертежи, 3D-модель или IES-файл.';
 form.querySelector('input').focus({preventScroll:true});
}
function showResult(){
 form.hidden=true;result.hidden=false;
 if(intent==='cooperation')result.innerHTML='<h3 tabindex="-1">Обращение подготовлено</h3><p>Это демонстрационная форма прототипа. Данные не отправляются и не сохраняются.</p><button class="text-link" type="button" data-designer-return>Вернуться к форме ↗</button>';
 else result.innerHTML='<h3 tabindex="-1">Материалы ChampionLED</h3><p>Каталоги и инструкции доступны для просмотра. Наличие чертежей, 3D-моделей и IES-файлов уточняется по артикулу.</p><div class="designer-open-documents">'+docs.flatMap(([name,key])=>[['Каталог',key],['Инструкция',key+'-manual']].map(([kind,file])=>'<a href="docs/'+file+'.pdf" target="_blank" rel="noopener"><span class="partner-pdf-icon" aria-hidden="true">PDF</span><span><strong>'+name+'</strong><small>'+kind+' ↗</small></span></a>')).join('')+'</div><p class="demo-form-note">Это демонстрация доступа: данные формы никуда не отправлены.</p><button class="text-link" type="button" data-designer-return>Вернуться к запросу материалов ↗</button>';
 result.querySelector('h3').focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const opener=event.target.closest('[data-designer-access]');
 if(opener){trigger=opener;intent=opener.dataset.designerAccess;if(!dialog.open)dialog.showModal();showForm();}
 if(event.target.closest('[data-designer-close]'))dialog.close();
 if(event.target.closest('[data-designer-return]'))showForm();
});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
document.addEventListener('submit',event=>{if(!event.target.matches('[data-designer-form]'))return;event.preventDefault();event.stopImmediatePropagation();if(form.reportValidity())showResult();},true);
})();
