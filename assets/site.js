(function(){
  'use strict';
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.textContent=open?'Close':'Menu';
    });
  }
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  var form=document.getElementById('contactForm');
  if(!form) return;
  var sel=document.getElementById('service'), st=document.getElementById('formStatus');
  var map={federal:'Federal Subcontracting Opportunity',commercial:'Commercial CFO Retainer (Tier I)',general:'General Inquiry'};
  try{
    var q=new URLSearchParams(location.search).get('service');
    if(q && map[q]) sel.value=map[q];
  }catch(e){}

  var EMAIL='bfoster@a2asolutions.org';
  form.addEventListener('submit',function(e){
    e.preventDefault();
    st.className='status'; st.textContent='';
    if(!form.checkValidity()){
      st.className='status warn';
      st.textContent='Fill in your name, email, and message, then send again.';
      form.reportValidity(); return;
    }
    var data=new FormData(form);
    if(data.get('bot-field')) return; // honeypot

    function viaEmail(){
      var subj='A2A Solutions inquiry: '+data.get('service');
      var body='Name: '+data.get('first_name')+' '+data.get('last_name')+'\nOrganization: '+(data.get('organization')||'')+'\nEmail: '+data.get('email')+'\n\n'+data.get('message');
      location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
      st.className='status warn';
      st.textContent='Your email app should open with the message ready to send. If it does not, write to '+EMAIL+'.';
    }

    var endpoint=form.getAttribute('data-endpoint');
    if(!endpoint){ viaEmail(); return; }
    st.textContent='Sending...';
    fetch(endpoint,{method:'POST',body:data,headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){ st.className='status ok'; st.textContent='Message received. We will reply within one business day.'; form.reset(); }
        else{ st.className='status warn'; st.textContent='Your message did not send. Email '+EMAIL+' and we will reply within one business day.'; }
      })
      .catch(function(){ st.className='status warn'; st.textContent='Your message did not send. Email '+EMAIL+' and we will reply within one business day.'; });
  });
})();
