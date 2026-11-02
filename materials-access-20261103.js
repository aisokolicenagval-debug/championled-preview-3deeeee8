(()=>{
'use strict';
const dialog=document.querySelector('[data-material-dialog]');if(!dialog)return;
const scope=dialog.dataset.materialDialog;
const form=dialog.querySelector('[data-material-form]'),result=dialog.querySelector('[data-material-result]');
const heading=dialog.querySelector('h2'),intro=dialog.querySelector('[data-material-intro]');
const message=form.querySelector('textarea'),caption=form.querySelector('[data-material-message-label]');
const topicAction=topic=>({'Спецификация':'спецификацию','Чертёж':'чертёж','3D-модель':'3D-модель','IES-файл':'IES-файл'}[topic]||topic);
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const docs=['pobeda-pro','pobeda-eco','olimpika'].flatMap((key,i)=>[
 {key,title:['Победа Про','Победа Эко','Олимпика'][i],kind:scope==='contractors'?'Параметры и состав':'Каталог',file:key+'.pdf'},
 {key:key+'-manual',title:['Победа Про','Победа Эко','Олимпика'][i],kind:'Инструкция',file:key+'-manual.pdf'}
]);
let trigger=null,context={mode:'documents',selection:'all',topic:''};
function documentsForContext(){
 if(context.selection==='instructions')return docs.filter(d=>d.key.endsWith('-manual'));
 if(context.selection==='catalogs')return docs.filter(d=>!d.key.endsWith('-manual'));
 const selected=docs.find(d=>d.key===context.selection);return selected?[selected]:docs;
}
function markMessage(title,required){
 if(!message||!caption)return;
 message.required=required;caption.replaceChildren(document.createTextNode(title));
 if(required){const mark=document.createElement('span');mark.className='required-mark';mark.setAttribute('aria-hidden','true');mark.textContent=' *';caption.append(mark);}
}
function showForm(){
 form.hidden=false;result.hidden=true;result.replaceChildren();
 const cooperation=context.mode==='cooperation',request=context.mode==='request';
 const selected=docs.find(d=>d.key===context.selection);
 if(request){
  heading.textContent='Запросить '+topicAction(context.topic);
  intro.textContent='Укажите название модели или артикул и нужное исполнение. Проверим, какие материалы доступны для этого изделия.';
  markMessage('Модель и необходимые материалы',true);
  message.placeholder='Укажите модель, исполнение и то, какой материал нужен.';
 }else if(cooperation){
  heading.textContent=scope==='partners'?'Стать дилером ChampionLED':'Сотрудничество с ChampionLED';
  intro.textContent='Оставьте контакты и при желании расскажите о своей работе. Обсудим формат сотрудничества.';
  markMessage('Ваш вопрос о сотрудничестве',false);
  if(message)message.placeholder='Расскажите о компании, практике или интересующем формате работы.';
 }else{
  heading.textContent=selected?selected.title+' — '+selected.kind.toLocaleLowerCase('ru-RU'):context.selection==='instructions'?'Инструкции ChampionLED':context.selection==='catalogs'?'Каталоги ChampionLED':'Материалы ChampionLED';
  intro.textContent=selected?'Оставьте контактные данные, чтобы открыть выбранный документ. Вопрос заполнять не обязательно.':'Оставьте контактные данные, чтобы посмотреть документы. Вопрос или дополнительные пожелания можно указать по желанию.';
  markMessage('Вопрос или нужные материалы',false);
  if(message)message.placeholder='Если нужны дополнительные сведения об изделии, напишите свой вопрос.';
 }
 if(scope==='designers'||scope==='business'||scope==='buyers'){
  const button=form.querySelector('button[type="submit"]');
  button.textContent=request?'Запросить материал':cooperation?'Отправить обращение':selected?'Открыть документ':'Посмотреть материалы';
 }
 let subject=form.querySelector('[name="requested_material"]');
 if(!subject){subject=document.createElement('input');subject.type='hidden';subject.name='requested_material';form.append(subject);}
 subject.value=request?context.topic:cooperation?'Сотрудничество':selected?selected.title+' — '+selected.kind:context.selection;
 if(!form.querySelector('.form-required-note,.partner-required-note')){const note=document.createElement('p');note.className='form-required-note';note.textContent='* Обязательные поля';form.prepend(note);}
 form.querySelector('input:not([type="hidden"])').focus({preventScroll:true});
}
function showDocuments(){
 form.hidden=true;result.hidden=false;
 const selected=documentsForContext();
 const gridClass=scope==='partners'?'partner-open-catalogs':scope==='contractors'?'contractor-open-documents':scope==='designers'?'designer-open-documents':'purchase-open-documents';
 const links=selected.map(d=>'<a href="docs/'+d.file+'" target="_blank" rel="noopener">'+(scope==='partners'?'<img src="assets/catalog-covers/'+d.key+'.png" alt="Обложка: '+E(d.title)+' — '+E(d.kind)+'"><strong>'+E(d.title)+'</strong><span>'+E(d.kind)+' · Открыть PDF ↗</span>':'<span class="partner-pdf-icon" aria-hidden="true">PDF</span><span><strong>'+E(d.title)+'</strong><small>'+E(d.kind)+' · Открыть PDF ↗</small></span>')+'</a>').join('');
 result.innerHTML='<h3 tabindex="-1">'+(selected.length===1?'Выбранный документ':'Документы ChampionLED')+'</h3><p>'+(selected.length===1?'Откройте выбранный документ по ссылке ниже.':'Выберите нужную серию и документ.')+'</p><div class="'+gridClass+'">'+links+'</div><p class="review-demo-note">Это прототип. Контактные данные никуда не отправлены и не сохранены.</p><button type="button" class="text-link" data-material-return>Вернуться к форме ↗</button>';
 result.querySelector('h3').focus({preventScroll:true});
}
function showApplication(){
 form.hidden=true;result.hidden=false;
 result.innerHTML='<h3 tabindex="-1">'+(context.mode==='request'?'Запрос материала подготовлен':scope==='partners'?'Заявка на дилерство подготовлена':'Обращение о сотрудничестве подготовлено')+'</h3>'+(context.mode==='request'?'<p>Выбранный тип материала: '+E(context.topic)+'. Доступность уточняется для конкретной модели и исполнения.</p>':'')+'<p>Это демонстрационная форма прототипа. Данные не отправляются и не сохраняются.</p><button type="button" class="text-link" data-material-return>Вернуться к форме ↗</button>';
 result.querySelector('h3').focus({preventScroll:true});
}
document.addEventListener('click',e=>{
 const opener=e.target.closest('[data-material-open]');
 if(opener){trigger=opener;context={mode:opener.dataset.materialMode||'documents',selection:opener.dataset.materialSelection||'all',topic:opener.dataset.materialTopic||''};if(!dialog.open)dialog.showModal();showForm();}
 if(e.target.closest('[data-partner-close],[data-contractor-close],[data-designer-close],[data-purchase-close]'))dialog.close();
 if(e.target.closest('[data-material-return]'))showForm();
});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
document.addEventListener('submit',e=>{
 if(e.target===form){
  e.preventDefault();e.stopImmediatePropagation();if(!form.reportValidity())return;
  const action=e.submitter?.value;
  if(action==='dealer'||action==='partner'){context.mode='cooperation';showApplication();}
  else if(action==='catalogs'||action==='instructions'){context.mode='documents';if(action==='instructions'&&!docs.some(d=>d.key===context.selection))context.selection='instructions';showDocuments();}
  else if(context.mode==='documents')showDocuments();else showApplication();
  return;
 }
 if(!e.target.matches('[data-partner-form="inquiry"]'))return;
 e.preventDefault();e.stopImmediatePropagation();const submitted=e.target;if(!submitted.reportValidity())return;
 submitted.hidden=true;const panel=document.createElement('div');panel.className='partner-form-result';panel.innerHTML='<h3 tabindex="-1">Обращение подготовлено</h3><p>Это демонстрационная форма прототипа. Данные не отправляются и не сохраняются.</p><button type="button" class="text-link">Вернуться к форме ↗</button>';submitted.after(panel);panel.querySelector('h3').focus({preventScroll:true});panel.querySelector('button').addEventListener('click',()=>{panel.remove();submitted.hidden=false;submitted.querySelector('input').focus({preventScroll:true});});
},true);
})();
