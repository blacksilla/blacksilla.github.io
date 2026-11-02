// Universal plugin: applies the saved theme to <html> before first paint (inline script). No SSR attribute (head re-render would reset it); CSS :root is ember.
export default defineNuxtPlugin(() => {
  useHead({
    script: [{
      innerHTML: "try{var t=localStorage.getItem('theme'),u=JSON.parse(localStorage.getItem('themes-unlocked')||'[]');if(t&&(t==='ember'||u.indexOf(t)>-1))document.documentElement.setAttribute('data-theme',t)}catch(e){}",
      tagPosition: 'head',
    }],
  })
})
