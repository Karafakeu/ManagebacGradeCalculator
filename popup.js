/* document.addEventListener('DOMContentLoaded',function (){
    document.querySelector('button.test').addEventListener('click',function(){
        chrome.tabs.query({currentWindow:true,active:true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id,'hi',setCount)
            })
    }, false)
}, false) */