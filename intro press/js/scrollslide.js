var slide = {
  load: function(){
    slide.create();
    slide.style();
    setTimeout(slide.init, 1000);
    $(window).on('resize', slide.init);
  },
  create: function(){
    slide.prevBt = $('<a id="prev">')
    .on('dblclick', slide.first)
    .on('click', slide.prev);
    slide.currentBt = $('<a id="current">1</a>')
    .on('click', slide.prompt);
    slide.nextBt = $('<a id="next">')
    .on('click', slide.next)
    .on('dblclick', slide.last);
    slide.aboutBt = $('<a id="about" href="https://github.com/rafaelcastrocouto/initio">');
    slide.listBt = $('<a id="list" href="#LIST">');
    slide.controlDiv = $('<div id="control">')
    .append(slide.prevBt, 
            slide.currentBt, 
            slide.nextBt,
            slide.listBt,
            slide.aboutBt);
    $('body').append(slide.controlDiv);
  },
  init: function(){
    slide.h = $('html').height();
    slide.heights = [];
    var h = 0;
    $('section').each(function(){
      slide.heights.push(h);
      h += $(this).outerHeight();
    });
    slide.n = slide.heights.length;
    $(window).scroll(slide.scroll);
    slide.scroll();
  },
  smooth: function(d){
    slide.des = d;
    slide.stop = false;
    slide.start = $(window).scrollTop();
    slide.diff = Math.abs(slide.start - d);
    if(slide.start > d) slide.speed = -1;
    else slide.speed = 1;
    slide.loop();
  },
  loop: function(){
    var l = $(window).scrollTop();
    if((slide.speed == 1 && l >= slide.des) 
    || (slide.speed == -1 && l <= slide.des)){ 
      slide.stop = true;
      return false;
    }
    var y = l + (slide.speed * (slide.diff/50));
    window.scrollTo(0, y);
    if(!slide.stop) setTimeout(slide.loop, 0);
  },
  to: function(i){
    if(!i) i = 0;
    slide.smooth(slide.heights[i]);
  },
  first: function(){
    slide.to(0);
  },
  prev: function(){
    var x = parseInt(slide.currentBt.html()) - 1;
    if(x > 0) slide.to(x - 1);
  },
  next: function(){
    var x = parseInt(slide.currentBt.html()) - 1;
    if(x < slide.n - 1) slide.to(x + 1);
  },
  last: function(){
    slide.to(slide.n - 1);
  },
  prompt: function(){
    var p = prompt('Slide?', '1-'+slide.n);
    p = parseInt(p);
    if(p > 0 && p <= slide.n) slide.to(p - 1);
  },
  scroll: function(){
    var c = $(window).scrollTop();
    for(var i = 0; i < slide.heights.length - 1; ++i){
      if(c >= slide.heights[i] - slide.h/2 
      && c < slide.heights[i + 1] - slide.h/2) 
        break;
    }
    slide.currentBt.html(i + 1);    
  },
  style: function(){
    var u = 'font/'; //http://fortawesome.github.io/Font-Awesome/assets/font-awesome/font/
    var css = [
'@font-face {', 
'  font-family: "FontAwesome"; font-weight: normal; font-style: normal; ',
'  src: url("'+u+'fontawesome-webfont.eot?v=3.2.1");',
'  src: url("'+u+'fontawesome-webfont.woff?v=3.2.1") format("woff"), ',
'       url("'+u+'fontawesome-webfont.ttf?v=3.2.1") format("truetype"), ',
      '       url("'+u+'fontawesome-webfont.svg#fontawesomeregular?v=3.2.1") format("svg"); }',
'* { color: black;  box-sizing: border-box; }',
'html, body, section { width: 100%;  height: 100%;  margin: 0; }', 
'section {  overflow: hidden; display: table;  background: #99a;  padding: 1em; }',
'article { display: table-cell;  background: white;  vertical-align: middle;  padding: 2em;  box-shadow: 0 0 1em black;  border-radius: 0.5em; }',
'#control { user-select: none; -webkit-user-select: none; position: fixed; bottom: 0; right: 0; height: 0.5em; transition: height 1s; }',
'#control:hover { height: 2.75em; }',
'#control a { font-family: "FontAwesome"; font-style: normal; color: white; text-shadow: 1px -1px 2px black, -1px -1px 2px black; opacity: 0.6; cursor: pointer;  padding: 0.5em 1.5em; display: inline-block; box-shadow: 0 0 1em black inset; }',
'#control a:hover { opacity: 0.9; }',
'#control a:before { display: inline-block; width: 14px; height: 14px;}',               
'#control #prev { background: #a11; border-top: 0.5em solid #a11; }',
'#control #prev:before { content: "\\f139"; }',
'#control #current { background: #4a1; border-top: 0.5em solid #4a1; }',
'#control #next { background: #dc1; border-top: 0.5em solid #dc1; }',
'#control #next:before { content: "\\f13a"; }',
'#control #list { background: #c81; border-top: 0.5em solid #c81; }',
'#control #list:before { content: "\\f0cb"; }',
'#control #about { background: #68a; border-top: 0.5em solid #68a; }',
'#control #about:before { content: "\\f113"; }'   
    ].join('\n');
    var styleEL = $('<style>'+css+'</style>');
    $('body').append(styleEL);
  }
};
$(window).on('load', slide.load);
