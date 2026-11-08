(()=>{
'use strict';
const initialTitle=document.title;
const initialDescription=document.querySelector('meta[name="description"]')?.content||'';
const file=location.pathname.split('/').pop();
function setMeta(key,value,property=false){let el=document.querySelector(`meta[${property?'property':'name'}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',key);document.head.append(el)}el.content=value}
function shorten(text,max=155){if(text.length<=max)return text;const cut=text.slice(0,max-1);return cut.slice(0,cut.lastIndexOf(' ')).replace(/[ ,;:—-]+$/,'')+'…'}
function metadata(){let title=initialTitle,description=initialDescription;const params=new URLSearchParams(location.search);
 if(file==='blog-1440.html'){
  const rubrics={home:['Освещение квартиры и дома | Блог ChampionLED','Освещение кухни, гостиной и домашнего кабинета. Разбор задач света и типов продукции для жилых пространств.'],business:['Освещение офиса и магазина | Блог ChampionLED','Общий, рабочий и акцентный свет для офисов, магазинов и общественных пространств. Материалы об освещении для бизнеса.'],product:['Светильники: устройство и комплектация | ChampionLED','Устройство магнитных и модульных систем, характеристики светильников, обязательные компоненты и документы перед заказом.'],updates:['Новинки и обновления продукции | Блог ChampionLED','Раздел для анонсов серий, светильников, компонентов и исполнений ChampionLED. Подтверждённые сведения о готовности продукции.']};
  const rubric=rubrics[params.get('rubric')];if(rubric)[title,description]=rubric;
  if(params.get('q')){title='Поиск материалов | Блог ChampionLED';description='Поиск по темам освещения дома и бизнеса, устройству светильников и подготовке к покупке в блоге ChampionLED.'}
 }
 if(file==='case-1440.html'&&!document.querySelector('[data-static-case]')&&typeof CASE_PREVIEWS!=='undefined'){
  const item=CASE_PREVIEWS.find(x=>x.key===(params.get('case')||'apartment'));
  if(item){title='Пример: '+item.title+' | ChampionLED';description=shorten('Пример кейса «'+item.title+'»: задача освещения, фото и видео, продукция и аналоги ChampionLED.')}else{title='Пример кейса не найден | ChampionLED';description='Вернитесь к выбору кейсов ChampionLED и найдите пример по пространству, задаче освещения или типу продукции.'}
 }
 document.title=title;setMeta('description',description);setMeta('og:title',title,true);setMeta('og:description',description,true);setMeta('og:url',location.origin+location.pathname+location.search,true);
 return {title,description};
}
function structured(page){
 const url=location.origin+location.pathname+location.search;
 const graph=[{'@type':file==='contacts-1440.html'?'ContactPage':file==='about-1440.html'?'AboutPage':['blog-1440.html','cases-1440.html'].includes(file)?'CollectionPage':'WebPage','@id':url+'#page',url,name:page.title,description:page.description,inLanguage:'ru-RU',isPartOf:{'@id':location.origin+'/#website'}}];
 const crumbs=document.querySelector('main nav[aria-label="Хлебные крошки"]');
 if(crumbs){const items=[...crumbs.children].filter(el=>el.textContent.trim()&&el.textContent.trim()!=='/').map((el,i)=>({'@type':'ListItem',position:i+1,name:el.textContent.trim().replace(/\s+/g,' '),item:el.tagName==='A'?new URL(el.getAttribute('href'),location.href).href:url}));if(items.length>1){graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumbs',itemListElement:items});graph[0].breadcrumb={'@id':url+'#breadcrumbs'}}}
 let script=document.getElementById('seo-page-data');if(!script){script=document.createElement('script');script.type='application/ld+json';script.id='seo-page-data';document.head.append(script)}script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
}
function update(){structured(metadata())}update();
const blogHeading=document.getElementById('blog-list-heading');if(blogHeading)new MutationObserver(update).observe(blogHeading,{childList:true,subtree:true,characterData:true});
})();
