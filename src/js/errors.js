export function errors(a) {
  maplinked = null;
  a && cancel_bubble(a);
  autoerror = 1;
  clearTimeout(timeoutVals);
  clearTimeout(timeoutErrors);
  $('#header').html(
    '\u041e\u0442\u0447\u0435\u0442 \u043e \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u044f\u0445'
  );
  $('#leftmenu').empty();
  $('#content').html("<tr><td><div id='err_buttons'></div><div id='err_table'></div></td></tr>");
  a =
    "<table><tr><td>\u0410\u0432\u0442\u043e\u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435&nbsp<font id='err_color' ";
  a += autoerror
    ? "color='green'>\u0432\u043a\u043b\u044e\u0447\u0435\u043d\u043e</font>"
    : "color='red'>\u0432\u044b\u043a\u043b\u044e\u0447\u0435\u043d\u043e</font>";
  a += "<button id='switch_button' onmousedown='switch_err(event)'>";
  a += autoerror
    ? '\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c'
    : '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c';
  a += '</button></td>';
  a += '<td rowspan=3>';
  a +=
    '<label>\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438:</label><br>';
  a += "<input id='err_num' type='text' size='20' onkeypress='return digits_only(event)'></input>";
  a += "<button onmousedown='find_err(event)'>&nbsp&nbsp>>&nbsp&nbsp</button></td></tr>";
  a +=
    "<tr><td>\u0412\u0441\u0435\u0433\u043e&nbsp\u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0435\u0439:&nbsp<text id='err_total'>0</text></td></tr>";
  a +=
    "<tr><td>\u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u043e:&nbsp<text id='err_current'>0</text>&nbsp";
  a +=
    "<button onmousedown='add_errors(event)'>\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c</button></table></td></tr></table>";
  $('#err_buttons').html(a);
  setTextFieldsVKAble();
  $('#err_table').html(
    "<i>\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0441\u043f\u0438\u0441\u043a\u0430 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0435\u0439. \u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435...</i><img src='/img/big-ajax-loader.gif'>"
  );
  err_count = 0;
  err_start = 1;
  running_query_get && running_query_get.abort();
  running_query_post && running_query_post.abort();
  get_errors_count();
}
function find_err(a) {
  a && cancel_bubble(a);
  a = $('#err_num').get(0).value;
  if ((a = parseInt(a)) && a <= err_count && a > 0)
    (err_start = a),
      running_query_get && running_query_get.abort(),
      running_query_post && running_query_post.abort(),
      add_errors();
}
function switch_err(a) {
  a && cancel_bubble(a);
  autoerror = autoerror ? 0 : 1;
  var a = $('#err_color'),
    b = $('#switch_button').get(0);
  autoerror
    ? (a.attr('color', 'green'),
      a.html('\u0432\u043a\u043b\u044e\u0447\u0435\u043d\u043e'),
      (b.textContent = '\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c'))
    : (a.attr('color', 'red'),
      a.html('\u0432\u044b\u043a\u043b\u044e\u0447\u0435\u043d\u043e'),
      (b.textContent = '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c'));
}
function get_errors_count() {
  running_query_get = $.get('/cgi-bin/spo_errors.cgi', show_errors_count, 'xml');
}
function add_errors() {
  var a = err_start - 1,
    b = 15;
  err_count - a < 15 && (b = err_count - a);
  running_query_post = $.post('/cgi-bin/spo_errors.cgi', a + '#' + b, show_errors, 'xml');
}
function show_errors_count(a) {
  if (!check_xml(a)) return $('#err_table').html(alarm_system_error), 0;
  err_count = $('root', a).text();
  $('#err_total').html(err_count);
  clearTimeout(timeoutErrors);
  timeoutErrors = setTimeout('get_errors_count()', 1e4);
  err_count == 0
    ? $('#err_table').html(
        '\u041d\u0435\u0442 \u043d\u0438 \u043e\u0434\u043d\u043e\u0439 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438'
      )
    : autoerror && add_errors();
}
function show_errors(a) {
  if (!check_xml(a)) return $('#err_table').html(alarm_system_error), 0;
  a = $('error', a);
  if (a.length == 0)
    return (
      $('#err_table').html(
        '\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u043e \u043d\u0438 \u043e\u0434\u043d\u043e\u0439 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438'
      ),
      0
    );
  var b = parseInt(err_start) + a.length - 1;
  $('#err_current').html(err_start + '-' + b);
  for (
    var b =
        '<tr><td><table><tr><th>\u0412\u0440\u0435\u043c\u044f</th><th>\u0422\u0438\u043f</th><th>UUID</th><th>\u041a\u043e\u0434</th><th>\u041f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442</th></tr>',
      c = a.length - 1;
    c >= 0;
    c--
  )
    (b += "<tr onmousedown='show_err_descr(event)' title='"),
      (b += a.eq(c).find('friendlyName').text() + "'>"),
      (b += '<td>' + a.eq(c).find('time').text() + ' ' + a.eq(c).find('date').text() + '</td>'),
      (b += '<td>' + a.eq(c).find('deviceType').text() + '</td>'),
      (b += '<td>' + a.eq(c).attr('urn') + '</td>'),
      (b += '<td>' + a.eq(c).find('code').text() + '</td>'),
      (b += '<td>' + a.eq(c).find('priority').text() + '</td></tr>');
  b += '</table></td></tr>';
  $('#err_table').html(b);
}
function show_err_descr(a) {
  if (a) cancel_bubble(a), (e = a.currentTarget);
  a = "<tr><td class='background'>";
  a +=
    '<b><i>\u0412\u0440\u0435\u043c\u044f \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438:</i></b><br>' +
    e.childNodes[0].textContent +
    '<br>';
  a +=
    '<b><i>\u0422\u0438\u043f \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430:</i></b><br>' +
    e.childNodes[1].textContent +
    '<br>';
  a += '<b><i>UUID:</i></b><br>' + e.childNodes[2].textContent + '<br>';
  a +=
    '<b><i>\u041a\u043e\u0434 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438:</i></b><br>' +
    e.childNodes[3].textContent +
    '<br>';
  a +=
    '<b><i>\u041f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438:</i></b><br>' +
    e.childNodes[4].textContent +
    '<br>';
  a +=
    '<b><i>\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u0438:</i></b><br>' +
    e.title;
  a += '</td></tr>';
  $('#leftmenu').html(a);
}
