function check_action(a,b,c){maplinked=null;a&&cancel_bubble(a);clearTimeout(timeoutErrors);action=c;kernel=b;navigate=action?kernel+": \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f":kernel+": \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b";$("#header").html(navigate);$("#leftmenu").empty();$("#content").html("<tr><td>"+ajax_waiter+"</td></tr>");ucsp_query(left_devices)}
function ucsp_query(a,b,c,f,g,d){if(b)cancel_bubble(b),e=b.currentTarget;running_query&&running_query.abort();d?running_query=$.ajax({url:"/cgi-bin/spo_ucsp.cgi",type:"POST",data:d=="none"?"kernel="+kernel+"&uuid="+c+"&sid="+f+"&action="+g:"kernel="+kernel+"&uuid="+c+"&sid="+f+"&action="+g+d,dataType:"text",success:a}):(c?f?g?b="kernel="+kernel+"&uuid="+c+"&sid="+f+g:($("#content").html("<tr><td>"+ajax_waiter+"</td></tr>"),b="kernel="+kernel+"&uuid="+c+"&sid="+f):($("#content").html("<tr><td>"+ajax_waiter+
"</td></tr>"),b="kernel="+kernel+"&uuid="+c):b="kernel="+kernel,running_query=$.ajax({url:"/cgi-bin/spo_ucsp.cgi",type:"POST",data:b,dataType:"xml",success:a}))}
function left_devices(a){$("#content").empty();if(!check_xml(a))return a.length>0?$("#content").html(alarm_system_error):$("#content").html("\u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432 \u043d\u0435 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d\u043e"),0;for(var a=$("device",a),b="",c=0;c<a.length;c++){var f=a.eq(c).children("UUID"),g=a.eq(c).children("friendlyName");g.length&&f.length&&(b+="<tr><td class='background'><a href='#' onmousedown=ucsp_query(left_services,event,'",b+=
f.text()+"')",b+=" id='"+f.text(),b+="'><span class='nav'>",b+=g.text(),b+="</span></a></td></tr>")}$("#leftmenu").html(b)}
function left_services(a){if(!check_xml(a))return $("#content").html(alarm_system_error),0;var b=$("fault detail",a);if(b.length>0||a.length==0)a=b.length>0?b.text():"\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d \u043e\u0442\u0432\u0435\u0442 \u043e\u0442 \u0441\u0438\u0441\u0442\u0435\u043c\u044b",$("#content").html(a);else{clearTimeout(timeoutVals);navigate=navigate.indexOf(":",navigate.indexOf(":")+1)==-1?navigate+": "+e.childNodes[0].textContent:navigate.substring(0,navigate.indexOf(":",
navigate.indexOf(":")+1))+": "+e.childNodes[0].textContent;$("#header").html(navigate);var c=$("root > device > serviceList > service > serviceType",a),f=$("root > device > serviceList > service > serviceID",a),g=e.parentNode;if(g.childNodes.length>1||f.length==0)for(;g.childNodes.length>1;)g.removeChild(g.lastChild);else{b=g.innerHTML;b+="<table><tr><td><table><tr><td>&nbsp</td></tr></table></td><td><table>";for(var d=0;d<f.length;d++)b+="<tr><td class='background'><a href='#' onmousedown=ucsp_query(",
b+=action?"build_actions":"build_tree",b+=",event,'"+e.id+"','"+f.eq(d).text()+"')",b+=" id='",b+=e.id+":"+f.eq(d).text(),b+="'><span class='nav'>",b+=c.eq(d).text()+" ("+f.eq(d).text()+")",b+="</span></a></td></tr>";if($("deviceList",a).length>0){f=$("deviceList > device > UUID",a);c=$("deviceList > device > friendlyName",a);for(d=0;d<f.length;d++)b+="<tr><td class='background'><a href='#' onmousedown=ucsp_query(left_services,event,'",b+=f.eq(d).text()+"')",b+=" id='"+f.eq(d).text(),b+="'><span class='nav'>",
b+=c.eq(d).text(),b+="</span></a></td></tr>"}b+="</table></td></tr></table>";g.innerHTML=b}b="<tr><td bgcolor='#ffffff'><span class='header'>";b+=$("device friendlyName",a).eq(0).text();b+="</span><br><br></td></tr><tr><td>\u0422\u0438\u043f \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430</td><td>";b+=$("device deviceType",a).eq(0).text();b+="</td></tr><tr><td>\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430</td><td>";b+=$("device friendlyName",
a).eq(0).text();b+="</td></tr><tr><td>\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f-\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c</td><td>";b+=$("device company",a).eq(0).text();b+="</td></tr><tr><td>\u0421\u0442\u0440\u0430\u043d\u0430-\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c</td><td>";b+=$("device country",a).eq(0).text();c=$("device modelName",a);c.length>0&&(b+="</td></tr><tr><td>\u041c\u043e\u0434\u0435\u043b\u044c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430</td><td>",
b+=c.eq(0).text());b+="</td></tr><tr><td>\u0421\u0435\u0440\u0438\u0439\u043d\u044b\u0439 \u043d\u043e\u043c\u0435\u0440</td><td>";b+=$("device serialNumber",a).eq(0).text();b+="</td></tr><tr><td>UUID</td><td>";b+=$("device UUID",a).eq(0).text();c=$("device URL",a);c.length>0&&(b+="</td></tr><tr><td>URL</td><td>",b+=c.eq(0).text());a=$("device version",a);a.length>0&&(b+="</td></tr><tr><td>\u0412\u0435\u0440\u0441\u0438\u044f</td><td>",b+=a.eq(0).text());b+="</td></tr>";$("#content").html(b);window.scrollTo(0,
$("#"+e.id).offset().top)}}function tree_toggle(a){var a=a||window.event,b=a.target||a.srcElement;if(hasClass(b,"Expand")&&(b=b.parentNode,!hasClass(b,"ExpandLeaf")))a&&cancel_bubble(a),a=hasClass(b,"ExpandOpen")?"ExpandClosed":"ExpandOpen",b.className=b.className.replace(/(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/,"$1"+a+"$3"),action||(running_query&&running_query.abort(),fill_values())}function hasClass(a,b){return RegExp("(^|\\s)"+b+"(\\s|$)").test(a.className)}
function build_tree(a){if(!check_xml(a))return $("#content").html(alarm_system_error),0;navigate=navigate.substring(0,navigate.indexOf(":",navigate.indexOf(":")+1))+": "+e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].textContent+": "+e.childNodes[0].textContent;$("#header").html(navigate);$("#content").html("<tr><td valign='top' width=390 onmousedown='tree_toggle(arguments[0])' style='overflow:hidden'></td><td valign='top' align='left' width=280 nowrap='nowrap' style='overflow:hidden'></td></tr>");
for(var b=$("serviceStateTable > stateVariable > name",a),c=$("serviceStateTable > stateVariable > friendlyName",a),f=$("serviceStateTable > stateVariable > dataType",a),g="<div id='"+e.id+"'>"+e.textContent+"</div><ul class='Container'>",d=0;d<b.length;d++){g+="<li id='"+b.eq(d).text()+"' class='Node IsRoot";g+=f.eq(d).text()=="struct"||f.eq(d).text()=="list"?" ExpandClosed":" ExpandLeaf";d+1==b.length&&(g+=" IsLast");g+="'><div class='Expand'></div><div class='Content'>"+c.eq(d).text();g+="<br><font size='2'><i>"+
b.eq(d).text()+"</i></font></div>";if(f.eq(d).text()=="struct"||f.eq(d).text()=="list")g+=subtree(a,b.eq(d).text(),b.eq(d).text());g+="</li>"}g+="</ul>";$("#content > tbody > tr > td:first").html(g);fill_values()}
function subtree(a,b,c){var f="<ul class='Container'>",g;if(g=$("serviceStateTable > stateVariable > name",a).filter(function(){return $(this).text()==c})){for(var d=0;d<g.length;d++)if(g.eq(d).text()==c){g=g.eq(d);break}if(b!=c){g=g.parent().find("stateVariable > name").filter(function(){return $(this).text()==b});if(!g)return;for(d=0;d<g.length;d++)if(g.eq(d).text()==b){g=g.eq(d);break}}g=g.next().next().next().children();for(d=0;d<g.length;d++){var b=childByName(g.get(d),"name").textContent,h=
childByName(g.get(d),"friendlyName").textContent,i=childByName(g.get(d),"dataType").textContent;f+="<li id='"+b+"' class='Node";f+=i=="struct"||i=="list"?" ExpandClosed":" ExpandLeaf";d+1==g.length&&(f+=" IsLast");f+="'><div class='Expand' id='"+i+"'></div><div class='Content' id='"+b+"'>";f+=h+"<br><font size='2'><i>"+b+"</i></font>";action&&(f+=generate_forms(g.get(d)));f+="</div>";if(i=="struct"||i=="list")f+=subtree(a,b,c);f+="</li>"}f+="</ul>";return f}}
function insert_struct_values(a,b){for(var c="",f=a.childNodes.length,g=0;g<f;g++){var d=a.childNodes[g];c+="<div style='min-height:"+d.offsetHeight+"px'>";hasClass(d,"ExpandLeaf")?c+="<nobr>"+b.children(d.id).text()+"</nobr>":hasClass(d,"ExpandOpen")?(c+="<div style='min-height:"+d.childNodes[1].offsetHeight+"px'>&nbsp</div>",c+="<div>",c+=d.firstChild.id=="struct"?insert_struct_values(d.lastChild,b.children(d.id).children("struct")):insert_list_values(d.lastChild,b.children(d.id).children("list")),
c+="</div>"):c+="&nbsp";c+="</div>"}return c}
function insert_list_values(a,b){var c="",f=b.get(0).childNodes.length;if(f>a.childNodes.length){var g=a.lastChild,d=g.className,d=d.replace(/ExpandOpen/g,"ExpandClosed");d.indexOf(" IsLast")!=-1&&(d=d.substring(0,d.indexOf(" IsLast")));g.className=d;for(var d=f-a.childNodes.length,h=0;h<d;h++){var i=g.cloneNode(true);a.appendChild(i)}a.lastChild.className+=" IsLast"}else if(f<a.childNodes.length)if(f==0)d=a.parentNode.className,d=d.replace(/ExpandOpen/g,"ExpandClosed"),a.parentNode.className=d;else{for(d=
a.lastChild.className;a.childNodes.length>f;)a.removeChild(a.lastChild);a.lastChild.className=d}for(g=0;g<f;g++)d=a.childNodes[g],c+="<div style='min-height:"+d.offsetHeight+"px'>",hasClass(d,"ExpandLeaf")?c+="<nobr>"+b.get(0).childNodes[g].textContent+"</nobr>":hasClass(d,"ExpandOpen")?(c+="<div style='min-height:"+d.childNodes[1].offsetHeight+"px'>&nbsp</div>",c+="<div>",c+=d.firstChild.id=="struct"?insert_struct_values(d.lastChild,b.children(d.id).eq(g).children("struct")):insert_list_values(d.lastChild,
b.children(d.id).eq(g).children("list")),c+="</div>"):c+="&nbsp",c+="</div>";return c}
function insert_values(a){if((new XMLSerializer).serializeToString(a).indexOf("\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0438\u043d\u0442\u0430\u043a\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0430\u043d\u0430\u043b\u0438\u0437\u0430 XML")==148)return $("#content > tbody").get(0).firstChild.childNodes[1].childNodes[0].innerHTML="\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u044b \u043d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435. \u0417\u043d\u0430\u0447\u0435\u043d\u0438\u044f \u043d\u0435 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u044b",0;
else $("#content > tbody").get(0).firstChild.childNodes[1].childNodes[0].innerHTML="&nbsp";for(var a=$("stateVariable > *",a),b=0;b<a.length;b++){var c=$("#value_"+a.get(b).tagName),f=$("#"+a.get(b).tagName).get(0).lastChild;if(a.get(b).childNodes.length==0){var g=f.parentNode.className,g=g.replace(/ExpandOpen/g,"ExpandClosed");f.parentNode.className=g;c.html("null")}else a.get(b).firstChild.tagName=="value"?a.get(b).firstChild.textContent.indexOf("http://")==-1?c.html("<nobr>"+a.get(b).firstChild.textContent+
"</nobr>"):c.html("<a href='"+a.get(b).firstChild.textContent+"'>"+a.get(b).firstChild.textContent+"</a>"):(g="<div style='min-height:"+f.previousSibling.offsetHeight+"px'>&nbsp</div>",g+="<div>",g+=a.get(b).firstChild.tagName=="struct"?insert_struct_values(f,a.eq(b).children("struct")):insert_list_values(f,a.eq(b).children("list")),g+="</div>",c.html(g))}}
function fill_values(){clearTimeout(timeoutVals);for(var a=$("#content > tbody > tr > td").get(0),b="<div style='min-height:"+a.firstChild.offsetHeight+"px'>&nbsp</div>",c=a.firstChild.id,f=a.lastChild,g="",d=0;d<f.childNodes.length;d++)b+="<div style='min-height:"+f.childNodes[d].childNodes[1].offsetHeight+"px'",hasClass(f.childNodes[d],"ExpandClosed")?b+=">&nbsp":(b+=" id='value_"+f.childNodes[d].id+"'>",g+="&"+f.childNodes[d].id+"= "),b+="</div>";g&&ucsp_query(insert_values,e,c.substring(0,c.indexOf(":")),
c.substring(c.indexOf(":")+1),g);b+="</table>";a.nextSibling.innerHTML=b;timeoutVals=setTimeout("fill_values()",1E4)}function digits_only(a){a||(a=event);a=a.charCode?a.charCode:a.keyCode?a.keyCode:a.which?a.which:0;return a>31&&(a<48||a>57)&&a!=37&&a!=39&&a!=46?false:true}
function add_list_item(a){if(a){cancel_bubble(a);e=a.currentTarget;a=e.parentNode.parentNode.className;a.indexOf("ExpandClosed")&&(a=a.replace(/ExpandClosed/g,"ExpandOpen"));e.parentNode.parentNode.className=a;var b=e.parentNode.parentNode.childNodes[2],a=b.lastChild.className,a=a.substring(0,a.indexOf(" IsLast"));b.lastChild.className=a;b.innerHTML+="<li id='"+b.lastChild.id+"'>"+b.lastChild.innerHTML+"</li>";b.lastChild.className=a+" IsLast"}}
function remove_list_item(a){if(a)cancel_bubble(a),e=a.currentTarget,a=e.parentNode.parentNode.className,a.indexOf("ExpandClosed")&&(a=a.replace(/ExpandClosed/g,"ExpandOpen")),e.parentNode.parentNode.className=a,a=e.parentNode.parentNode.childNodes[2],a.childNodes.length>1&&(a.removeChild(a.lastChild),a.lastChild.className+=" IsLast")}
function start_spin(a,b,c,f){a&&cancel_bubble(a);a=parseInt($("#spinbutton").val())+f;a>=b&&a<=c&&$("#spinbutton").val(a);timeoutSpin=setTimeout("run_spin("+b+","+c+","+f+")",500)}function run_spin(a,b,c){var f=parseInt($("#spinbutton").val())+c;f>=a&&f<=b&&$("#spinbutton").val(f);timeoutSpin=setTimeout("run_spin("+a+","+b+","+c+")",50)}function stop_spin(){clearTimeout(timeoutSpin)}
function generate_forms(a){var b=a.childNodes[2].textContent;if(b=="struct")return"";var c=":&nbsp";if(b=="list")c+="<img class='Image' src='/img/add.png' onmousedown='add_list_item(event)'>&nbsp",c+="<img class='Image' src='/img/remove.png' onmousedown='remove_list_item(event)'>&nbsp";else if(a.childNodes.length>3&&a.childNodes[3].tagName.indexOf("allowed")>=0)if(b=="string"||b=="char"){c+="<select name='"+a.firstChild.textContent+"' ";c+="onmousedown='cancel_bubble(event)'><option>&nbsp</option>";
for(b=0;b<a.childNodes[3].childNodes.length;b++)c+="<option value='"+a.childNodes[3].childNodes[b].firstChild.textContent+"'>",c+=a.childNodes[3].childNodes[b].lastChild.textContent,c+="</option>";c+="</select>"}else{var f=childByName(a.childNodes[3],"minimum")||childByName(a.childNodes[3],"min"),b=parseInt(f.textContent),f=childByName(a.childNodes[3],"maximum")||childByName(a.childNodes[3],"max"),g=parseInt(f.textContent),f=childByName(a.childNodes[3],"step"),a=parseInt(f.textContent);c+="<button onmousedown='start_spin(event,"+
b+","+g+","+(0-a)+")'";c+=" onmouseup='stop_spin()'> -"+a+" </button>";c+="<input id='spinbutton' type='text' readonly value='"+b+"' size='2'></input>";c+="<button onmousedown='start_spin(event,"+b+","+g+","+a+")'";c+=" onmouseup='stop_spin()'> +"+a+" </button>"}else{c+="<input size='20' type='text'";if(b.indexOf("int")>=0||b=="double")c+=" onkeypress='return digits_only(event)'";c+=">"}return c}
function build_actions(a){if(!check_xml(a))return $("#content").html(alarm_system_error),0;navigate=navigate.substring(0,navigate.indexOf(":",navigate.indexOf(":")+1))+": "+e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].textContent+": "+e.childNodes[0].textContent;$("#header").html(navigate);var b=$("actionList > action",a),c="<tr><td valign='top' width='390'>";b.length||(c+="\u042d\u0442\u043e\u0442 \u0441\u0435\u0440\u0432\u0438\u0441 \u043d\u0435 \u0438\u043c\u0435\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439");
for(var f=0;f<b.length;f++){c+="<table rules='none'><tr><td onmousedown='tree_toggle(arguments[0])'>";c+="<div><b>"+childByName(b.get(f),"name").textContent+"</b></div>";if(childByName(b.get(f),"argumentList")){c+="<ul class='Container'>";for(var g=b.eq(f).find("argument > direction").filter(function(){return $(this).text()=="IN"}).prev(),d=0;d<g.length;d++){for(var h=$("stateVariable > name",a).filter(function(){return $(this).text()==g.eq(d).text()}),i=0;i<h.length;i++)if(h.eq(i).text()==g.eq(d).text()){h=
h.eq(i).parent().get(0);break}if(!h.firstChild)return $("#content").html("\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439 "+g.eq(d).text()+", \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u043e\u0439 \u0432 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0438 "+childByName(b.get(f),"name").textContent),0;i=h.childNodes[2].textContent;c+="<li class='Node IsRoot";c+=i=="struct"||
i=="list"?" ExpandClosed":" ExpandLeaf";d+1==g.length&&(c+=" IsLast");c+="'><div class='Expand' id='"+i+"'></div><div class='Content' id='"+h.childNodes[0].textContent+"'>";c+=h.childNodes[1].textContent;c+="<br><font size='2'>"+h.childNodes[0].textContent+"</font>";c+=generate_forms(h);c+="</div>";if(i=="struct"||i=="list")c+=subtree(a,h.childNodes[0].textContent,h.childNodes[0].textContent);c+="</li>"}c+="</ul>"}c+="<button onmousedown=exec_action(event) id='"+e.id+"' name='"+childByName(b.get(f),
"name").textContent+"'>\u0412\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435</button></td>";c+="</tr></table><br>"}c+="</td><td valign='top' width='280' id='action_response'></td></tr>";$("#content").html(c);setTextFieldsVKAble()}
function get_action_inner_args(a){for(var b="",c=0;c<a.childNodes.length;c++){var f=a.childNodes[c].childNodes[1];a.childNodes[c].firstChild.id=="struct"?(b+="&"+f.id+"=struct_start",b+=get_action_inner_args(a.childNodes[c].childNodes[2]),b+="&"+f.id+"=struct_end"):a.childNodes[c].firstChild.id=="list"?(b+="&"+f.id+"=list_start",b+=get_action_inner_args(a.childNodes[c].childNodes[2]),b+="&"+f.id+"=list_end"):(b+="&"+f.id+"=",b+=f.lastChild.value||f.childNodes[5].value?f.lastChild.value||f.childNodes[5].value:
" ")}return b}
function exec_action(a){if(a)cancel_bubble(a),e=a.currentTarget;var a=e.name,b=e.id.substring(0,e.id.indexOf(":")),c=e.id.substring(e.id.indexOf(":")+1),f="";if(e.parentNode.childNodes.length>2)for(var g=e.parentNode.childNodes[1],d=0;d<g.childNodes.length;d++){var h=g.childNodes[d].childNodes[1];g.childNodes[d].firstChild.id=="struct"?(f+="&"+h.id+"=struct_start",f+=get_action_inner_args(g.childNodes[d].childNodes[2]),f+="&"+h.id+"=struct_end"):g.childNodes[d].firstChild.id=="list"?(f+="&"+h.id+
"=list_start",f+=get_action_inner_args(g.childNodes[d].childNodes[2]),f+="&"+h.id+"=list_end"):(f+="&"+h.id+"=",f+=h.lastChild.value||h.childNodes[5]&&h.childNodes[5].value?h.lastChild.value||h.childNodes[5].value:" ")}f==""&&(f="none");$("#action_response").html("<i>\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435.<br>\u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435...</i><img src='/img/big-ajax-loader.gif'>");ucsp_query(action_result,
e,b,c,a,f)}function action_result(a){$("#action_response").html("<textarea readonly cols=35 rows=20>"+a+"</textarea><br><button onmousedown=clear_action_response(event)>\u0417\u0430\u043a\u0440\u044b\u0442\u044c</button>")}function clear_action_response(a){if(a)cancel_bubble(a),e=a.currentTarget,e.parentNode.innerHTML=""};