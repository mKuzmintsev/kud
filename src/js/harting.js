//настройка коммутаторов
export function harting(event) {
  if (event) cancel_bubble(event);
  clearTimeout(timeoutVals);
  clearTimeout(timeoutErrors);
  if (running_query) running_query.abort();

  var items =
    "<tr><td class='background'><a onmousedown=harting_interactive(event)><span class='nav'>полная настройка</span></a></td></tr>";
  items +=
    "<tr><td class='background'><a onmousedown=harting_conf(event)><span class='nav'>выборочная настройка</span></a></td></tr>";
  items +=
    "<tr><td class='background'><a onmousedown=harting_check_LAN(event)><span class='nav'>проверка соединений</span></a></td></tr>";
  items +=
    "<tr><td class='background'><a onmousedown=harting_info(event)><span class='nav'>сбор информации</span></a></td></tr>";
  $('#leftmenu').html(items);
  $('#content').empty();
  $('#header').html('Настройка коммутаторов');

  $.get('/cgi-bin/get_ip.sh', harting_get_ip, 'text');

  img_enable = '/img/harting9k.jpg';
  img_disable = '/img/harting9k_disable.jpg';
}

//получение IP-адресов коммутаторов
function harting_get_ip(addr) {
  addr = addr.substring(addr.indexOf('.') + 1);
  addr = addr.substring(addr.indexOf('.') + 1);
  addr = addr.substring(0, addr.indexOf('\n'));
  ip = {
    G1: '10.241.' + addr,
    G2: '10.242.' + addr,
    L1: '10.251.' + addr,
    L2: '10.252.' + addr,
    L3: '10.253.' + addr,
  };
}

//выполняет запросы
//event    - событие клика
//callback - обработчик ответа
//type = 1 - сбор информации
//		 2 - выборочная настройка
//		 3 - проверка коммутаций
//switch_number - номер коммутатора
function harting_request(event, callback, query_type, switch_number) {
  if (event) cancel_bubble(event);
  var path = '/cgi-bin/';
  var param;
  if (query_type == 1) {
    switch_number = $("#content img[src='" + img_enable + "']").get(0).id;
    path += 'harting_info.sh';
    param = ip[switch_number];
  } else if (query_type == 2) {
    if (!switch_number) switch_number = $("#content img[src='" + img_enable + "']").get(0).id;
    path += 'harting_conf_' + switch_number + '.sh';
    param = ip[switch_number];
  } else {
    path += 'harting_check_LAN.sh';
    param = ip['L1'].substring(7);
  }
  $('#waiter').html(ajax_waiter);
  $('#content button').attr('disabled', 'disabled');
  running_query = $.ajax({
    url: path,
    type: 'POST',
    data: param,
    dataType: 'text',
    success: callback,
  });
}

function draw_switches() {
  var items = '<br>Выберите коммутатор:<br>';
  items += "<img id='L1' src=" + img_enable + ' width=105 height=250>&nbsp&nbsp&nbsp';
  items += "<img id='L2' src=" + img_disable + ' width=97 height=231>&nbsp&nbsp&nbsp';
  items += "<img id='L3' src=" + img_disable + ' width=97 height=231>&nbsp&nbsp&nbsp';
  items += "<img id='G1' src=" + img_disable + ' width=97 height=231>&nbsp&nbsp&nbsp';
  items += "<img id='G2' src=" + img_disable + ' width=97 height=231>&nbsp&nbsp&nbsp';
  items += "<div style='color: #003366; font-size: 20px;'>";
  items += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspL1&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
  items += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspL2&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
  items += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspL3&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
  items += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspG1&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
  items += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspG2&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>';
  return items;
}

//сбор информации
function harting_info(event) {
  if (event) cancel_bubble(event);
  if (running_query) running_query.abort();
  shift = 0;
  $('#header').html('Настройка коммутаторов: сбор информации');
  var items = "<tr><td valign='top'><b>Сбор информации о коммутаторе</b>";
  items += draw_switches();
  items +=
    '<br><button onmousedown=harting_request(event,info_resp,1)><font size=4>Запросить</font></button>';
  items += "</td></tr><tr><td><div id='waiter'></div></td></tr>";
  $('#content').html(items);
  set_handlers();
}

