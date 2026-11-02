// Universal plugin: adds `js-motion` to <html> before first paint (inline script), unless reduced motion.
// Failsafe: if the app never sets `motion-ready` within 3s (JS failed/slow), remove js-motion so nothing stays hidden.
export default defineNuxtPlugin(() => {
  useHead({
    script: [{
      innerHTML: "try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js-motion')},3000)}}catch(e){}",
      tagPosition: 'head',
    }],
  })
})
