/* Existing local search now filters static article cards. Rubrics use ordinary links. */
(()=>{
const root=document.querySelector('[data-static-blog]');if(!root)return;
const form=document.getElementById('blog-search-form'),input=document.getElementById('blog-query');
const cards=[...root.querySelectorAll('[data-blog-card]')],status=document.getElementById('blog-results-status'),empty=document.getElementById('blog-empty');
if(!form||!cards.length)return;
const defaultStatus=status.textContent;
function search(){const q=input.value.trim().toLocaleLowerCase('ru-RU');let count=0;cards.forEach(c=>{c.hidden=!!q&&!c.textContent.toLocaleLowerCase('ru-RU').includes(q);if(!c.hidden)count++});status.textContent=q?'Найдено статей: '+count:defaultStatus;empty.hidden=count!==0;const url=new URL(location.href);if(q)url.searchParams.set('q',input.value.trim());else url.searchParams.delete('q');history.replaceState(null,'',url)}
input.value=new URLSearchParams(location.search).get('q')||'';
form.addEventListener('submit',e=>{e.preventDefault();search()});
let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(search,180)});
if(input.value)search();
})();
