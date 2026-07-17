// Mobile nav toggle
(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');
  if(navToggle){
    navToggle.addEventListener('click', function(){
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });
    navToggle.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        navToggle.click(); e.preventDefault();
      }
    })
  }
  Array.from(document.querySelectorAll('.nav-list a')).forEach(function(link){
    link.addEventListener('click', function(){
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
// Smooth-scroll to anchor
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      var target = document.getElementById(this.hash.slice(1));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
        target.focus({preventScroll:true});
      }
    });
  });
})();
// Section fade-in on scroll
(function(){
  var sections = Array.from(document.querySelectorAll('.section'));
  if(!window.IntersectionObserver) return;
  sections.forEach(function(sec){ sec.classList.add('anim-inactive'); });
  var io = new IntersectionObserver(function(entries, observer){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('anim-fadein-up');
        entry.target.classList.remove('anim-inactive');
        observer.unobserve(entry.target);
      }
    });
  },{ threshold: 0.12 });
  sections.forEach(function(sec){ io.observe(sec); });
})();
// FAQ accordion
(function(){
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click', function(){
      var parent = btn.parentElement;
      var open = parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      parent.querySelector('.faq-answer').style.maxHeight = open ? parent.querySelector('.faq-answer').scrollHeight + 'px': null;
      // Close others
      document.querySelectorAll('.faq-item').forEach(function(item){
        if(item!==parent){
          item.classList.remove('open');
          item.querySelector('.faq-question').setAttribute('aria-expanded','false');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
    });
  });
})();
// Text size increase/decrease
(function(){
  var htmlEl = document.documentElement;
  var btnIncrease = document.getElementById('text-increase');
  var btnDecrease = document.getElementById('text-decrease');
  var size = 100;
  btnIncrease.addEventListener('click',function(){ size=Math.min(size+10,150); htmlEl.style.fontSize= size+"%"; });
  btnDecrease.addEventListener('click',function(){ size=Math.max(size-10,80); htmlEl.style.fontSize= size+"%"; });
})();
// Quick contact form mock (only feedback)
(function(){
  var form = document.getElementById('quick-contact-form');
  if(form){
    var fb=form.querySelector('.form-feedback');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      fb.textContent = 'Danke! Wir melden uns baldmöglichst.';
      form.reset();
    });
  }
})();
// Chatbot widget
(function(){
  var widget = document.getElementById('chatbot-widget'),
      panel = widget.querySelector('.chatbot-panel'),
      toggleBtn = widget.querySelector('.chatbot-toggle'),
      closeBtn = widget.querySelector('.chatbot-close'),
      form = widget.querySelector('.chatbot-form'),
      messages = widget.querySelector('.chatbot-messages');
  function openChat(){ widget.classList.add('open'); panel.querySelector('input').focus();}
  function closeChat(){ widget.classList.remove('open'); }
  toggleBtn.addEventListener('click',function(){
    if(widget.classList.contains('open')) closeChat(); else openChat();
  });
  closeBtn.addEventListener('click',closeChat);
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var val = form.message.value.trim();
    if(!val) return;
    var userDiv = document.createElement('div');
    userDiv.className = 'chatbot-msg chatbot-msg-user';
    userDiv.textContent = val;
    messages.appendChild(userDiv);
    messages.scrollTop = messages.scrollHeight;
    form.message.value = '';
    form.message.disabled = true;
    form.querySelector('button[type="submit"]').disabled = true;
    fetch('https://overstay-choosy-succulent.ngrok-free.dev/webhook/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: val, companyId: 'julians-fahrschule-repo', companyName: 'Julians Fahrschule' })
    }).then(function(res){ return res.json(); })
      .then(function(data){
        var botDiv = document.createElement('div');
        botDiv.className = 'chatbot-msg chatbot-msg-bot';
        botDiv.textContent = data && data.reply ? data.reply : 'Es gab ein Problem mit der Antwort.';
        messages.appendChild(botDiv); messages.scrollTop = messages.scrollHeight;
      }).catch(function(){
        var botDiv = document.createElement('div');
        botDiv.className = 'chatbot-msg chatbot-msg-bot';
        botDiv.textContent = 'Fehler: Bitte versuche es später nochmal.';
        messages.appendChild(botDiv);
        messages.scrollTop = messages.scrollHeight;
      }).finally(function(){
        form.message.disabled = false;
        form.querySelector('button[type="submit"]').disabled = false;
        form.message.focus();
      });
  });
  // Keyboard accessibility
  toggleBtn.addEventListener('keydown', function(e){
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleBtn.click(); }
  });
  closeBtn.addEventListener('keydown', function(e){
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); closeBtn.click(); }
  });
  widget.addEventListener('keydown', function(e){
    if(e.key==='Escape'){closeChat(); toggleBtn.focus();}
  });
  // Focus trap inside open panel
  panel.addEventListener('keydown', function(e){
    if (!widget.classList.contains('open')) return;
    var focusable = panel.querySelectorAll('button, input, textarea'), first=focusable[0], last=focusable[focusable.length-1];
    if(e.key==="Tab"){
      if(e.shiftKey && document.activeElement===first) {e.preventDefault(); last.focus();}
      if(!e.shiftKey && document.activeElement===last) {e.preventDefault(); first.focus();}
    }
  });
})();
