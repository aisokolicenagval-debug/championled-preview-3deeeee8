/* Preserve existing catalog/search handlers while matching the storefront layout. */
(()=>{
 const header=document.querySelector('.header-main'),cart=header?.querySelector('[data-popup="cart"]');
 if(cart&&!header.querySelector('.header-request')){
  const action=document.createElement('button');
  action.type='button';action.className='header-request';action.dataset.request='question';
  action.textContent='Отправить запрос';
  action.addEventListener('click',()=>{if(typeof closeCatalog==='function')closeCatalog()});
  cart.insertAdjacentElement('afterend',action);
 }
 const form=document.getElementById('search-form'),input=document.getElementById('query');
 if(!form||!input)return;
 input.placeholder='Найти товары';
 const submit=form.querySelector('button[aria-label="Искать"]');
 if(submit){submit.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="m15.5 15.5 6 6"/></svg>';form.insertBefore(submit,input)}
 const clear=form.querySelector('.search-clear');
 if(clear){
  clear.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>';
  form.appendChild(clear);
  const sync=()=>{clear.hidden=false;clear.disabled=!input.value};
  input.addEventListener('input',sync);clear.addEventListener('click',sync);sync();
 }
})();
