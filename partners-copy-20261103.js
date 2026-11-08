(()=>{
  'use strict';
  const dialog=document.getElementById('partner-access-dialog');
  if(!dialog)return;
  const form=dialog.querySelector('[data-partner-form="access"]');
  const result=dialog.querySelector('[data-partner-result]');
  const catalogs=[
    {key:'pobeda-pro',title:'Победа Про · каталог',file:'pobeda-pro.pdf'},
    {key:'pobeda-pro-manual',title:'Победа Про · инструкция',file:'pobeda-pro-manual.pdf'},
    {key:'pobeda-eco',title:'Победа Эко · каталог',file:'pobeda-eco.pdf'},
    {key:'pobeda-eco-manual',title:'Победа Эко · инструкция',file:'pobeda-eco-manual.pdf'},
    {key:'olimpika',title:'Олимпика · каталог',file:'olimpika.pdf'},
    {key:'olimpika-manual',title:'Олимпика · инструкция',file:'olimpika-manual.pdf'}
  ];
  let trigger=null;
  let unlocked=false;
  function showForm(){
    form.hidden=false;result.hidden=true;result.replaceChildren();
    form.querySelector('input').focus({preventScroll:true});
  }
  function showCatalogs(){
    form.hidden=true;result.hidden=false;
    result.innerHTML='<h3 tabindex="-1">Каталоги и инструкции ChampionLED</h3><p>Выберите документ для просмотра.</p><div class="partner-open-catalogs">'+catalogs.map(c=>'<a href="docs/'+c.file+'" target="_blank" rel="noopener"><img src="assets/catalog-covers/'+c.key+'.png" alt="Обложка документа: '+c.title+'"><strong>'+c.title+'</strong><span>Открыть PDF ↗</span></a>').join('')+'</div><button class="text-link" type="button" data-partner-return>Вернуться к форме ↗</button>';
    result.querySelector('h3').focus({preventScroll:true});
  }
  function showApplication(target,purpose){
    const isAccess=purpose==='access';
    let panel;
    if(isAccess){form.hidden=true;result.hidden=false;panel=result;}
    else{target.hidden=true;panel=document.createElement('div');panel.className='partner-form-result';target.after(panel);}
    panel.innerHTML='<h3 tabindex="-1">'+(isAccess?'Заявка на дилерство подготовлена':'Обращение подготовлено')+'</h3><p class="partner-demo-result">Это демонстрационная форма прототипа. Данные не отправляются и не сохраняются.</p><button type="button" class="text-link" data-partner-again>Вернуться к форме ↗</button>';
    panel.querySelector('h3').focus({preventScroll:true});
    panel.querySelector('[data-partner-again]').addEventListener('click',()=>{
      if(isAccess)showForm();else{panel.remove();target.hidden=false;target.querySelector('input').focus({preventScroll:true});}
    });
  }
  document.addEventListener('click',event=>{
    const opener=event.target.closest('[data-partner-access]');
    if(opener){
      trigger=opener;
      if(!dialog.open)dialog.showModal();
      if(unlocked)showCatalogs();else showForm();
    }
    if(event.target.closest('[data-partner-close]'))dialog.close();
    if(event.target.closest('[data-partner-return]'))showForm();
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
  document.addEventListener('submit',event=>{
    const submitted=event.target;
    if(!submitted.matches('[data-partner-form]'))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!submitted.reportValidity())return;
    const purpose=submitted.dataset.partnerForm;
    if(purpose==='access'&&event.submitter?.value==='catalogs'){unlocked=true;showCatalogs();}
    else showApplication(submitted,purpose);
  },true);
})();
