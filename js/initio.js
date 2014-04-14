//SEQs
var pre_seqs = { // F6(13) F7(21) F8(34) F9(55) 1AGT(38) 1AHO(64)
  'F6': fibonacci(6), // ABBABBABABBAB
  'F7': fibonacci(7), // BABABBABABBABBABABBAB
  'F8': fibonacci(8), // ABBABBABABBABBABABBABABBABBABABBAB
  'F9': fibonacci(9), // BABABBABABBABBABABBABABBABBABABBABBABABBABABBABBABABBAB           
  '1AGT': realToAb(     'GVPINVSCTGSPQCIKPCKDAGMRFGKCMNRKCHCTPK'), 
                      // AAAABABABABABAABAABBAAABBABAABBBABABAB
  '1AHO': realToAb(     'VKDGYIVDDVNCTYFCGRNAYCNEECTKLKGESGYCQWASPYGNACYCYKLPDHVRTKGPGRCH') 
                      // ABBABAABBABABBBAABBABABBBABBABABBABABBABABABAABABBAABBABBBAAABAB
};
//GLOBALS
var Linearang;  //[0,0,...]
var $seqs = $('#seqs'), current_seq, aseqs, seq_name;
var $steps = $('#steps'), current_step, steps, asteps;
var $Pop = $('#Pop'), aPop, pop;
var $Parent = $('#Parent'), aParent, parent;
var $Ang_num = $('#Ang_num'), aAng_num, ang_num;
var test = 0, total_tests = 0, test_counter = 1;
var An, $An = $('#An'), aAn;
var En, $En = $('#En'), aEn; 
var the_min, avg_en;
var $total_prog = $('#total_prog'), total_prog;
var $prog = $('#prog'), prog;       
var gpi, global_parameter = [], $gp = $('#gp');
var $controls = $('#controls'), $input = $('input.editable');
var energy_data = [], min_data = [], final_data = [], avg_data = []; 
var save_data = [];
var $results = $('#results'), $container, $table, $canvas;
var start_time, end_time;
var $eff = $('#Eff');
var $effs = $('#Eff_success'), aeffs, effs; 
var $efff = $('#Eff_fail'), aefff, efff;
var $rig =  $('#Rig');
var $rigs = $('#Rig_success'), arigs, rigs; 
var $rigf = $('#Rig_fail'), arigf, rigf;
var $rigm = $('#Rig_max'), arigm, rigm;
var $rign = $('#Rig_neigh'), arign, rign;
var $rigx = $('#Rig_neighexp'), arigx, rigx;

var createCanvas = function(w, h){
  if(!h) h = w;
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  $canvas.prepend(c);
  return c;
};

var gen_linear_ang = function(){
  var a = [];
  var i = current_seq.length;  
  while(i) a[--i] = 0;  
  return a;
};

var progress_bar = function(){
  prog += 100;
  var p = prog/total_prog;
  var s = p*100;
  $prog.attr('title', s.toFixed(1) + '%');
  $prog.prev().text(s.toFixed(0) + '%');
  $prog.val(p);
  
};

var total_progress_bar = function(){
  var p = test/total_tests;
  var s = p*100;
  $total_prog.attr('title', s.toFixed(1) + '%');
  $total_prog.prev().text(s.toFixed(0) + '%');
  $total_prog.val(p);        
};

