import React, { useState } from 'react';

const TIPS = [
  {icon:'🔒',title:'HTTPS తప్పకుండా Check చేయి',cat:'URL',level:'Basic',
   desc:'Login page తెరిచే ముందు address bar లో 🔒 lock icon చూడు. "http://" మాత్రమే ఉంటే credential ఇవ్వకు.',
   eg:'✅ https://paypal.com  ❌ http://paypal-secure.xyz'},
  {icon:'🔗',title:'Suspicious Domains గుర్తించు',cat:'URL',level:'Basic',
   desc:'.xyz .tk .ml .ga .cf extensions తో real companies ఉండవు. Scammers cheap domains వాడతారు.',
   eg:'❌ paypal-verify.xyz  ✅ paypal.com'},
  {icon:'📧',title:'Urgent Emails Ignore చేయి',cat:'Email',level:'Basic',
   desc:'"Account suspended in 24 hours!" లాంటి urgent messages phishing. Real companies ఇలా threaten చేయవు.',
   eg:'❌ "URGENT: Verify NOW or lose access!"'},
  {icon:'👤',title:'Generic Greeting = Red Flag',cat:'Email',level:'Basic',
   desc:'"Dear Customer" వస్తే suspicious! Real companies మీ పేరు తో greet చేస్తాయి.',
   eg:'❌ "Dear Valued Customer"  ✅ "Dear Ravi Kumar"'},
  {icon:'🏦',title:'Brand Impersonation గుర్తించు',cat:'URL',level:'Intermediate',
   desc:'"paypal-secure.xyz" brand name వాడి mislead చేస్తుంది. Real URL slash కి ముందు domain మాత్రమే.',
   eg:'❌ paypal-secure.xyz/login  ✅ paypal.com/login'},
  {icon:'🔑',title:'Password Email లో ఇవ్వకు',cat:'Email',level:'Basic',
   desc:'Real banks, PayPal — ఏ company కూడా email లో password, CVV అడగవు. అడిగితే 100% scam.',
   eg:'❌ "Enter your password to verify"'},
  {icon:'📱',title:'2-Factor Authentication వాడు',cat:'Protection',level:'Intermediate',
   desc:'2FA enable చేస్తే password తెలిసినా account safe. Google Authenticator use చేయి.',
   eg:'✅ Google, PayPal, Bank అన్నింటికీ 2FA'},
  {icon:'🕵️',title:'Hover to See Real URL',cat:'URL',level:'Intermediate',
   desc:'Click ముందు link hover చేయి — status bar లో real URL కనిపిస్తుంది. Match కాకపోతే trap!',
   eg:'Display: "Click here"  Real: http://phish.xyz'},
  {icon:'📎',title:'Unknown Attachments తెరవకు',cat:'Email',level:'Intermediate',
   desc:'Unknown sender నుండి .exe .zip .docm files తెరవకు — ransomware contain అవుతుంది.',
   eg:'❌ Invoice.exe  ❌ Statement.zip from unknown'},
  {icon:'🌐',title:'URL Direct Type చేయి',cat:'URL',level:'Basic',
   desc:'Email link click చేయకుండా browser లో directly official URL type చేయి.',
   eg:'✅ Browser: paypal.com  ❌ Email link click'},
  {icon:'📞',title:'Phone Call తో Verify చేయి',cat:'Protection',level:'Advanced',
   desc:'Suspicious email వస్తే — official website నుండి number తీసుకుని call చేసి verify చేయి.',
   eg:'✅ paypal.com listed number కి call'},
  {icon:'🔄',title:'Software Update చేయి',cat:'Protection',level:'Basic',
   desc:'Browser, OS, Antivirus అన్నీ update గా ఉంచు — phishing sites automatically block అవుతాయి.',
   eg:'✅ Chrome/Windows auto-update enable చేయి'},
];

const LC = {Basic:'#10b981',Intermediate:'#f59e0b',Advanced:'#ef4444'};

export default function Tips() {
  const [cat, setCat] = useState('All');
  const [lvl, setLvl] = useState('All');
  const [exp, setExp] = useState(null);

  const data = TIPS.filter(t=>(cat==='All'||t.cat===cat)&&(lvl==='All'||t.level===lvl));

  return (
    <div>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-0.5px'}}>💡 Safety Tips</h1>
        <p style={{color:'var(--text-secondary)',fontSize:14,marginTop:4}}>Phishing నుండి protect అవ్వడానికి complete guide</p>
      </div>

      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {[{icon:'🔗',label:'URL Safety',cat:'URL',color:'#6366f1'},{icon:'📧',label:'Email Safety',cat:'Email',color:'#8b5cf6'},{icon:'🛡️',label:'Protection',cat:'Protection',color:'#10b981'}].map(x=>(
          <div key={x.label} onClick={()=>setCat(x.cat)}
            style={{background:'var(--bg-card)',border:`1px solid ${cat===x.cat?x.color:'var(--border)'}`,borderLeft:`3px solid ${x.color}`,borderRadius:12,padding:'16px 20px',cursor:'pointer',transition:'all .15s'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:22}}>{x.icon}</span>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{x.label}</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{TIPS.filter(t=>t.cat===x.cat).length} tips</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:16,marginBottom:20,flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:6,fontWeight:600,textTransform:'uppercase'}}>Category</div>
          <div style={{display:'flex',gap:6}}>
            {['All','URL','Email','Protection'].map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{padding:'6px 14px',borderRadius:20,border:'1px solid',cursor:'pointer',fontSize:12,fontWeight:600,
                  background:cat===c?'rgba(99,102,241,0.2)':'transparent',
                  borderColor:cat===c?'rgba(99,102,241,0.4)':'var(--border)',
                  color:cat===c?'#a5b4fc':'var(--text-muted)'}}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:6,fontWeight:600,textTransform:'uppercase'}}>Level</div>
          <div style={{display:'flex',gap:6}}>
            {['All','Basic','Intermediate','Advanced'].map(l=>(
              <button key={l} onClick={()=>setLvl(l)}
                style={{padding:'6px 14px',borderRadius:20,border:'1px solid',cursor:'pointer',fontSize:12,fontWeight:600,
                  background:lvl===l?'rgba(99,102,241,0.2)':'transparent',
                  borderColor:lvl===l?'rgba(99,102,241,0.4)':'var(--border)',
                  color:lvl===l?'#a5b4fc':'var(--text-muted)'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
        {data.map((t,i)=>(
          <div key={i} onClick={()=>setExp(exp===i?null:i)}
            style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderLeft:`3px solid #6366f1`,borderRadius:12,padding:18,cursor:'pointer',transition:'transform .15s',transform:exp===i?'none':'translateY(0)'}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
              <span style={{fontSize:24,flexShrink:0}}>{t.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:5}}>{t.title}</div>
                <div style={{display:'flex',gap:6}}>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,background:'rgba(99,102,241,0.12)',color:'#a5b4fc'}}>{t.cat}</span>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,background:`${LC[t.level]}18`,color:LC[t.level]}}>{t.level}</span>
                </div>
              </div>
              <span style={{color:'var(--text-muted)',fontSize:11}}>{exp===i?'▲':'▼'}</span>
            </div>
            <p style={{color:'var(--text-secondary)',fontSize:13,lineHeight:1.6,margin:0}}>{t.desc}</p>
            {exp===i && (
              <div style={{marginTop:12,padding:10,background:'var(--bg-secondary)',borderRadius:6,fontSize:12,fontFamily:'monospace',color:'var(--text-muted)'}}>
                {t.eg}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
