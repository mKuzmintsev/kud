export function extra(a) {
  maplinked = null;
  a && cancel_bubble(a);
  $('#content').empty();
  $('#header').html(
    '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e'
  );
  a =
    "<tr><td class='background'><a href='#' onmousedown=firmware(event,'base')><span class='nav'>\u0431\u0430\u0437\u043e\u0432\u0430\u044f \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430</span></a></td></tr>";
  a +=
    "<tr><td class='background'><a href='#' onmousedown=firmware(event,'system')><span class='nav'>\u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u043d\u0430\u044f \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430</span></a></td></tr>";
  a +=
    "<tr><td class='background'><a href='#' onmousedown=firmware(event,'man')><span class='nav'>\u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430</span></a></td></tr>";
  a +=
    "<tr><td class='background'><a href='#' onmousedown=terminal(event)><span class='nav'>\u0442\u0435\u0440\u043c\u0438\u043d\u0430\u043b</span></a></td></tr>";
  a +=
    "<tr><td class='background'><a href='#' onmousedown=test_reports(event)><span class='nav'>\u043e\u0442\u0447\u0435\u0442\u044b \u0430\u0432\u0442\u043e\u0442\u0435\u0441\u0442\u043e\u0432</span></a></td></tr>";
  a +=
    "<tr><td class='background'><a href='#' onmousedown=get_test(event,'/test_list.xml',menu_test)><span class='nav'>\u0430\u0432\u0442\u043e\u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435</span></a></td></tr>";
  a +=
    "<tr><td class='background'><a href='#' onmousedown=ls_varlog(event)><span class='nav'>\u0436\u0443\u0440\u043d\u0430\u043b\u044b</span></a></td></tr>";
  $('#leftmenu').html(a);
}
function firmware(a, c) {
  a && cancel_bubble(a);
  download_type = c;
  timeoutVals && clearTimeout(timeoutVals);
  clearTimeout(timeoutErrors);
  running_query && running_query.abort();
  var b = '';
  c == 'man'
    ? (b =
        '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430')
    : c == 'base'
    ? (b =
        '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u0431\u0430\u0437\u043e\u0432\u0430\u044f \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430')
    : c == 'system' &&
      (b =
        '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u043d\u0430\u044f \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430');
  $('#header').html(b);
  b = "<tr><td><form id='firm_form' name='firm_form' method='POST' enctype='multipart/form-data'";
  b += " onsubmit=sendForm(this,'/cgi-bin/spo_uploader.cgi',uploadComplete)>";
  b += "<input type='text' value='" + download_type + "' name='type' style='display:none'>";
  c == 'man' &&
    ((b +=
      "<label>\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430: </label><input maxlength='100' type='text' size='45' name='title'><br><br>"),
    (b +=
      "<label>\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u0440\u0430\u0442\u043a\u043e\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0430:</label><br><textarea maxlength='1000' cols='90' rows='5' name='descr'></textarea><br><br>"));
  b +=
    "<label>\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u0439\u043b: </label><input type='file' name='firm_file'>";
  b += "<input type='submit' value='\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c'>";
  b += "</form><div id='upload'></div></td></tr>";
  $('#content').html(b);
  c != 'man'
    ? $.post('/cgi-bin/get_version.sh', download_type, show_version, 'text')
    : setTextFieldsVKAble();
}
function create_ifr() {
  var a = document.createElement('div'),
    c = "<iframe style='display:none' src='about:blank'";
  c += " id='firm_frame' name='firm_frame' onload=sendComplete('firm_frame')></iframe>";
  a.innerHTML = c;
  document.body.appendChild(a);
  return $('#firm_frame').get(0);
}
function sendForm(a, c, b) {
  var d = create_ifr();
  d.onSendComplete = function () {
    b(d);
  };
  a.setAttribute('target', d.id);
  a.setAttribute('action', c);
  a.submit();
  $('#upload').html(
    "<i>\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0444\u0430\u0439\u043b\u0430. \u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435...</i><img src='/img/big-ajax-loader.gif'>"
  );
}
function sendComplete(a) {
  a = document.getElementById(a);
  if (a.onSendComplete && typeof a.onSendComplete == 'function') a.onSendComplete();
}
function uploadComplete(a) {
  var c = a.contentDocument.body.firstChild.innerHTML;
  document.body.removeChild(document.body.lastChild);
  if (c)
    if (download_type == 'man') {
      var a = c.substring(0, c.indexOf('\n')),
        c = c.substring(c.indexOf('\n') + 1),
        b = c.substring(0, c.indexOf('\n')),
        c = c.substring(c.indexOf('\n') + 1),
        d = 'kernel=devs&uuid=CONFIG_' + mac + '&sid=4&action=ADD_MAN';
      d += '&FILE=struct_start&TITLE=' + a + '&DESCR=' + b + '&FILE_NAME=' + c + '&FILE=struct_end';
      $.post('/cgi-bin/spo_ucsp.cgi', d, add_man_result, 'xml');
    } else $.post('/cgi-bin/unpack.sh', download_type, unpack_res, 'text');
  else
    $('#upload').html(
      '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0444\u0430\u0439\u043b'
    );
}
function add_man_result(a) {
  check_xml(a) && $('fault', a).length > 0
    ? $('#upload').html($('fault', a).text())
    : $('#upload').empty();
}
function unpack_res(a) {
  a.indexOf('OK') != -1
    ? $('#upload').html(
        '\u0424\u0430\u0439\u043b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d'
      )
    : $('#upload').html(
        '\u0424\u0430\u0439\u043b \u043d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u0435\u043d'
      );
  $.post('/cgi-bin/get_version.sh', download_type, show_version, 'text');
}
function show_version(a) {
  var c = a.substring(a.indexOf('current') + 8),
    a = a.substring(0, a.indexOf('current') - 1),
    b = '';
  $('#upload').empty();
  c &&
    ((b +=
      '\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0430 \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430 \u0432\u0435\u0440\u0441\u0438\u0438 ' +
      c),
    (b +=
      '<button onmousedown=uninstall_firmware(event)>\u0423\u0434\u0430\u043b\u0438\u0442\u044c</button><br><br>'),
    $('#upload').append(b));
  a
    ? ((b =
        '\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430 \u0432\u0435\u0440\u0441\u0438\u0438 ' +
        a),
      (b +=
        '<button onmousedown=install_firmware(event)>\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c</button>'),
      $('#upload').append(b))
    : $('#upload').append(
        '\u041a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u0444\u0430\u0439\u043b \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0438 \u043d\u0435 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d'
      );
}
function uninstall_firmware(a) {
  a && cancel_bubble(a);
  $('#upload').html(
    "<i>\u0423\u0434\u0430\u043b\u044f\u0435\u0442\u0441\u044f \u0442\u0435\u043a\u0443\u0449\u0430\u044f \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430...</i><img src='/img/big-ajax-loader.gif'>"
  );
  $.post('/cgi-bin/uninstall.sh', download_type);
}
function install_firmware(a) {
  a && cancel_bubble(a);
  $('#content').html(
    "<i>\u0423\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0430...</i><img src='/img/big-ajax-loader.gif'>"
  );
  $.post('/cgi-bin/reboot.sh', download_type);
}
function terminal(a) {
  a && cancel_bubble(a);
  $('#header').html(
    '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u0442\u0435\u0440\u043c\u0438\u043d\u0430\u043b'
  );
  a =
    "<tr><td><input type='text' size='65' name='title'>&nbsp<button onmousedown='exec(event)'>\u0412\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c</button><br>";
  a +=
    '<font size=2><i>(\u0435\u0441\u043b\u0438 \u0432\u044b\u0432\u043e\u0434 \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043f\u0440\u0435\u0432\u044b\u0441\u0438\u0442 100000 \u0437\u043d\u0430\u043a\u043e\u0432, \u0435\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u0431\u0443\u0434\u0435\u0442 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043e)</i></font><br>';
  a += "<textarea readonly cols='88' rows='33' wrap='off'></textarea></td></tr>";
  $('#content').html(a);
  setTextFieldsVKAble();
}
var req;
function exec(a) {
  a && cancel_bubble(a);
  req && req.abort();
  req = null;
  is_req_aborted = false;
  window.XMLHttpRequest && (req = new XMLHttpRequest());
  req || (req = new ActiveXObject('Msxml2.XMLHTTP'));
  req || (req = new ActiveXObject('Microsoft.XMLHTTP'));
  if (req)
    req.open('POST', '/cgi-bin/ssh.sh', true),
      (req.onreadystatechange = processReqChange),
      req.send($('#content input').val()),
      ($('#content textarea').get(0).value =
        '\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u043e\u0442\u0432\u0435\u0442\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430...');
}
function processReqChange() {
  if (!is_req_aborted && (req.readyState == 4 || req.responseText.length > 1e5))
    ($('#content textarea').get(0).value = req.responseText), (is_req_aborted = true), req.abort();
}
function get_test(a, c, b, d) {
  a && cancel_bubble(a);
  d ? $.ajax({ url: c, type: 'GET', dataType: 'xml', success: b, error: d }) : $.get(c, b, 'xml');
}
function rem_kuev(a) {
  var c = a.substring(0, a.indexOf(' ')),
    c = c.substring(c.indexOf('kernel-') + 7),
    c = c.substring(0, c.indexOf('/')),
    a = a.substring(a.indexOf(' ') + 1);
  a == ''
    ? $('#content').html(
        '<font>\u041a\u0423\u042d\u0412 \u043d\u0435 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d</font>'
      )
    : ((kuev_path = 'kernel=' + c + '&uuid=' + a + '&sid=2'),
      builder
        ? build_autotest()
        : ((c =
            '<font>\u041a\u0423\u042d\u0412 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d! UUID: ' +
            a +
            '</font><br><font color=red size=4>\u0412\u041d\u0418\u041c\u0410\u041d\u0418\u0415: '),
          (c +=
            '\u041f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430 \u043a \u0442\u0435\u0441\u0442\u0430\u043c \u0431\u0443\u0434\u0443\u0442 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u044b \u0432\u0441\u0435 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432.<br>'),
          (c +=
            '\u041f\u043e\u0441\u043b\u0435 \u043e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u044f \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u041a\u0423\u0414 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043a\u043d\u043e\u043f\u043a\u0438 \u043d\u0438\u0436\u0435.</font><br><br>'),
          (c +=
            '<button onclick=reboot()><font size=4>\u041f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c</font></button>'),
          $('#content').html(c),
          (c = kuev_path.replace(/sid=2/, 'sid=1&MAP=')),
          $.post('/cgi-bin/spo_ucsp.cgi', c, function (a) {
            maplinked = $('MAP > list', a);
          })));
}
function menu_test(a) {
  $('#header').html(
    '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u0430\u0432\u0442\u043e\u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435'
  );
  builder = 0;
  $.post('/cgi-bin/spo_ucsp.cgi', 'deviceType=SMEC', rem_kuev, 'text');
  a = $('test_list > test', a);
  if (a.length) {
    var c = $(
      "#leftmenu > tbody > tr > td:contains('\u0430\u0432\u0442\u043e\u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435')"
    );
    if (c.children('table').length > 0) c.children('table').remove();
    else {
      for (
        var b = '<table><tr><td><table><tr><td>&nbsp</td></tr></table></td><td><table>', d = 0;
        d < a.length;
        d++
      )
        (b += "<tr><td class='background'><a href='#' onmousedown=get_test(event,'"),
          (b += a.eq(d).children('fname').text() + "',nav_test)><span class='nav'>"),
          (b += a.eq(d).children('title').text() + '</span></a></td></tr>');
      b += '</table></td></tr></table>';
      c.html(c.html() + b);
    }
  }
}
function test_reports(a) {
  a && cancel_bubble(a);
  $('#header').html(
    '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u043e\u0442\u0447\u0435\u0442\u044b \u0430\u0432\u0442\u043e\u0442\u0435\u0441\u0442\u043e\u0432'
  );
  $.get(
    '/cgi-bin/ls_reports.sh',
    function (a) {
      for (items = '<tr><td>'; a.substring(0, 1) == '\n'; ) a = a.substring(1);
      for (; a.indexOf('\n') != -1; ) {
        var b = a.substring(0, a.indexOf('\n'));
        items += "<a href='#' onmousedown=cat_report(event,'" + b + "')>" + b + '</a><br><br>';
        a = a.substring(a.indexOf('\n') + 1);
      }
      items += '</td></tr>';
      $('#content').html(items);
    },
    'text'
  );
}
function cat_report(a, c) {
  a && cancel_bubble(a);
  $.post(
    '/cgi-bin/cat_report.sh',
    c,
    function (a) {
      $('#content').html(a);
    },
    'text'
  );
}
function click_auto(a) {
  a && cancel_bubble(a);
  $('#is_autotest').click();
}
function nav_test(a) {
  stop_test();
  if (
    $('#content')
      .text()
      .indexOf(
        '\u041a\u0423\u042d\u0412 \u043d\u0435 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d'
      ) == -1
  )
    check_xml(a)
      ? $('test', a).length
        ? ($.post('/cgi-bin/ssh.sh', '/mnt/cf/system/framework.sh stop'),
          (xmlTestGroup = a),
          (testResult = {}),
          (a = $('head > title', xmlTestGroup).text()),
          (testResult.title = a),
          (testResult.test = []),
          (tests = $('test', xmlTestGroup)),
          (a =
            "<tr><td colspan=2 align='center'><font size=4><b>" +
            a +
            '</b></font><br><br></td></tr>'),
          (a += "<tr><td id='navigate' width=230px></td>"),
          (a +=
            "<td align='right' valign='center'><button onmousedown=finish_tests(event)><font size=3>\u0421\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442</font></button></td></tr>"),
          (a +=
            "<tr><td><br><input type=checkbox id='is_autotest'><font onmousedown='click_auto(event)' size=4>\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438</font></td><td></td></tr>"),
          (a += "<tr><td><hr width=673px></td></tr><tr><td id='cur_test'></td></tr>"),
          $('#content').html(a),
          (a =
            '<font>\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e \u0442\u0435\u0441\u0442\u0430:</font><br>'),
          (a += '<button><font size=4><<</font></button>&nbsp&nbsp'),
          (a += '<button><font size=4><</font></button>&nbsp&nbsp'),
          (a += "<input readonly type='text' size=4>&nbsp&nbsp"),
          (a += '<button><font size=4>></font></button>&nbsp&nbsp'),
          (a += '<button><font size=4>>></font></button>'),
          $('#navigate').html(a),
          (index = 0),
          $('#navigate button:first').bind('mousedown', function () {
            stop_test();
            index = 0;
            $('#navigate input').val(
              tests.eq(index).children('number').text() + '/' + tests.length
            );
            $('#navigate input').attr('name', index);
            gen_test();
          }),
          $('#navigate button:last').bind('mousedown', function () {
            stop_test();
            index = tests.length - 1;
            $('#navigate input').val(
              tests.eq(index).children('number').text() + '/' + tests.length
            );
            $('#navigate input').attr('name', index);
            gen_test();
          }),
          $('#navigate button')
            .eq(1)
            .bind('mousedown', function () {
              stop_test();
              index = parseInt($('#navigate input').attr('name')) - 1;
              index < 0 && (index = 0);
              $('#navigate input').val(
                tests.eq(index).children('number').text() + '/' + tests.length
              );
              $('#navigate input').attr('name', index);
              gen_test();
            }),
          $('#navigate button').eq(2).bind('mousedown', next_test),
          $('#navigate input').val(tests.eq(index).children('number').text() + '/' + tests.length),
          $('#navigate input').attr('name', index),
          gen_test())
        : $('#content').html(
            '\u0412 \u0433\u0440\u0443\u043f\u043f\u0435 \u043d\u0435\u0442 \u0442\u0435\u0441\u0442\u043e\u0432'
          )
      : $('#content').html(
          '<font>\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0435 xml-\u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0433\u0440\u0443\u043f\u043f\u044b \u0442\u0435\u0441\u0442\u043e\u0432</font>'
        );
}
function gen_test() {
  var a = $('test', xmlTestGroup).eq(index),
    c =
      '<table width=673px><tbody><tr><td><font size=3><b>' +
      a.children('number').text() +
      '.&nbsp' +
      a.children('title').text() +
      '</b></font>';
  c += '<br><br><font>' + a.children('question').text() + '</font><br><br></td>';
  c +=
    "<td valign='top' align='right' width=175px><button onmousedown=prepare_test(event,'" +
    index +
    "') id='start_test' style='background: lightgreen'>";
  c += '<font size=4>\u0421\u0422\u0410\u0420\u0422</font></button>&nbsp&nbsp';
  c +=
    "<button onmousedown=stop_test(event) disabled='disabled' id='stop_test'><font size=4>\u0421\u0422\u041e\u041f</font></button>";
  c += '</td></tr>';
  c += "<tr><td colspan=2 id='test_progress'></td></tr>";
  $('#cur_test').html(c);
  $('#is_autotest').prop('checked') && prepare_test();
}
function stop_test(a) {
  a && cancel_bubble(a);
  testResult &&
    testResult.test[index] &&
    testResult.test[index].indexOf(
      '\u0422\u0435\u0441\u0442 \u043f\u0440\u043e\u0439\u0434\u0435\u043d'
    ) == -1 &&
    testResult.test[index].indexOf(
      '\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d'
    ) == -1 &&
    testResult.test[index].indexOf(
      '\u0422\u0435\u0441\u0442 \u043f\u0440\u0435\u0440\u0432\u0430\u043d'
    ) == -1 &&
    (testResult.test[index] +=
      '</td><td>\u0422\u0435\u0441\u0442 \u043f\u0440\u0435\u0440\u0432\u0430\u043d</td></tr>');
  running_kuev_test && running_kuev_test.abort();
  clearTimeout(running_kuev_timeout);
  $('#start_test').removeAttr('disabled');
  $('#stop_test').attr('disabled', 'disabled');
  $('#cur_test button:first').attr('style', 'background: lightgreen');
}
function send_action_test(a) {
  for (var c = kuev_path + '&action=setData&DATA_LIST=list_start', b = 0; b < a.length; b++)
    (c += '&DATA=struct_start'),
      (c += '&NAME=' + a.eq(b).children('NAME').text()),
      (c += '&VALUE=' + a.eq(b).children('VALUE').text()),
      (c += '&DATA=struct_end');
  c += '&DATA_LIST=list_end';
  running_kuev_test = $.ajax({ url: '/cgi-bin/spo_ucsp.cgi', type: 'POST', data: c });
}
function check_vars_test(a) {
  for (var c = kuev_path, b = 0; b < output_list.length; b++)
    c += '&' + output_list.eq(b).children('NAME').text() + '= ';
  running_kuev_test = $.ajax({
    url: '/cgi-bin/spo_ucsp.cgi',
    type: 'POST',
    data: c,
    dataType: 'xml',
    success: a,
  });
}
function prepare_test(a) {
  a && cancel_bubble(a);
  if (!testResult.start_time)
    testResult.start_time = $('#dt')
      .html()
      .replace(/<b>/g, '')
      .replace(/<\/b><br>/g, ' ');
  $('#start_test').attr('disabled', 'disabled');
  $('#stop_test').removeAttr('disabled');
  $('#cur_test button:first').removeAttr('style');
  a = $('test', xmlTestGroup).eq(index);
  a = $(a.children('pre_test').text(), xmlTestGroup);
  if (a.length) {
    output_list = a.find('output_list > var');
    var c = '5';
    a.children('timeout').length && (c = a.children('timeout').text());
    $('#test_progress').html(
      '\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u043a \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e.<br>\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432 \u0447\u0435\u0440\u0435\u0437 ' +
        c +
        ' \u0441\u0435\u043a.<br>'
    );
    a.find('input_list').length && send_action_test(a.find('input_list > var'));
    running_kuev_timeout = setTimeout('check_vars_test(run_test)', 1e3 * c);
  } else run_test();
}
function res_error_test(a) {
  var c = true;
  if (!a) return c;
  var b = check_xml(a);
  if ($('fault', a).length > 0 || !b)
    return (
      (c = "<br><font color='red'>\u041e\u0448\u0438\u0431\u043a\u0430: "),
      (c += b
        ? $('fault > detail', a).text()
        : '\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u044b \u043d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435'),
      $('#test_progress').append(
        c +
          '<br><br>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d.</font>'
      ),
      (testResult.test[index] +=
        c +
        '</font></td><td>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d</td></tr>'),
      stop_test(),
      false
    );
  for (b = 0; b < output_list.length; b++) {
    var d = output_list.eq(b).children('NAME').text(),
      e =
        $('body > stateVariable > ' + d, a)
          .find('DATA')
          .text() || 'null',
      f =
        $('body > stateVariable > ' + d, a)
          .find('STATUS')
          .text() || 'null',
      d = output_list.eq(b).children('VALUE').text();
    if (d != e || output_list.eq(b).children('STATUS').text() != f)
      if (((f = output_list.eq(b).children('RANGE')), f.length > 0)) {
        if (
          ((f = parseFloat(f.text())),
          (val_parsed = parseFloat(e)),
          isNaN(f) || isNaN(val_parsed) || d > val_parsed + f || d < val_parsed - f)
        )
          c = false;
      } else c = false;
    else output_list.eq(b).empty();
    console.log(c);
  }
  e = kuev_path + '&type=FIND';
  if (!c) {
    for (b = 0; b < output_list.length; b++)
      output_list.eq(b).text() != '' &&
        (e += '&' + output_list.eq(b).children('NAME').text() + '= ');
    $.post(
      '/cgi-bin/spo_ucsp.cgi',
      e,
      function (c) {
        if ($('fault', c).length > 0) {
          var b =
            "<br><font color='red'>\u041e\u0448\u0438\u0431\u043a\u0430: " +
            $('fault > detail', c).text();
          $('#test_progress').append(
            b +
              '<br><br>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d.</font>'
          );
          testResult.test[index] +=
            b +
            '</font></td><td>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d</td></tr>';
        } else {
          for (var d = 0; d < output_list.length; d++)
            if (output_list.eq(d).text() != '') {
              var f = output_list.eq(d).children('NAME').text(),
                e = output_list.eq(d).children('VALUE').text(),
                h = output_list.eq(d).children('STATUS').text(),
                b = $('body > stateVariable > ' + f, a),
                i = b.find('DATA').text() || 'null',
                j = b.find('STATUS').text() || 'null',
                k = $('service > stateVariable > name', c)
                  .filter(function () {
                    return $(this).text() == f;
                  })
                  .next()
                  .text(),
                b = "<br><font color='red'>",
                g = maplinked
                  .find('VARNAME')
                  .filter(function () {
                    return $(this).text() == f;
                  })
                  .parent();
              b += k + ' (\u041a\u041c\u0420 ' + g.children('KMR').text();
              b += ', \u041c\u0420 ' + g.children('MR').text();
              b += ', \u0441\u0438\u0433\u043d\u0430\u043b ' + g.children('SIGNAL').text() + '):';
              e != i &&
                (b +=
                  '<br>&nbsp&nbsp&nbsp&nbsp\u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 ' +
                  i +
                  ' (\u043e\u0436\u0438\u0434\u0430\u043b\u043e\u0441\u044c ' +
                  e +
                  ')');
              h != j &&
                (b +=
                  '<br>&nbsp&nbsp&nbsp&nbsp\u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 ' +
                  j +
                  ' (\u043e\u0436\u0438\u0434\u0430\u043b\u043e\u0441\u044c ' +
                  h +
                  ')');
              b += '</font>';
              $('#test_progress').append(b);
              testResult.test[index] += b;
            }
          pretest_running
            ? $('#test_progress').append(
                "<br><br><font color='red'>\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u043a \u0442\u0435\u0441\u0442\u0443 \u043d\u0435 \u0443\u0434\u0430\u043b\u0430\u0441\u044c.<br><br>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d.</font>"
              )
            : ($('#test_progress').append(
                "<br><br><font color='red'>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d.</font>"
              ),
              (testResult.test[index] +=
                '</td><td>\u0422\u0435\u0441\u0442 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d</td></tr>'));
        }
        stop_test();
      },
      'xml'
    );
  }
  return c;
}
function run_test(a) {
  var c = $('test', xmlTestGroup).eq(index).clone(),
    b = $('#navigate input').val();
  testResult.test[index] =
    '<tr><td>' + b.substring(0, b.indexOf('/')) + '</td><td>' + c.children('title').text();
  output_list = c.find('output_list > var');
  pretest_running = true;
  if (res_error_test(a)) {
    b = '5';
    c.children('timeout').length && (b = c.children('timeout').text());
    var d = '';
    a &&
      (d +=
        "<font color='green'>\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430 \u0443\u0441\u043f\u0435\u0448\u043d\u043e.</font><br><br>");
    d +=
      '\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0442\u0435\u0441\u0442.<br>';
    d +=
      '\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432 \u0447\u0435\u0440\u0435\u0437 ' +
      b +
      ' \u0441\u0435\u043a.<br>';
    a ? $('#test_progress').append(d) : $('#test_progress').html(d);
    c.find('input_list').length && send_action_test(c.find('input_list > var'));
    running_kuev_timeout = setTimeout('check_vars_test(check_res_test)', 1e3 * b);
  }
}
function check_res_test(a) {
  pretest_running = false;
  res_error_test(a) &&
    ($('#test_progress').append(
      "<br><font color='green'>\u0422\u0435\u0441\u0442 \u043f\u0440\u043e\u0439\u0434\u0435\u043d \u0443\u0441\u043f\u0435\u0448\u043d\u043e!</font>"
    ),
    (testResult.test[index] +=
      '</td><td>\u0422\u0435\u0441\u0442 \u043f\u0440\u043e\u0439\u0434\u0435\u043d</td></tr>'),
    stop_test(),
    index != $('test', xmlTestGroup).length - 1
      ? ($('#test_progress').append(
          '<br><br><button onmousedown=next_test(event)><font size=4>\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0442\u0435\u0441\u0442</font></button>'
        ),
        $('#is_autotest').prop('checked') && next_test())
      : $('#is_autotest').prop('checked') && finish_tests());
}
function next_test(a) {
  a && cancel_bubble(a);
  stop_test();
  index = parseInt($('#navigate input').attr('name')) + 1;
  index == tests.length && (index = tests.length - 1);
  $('#navigate input').val(tests.eq(index).children('number').text() + '/' + tests.length);
  $('#navigate input').attr('name', index);
  gen_test();
}
function finish_tests(a) {
  a && cancel_bubble(a);
  if (testResult.test.length > 0) {
    stop_test();
    testResult.finish_time = $('#dt')
      .html()
      .replace(/<b>/g, '')
      .replace(/<\/b><br>/g, ' ');
    a =
      '<tr><td>\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f: ' +
      testResult.title +
      '<br>';
    a +=
      '\u0412\u0440\u0435\u043c\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f: ' +
      testResult.start_time +
      '<br>';
    a +=
      '\u0412\u0440\u0435\u043c\u044f \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u044f \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f: ' +
      testResult.finish_time +
      '<br><br>';
    a +=
      '<table border=1><tr><th>\u2116</th><th>\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435</th><th>\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442</th></tr>';
    for (var c = 0; c < testResult.test.length; c++)
      testResult.test[c] && (a += testResult.test[c]);
    a += '</table></td></tr>';
    $('#content').html(a);
    $.post(
      '/cgi-bin/save_report.sh',
      a,
      function (a) {
        $('#content').append(
          '<br>\u0418\u043c\u044f \u0444\u0430\u0439\u043b\u0430 \u0441 \u043e\u0442\u0447\u0435\u0442\u043e\u043c: ' +
            a
        );
      },
      'text'
    );
  }
}
function test_builder(a) {
  a && cancel_bubble(a);
  a = $(
    "#leftmenu > tbody > tr > td:contains('\u0440\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u0430\u0432\u0442\u043e\u0442\u0435\u0441\u0442\u043e\u0432')"
  );
  if (a.children('table').length > 0) a.children('table').remove();
  else {
    var c = '<table><tr><td><table><tr><td>&nbsp</td></tr></table></td><td><table>';
    c += "<tr><td class='background'><a href='#' onmousedown=build_autogroup(event)>";
    c +=
      "<span class='nav'>\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443</span></a></td></tr>";
    c += "<tr><td class='background'><a href='#' onmousedown=find_kuev(event)>";
    c +=
      "<span class='nav'>\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u0435\u0441\u0442/\u043f\u0440\u0435\u0442\u0435\u0441\u0442</span></a></td></tr>";
    c += "<tr><td class='background'><a href='#' onmousedown=rm_test_menu(event)>";
    c +=
      "<span class='nav'>\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443/\u0442\u0435\u0441\u0442</span></a></td></tr>";
    c += '</table></td></tr></table>';
    a.html(a.html() + c);
  }
}
function build_autogroup(a) {
  a && cancel_bubble(a);
  a = '<tr><td>';
  a +=
    "<br>\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0433\u0440\u0443\u043f\u043f\u044b \u0442\u0435\u0441\u0442\u043e\u0432:<br><input type='text' size='50'>";
  a +=
    "<br><br>\u0418\u043c\u044f \u0444\u0430\u0439\u043b\u0430:<br><input type='text' size='50'>";
  a +=
    "<br><br><button onmousedown='create_group(event)'><font size=4>\u0421\u043e\u0437\u0434\u0430\u0442\u044c</font</button>";
  a += '</td></tr><tr><td></td></tr>';
  $('#content').html(a);
  setTextFieldsVKAble();
}
function create_group(a) {
  a && cancel_bubble(a);
  var a = $('#content input:last').val(),
    c = $('#content input:first').val();
  a == '' || c == ''
    ? $('#content tr:last td').html(
        '<br><font size=2 color=red>\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u043f\u043e\u043b\u044f</font>'
      )
    : a.indexOf('\x00') != -1 || a.indexOf('/') != -1 || a.length > 255
    ? $('#content tr:last td').html(
        "<br><font size=2 color=red>\u0418\u043c\u044f \u0444\u0430\u0439\u043b\u0430 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u0442\u044c \u0441\u0438\u043c\u0432\u043e\u043b\u044b '\\0' \u0438 '/', \u0430 \u0442\u0430\u043a\u0436\u0435 \u0438\u043c\u0435\u0442\u044c \u0434\u043b\u0438\u043d\u0443 \u0431\u043e\u043b\u044c\u0448\u0435 255 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432</font>"
      )
    : $.post(
        '/cgi-bin/add_testgroup.sh',
        c + '/' + a + '.xml',
        function (a) {
          a.indexOf('OK') != -1
            ? $('#content tr:last td').html(
                "<br><font size=4 color='green'>\u0413\u0440\u0443\u043f\u043f\u0430 \u0442\u0435\u0441\u0442\u043e\u0432 \u0441\u043e\u0437\u0434\u0430\u043d\u0430!</font>"
              )
            : $('#content tr:last td').html(
                "<br><font size=4 color='red'>\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0438 \u0433\u0440\u0443\u043f\u043f\u044b \u0442\u0435\u0441\u0442\u043e\u0432.</font>"
              );
        },
        'text'
      );
}
function find_kuev() {
  $('#content').html('<tr><td>' + ajax_waiter + '</td></tr>');
  builder = 1;
  $.post('/cgi-bin/spo_ucsp.cgi', 'deviceType=SMEC', rem_kuev, 'text');
}
function build_autotest(a) {
  a && cancel_bubble(a);
  $('#content').html('<tr><td>' + ajax_waiter + '</td></tr>');
  $.post(
    '/cgi-bin/spo_ucsp.cgi',
    kuev_path,
    function (a) {
      var b = '<tr><td width=340px>';
      b +=
        "\u0421\u043e\u0437\u0434\u0430\u0442\u044c <input type='radio' name='type' value='test' checked id='istest'>\u0442\u0435\u0441\u0442 ";
      b +=
        "<input type='radio' name='type' value='pretest'>\u043f\u0440\u0435\u0442\u0435\u0441\u0442";
      b += "<table cellspacing=0 cellpadding=0 class='border_table'>";
      b += '<th><font size=2>\u0421\u0438\u0433\u043d\u0430\u043b</font></th>';
      b += '<th><font size=2>input list</font></th>';
      b += '<th><font size=2>output list</font></th>';
      for (var a = $('serviceStateTable > stateVariable', a), d = 1; d < a.length; d++) {
        var e = a
          .eq(d)
          .find('struct > stateVariable > name:contains(DATA)')
          .parent()
          .children('dataType')
          .text();
        b += "<tr><td style='word-wrap: break-word; display: block; width: 260px'>";
        b += "<font size=2 data-type='" + e + "'>" + a.eq(d).children('name').text() + '<br>';
        b += a.eq(d).children('friendlyName').text() + '</font></td>';
        b +=
          "<td align='center' onmousedown=change_vars_list(event,this,1)><img src='/img/add.png'></td>";
        b +=
          "<td align='center' onmousedown=change_vars_list(event,this,0)><img src='/img/add.png'></td></tr>";
      }
      b += "</table></td><td width=8></td><td valign='top' width=325><br>";
      b += "<table  class='border_table' id='input_table' cellspacing=0 cellpadding=0>";
      b += '<th><font size=2>input list</font></th><th><font size=2>value</font></th></table>';
      b += "<br><br><table class='border_table' id='output_table' cellspacing=0 cellpadding=0>";
      b +=
        '<th><font size=2>output list</font></th><th><font size=2>value</font></th></table><br><br>';
      b +=
        "<font size=2>\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u0441\u0442\u0430/\u043f\u0440\u0435\u0442\u0435\u0441\u0442\u0430:&nbsp</font><textarea cols='42' rows='2' id='test_title'></textarea><br><br>";
      b +=
        "<font size=2>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f (\u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0442\u0435\u0441\u0442\u0430):&nbsp</font><textarea cols='42' rows='5' id='test_question'></textarea><br><br>";
      b +=
        '<font size=2>\u0412\u0440\u0435\u043c\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0438 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430 \u0442\u0435\u0441\u0442\u0430 (\u0441\u0435\u043a.):&nbsp</font>';
      b += '<br><button onmousedown=start_spin(event,1,300,-1)';
      b += ' onmouseup=stop_spin() onmouseout=stop_spin()> -1 </button>';
      b += "<input id='spinbutton' type='text' readonly value='1' size='2'></input>";
      b += '<button onmousedown=start_spin(event,1,300,1)';
      b += ' onmouseup=stop_spin() onmouseout=stop_spin()> +1 </button>';
      b += '</td></tr>';
      $('#content').html(b);
      $('#input_table, #output_table').css('visibility', 'hidden');
      setTextFieldsVKAble();
      $.post(
        '/cgi-bin/ssh.sh',
        'ls /mnt/cf/base/web/tests/',
        function (a) {
          var a = clear_cr(a),
            c =
              "<br><br><font size=2>\u0413\u0440\u0443\u043f\u043f\u0430 \u0442\u0435\u0441\u0442\u043e\u0432: </font><select id='test_group'>",
            b = a.substring(0, a.indexOf('\n')),
            a = a.substring(a.indexOf('\n') + 1);
          c += '<option selected>' + b + '</option>';
          b = a.substring(0, a.indexOf('\n'));
          for (a = a.substring(a.indexOf('\n') + 1); b; )
            (c += '<option>' + b + '</option>'),
              (b = a.substring(0, a.indexOf('\n'))),
              (a = a.substring(a.indexOf('\n') + 1));
          c += "</select><div id='pretest_selector'></div>";
          $('#content > tbody > tr > td:last').append(c);
          $('#test_group').change(find_pretest);
          $('#content > tbody > tr > td:last').append(
            "<br><br><button onmousedown=add_test()><font size=3>\u0421\u043e\u0437\u0434\u0430\u0442\u044c</font></button><br><div id='hint'></div>"
          );
        },
        'text'
      );
    },
    'xml'
  );
}
function find_pretest() {
  $('#pretest_selector').empty();
  $('#test_group').val().length &&
    $.get(
      '/tests/' + $('#test_group').val(),
      function (a) {
        a = $('testlist > *:not(head, test)', a);
        console.log(a);
        if (a.length > 0) {
          items =
            '<br><font size=2>\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0440\u0435\u0442\u0435\u0441\u0442 (\u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u0442\u0435\u0441\u0442\u043e\u0432): </font><select>';
          items += '<option selected></option>';
          for (var c = 0; c < a.length; c++) items += '<option>' + a.get(c).tagName + '</option>';
          items += '</select>';
          $('#pretest_selector').html(items);
        }
      },
      'xml'
    );
}
function change_vars_list(a, c, b) {
  a && cancel_bubble(a);
  var a = c.parentNode.firstChild.firstChild.innerHTML,
    d = c.parentNode.firstChild.firstChild.getAttribute('data-type'),
    a = a.substring(0, a.indexOf('<')),
    e = c.firstChild.src,
    e = e.substring(e.indexOf('8080') + 4);
  e == '/img/add.png'
    ? ((c.firstChild.src = '/img/remove.png'),
      (c = "<tr><td style='word-wrap: break-word; display: block; width: 239px'>"),
      (c += '<font size=2>' + a + '</font></td><td>'),
      d == 'string'
        ? (c += '<select><option selected>ON</option><option>OFF</option></select>')
        : d == 'double' &&
          ((c += "<input type='text' size='"),
          (c += b ? "6'>" : "1'>&#177;<input type='text' size='1'>")),
      (c += '</td></tr>'),
      b
        ? ($('#input_table').append(c),
          (b = $('#input_table tr:last input')),
          b.length > 0 && add_custom_vk(b),
          $('#input_table tr').length == 2 && $('#input_table').css('visibility', 'visible'))
        : ($('#output_table').append(c),
          (b = $('#output_table tr:last input')),
          b.length > 0 && add_custom_vk(b),
          $('#output_table tr').length == 2 && $('#output_table').css('visibility', 'visible')))
    : ((c.firstChild.src = '/img/add.png'),
      b
        ? ($("#input_table td > font:contains('" + a + "')")
            .not(":has(:contains('" + a + "'))")
            .parent()
            .parent()
            .remove(),
          $('#input_table tr').length == 1 && $('#input_table').css('visibility', 'hidden'))
        : ($("#output_table td > font:contains('" + a + "')")
            .not(":has(:contains('" + a + "'))")
            .parent()
            .parent()
            .remove(),
          $('#output_table tr').length == 1 && $('#output_table').css('visibility', 'hidden')));
}
function add_test(a) {
  a && cancel_bubble(a);
  if ((a = $('#test_group').val())) {
    var c = $('#istest').is(':checked');
    param = '';
    if (c) param += '<test><title>' + $('#test_title').val() + '</title>';
    else {
      if ($('#test_title').val() == '') {
        $('#hint').html(
          '<font size=2 color=red>\u041d\u0435 \u0437\u0430\u0434\u0430\u043d\u043e \u0438\u043c\u044f \u043f\u0440\u0435\u0442\u0435\u0441\u0442\u0430</font>'
        );
        return;
      }
      param += '<' + $('#test_title').val().replace(/ /g, '_') + '>';
    }
    c &&
      $('#pretest_selector select').length > 0 &&
      $('#pretest_selector select').val().length > 0 &&
      (param += '<pre_test>' + $('#pretest_selector select').val() + '</pre_test>');
    c && (param += '<number>00</number>');
    c &&
      $('#test_question').val() != '' &&
      (param += '<question>' + $('#test_question').val() + '</question>');
    param += '<timeout>' + $('#spinbutton').val() + '</timeout>';
    param += '<input_list>';
    for (var b = $('#input_table tr'), d = 1; d < b.length; d++) {
      var e = '',
        e =
          b.eq(d).find('td > select').length > 0
            ? b.eq(d).find('td > select').val()
            : 1 * b.eq(d).find('td > input').val();
      param += '<var><NAME>' + b.eq(d).find('td > font').text() + '</NAME>';
      param += '<VALUE>' + e + '</VALUE></var>';
    }
    param += '</input_list>';
    param += '<output_list>';
    b = $('#output_table tr');
    for (d = 1; d < b.length; d++) {
      var f = (e = '');
      b.eq(d).find('td > select').length > 0
        ? (e = b.eq(d).find('td > select').val())
        : ((e = 1 * b.eq(d).find('td > input:first').val()),
          (f = 1 * b.eq(d).find('td > input:last').val()));
      param += '<var><NAME>' + b.eq(d).find('td > font').text() + '</NAME>';
      param += '<VALUE>' + e + '</VALUE>';
      f > 0 && (param += '<RANGE>' + f + '</RANGE>');
      param += '<STATUS>NORMAL</STATUS></var>';
    }
    param += '</output_list>';
    param += c ? '</test>/' : '</' + $('#test_title').val().replace(/ /g, '_') + '>/';
    param += a;
    $.post(
      '/cgi-bin/add_test.sh',
      param,
      function (a) {
        a.indexOf('OK') != -1
          ? c
            ? $('#hint').html(
                "<br><font size=4 color='green'>\u0422\u0435\u0441\u0442 \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d!</font>"
              )
            : $('#hint').html(
                "<br><font size=4 color='green'>\u041f\u0440\u0435\u0442\u0435\u0441\u0442 \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d!</font>"
              )
          : c
          ? $('#hint').html(
              "<br><font size=4 color='red'>\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0438 \u0442\u0435\u0441\u0442\u0430.</font>"
            )
          : $('#hint').html(
              "<br><font size=4 color='red'>\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0438 \u043f\u0440\u0435\u0442\u0435\u0441\u0442\u0430.</font>"
            );
      },
      'text'
    );
  } else
    $('#hint').html(
      '<font size=2 color=red>\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u0430 \u0433\u0440\u0443\u043f\u043f\u0430 \u0442\u0435\u0441\u0442\u043e\u0432</font>'
    );
}
function rm_test_menu(a) {
  a && cancel_bubble(a);
  $('#content').html(
    "<div class='test_select'></div><div class='test_split'>&nbsp</div><div class='test_select'></div>"
  );
  get_test(null, '/test_list.xml', get_group_list);
}
function get_group_list(a) {
  a = $('test_list > test', a);
  if (a.length) {
    var c = "<select size='15'></select><br><br>";
    c += '<textarea readonly></textarea>';
    c +=
      "<div class='delete_button' onmousedown=delete_test(event,1)>\u0423\u0434\u0430\u043b\u0438\u0442\u044c</div>";
    $('#content .test_select:first').html(c);
    c = c.replace(/\(1\)/, '()');
    $('#content .test_select:last').html(c);
    for (var c = '', b = 0; b < a.length; b++)
      (c += "<option value='" + a.eq(b).children('fname').text() + "'>"),
        (c += a.eq(b).children('title').text() + '</option>');
    $('#content .test_select:first > select').html(c);
    $('#content .test_select:first > select').change(function () {
      var a = $(this).find(':selected');
      $('#content .test_select:first > textarea').html(a.text() + ' (' + a.val() + ')');
      get_test(null, a.val(), get_test_list, clear_test_list);
    });
    $('#content .test_select:last > select').change(function () {
      var a = $(this).find(':selected');
      $('#content .test_select:last > textarea').html(a.text());
    });
  } else
    $('#content').html(
      '\u0422\u0435\u0441\u0442\u043e\u0432 \u043d\u0435 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d\u043e'
    );
}
function delete_test(a, c) {
  a && cancel_bubble(a);
  var b = '.delete_button:';
  b += c ? 'first' : 'last';
  var b = $(b).prev().text(),
    d = '\u0423\u0434\u0430\u043b\u0438\u0442\u044c ';
  d += c ? '\u0433\u0440\u0443\u043f\u043f\u0443' : '\u0442\u0435\u0441\u0442';
  d += " '" + b + "'?";
  confirm(d) &&
    (c
      ? ((b = b.replace(/.*\(/g, '')),
        (b = b.substring(0, b.length - 1)),
        $.post('/cgi-bin/rm_testgroup.sh', b, get_group_list, 'xml'))
      : ((b = $('#content .test_select:first > select').find(':selected').val()),
        (d = $('#content .test_select:last > select').find(':selected').val()),
        $.post('/cgi-bin/rm_test.sh', b + '/' + d, get_test_list, 'xml')));
}
function get_test_list(a) {
  for (var a = $('testlist > test', a), c = '', b = 0; b < a.length; b++)
    (c += "<option value='" + a.eq(b).children('number').text() + "'>"),
      (c += a.eq(b).children('title').text() + '</option>');
  $('#content .test_select:last > select').html(c);
}
function clear_test_list() {
  $('#content .test_select:last > select').html('');
}
function ls_varlog(a) {
  a && cancel_bubble(a);
  $('#header').html(
    '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e: \u0436\u0443\u0440\u043d\u0430\u043b\u044b'
  );
  $.get(
    '/cgi-bin/ls_varlog.sh',
    function (a) {
      for (items = '<tr><td>'; a.substring(0, 1) == '\n'; ) a = a.substring(1);
      for (; a.indexOf(' ') != -1; ) {
        var b = a.substring(0, a.indexOf(' '));
        items += "<a href='/varlog/" + b + "'>" + b + '</a><br><br>';
        a = a.substring(a.indexOf(' ') + 1);
      }
      items += '</td></tr>';
      $('#content').html(items);
    },
    'text'
  );
  $('#content').html('<tr><td>' + ajax_waiter + '</td></tr>');
}
