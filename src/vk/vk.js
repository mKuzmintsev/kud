/* (c) Scientec Internet Applications + Media GmbH - www.scientec.de */

dKey = "";
dKeyName = "";
array = new Array();
array['Shift'] = "0";
array['AltGr'] = "0";
array['CapsLock'] = "0";
var keys = "en";
var textField = null;

//
var connectedTextField = null;
var buttonDown;
/*var flag = false;
var inputs = document.getElementsByTagName('input');
//var k = 0; 
for(var i = 0; i < inputs.length; i++)
{
    if(inputs[i].getAttribute('type') == 'text')
    {
	inputs[i].setAttribute('onMouseDown', 'show_vk(this)');
    }
}

function show_vk(obj)
{
    setTextField(obj);
    if(!flag)
    {
	flag = true;
    }
}
*/
function setConnectedTextField(obj)
{
    connectedTextField = obj;    
//    alert(connectedTextField);
    textField.value = connectedTextField.value;
    textField.setAttribute("type", obj.getAttribute('type') );
    textField.setAttribute("onclick", "syncTextField()")
}

function syncTextField()
{
    connectedTextField.value = textField.value;
}


function clearSel()
{
    if(buttonDown)
        buttonDown.blur();
}

function init()
{
    textField = document.getElementById("textField");
    clearTextField();
    var butts = document.getElementsByTagName('button');
    if(!butts)
	return;
    for(var i = 0; i < butts.length; i++)
    {
	if(butts[i].getAttribute('key'))
	{
	    butts[i].setAttribute('onClick', 'writeKey(this)');
	}    
    }
}

function setActivity()
{
    if(window.parent.set_activity)
    {
//	alert(window.parent.set_activity);
	window.parent.set_activity();
    }
}

//function 
//

function clearTextField()
{
    textField.value="";
//    document.getElementById("1").value="";
//    document.getElementById("2").value="";
//    document.getElementById("3").value="";
//    document.getElementById("4").value="";
}

function writeKey(obj)
{    
    var key = obj.getAttribute('key');
    obj.blur();
    textField = document.getElementById("textField");
    if(key)
    {
	if(key == "Enter")
	    key = 10;
	else if(key == "BackSp")
	    key = 11;
	else if(key == "ClearAll")
	    key = 12;
	else if(key == "Esc")
	    key = 13;
	if(dKey)
	{
    	    if(nK[String.fromCharCode(key)+dKeyName])
    	    {
    		textField.value += String.fromCharCode(nK[String.fromCharCode(key)+dKeyName]);
//    		if(connectedTextField)
//		    connectedTextField.value += String.fromCharCode(nK[String.fromCharCode(key)+dKeyName]);
    	    }
	    else if(nK[key+dKeyName])
	    {
	        textField.value += String.fromCharCode(nK[key+dKeyName]);
//	    	if(connectedTextField)
//		    connectedTextField.value += String.fromCharCode(nK[key+dKeyName]);
	    }
	    else
	    {
	        textField.value += String.fromCharCode(dKey)+String.fromCharCode(key);
//		if(connectedTextField)
//		    connectedTextField.value += String.fromCharCode(dKey)+String.fromCharCode(key);
	    }
        }
	else
	{
	    if(key == " ")
	    {
    		textField.value += " ";
//    		if(connectedTextField)
//		    connectedTextField.value += " ";
    	    }
	    else
    	    {
    		if(key!=10 && key!=11 && key!=12 && key!=13)
        	{
        	    textField.value += String.fromCharCode(key);
//        	    if(connectedTextField)
//        		connectedTextField.value += String.fromCharCode(key);
        	}
    		else
    		{
    		    if(key == 10)//Enter
    		    {
    			window.parent.close_vk(connectedTextField);
    			if(window.parent.setTextField)
    			    window.parent.setTextField(connectedTextField.getAttribute("id"), connectedTextField.value);
    			textField.value = "";
    			connectedTextField = null;
    		    }
    		    else if(key == 11)//BackSpace
    		    {
    			if(textField.value)
    			{
    			    textField.value = textField.value.substring(0, textField.value.length - 1);
//    			    if(connectedTextField)
//        			connectedTextField.value = connectedTextField.value.substring(0, connectedTextField.value.length - 1);
    			}
    		    }
    		    else if(key == 12)//ClearAll
    		    {
    			if(textField.value)
    			{
    			    textField.value = "";
//    			    if(connectedTextField)
//        			connectedTextField.value = "";
    			}
    		    }
    		    else if(key == 13)//Esc
    		    {
    			window.parent.close_vk(connectedTextField);
    			textField.value = "";
    			connectedTextField.value = "";
    			connectedTextField = null;
    		    }
    		}
    	    }
        }
        if(connectedTextField)
    	    connectedTextField.value = textField.value;
	dKey = "";
	dKeyName = "";
      }
    click();
}


function showTab(tab)
{
  if(array[tab] == "0")
  {
    array[tab] = 1;
  }
  else
  {
    array[tab] = 0;  
  }

  show = "normalState_" + keys;
  if(array['Shift'] == 1)
  {
    show = "shiftState_" + keys;
  }
  if(array['CapsLock'] == 1)
  {
    show = "normalStateCap_" + keys;
  }
  if(array['Shift'] == 1 && array['CapsLock'] == 1)
  {
    show = "shiftStateCap_" + keys;
  }
 
  for(var i = 0; i < document.getElementsByTagName("TABLE").length; i++)
  {
    //hide all keys layers
    if(document.getElementsByTagName("TABLE")[i].id != "textContainer" && document.getElementsByTagName("TABLE")[i].id != "workspace")
      document.getElementsByTagName("TABLE")[i].setAttribute("class", "noshow");
  }
  document.getElementById(show).setAttribute("class", "show");

}

function click()
{
  array['Shift'] = "0";
  array['AltGr'] = "0";
  show = "normalState_" + keys;
  if(array['CapsLock'] == 1)
  {
    show = "normalStateCap_" + keys;
  }
  for(var i = 0; i < document.getElementsByTagName("TABLE").length; i++)
  {
    //hide all keys layers
    if(document.getElementsByTagName("TABLE")[i].id != "textContainer" && document.getElementsByTagName("TABLE")[i].id != "workspace")
      document.getElementsByTagName("TABLE")[i].setAttribute("class", "noshow");
  }
  document.getElementById(show).setAttribute("class", "show");
}

function showName(obj)
{}

function getKeyboard(object)
{
    array['Shift'] = "0";
    array['AltGr'] = "0";
    array['CapsLock'] = "0";
    for(var i = 0; i < object.options.length; i++)
        if(object.options[i].selected)
	    keys = object.options[i].getAttribute("keys");
     click();
}

function clearAreas(){
  document.getElementById('feld1').value="";
  document.getElementById('feld2').value="";
}

function showHelp(obj){
	document.getElementById('info').style.backgroundColor="white";
	document.getElementById('info').innerHTML=document.getElementById(obj.id+"Text").innerHTML;
}