//вывод собранной информации
function info_resp(text) {
  $('#content button').removeAttr('disabled');
  text = text.replace(/\n/g, '<br>');
  text = text.replace(/\t/g, '&nbsp&nbsp');
  $('#waiter').html(text);
}

//настройка
function harting_conf(event) {
  if (event) cancel_bubble(event);
  if (running_query) running_query.abort();
  shift = 0;
  $('#header').html('Настройка коммутаторов: выборочная настройка');
  var items = "<tr><td valign='top'><b>Настройка коммутаторов</b>";
  items += draw_switches();
  items +=
    '<br><button onmousedown=harting_request(event,conf_resp,2)><font size=4>Сконфигурировать</font></button>';
  items += "</td></tr><tr><td><div id='waiter'></div></td></tr>";
  $('#content').html(items);
  set_handlers();
}

//вывод результата конфигурирования
function conf_resp(text) {
  $('#content button').removeAttr('disabled');
  if (text.indexOf(alarm_fail) != -1) text = alarm_fail_ru;
  else if (text.indexOf(alarm_ok) != -1) text = alarm_ok_ru;
  else text = alarm_system_error;
  $('#waiter').html(text);
}

//настраивает поведение меню
function set_handlers() {
  var harting_img = $('#content > tbody > tr:first > td > img');
  harting_img.mousedown(function () {
    for (var i = 0; i < harting_img.length; i++)
      if (harting_img.get(i).id != this.id) {
        harting_img.eq(i).attr('src', img_disable);
        harting_img.eq(i).attr('width', 97);
        harting_img.eq(i).attr('height', 231);
      }
    this.src = img_enable;
  });
  harting_img.mouseover(function () {
    this.width = 105;
    this.height = 250;
  });
  harting_img.mouseout(function () {
    if (this.src.indexOf(img_enable) == -1) {
      this.width = 97;
      this.height = 231;
    }
  });
}

//проверка соединений
function harting_check_LAN(event) {
  if (event) cancel_bubble(event);
  if (running_query) running_query.abort();
  $('#header').html('Настройка коммутаторов: проверка соединений');
  var items = "<tr><td valign='top'><b>Проверка корректности коммутаций</b>";
  items += '<br>Ниже приведена правильная схема взаимодействия между коммутаторами:';
  items += '<br><canvas width=670 height=260></canvas>';
  items +=
    '<br><button onmousedown=harting_request(event,check_resp,3)><font size=4>Проверить соответствие</font></button>';
  items += "</td></tr><tr><td><div id='waiter'></div></td></tr>";
  $('#content').html(items);
  img = new Image();
  img.onload = harting_check_draw;
  img.src = img_enable;
}

