timeoutSpin = running_query = timeoutErrors = timeoutVals = null;
scrolling = flag = false;
scroll_base = mouseY = 0;
alarm_system_error =
  '\u0421\u0431\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u044b. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435';
ajax_waiter =
  "<i>\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0437\u0430\u043f\u0440\u043e\u0441. \u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435...</i><img src='/img/big-ajax-loader.gif'>";
alarm_ok = 'Configuring complete successful!';
alarm_ok_ru =
  '\u041a\u043e\u043c\u043c\u0443\u0442\u0430\u0442\u043e\u0440 \u0441\u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d \u0443\u0441\u043f\u0435\u0448\u043d\u043e!';
alarm_fail = 'Wrong connection! Configuring fail!';
alarm_fail_ru =
  '\u041f\u0440\u043e\u0446\u0435\u0441\u0441 \u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438 \u043d\u0435\u0432\u043e\u0437\u043c\u043e\u0436\u0435\u043d. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f.';
running_query_post = running_query_get = null;
alive_error = 0;
testResult = running_kuev_timeout = running_kuev_test = null;
jQuery.fn.extend({
  disableSelection: function () {
    this.each(function () {
      this.onselectstart = function () {
        return false;
      };
      this.unselectable = 'on';
      jQuery(this).css('-moz-user-select', 'none');
    });
  },
  enableSelection: function () {
    this.each(function () {
      this.onselectstart = function () {};
      this.unselectable = 'off';
      jQuery(this).css('-moz-user-select', 'auto');
    });
  },
});
$(document).ready(function () {
  $.get(
    '/cgi-bin/check_load_config.sh',
    function (a) {
      console.log('a = ', a);

      for (var b = '', c = ''; a.indexOf('\n') == 0; ) a = a.substring(1);
      console.log('a = ', a);
      for (; a.indexOf('\n') > 0; ) {
        var d = a.substring(0, a.indexOf('\n'));
        b += "<td colspan=2 align='center' class='textlogomini'><b>";
        b += d + "</b></td><td bgcolor='#003366'></td>";
        c += "<td align='center' onmousedown=check_action(event,'";
        c +=
          d +
          "',false)><a href='#'><span class='nav'>\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b</span></a></td>";
        c += "<td align='center' onmousedown=check_action(event,'";
        c +=
          d +
          "',true)><a href='#'><span class='nav'>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f</span></a></td>";
        c += "<td bgcolor='#003366'></td>";
        a = a.substring(a.indexOf('\n') + 1);
      }
      b += "<td colspan=2 rowspan=2 align='center' class='nav' onmousedown='errors(event)'>";
      b +=
        "<a href='#' cursor='pointer'>\u0421\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043e<br>\u043d\u0435\u0438\u0441\u043f\u0440\u0430\u0432\u043d\u043e\u0441\u0442\u044f\u0445</a></td><td rowspan=2 bgcolor='#003366'></td>";
      a.indexOf('show switches') != -1 &&
        ((b += "<td colspan=2 rowspan=2 align='center' class='nav' onmousedown='harting(event)'>"),
        (b +=
          "<a href='#' cursor='pointer'>\u0420\u0430\u0431\u043e\u0442\u0430 \u0441<br>\u043a\u043e\u043c\u043c\u0443\u0442\u0430\u0442\u043e\u0440\u0430\u043c\u0438</a></td><td rowspan=2 bgcolor='#003366'></td>"));
      b += "<td colspan=2 rowspan=2 align='center' class='nav' onmousedown='extra(event)'>";
      b +=
        "<a href='#' cursor='pointer'>\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e</a></td>";
      $('#menu_line1').html(b);
      $('#menu_line2').html(c);
    },
    'text'
  );
  $('body *').disableSelection();
  alive = setTimeout('check_alive()', 6e4);
  get_date();
  $('body').bind('mousedown', function (a) {
    a = a || window.event;
    scrolling = true;
    mouseX = a.clientX;
    mouseY = a.clientY;
    scroll_baseX = document.body.scrollLeft;
    if (!scroll_baseX) scroll_baseX = document.documentElement.scrollLeft;
    scroll_baseY = document.body.scrollTop;
    if (!scroll_baseY) scroll_baseY = document.documentElement.scrollTop;
  });
  $('body').bind('mousemove', function (a) {
    a = a || window.event;
    scrolling &&
      !flag &&
      window.scrollTo(scroll_baseX + mouseX - a.clientX, scroll_baseY + mouseY - a.clientY);
  });
  $('body').bind('mouseup', function () {
    scrolling = false;
  });
  $('body').bind('mouseleave', function () {
    scrolling = false;
  });
  $.get('/cgi-bin/get_mac.sh', save_mac);
  extra();
});
function cancel_bubble(a) {
  a = a || window.event;
  a.stopPropagation ? a.stopPropagation() : (a.cancelBubble = true);
}
function check_xml(a) {
  return new XMLSerializer()
    .serializeToString(a)
    .indexOf(
      '\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0438\u043d\u0442\u0430\u043a\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u0430\u043d\u0430\u043b\u0438\u0437\u0430 XML'
    ) != -1
    ? 0
    : 1;
}
function save_mac(a) {
  mac = a.substring(a.indexOf('\n') + 1);
}
function check_alive() {
  $.ajax({
    url: '/cgi-bin/alive.sh',
    type: 'GET',
    dataType: 'text',
    error: function () {
      if (alive_error) window.location = 'http://skdu.tvz';
      alive_error = 1;
      alive = setTimeout('check_alive()', 6e4);
    },
    success: function () {
      alive_error = 0;
      alive = setTimeout('check_alive()', 6e4);
    },
  });
}
function go_to_menu(a) {
  a && cancel_bubble(a);
  window.location = location.href.substring(0, location.href.indexOf(':8080'));
}
function clear_cr(a) {
  for (; a[0] == '\n' || a[a.length - 1] == '\n'; )
    a[0] == '\n' && (a = a.substring(1)),
      a[a.length - 1] == '\n' && (a = a.substring(0, a.length - 1));
  return a;
}
function childByName(a, b) {
  for (var c = 0; c < a.childNodes.length; c++)
    if (a.childNodes[c].tagName == b) return a.childNodes[c];
}
function setTextFieldsVKAble() {
  for (var a = document.getElementsByTagName('input'), b = 0; b < a.length; b++)
    a[b].getAttribute('type') == 'text' &&
      !a[b].hasAttribute('readonly') &&
      a[b].setAttribute('onMouseDown', 'show_vk(this)');
  a = document.getElementsByTagName('textarea');
  for (b = 0; b < a.length; b++)
    a[b].hasAttribute('readonly') || a[b].setAttribute('onMouseDown', 'show_vk(this)');
}
function add_custom_vk(a) {
  for (var b = 0; b < a.length; b++) a[b].setAttribute('onMouseDown', 'show_vk(this)');
}
function show_vk(a) {
  document.getElementById('vk').contentWindow.setConnectedTextField(a);
  if (!flag) (flag = true), (document.getElementById('vk').style.display = 'inline');
}
function close_vk() {
  flag = false;
  document.getElementById('vk').style.display = 'none';
}
function get_date() {
  $.get('/cgi-bin/date.sh', set_date, 'text');
}
function set_date(a) {
  a = a.replace(/ /g, '').replace(/\n/g, '');
  a = ('<b>' + a).replace(/_/g, '</b><br>');
  $('#dt').html(a);
  setTimeout('get_date()', 1e4);
}
function reboot(a) {
  a && cancel_bubble(a);
  $.post('/cgi-bin/ssh.sh', 'reboot');
}