var load = function(){   

  $('#print').on('click', function(){
    window.print();
  });         

  $('#reset').on('click', function(){
    location.reload();
  }); 
  
  $('div').on('click', '.expand', function(){
    $(this).next().next().toggleClass('hidden');
  });         

  $('#start').on('click', function(){     
    total_prog = 0;   
    $input.attr('disabled', true);          

    aseqs = $seqs.val().split(',');          
    asteps = $steps.val().split(',');
    aAn = $An.val().split(',');
    aEn = $En.val().split(',');    
    aPop = $Pop.val().split(',');    
    aParent = $Parent.val().split(',');    
    aAng_num = $Ang_num.val().split(',');    
    arigf = $rigf.val().split(',');    
    arigs = $rigs.val().split(',');    
    arigm = $rigm.val().split(',');    
    arign = $rign.val().split(',');
    arigx = $rigx.val().split(',');
    aefff = $efff.val().split(',');    
    aeffs = $effs.val().split(',');    
    gpi = $gp.prop('checked');

    total_tests += Math.max(
      aseqs.length, 
      asteps.length, 
      aAn.length, 
      aEn.length,
      aPop.length, 
      aParent.length, 
      aAng_num.length, 
      arigf.length, 
      arigf.length, 
      arigm.length,  
      arign.length,  
      arigx.length,  
      aefff.length,     
      aeffs.length
    );                    
    total_progress_bar();  

    test_protein();
  });  
};       

var test_protein = function(){ 
  if(test < total_tests) {         
    start_time = new Date();
    prog = 0;    

    if(aseqs[test]) {
      seq_name = aseqs[test];
      current_seq = pre_seqs[seq_name];
    }
    if(asteps[test])   steps = parseInt(asteps[test]);          
    if(aAn[test])      An = parseInt(aAn[test]) ;
    if(aEn[test])      En = parseInt(aEn[test]);        
    if(aPop[test])     pop = parseInt(aPop[test]);        
    if(aParent[test])  parent = parseFloat(aParent[test])/100;        
    if(aAng_num[test]) ang_num = parseInt(aAng_num[test]);        
    if(aefff[test]) efff = aefff[test];        
    if(aeffs[test]) effs = aeffs[test];        
    if(arigs[test]) rigs = arigs[test];        
    if(arigf[test]) rigf = arigf[test];                
    if(arigm[test]) rigm = parseInt(arigm[test]);        
    if(arign[test]) rign = parseInt(arign[test]);        
    if(arigx[test]) rigx = arigx[test]; 

    total_prog = (An + En) * steps;            

    Linearang = gen_linear_ang(); 
    if(gpi) global_parameter = gen_parameter();         

    energy_data = []; min_data = [];  
    avg_en = 0;          

    the_min = {energy: Infinity};  

    $table = $('<table><tr><th>Step</th><th>Angles</th><th>Energy</th></tr></table>');
    $canvas = $('<div>').addClass('expandable')            
      .append($table);              
    $container = $('<div>').addClass('container')
      .append('<h3 id="Test_'+test_counter+'">Test '+test_counter+'<h3>')
      .append('<p>Sequence: '+seq_name+'('+current_seq.length+') ['+current_seq+']<p>')
      .append('<p>ELA(N): '+En+', Pop: '+pop+', Parent: '+(parent*100)+'%, Angles: '+ang_num+', Ann(N): '+An+'<p>')
      .append('<p>Parameters Global: '+gpi+', Eff Success: '+effs+', Fail: '+efff+', Rig Success: '+rigs+', Fail: '+rigf+', Max: '+rigm+'<p>')
      .append('<p>Rigidity Neightbors: '+rign+', Neightbors Expression: '+rigx+'<p>')
      .append('<p>Start: '+start_time+'</p>') 
      .append($('<input type="checkbox">').addClass('expand')) 
      .append($('<span>Hide details</span>'))      
      .append($canvas)
      .append($('<b></b>').addClass('loader'));
    $results           
      .prepend($container); 
    
    save_data = [
      seq_name+'('+current_seq.length+')', 
      En, pop, parent*100, ang_num, An, gpi,
      effs, efff, rigs, rigf, rigm, rign, rigx,
      start_time.valueOf()
    ];   
    
    current_step = 0;
    step_protein();

    ++test; ++test_counter;
  } else {
    $input.attr('disabled', false);
    final_chart();
  }
}

