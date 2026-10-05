const cards=document.querySelectorAll('.feature,.mini,.screen,.split-image');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
cards.forEach(c=>{c.classList.add('reveal');observer.observe(c)});
const style=document.createElement('style');style.textContent='.reveal{opacity:0;transform:translateY(20px);transition:opacity .65s ease,transform .65s ease}.reveal.show{opacity:1;transform:none}';document.head.appendChild(style);
