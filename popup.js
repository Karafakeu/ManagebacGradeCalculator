const ovBtn=document.getElementById("info");
const setBtn=document.getElementById("sett");
const hero1=document.getElementById("hero1");
const hero2=document.getElementById("hero2");
hero2.classList.add("exit");
ovBtn.addEventListener('click',()=>{
    hero1.classList.remove("exit");
    hero2.classList.add("exit");
});
setBtn.addEventListener('click',()=>{
    hero2.classList.remove("exit");
    hero1.classList.add("exit");
});