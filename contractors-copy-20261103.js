(()=>{
  'use strict';
  const dialog=document.getElementById('contractor-access-dialog');
  if(!dialog)return;
  const form=dialog.querySelector('[data-contractor-access-form]');
  const result=dialog.querySelector('[data-contractor-result]');
  const documents=[
    {title:'Победа Про',kind:'Инструкция',file:'pobeda-pro-manual.pdf'},
    {title:'Победа Про',kind:'Параметры и состав',file:'pobeda-pro.pdf'},
    {title:'Победа Эко',kind:'Инструкция',file:'pobeda-eco-manual.pdf'},
    {title:'Победа Эко',kind:'Параметры и состав',file:'pobeda-eco.pdf'},
    {title:'Олимпика',kind:'Инструкция',file:'olimpika-manual.pdf'},
    {title:'Олимпика',kind:'Параметры и состав',file:'olimpika.pdf'}
  ];
  let trigger=null;
  function showForm(){
    form.hidden=false;result.hidden=true;result.replaceChildren();
    form.querySelector('input').focus({preventScroll:true});
  }
  function showDocuments(){
    form.hidden=true;result.hidden=false;
    result.innerHTML='<h3 tabindex="-1">Инструкции и технические материалы</h3><p>Откройте документ для нужной серии и исполнения.</p><div class="contractor-open-documents">'+documents.map(d=>'<a href="docs/'+d.file+'" target="_blank" rel="noopener"><span class="partner-pdf-icon" aria-hidden="true">PDF</span><span><strong>'+d.title+'</strong><small>'+d.kind+' ↗</small></span></a>').join('')+'</div><button class="text-link" type="button" data-contractor-return>Вернуться к форме ↗</button>';
    result.querySelector('h3').focus({preventScroll:true});
  }
  function showPartnerApplication(){
    form.hidden=true;result.hidden=false;
    result.innerHTML='<h3 tabindex="-1">Заявка на партнёрство подготовлена</h3><p>Это демонстрационная форма прототипа. Данные не отправляются и не сохраняются.</p><button class="text-link" type="button" data-contractor-return>Вернуться к форме ↗</button>';
    result.querySelector('h3').focus({preventScroll:true});
  }
  document.addEventListener('click',event=>{
    const opener=event.target.closest('[data-contractor-access]');
    if(opener){trigger=opener;form.dataset.intent=opener.dataset.contractorAccess==='partner'?'partner':'instructions';if(!dialog.open)dialog.showModal();showForm();}
    if(event.target.closest('[data-contractor-close]'))dialog.close();
    if(event.target.closest('[data-contractor-return]'))showForm();
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
  document.addEventListener('submit',event=>{
    if(!event.target.matches('[data-contractor-access-form]'))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!form.reportValidity())return;
    const intent=event.submitter?.value||form.dataset.intent;
    if(intent==='partner')showPartnerApplication();else showDocuments();
  },true);
})();