//отрисовка связей для схемы коммутаций двухэтажного выгона
function harting_check_draw() {
  var ctx = $('canvas').get(0).getContext('2d');
  ctx.drawImage(img, 0, 0);
  ctx.drawImage(img, 120, 0);
  ctx.drawImage(img, 240, 0);
  ctx.drawImage(img, 360, 0);
  ctx.drawImage(img, 480, 0);

  ctx.fillStyle = '#003366';
  ctx.font = '20px Arial';

  ctx.fillText('L1', 33, 225);
  ctx.fillText('L2', 153, 225);
  ctx.fillText('L3', 273, 225);
  ctx.fillText('G1', 393, 225);
  ctx.fillText('G2', 513, 225);

  ctx.fillStyle = 'green';

  //1.7 -> 2.1
  ctx.moveTo(61, 158);
  ctx.beginPath();
  ctx.arc(61, 158, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(152, 44);
  ctx.arc(152, 44, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(61, 158);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(80, 120, 120, 80, 152, 44);
  ctx.stroke();

  //2.7 -> 3.1
  ctx.moveTo(181, 158);
  ctx.beginPath();
  ctx.arc(181, 158, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(272, 44);
  ctx.arc(272, 44, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(181, 158);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(200, 120, 240, 80, 272, 44);
  ctx.stroke();

  //4.2 -> 5.3
  ctx.moveTo(391, 67);
  ctx.beginPath();
  ctx.arc(391, 67, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(512, 90);
  ctx.beginPath();
  ctx.arc(512, 90, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(391, 67);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(429, 70, 469, 80, 512, 90);
  ctx.stroke();

  //4.1 -> 5.4
  ctx.moveTo(391, 44);
  ctx.beginPath();
  ctx.arc(391, 44, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(512, 112);
  ctx.beginPath();
  ctx.arc(512, 112, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(391, 44);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(559, -10, 559, 50, 512, 112);
  ctx.stroke();

  //1.1 -> 3.7
  ctx.moveTo(301, 158);
  ctx.beginPath();
  ctx.arc(301, 158, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(31, 44);
  ctx.beginPath();
  ctx.arc(31, 44, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(301, 158);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(72, 200, -30, 250, 31, 44);
  ctx.stroke();
}

//вывод результата проверки коммутаций между свичами
function check_resp(text) {
  $('#content button').removeAttr('disabled');
  var ctx = $('canvas').get(0).getContext('2d');

  if (text.indexOf('Коммутатор L1 порт№7 <---> Коммутатор L2 порт№1 Нет') != -1) {
    //1.7 -> 2.1
    ctx.fillStyle = 'red';
    ctx.moveTo(61, 158);
    ctx.beginPath();
    ctx.arc(61, 158, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(152, 44);
    ctx.arc(152, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(61, 158);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.bezierCurveTo(80, 120, 120, 80, 152, 44);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор L1 порт№7 <---> Коммутатор L2 порт№1 Есть') != -1) {
    //1.7 -> 2.1
    ctx.fillStyle = 'green';
    ctx.moveTo(61, 158);
    ctx.beginPath();
    ctx.arc(61, 158, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(152, 44);
    ctx.arc(152, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(61, 158);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.bezierCurveTo(80, 120, 120, 80, 152, 44);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор L1 порт№1 <---> Коммутатор L3 порт№7 Нет') != -1) {
    //1.1 -> 3.7
    ctx.fillStyle = 'red';
    ctx.moveTo(301, 158);
    ctx.beginPath();
    ctx.arc(301, 158, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(31, 44);
    ctx.beginPath();
    ctx.arc(31, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(301, 158);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.bezierCurveTo(72, 200, -30, 250, 31, 44);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор L1 порт№1 <---> Коммутатор L3 порт№7 Есть') != -1) {
    //1.1 -> 3.7
    ctx.fillStyle = 'green';
    ctx.moveTo(301, 158);
    ctx.beginPath();
    ctx.arc(301, 158, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(31, 44);
    ctx.beginPath();
    ctx.arc(31, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(301, 158);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.bezierCurveTo(72, 200, -30, 250, 31, 44);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор L2 порт№7 <---> Коммутатор L3 порт№1 Нет') != -1) {
    //2.7 -> 3.1
    ctx.fillStyle = 'red';
    ctx.moveTo(181, 158);
    ctx.beginPath();
    ctx.arc(181, 158, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(272, 44);
    ctx.arc(272, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(181, 158);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.bezierCurveTo(200, 120, 240, 80, 272, 44);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор L2 порт№7 <---> Коммутатор L3 порт№1 Есть') != -1) {
    //2.7 -> 3.1
    ctx.fillStyle = 'green';
    ctx.moveTo(181, 158);
    ctx.beginPath();
    ctx.arc(181, 158, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(272, 44);
    ctx.arc(272, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(181, 158);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.bezierCurveTo(200, 120, 240, 80, 272, 44);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор G1 порт№1 <---> Коммутатор G2 порт№4 Нет') != -1) {
    //4.1 -> 5.4
    ctx.fillStyle = 'red';
    ctx.moveTo(391, 44);
    ctx.beginPath();
    ctx.arc(391, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(512, 112);
    ctx.beginPath();
    ctx.arc(512, 112, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(391, 44);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.bezierCurveTo(559, -10, 559, 50, 512, 112);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор G1 порт№1 <---> Коммутатор G2 порт№4 Есть') != -1) {
    //4.1 -> 5.4
    ctx.fillStyle = 'green';
    ctx.moveTo(391, 44);
    ctx.beginPath();
    ctx.arc(391, 44, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(512, 112);
    ctx.beginPath();
    ctx.arc(512, 112, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(391, 44);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.bezierCurveTo(559, -10, 559, 50, 512, 112);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор G1 порт№2 <---> Коммутатор G2 порт№3 Нет') != -1) {
    //4.2 -> 5.3
    ctx.fillStyle = 'red';
    ctx.moveTo(391, 67);
    ctx.beginPath();
    ctx.arc(391, 67, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(512, 90);
    ctx.beginPath();
    ctx.arc(512, 90, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(391, 67);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.bezierCurveTo(429, 70, 469, 80, 512, 90);
    ctx.stroke();
  }
  if (text.indexOf('Коммутатор G1 порт№2 <---> Коммутатор G2 порт№3 Есть') != -1) {
    //4.2 -> 5.3
    ctx.fillStyle = 'green';
    ctx.moveTo(391, 67);
    ctx.beginPath();
    ctx.arc(391, 67, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.moveTo(512, 90);
    ctx.beginPath();
    ctx.arc(512, 90, 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(391, 67);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.bezierCurveTo(429, 70, 469, 80, 512, 90);
    ctx.stroke();
  }

  text = text.replace(/\n/g, '<br>');
  $('#waiter').html(text);
}

//интерактивное конфигурирование всех коммутаторов по очереди
function harting_interactive(event) {
  if (event) cancel_bubble(event);
  if (running_query) running_query.abort();
  $('#header').html('Настройка коммутаторов: полная настройка');
  var items = "<tr><td valign='top'><b>Интерактивное конфигурирование коммутаторов</b>";
  items += '<br><div id=hint>Подключите локальный интерфейс модуля КУД к ';
  items += "порту №2 коммутатора L1 и нажмите 'Далее'</div>";
  items +=
    "<button onmousedown=harting_request(event,step0_resp,2,'L1')><font size=4>Далее</font></button>";
  items += "<div id='waiter'></div>";
  items += '<br><canvas width=670 height=500></canvas></td></tr>';
  $('#content').html(items);
  var img = new Image();
  img.onload = function () {
    var img_scdu = new Image();
    img_scdu.onload = function () {
      var ctx = $('canvas').get(0).getContext('2d');

      ctx.drawImage(img, 0, 100);
      ctx.drawImage(img, 120, 100);
      ctx.drawImage(img, 240, 100);
      ctx.drawImage(img, 360, 100);
      ctx.drawImage(img, 480, 100);
      ctx.drawImage(img_scdu, 200, 0);
      ctx.lineWidth = 4;
      ctx.strokeRect(200, 0, 120, 50);
      ctx.fill();

      ctx.fillStyle = '#003366';
      ctx.font = '20px Arial';

      ctx.fillText('L1', 33, 325);
      ctx.fillText('L2', 153, 325);
      ctx.fillText('L3', 273, 325);
      ctx.fillText('G1', 393, 325);
      ctx.fillText('G2', 513, 325);

      //KUD.1 -> 1.2
      ctx.fillStyle = 'SlateGray';
      ctx.moveTo(31, 167);
      ctx.beginPath();
      ctx.arc(31, 167, 6, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.moveTo(200, 25);
      ctx.beginPath();
      ctx.arc(200, 25, 6, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(31, 167);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'SlateGray';
      ctx.bezierCurveTo(100, 30, 30, 30, 200, 25);
      ctx.stroke();
    };
    img_scdu.src = '/img/scdu.gif';
  };
  img.src = img_enable;
}

//анализ итога шага 0
function step0_resp(text) {
  $('#content button').removeAttr('disabled');
  if (text.indexOf(alarm_fail) != -1) harting_interactive();
  else if (text.indexOf(alarm_ok) != -1) harting_step1();
  else {
    alert(alarm_system_error);
    harting_interactive();
  }
}

//шаг 1
function harting_step1() {
  $('#waiter').empty();
  var items = "Соедините порт №7 коммутатора L1 с портом №1 коммутатора L2 и нажмите 'Далее'";
  $('#hint').html(items);
  $('#content button').attr('onmousedown', "harting_request(event,step1_resp,2,'L2')");

  var ctx = $('canvas').get(0).getContext('2d');

  //KUD.1 -> 1.2
  ctx.fillStyle = 'green';
  ctx.moveTo(31, 167);
  ctx.beginPath();
  ctx.arc(31, 167, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(200, 25);
  ctx.beginPath();
  ctx.arc(200, 25, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(31, 167);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(100, 30, 30, 30, 200, 25);
  ctx.stroke();

  //1.7 -> 2.1
  ctx.fillStyle = 'SlateGray';
  ctx.moveTo(61, 258);
  ctx.beginPath();
  ctx.arc(61, 258, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(152, 144);
  ctx.arc(152, 144, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(61, 258);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'SlateGray';
  ctx.bezierCurveTo(80, 220, 120, 180, 152, 144);
  ctx.stroke();
}

//анализ итога шага 1
function step1_resp(text) {
  $('#content button').removeAttr('disabled');
  if (text.indexOf(alarm_fail) != -1) harting_step1();
  else if (text.indexOf(alarm_ok) != -1) harting_step2();
  else {
    alert(alarm_system_error);
    harting_step1();
  }
}

//шаг 2
function harting_step2() {
  $('#waiter').empty();
  var items = "Соедините порт №7 коммутатора L2 с портом №1 коммутатора L3 и нажмите 'Далее'";
  $('#hint').html(items);
  $('#content button').attr('onmousedown', "harting_request(event,step2_resp,2,'L3')");

  var ctx = $('canvas').get(0).getContext('2d');

  //1.7 -> 2.1
  ctx.fillStyle = 'green';
  ctx.moveTo(61, 258);
  ctx.beginPath();
  ctx.arc(61, 258, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(152, 144);
  ctx.arc(152, 144, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(61, 258);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(80, 220, 120, 180, 152, 144);
  ctx.stroke();

  //2.7 -> 3.1
  ctx.fillStyle = 'SlateGray';
  ctx.moveTo(181, 258);
  ctx.beginPath();
  ctx.arc(181, 258, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(272, 144);
  ctx.arc(272, 144, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(181, 258);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'SlateGray';
  ctx.bezierCurveTo(200, 220, 240, 180, 272, 144);
  ctx.stroke();
}

//анализ итога шага 2
function step2_resp(text) {
  $('#content button').removeAttr('disabled');
  if (text.indexOf(alarm_fail) != -1) harting_step2();
  else if (text.indexOf(alarm_ok) != -1) harting_step3();
  else {
    alert(alarm_system_error);
    harting_step2();
  }
}

//шаг 3
function harting_step3() {
  $('#waiter').empty();
  var items =
    "Соедините глобальный интерфейс модуля КУД с портом №8 коммутатора G2 и нажмите 'Далее'";
  $('#hint').html(items);
  $('#content button').attr('onmousedown', "harting_request(event,step3_resp,2,'G2')");

  var ctx = $('canvas').get(0).getContext('2d');

  //2.7 -> 3.1
  ctx.fillStyle = 'green';
  ctx.moveTo(181, 258);
  ctx.beginPath();
  ctx.arc(181, 258, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(272, 144);
  ctx.arc(272, 144, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(181, 258);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(200, 220, 240, 180, 272, 144);
  ctx.stroke();

  //KUD.2 -> 5.8
  ctx.fillStyle = 'SlateGray';
  ctx.moveTo(541, 235);
  ctx.beginPath();
  ctx.arc(541, 235, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(321, 325);
  ctx.beginPath();
  ctx.arc(321, 25, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(321, 25);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'SlateGray';
  ctx.bezierCurveTo(550, 20, 600, 100, 541, 235);
  ctx.stroke();
}

//анализ итога шага 3
function step3_resp(text) {
  $('#content button').removeAttr('disabled');
  if (text.indexOf(alarm_fail) != -1) harting_step3();
  else if (text.indexOf(alarm_ok) != -1) harting_step4();
  else {
    alert(alarm_system_error);
    harting_step3();
  }
}

//шаг 4
function harting_step4() {
  $('#waiter').empty();
  $('#content button').attr('onmousedown', "harting_request(event,step4_resp,2,'G1')");
  $('#hint').html("Соедините порт №2 коммутатора G1 с портом №3 коммутатора G2 и нажмите 'Далее'");

  var ctx = $('canvas').get(0).getContext('2d');

  //KUD.2 -> 5.8
  ctx.fillStyle = 'green';
  ctx.moveTo(541, 235);
  ctx.beginPath();
  ctx.arc(541, 235, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(321, 325);
  ctx.beginPath();
  ctx.arc(321, 25, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(321, 25);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(550, 20, 600, 100, 541, 235);
  ctx.stroke();

  //4.2 -> 5.3
  ctx.fillStyle = 'SlateGray';
  ctx.moveTo(391, 167);
  ctx.beginPath();
  ctx.arc(391, 167, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(512, 190);
  ctx.beginPath();
  ctx.arc(512, 190, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(391, 167);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'SlateGray';
  ctx.bezierCurveTo(429, 170, 469, 180, 512, 190);
  ctx.stroke();
}

//анализ итога шага 4
function step4_resp(text) {
  $('#content button').removeAttr('disabled');
  if (text.indexOf(alarm_fail) != -1) harting_step4();
  else if (text.indexOf(alarm_ok) != -1) harting_step5();
  else {
    alert(alarm_system_error);
    harting_step4();
  }
}

//шаг 5
function harting_step5() {
  $('#waiter').empty();
  $('#content button').attr('onmousedown', 'finish_interactive(event)');
  $('#hint').html(
    "Соедините порт №1 коммутатора L1 с портом №7 коммутатора L3,<br>порт №1 коммутатора G1 с портом №4 коммутатора G2 и нажмите 'Готово'"
  );
  $('#content button').text('Готово');

  var ctx = $('canvas').get(0).getContext('2d');

  //4.2 -> 5.3
  ctx.fillStyle = 'green';
  ctx.moveTo(391, 167);
  ctx.beginPath();
  ctx.arc(391, 167, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(512, 190);
  ctx.beginPath();
  ctx.arc(512, 190, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(391, 167);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'green';
  ctx.bezierCurveTo(429, 170, 469, 180, 512, 190);
  ctx.stroke();

  //4.1 -> 5.4
  ctx.fillStyle = 'SlateGray';
  ctx.moveTo(391, 144);
  ctx.beginPath();
  ctx.arc(391, 144, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(512, 212);
  ctx.beginPath();
  ctx.arc(512, 212, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(391, 144);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'SlateGray';
  ctx.bezierCurveTo(559, 90, 559, 150, 512, 212);
  ctx.stroke();

  //1.1 -> 3.7
  ctx.fillStyle = 'SlateGray';
  ctx.moveTo(301, 258);
  ctx.beginPath();
  ctx.arc(301, 258, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.moveTo(31, 144);
  ctx.beginPath();
  ctx.arc(31, 144, 6, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(301, 258);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'SlateGray';
  ctx.bezierCurveTo(72, 300, -30, 350, 31, 144);
  ctx.stroke();
}

function finish_interactive(event) {
  if (event) cancel_bubble(event);
  harting_check_LAN();
  harting_request(null, check_resp, 3);
}