//step loop
var step_protein = function(P){ 
  if(P) { // won't happen on 1st call
    avg_en += P.energy;
    if(P.energy < the_min.energy) the_min = P;  
  } 
  if(current_step < steps) {

    /*if(the_min.getAngle) //uncomment to keep min
      var oa = the_min.getAngle(2);
    else */  var oa = Linearang;

    var p = new Protein({seq: current_seq, ang: oa});          
    energy_data.push(p.energy);          

    var obj = { 
      seq: current_seq, 
      ang: oa, 
      l: En, 
      pop: pop,
      parent: parent,
      ang_num: ang_num,
      efff: efff,
      effs: effs,
      rigf: rigf,
      rigs: rigs,         
      rigm: rigm,        
      rign: rign,         
      rigx: rigx         
    };

    if(gpi) obj.parameter = global_parameter;
    else    obj.parameter = gen_parameter();

    ela_worker.postMessage(JSON.stringify(obj));          
    ++current_step;          
  } else plot();        
};   

//workers
var ela_worker = new Worker('js/ela.js');
ela_worker.addEventListener('error', onError, false);
ela_worker.addEventListener('message', function(e) {
  var data = JSON.parse(e.data); 
  if(data.log) console.log(data.log);
  if(data.parameter) {
    printParameters(data.parameter); 
    if(gpi) global_parameter = data.parameter;
  }
  if(data.data) {
    energy_data.push(data.data);          
    progress_bar();
  }
  if(data.ang) {
    energy_data.push(data.energy);
    var msg = JSON.stringify({seq: current_seq, ang: data.ang, l: An});
    ann_worker.postMessage(msg);  
  }
}, false);

var gen_parameter = function(){
  var parameter = [];        
  for(var i = 1; i < current_seq.length; ++i){
    parameter[i] = {};          
    parameter[i].efficiency = 1;
    parameter[i].rigidity = 1;
  }
  return parameter;
};     

var printParameters = function(parameter){
  var eff = [], rig = [];
  for(var i = 1; i < parameter.length - 1; ++i){
    rig.push( Number(parameter[i].rigidity).toFixed(0) );
    eff.push( Number(parameter[i].efficiency).toFixed(0) );
  }
  $eff.val( eff.join(',') ); 
  $rig.val( rig.join(',') );        
};      

var ann_worker = new Worker('js/ann.js');
ann_worker.addEventListener('error', onError, false);
ann_worker.addEventListener('message', function(e) { 
  var data = JSON.parse(e.data);
  if(data.log) console.log(data.log);
  if(data.data) {
    energy_data.push(data.data);
    progress_bar();
  }
  if(data.ang) {
    var angstr = data.ang.slice(1).join(', ');
    energy_data.push(data.energy);
    min_data.push(data.energy);
    $table.append($(['<tr>',
       '<td>'+current_step+'</td>',
       '<td>'+angstr+'</td>',
       '<td>'+data.energy+'</td>',
       '</tr>'].join('')));
    var p = new Protein({'seq': current_seq, 'ang': data.ang});                 
    step_protein(p);
  }
}, false); 

var plot = function(){
  end_time = new Date();       
  var duration = (end_time.valueOf() - start_time.valueOf())/1000,
      avarage = avg_en/steps;
  avg_data.push(avarage);
  final_data.push(the_min.energy);
  $container
    .append($('<p>End: '+end_time+'</p>'))
    .append($('<p>Time: '+duration.toFixed(3)+' seconds</p>'))
    .append($('<p>Avarage Duration (Time/'+steps+'): '+(duration/steps).toFixed(3)+' seconds</p>'))
    .append($('<p>Avarage Energy (Sum/'+steps+'): '+avarage+'</p>'))
    .append($('<p>Minimum Energy: '+the_min.energy+'</p>'));

  save_data = save_data.concat([
    end_time.valueOf(), duration.toFixed(3), (duration/steps).toFixed(3), avarage, 
    the_min.energy, the_min.getAngle().slice(1).join(', ')
  ]);

  $.post('/post', {data: save_data.join(';')});      
  
  test_chart(energy_data);
  console.log(the_min); 
  the_min.render();
  total_progress_bar(); 
  $('.loader').remove();

  test_protein();
};      

$(load); 