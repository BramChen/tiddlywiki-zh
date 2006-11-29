/* 
////////////////////////////////////////////////////////////////////////
// ProtoEdit                                                          //
// v. 2.11                                                            //
////////////////////////////////////////////////////////////////////////

For license see LICENSE.TXT
*/
var isDOM = document.getElementById //DOM1 browser 
var isO   = isO5 = window.opera && isDOM; //Opera 5+
var isO6  = isO && window.print //Opera 6+
var isO7  = isO && document.readyState //Opera 7+
var isO8  = isO && document.createProcessingInstruction && (new XMLHttpRequest()).getAllResponseHeaders //Opera 8+
var isIE  = document.all && document.all.item && !isO //Microsoft Internet Explorer 4+
var isIE5 = isIE && isDOM //MSIE 5+
var isMZ  = isDOM && (navigator.appName=="Netscape")
var ua = navigator.userAgent.toLowerCase();
var isSafari = (ua.indexOf("safari") != -1);

var ProtoEdit = function(){
 this.enabled = true;
 this.MZ=isMZ;
 this.buttons = new Array();
}

ProtoEdit.prototype._init = function(id, rte) {
 this.id = id;                           //id - id of textarea   
 this.area = document.getElementById(id);//area - textarea object
 this.area._owner = this;                //area._owner - this    
                                         //rte - id of rte frame 
 if (rte)
 {
  if(isIE){
    frames[rte].document.onkeydown = function() { document.getElementById(id)._owner.keyDown(frames[rte].event) }
  }else if (this.MZ=isMZ) {
    document.getElementById(rte).contentWindow.document.addEventListener("keypress", function(ev) { document.getElementById(id)._owner.keyDown(ev) }, true);
    document.getElementById(rte).contentWindow.document.addEventListener("keyup",    function(ev) { document.getElementById(id)._owner.keyDown(ev) }, true);
  }
 }
 else
 {
  if(isIE){
   this.area.onkeydown = function() { this._owner.keyDown(event) }
  }else if (isMZ) {
    this.area.addEventListener("keypress", function(ev) { this._owner.keyDown(ev) }, true);
    this.area.addEventListener("keyup",    function(ev) { this._owner.keyDown(ev) }, true);
  }else if (isO8) {
    this.area.onkeypress = function() { this._owner.keyDown(event) }
  }
 }
}

ProtoEdit.prototype.enable = function() {
 this.enabled = true;
}

ProtoEdit.prototype.disable = function() {
 this.enabled = false;
}

ProtoEdit.prototype.KeyDown = function () {

  if (!this.enabled) return;

  return true;
}

ProtoEdit.prototype.insTag = function (Tag,Tag2) {
  if (isMZ)
  {
   var ss = this.area.scrollTop;
   sel1 = this.area.value.substr(0, this.area.selectionStart);
   sel2 = this.area.value.substr(this.area.selectionEnd);

   sel = this.area.value.substr(this.area.selectionStart,
                   this.area.selectionEnd - this.area.selectionStart);

   this.area.value = sel1 + Tag + sel + Tag2 + sel2;

   selPos = Tag.length + sel1.length + sel.length + Tag2.length;
   this.area.setSelectionRange(sel1.length, selPos);
   this.area.scrollTop = ss;
  }
  else
  {
   this.area.focus();
   sel = document.selection.createRange();
   sel.text = Tag+sel.text+Tag2;
   this.area.focus();
  }
  return true;
}

ProtoEdit.prototype.createToolbar = function (id, width, height, readOnly) {
  wh = "";

  html = '<table id="buttons_' + id + '" cellpadding="1" cellspacing="0" class="toolbar">'
          + '  <tr>';
  if (this.editorName) html += '<td class="'+this.editorNameClass+'">'+this.editorName+'</td>';

  for (var i = 0; i<this.buttons.length; i++) 
  {
   var btn = this.buttons[i];
   if (btn.name==" ")
    html += ' <td>&nbsp;</td>\n';
   else if (btn.name=="customhtml")
    html += btn.desc;
   else
    html += ' <td class="btns-"><div id="' + btn.name + '_' + id + '" onmouseover=\'this.className="btn-hover";\' '
          + 'onmouseout=\'this.className="btn-";\' class="btn-" '
          + 'onclick="this.className=\'btn-pressed\';' + btn.actionName + '('//\'' + id + '\', ' 
          + btn.actionParams + ')"><img src="' + this.imagesPath 
          + btn.name + '.gif" ' + wh + ' alt="' + btn.desc + '" title="' + btn.desc 
          + '"></div></td>\n';
  }
  html += '</tr></table>\n';

  return html;
}

ProtoEdit.prototype.addButton = function (name, desc, actionParams, actionName) {
 if (actionName == null) actionName = this.actionName;
 var i = this.buttons.length;
 this.buttons[i] = new Object();
 this.buttons[i].name = name;
 this.buttons[i].desc = desc;
 this.buttons[i].actionName   = actionName;
 this.buttons[i].actionParams = actionParams;
}

ProtoEdit.prototype.checkKey = function (k) {

 if (k==85+4096 || k==73+4096 || k==49+2048 || k==50+2048 || k==51+2048 || k==52+2048 || 
   k==76+4096 || k==76+2048 || k==78+2048 || k==79+2048 || k==66+2048 || k==83+2048 || 
   k==85+2048 || k==72+2048 || k==73+2048 || k==74+2048 || k==84+2048 || k==2109 ||
   k==2124+32 || k==2126+32 || k==2127+32 || k==2114+32 || k==2131+32 ||
   k==2133+32 || k==2121+32 || k==2120+32 || k==2122+32)
  return true;
 else
  return false;
}

ProtoEdit.prototype.addEvent = function (el, evname, func) {
  if (isIE || isO8) 
    el.attachEvent("on" + evname, func);
  else
    el.addEventListener(evname, func, true);
}

ProtoEdit.prototype.trim = function(s2) {
   if (typeof s2 != "string") return s2;
   var s = s2;
   var ch = s.substring(0, 1);
  
   while (ch == " ") { // Check for spaces at the beginning of the string
      s = s.substring(1, s.length);
      ch = s.substring(0, 1);
   }
   ch = s.substring(s.length-1, s.length);
  
   while (ch == " ") { // Check for spaces at the end of the string
      s = s.substring(0, s.length-1);
      ch = s.substring(s.length-1, s.length);
   }
  
  // Note that there are two spaces in the string - look for multiple spaces within the string
   while (s.indexOf("  ") != -1) {
    // Again, there are two spaces in each of the strings
      s = s.substring(0, s.indexOf("  ")) + s.substring(s.indexOf("  ")+1, s.length);
   }
   return s; // Return the trimmed string back to the user
}
/*
////////////////////////////////////////////////////////////////////////
// WikiEdit                                                           //
// v. 3.01                                                            //
// supported: MZ1.4+, MSIE5+, Opera 8+                                //
//                                                                    //
// (c) Roman "Kukutz" Ivanov <thingol@mail.ru>, 2003-2005             //
//   based on AutoIndent for textarea                                 //
//   (c) Roman "Kukutz" Ivanov, Evgeny Nedelko, 2003                  //
// Many thanks to Alexander Babaev, Sergey Kruglov, Evgeny Nedelko    //
//             and Nikolay Jaremko                                    //
// http://wackowiki.com/WikiEdit                                      //
//                                                                    //
////////////////////////////////////////////////////////////////////////

For license see LICENSE.TXT
*/
var WikiEdit = function(){
 this.mark = "##inspoint##";
 this.begin = "##startpoint##";
 this.rbegin = new RegExp(this.begin);
 this.end = "##endpoint##";
 this.rend = new RegExp(this.end);
 this.rendb = new RegExp("^" + this.end);
 this.enabled = true;
 this.tab = false;
 this.enterpressed = false;
 this.undostack = new Array();
 this.buttons = new Array();
}

WikiEdit.prototype = new ProtoEdit();
WikiEdit.prototype.constructor = WikiEdit;

// initialisation
WikiEdit.prototype.init = function(id, name, nameClass, imgPath) {

 if (!(isMZ || isIE || isO8)) return;
 this.mzBugFixed=true;
 if (isMZ && navigator.userAgent.substr(navigator.userAgent.indexOf("Gecko/")+6,4)=="2003" ) {
  this.mzBugFixed=(navigator.userAgent.substr(navigator.userAgent.indexOf("Gecko/")+6,8)>20030510);
  mzOld=(navigator.userAgent.substr(navigator.userAgent.indexOf("Gecko/")+6,8)<20030110);
  if (mzOld) this.MZ=false;
  else this.MZ=true;
 }
 if (isMZ && navigator.userAgent.substr(navigator.userAgent.indexOf("Gecko/")+6,4)=="2002" ) this.MZ=false;
 if (!(this.MZ || isIE || isO8)) return;

 this._init(id);

// if (!this.area.id) this.area.id = "area_"+String(Math.floor(Math.random()*10000));

 this.imagesPath = (imgPath?imgPath:"images/");
 this.editorName = name;
 this.editorNameClass = nameClass;

 this.actionName = "document.getElementById('" + this.id + "')._owner.insTag";

 if (isMZ || isO8)
 {
 try {
  this.undotext = this.area.value;
  this.undosels = this.area.selectionStart;
  this.undosele = this.area.selectionEnd;
 } catch(e){};
 }
 if (isIE)
 {
  this.area.addBehavior(this.imagesPath+"sel.htc");
 }

 this.addButton("h1","标题","'!','',0,1");
// this.addButton("h2","Heading 2","'!!','',0,1");
// this.addButton("h3","Heading 3","'!!!','',0,1");
// this.addButton(" ");
 this.addButton("bold","粗体","'\\'\\'','\\'\\''");
 this.addButton("italic","斜体","'//','//'");
 this.addButton("underline","底线","'__','__'");
 this.addButton("strike","删除线","'--','--'");
 this.addButton("superscript","上标","'^^','^^'");
 this.addButton("subscript","下标","'~~','~~'"); 
// this.addButton(" ");
 this.addButton("ul","清单","'*','',0,1,1");
 this.addButton("ol","数字清单","'#','',0,1,1");
// this.addButton(" ");
 this.addButton("indent","缩排","'\\t','',0,1");
 this.addButton("outdent","取消缩排","","document.getElementById('" + this.id + "')._owner.unindent");
 this.addButton("quote","引言","'>',''");
// this.addButton(" "); 
 this.addButton("hr","分隔线","'','\\n----\\n',2");
 this.addButton("textred","红字","'@@color:red;','@@',2");
 this.addButton("hilitecolor","强调","'@@','@@',2");
 this.addButton("createlink","炼结","","document.getElementById('" + this.id + "')._owner.createLink");
 this.addButton("createimage","内嵌图档","","document.getElementById('" + this.id + "')._owner.createImage");
 this.addButton("createtable","插入表格","'','\\n|!  |!  A  |!  B  |!  C  |!  D  |\\n|!1|  |  |  |  |\\n|!2|  |  |  |  |\\n|!3|  |  |  |  |\\n',2");
// this.addButton(" ");
 this.addButton("help","帮助","","document.getElementById('" + this.id + "')._owner.help");
/*
 this.addButton("customhtml",'<td><div style="font:12px Arial;text-decoration:underline; padding:4px;" id="hilfe_' + this.id + '" onmouseover=\'this.className="btn-hover";\' '
	+ 'onmouseout=\'this.className="btn-";\' class="btn-" '
	+ 'onclick="this.className=\'btn-pressed\';window.open(\'http://www.tiddlywiki.com/#ExtendedFormatting%20EmbeddedImages\');" '
	+ ' title="Help on TiddlyWiki Formatting">Help</a>'
	+ '</div></td>');
*/

 try {
  var toolbar = document.createElement("div");
  toolbar.id = "tb_"+this.id;
  this.area.parentNode.insertBefore(toolbar, this.area);
  toolbar = document.getElementById("tb_"+this.id);
  toolbar.innerHTML = this.createToolbar(1);
 } catch(e){};
}

// switch TAB key interception on and off
WikiEdit.prototype.switchTab = function() {
 this.tab = !this.tab;
}

// internal functions ----------------------------------------------------
WikiEdit.prototype._LSum = function (Tag, Text, Skip)
{
 if (Skip)
 {
  var bb = new RegExp("^([ ]*)([*][*])(.*)$");
  q = Text.match(bb);
  if (q!=null)
  {
   Text = q[1]+Tag+q[2]+q[3];
   return Text;
  }
  var w = new RegExp("^([ ]*)(([*]|([1-9][0-9]*|[a-zA-Z])([.]|[)]))( |))(.*)$");
  q = Text.match(w);
  if (q!=null)
  {
   Text = q[1]+q[2]+Tag+q[7];
   return Text;
  }
 }
 var w  = new RegExp("^([ ]*)(.*)$");
 q = Text.match(w);
 Text = q[1]+Tag+q[2];
 return Text;
}

WikiEdit.prototype._RSum = function (Text, Tag)
{
 var w  = new RegExp("^(.*)([ ]*)$");
 q = Text.match(w);
 Text = q[1]+Tag+q[2];
 return Text;
}

WikiEdit.prototype._TSum = function (Text, Tag, Tag2, Skip)
{
 var bb = new RegExp("^([ ]*)"+this.begin+"([ ]*)([*][*])(.*)$");
 q = Text.match(bb);
 if (q!=null)
 {
  Text = q[1]+this.begin+q[2]+Tag+q[3]+q[4];
 }
 else
 {
  var w = new RegExp("^([ ]*)"+this.begin+"([ ]*)(([*]|([1-9][0-9]*|[a-zA-Z])([.]|[)]))( |))(.*)$");
  q = Text.match(w);
  if (Skip && q!=null)
  {
   Text = q[1]+this.begin+q[2]+q[3]+Tag+q[8];
  }
  else
  {
   var w = new RegExp("^(.*)"+this.begin+"([ ]*)(.*)$");
   var q = Text.match(w);
   if (q!=null)
   {
    Text = q[1]+this.begin+q[2]+Tag+q[3];
   }
  }
 }
 var w = new RegExp("([ ]*)"+this.end+"(.*)$");
 var q = Text.match(w);
 if (q!=null)
 {
  var w = new RegExp("^(.*)"+this.end);
  var q1 = Text.match(w);
  if (q1!=null)
  {
   var s = q1[1];
   ch = s.substring(s.length-1, s.length);
   while (ch == " ") {
      s = s.substring(0, s.length-1);
      ch = s.substring(s.length-1, s.length);
   }
   Text = s+Tag2+q[1]+this.end+q[2];
  }
 }
 return Text;
}

WikiEdit.prototype.MarkUp = function (Tag, Text, Tag2, onNewLine, expand, strip)
{
 var skip = 0;
 if (expand == 0) skip = 1;
 var r = '';
 var fIn = false;
 var fOut = false;
 var add = 0;
 var f = false;
 var w = new RegExp("^  ( *)(([*]|([1-9][0-9]*|[a-zA-Z])([.]|[)]))( |))");
 if (!isO8) Text = Text.replace(new RegExp("\r", "g"), "");
 if (!isO8) var lines = Text.split('\n');
 else var lines = Text.split('\r\n');
 for(var i = 0; i < lines.length; i++) {
   if (this.rbegin.test(lines[i]))
     fIn = true;
   if (this.rendb.test(lines[i]))
     fIn = false;
   if (this.rend.test(lines[i]))
     fOut = true;
   if (this.rendb.test(lines[i+1])) {
     fOut = true;
     lines[i+1]=lines[i+1].replace(this.rend, "");
     lines[i]=lines[i]+this.end;
   }
   if (r != '')
     r += '\n';

  if (fIn && strip==1) {
    if (this.rbegin.test(lines[i]))
    {
     lines[i] = lines[i].replace(this.rbegin, "");
     f = true;
    } else f=false;
//  alert(lines[i].replace(new RegExp("\n","g"),"|").replace(new RegExp(" ","g"),"_"));
    lines[i] = lines[i].replace(w, "$1");
//  alert(lines[i].replace(new RegExp("\n","g"),"|").replace(new RegExp(" ","g"),"_"));
    if (f) lines[i] = this.begin+lines[i];
  }
/*
 fIn &&
  onNewLine==0 //äîáàâëÿåì òàãè.
  onNewLine==1 //äîáàâëÿåì òàãè, åñëè ïåðâàÿ ñòðîêà
  onNewLine==2 //äîáàâëÿåì òàãè, åñëè ïåðâàÿ_è_ïîñëåäíÿÿ ñòðîêà, èíà÷å
   //äîáàâëÿåì ïåðâûé òàã, åñëè ïåðâàÿ ëèáî äîáàâëÿåì ïîñëåäíèé, åñëè ïîñëåäíÿÿ
 //èíà÷å äîáàâëÿåì íåèçìåííûé òåêñò
*/
  if (fIn && (onNewLine==0 | (onNewLine==1 && add==0) | (onNewLine==2 && (add==0 || fOut)))) {
  //äîáàâëÿåì òàãè
    if (expand==1) {
      l = lines[i];
      if (add==0) l = this._LSum(Tag, l, skip);
      if (fOut)   l = this._RSum(l, Tag2);
      if (add!=0 && onNewLine!=2) l = this._LSum(Tag, l, skip);
      if (!fOut  && onNewLine!=2) l = this._RSum(l, Tag2);
      r += l;
    } else {
/*
  íå ýêñïàíä. ýòî çíà÷èò, ÷òî
  åñëè ïåðâàÿ ñòðîêà, òî äîáàâëÿåì ðåïëåéñîì ïåðâûé è ñóììîé âòîðîé
  åñëè ïîñëåäíÿÿ, òî äîáàâëÿåì ñóììîé ïåðâûé è ðåïëåéñîì âòîðîé
  åñëè ïåðâàÿ è ïîñëåäíÿÿ, òî îáà ðåïëåéñîì
  èíà÷å ñóììîé
*/
//    alert(lines[i].replace(new RegExp("\n","g"),"|").replace(new RegExp(" ","g"),"_"));
//    alert(lines[i+1].replace(new RegExp("\n","g"),"|").replace(new RegExp(" ","g"),"_"));
      l = this._TSum(lines[i], Tag, Tag2, skip);
      if (add!=0 && onNewLine!=2) l = this._LSum(Tag, l, skip);
      if (!fOut  && onNewLine!=2) l = this._RSum(l, Tag2);
      r += l;
    }
    add++;
  } else {
  //äîáàâëÿåì íåèçìåííûé òåêñò
    r += lines[i];
  }
  if (fOut)
   fIn = false;
 }
 return r;
}

WikiEdit.prototype.keyDown = function (e) {

  if (!this.enabled) return;

  if (!e) var e = window.event;
  
  var l, q, l1, re, tr, str, t, tr2, tr1, r1, re, q, e;
  var justenter = false;
  var wasEvent = remundo = res = false;
  if (isMZ) var noscroll = false;

  var t = this.area;

  var Key = e.keyCode;
  if (Key==0) Key = e.charCode;
  if (Key==8 || Key==13 || Key==32 || (Key>45 && Key<91) || (Key>93 && Key<112) || (Key>123 && Key<144)
      || (Key>145 && Key<255)) remundo = Key;
  if (e.altKey && !e.ctrlKey) Key=Key+4096;
  if (e.ctrlKey) Key=Key+2048;

  if (isMZ && e.type == "keypress" && this.checkKey(Key))
  {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  if (isMZ && e.type == "keyup" && (Key==9 || Key==13))
    return false;

  if (isMZ || isO8) 
  {
   var scroll = t.scrollTop;
   undotext = t.value;
   undosels = t.selectionStart;
   undosele = t.selectionEnd;
  }

  if (isIE)
  {
    tr  = document.selection.createRange();
    str = tr.text;
  } else {
    str = t.value.substr(t.selectionStart, t.selectionEnd - t.selectionStart);
  }
  sel = (str.length > 0);

  if (isIE && Key==2048+187) Key=2048+61; //
  if (isIE && Key==2048+189 && e.shiftKey) Key=2048+95; //

  switch (Key)
  {
  case 2138: //Z
   if ((isMZ || isO8) && this.undotext) {
    t.value = this.undotext;
    t.setSelectionRange(this.undosels, this.undosele);
    this.undotext = "";
   }
  break;
  case 9:  //Tab
  case 2132: //T
  case 4181: //U
  case 4169: //I
   if (this.tab || Key!=9)
   if (e.shiftKey || Key==4181) {
     res = this.unindent();
   } else {
     res = this.insTag("  ", "", 0, 1);
   }
  break;
  case 2097:   //1
    res = this.insTag("!", "!", 0, 1);
  break;
  case 2098:   //2
    res = this.insTag("!!", "!!", 0, 1);
  break;
  case 2099:   //3
    res = this.insTag("!!!", "!!!", 0, 1);
  break;
  case 2100:   //4
    res = this.insTag("!!!", "!!!", 0, 1);
  break;
  case 2109: //=
   if (sel)
    res = this.insTag("++", "++");
  break;
  case 2143: //_
//   if (sel) //&& e.shiftKey)
    res = this.insTag("", "\n----\n", 2);
  break;
  case 2114: //B
   if (sel)
    res = this.insTag("\'\'", "\'\'");
  break;
  case 2131:  //S
   if (sel)
    res = this.insTag("--", "--");
  break;
  case 2133: //U
   if (sel)
    res = this.insTag("__", "__");
  break;
  case 2121: //I
   if (sel)
    res = this.insTag("//", "//");
  break;
  case 2122: //J
   if (sel)
    res = this.insTag("@@", "@@", 2);
  break;
  case 2120: //H
   if (sel)
    res = this.insTag("??", "??", 2);
  break;
  case 4179: //Alt+S
    try {
      if (weSave!=null) weSave();
    }
    catch(e){};
  break;
  case 2124:   //L
  case 4172:
    if (e.shiftKey && e.ctrlKey) {
      res = this.insTag("* ", "", 0, 1, 1);
    } else if (e.altKey || e.ctrlKey) {
      res = this.createLink(e.altKey);
    }
  break;
  case 2127: //O
  case 2126: //N
   if (e.ctrlKey && e.shiftKey)
    res = this.insTag("#", "", 0, 1, 1);
  break;
  case 13:
  case 2061:
  case 4109:
   if (e.ctrlKey) {//Ctrl+Enter
    try {
      if (weSave!=null) weSave();
    }
    catch(e){};
   }
   else if (e.shiftKey) { //Shift+Enter
     res = false;
   }
   else
   {
     var text = t.value;
     if (!isO8) text = text.replace(/\r/g, "");
     var sel1 = text.substr(0, t.selectionStart);
     var sel2 = text.substr(t.selectionEnd);           
     //if (isO8) sel1 = sel1.replace(/\r\n$/, "");
     re = new RegExp("(^|\n)(( +)((([*]|([1-9][0-9]*|[a-zA-Z])([.]|[)]))( |))|))("+(this.enterpressed?"\\s":"[^\r\n]")+"*)"+(this.mzBugFixed?"":"\r?\n?")+"$");
     q = sel1.match(re);
     if (q!=null) 
     {
      if (!this.enterpressed) 
      {
       if (q[3].length % 2==1)
        q[2] = "";
       else
       {
        re = new RegExp("([1-9][0-9]*)([.]|[)])");
        q2 = q[2].match(re);
        if (q2!=null) 
          q[2]=q[2].replace(re, String(Number(q2[1])+1)+q2[2]);
       }
      }
      else
      {
       sel1 = sel1.replace(re, "");
       q[2] = "";
      }
      
      if (isMZ) q[2] = q[2].replace(/ $/, "");
      
      t.value=sel1+(this.mzBugFixed?"\n":"")+q[2]+sel2;
      sel = q[2].length + sel1.length + (this.mzBugFixed?1:0) + (isO8?1:0);
      t.setSelectionRange(sel, sel);

      if (isMZ && q[2] != "") {
        try {
          var newEvent = document.createEvent("KeyEvents");
          newEvent.initKeyEvent("keypress", true, true, document.defaultView, 
                                e.ctrlKey, e.altKey, e.shiftKey, 
                                e.metaKey, 0, " ".charCodeAt(0));
          e.preventDefault();
          e.target.dispatchEvent(newEvent);
          wasEvent = true;
        } catch(e){}; 
      } else if (isIE) {
       var op = this.area;
       var tp = 0; var lf = 0;
       do {
         tp+=op.offsetTop;
         lf+=op.offsetLeft;
       } while (op=op.offsetParent);
       if (tr.offsetTop >= this.area.clientHeight+tp) tr.scrollIntoView(false);
      }
      res = true;
     }
    var justenter = true;
   }
  break;
  }

  this.enterpressed = justenter;
  if (!res && remundo) {//alert(remundo+"|"+Key+"|"+this.undotext1);
   this.undotext = "";
  }

  if (res)
  {
    this.area.focus();
    if (isMZ || isO8) {
     this.undotext=undotext;
     this.undosels=undosels;
     this.undosele=undosele;
     if (wasEvent) return true;
     e.cancelBubble = true;
     e.preventDefault();
     e.stopPropagation();
    } 
    if (!noscroll) t.scrollTop = scroll;
    e.returnValue = false;
    return false;
  }
}

WikiEdit.prototype.getDefines = function ()
{
  var t = this.area;

  text = t.value;
  if (!isO8) text = text.replace(/\r/g, "");
  this.ss = t.selectionStart;
  this.se = t.selectionEnd;

  this.sel1 = text.substr(0, this.ss);
  this.sel2 = text.substr(this.se);
  this.sel = text.substr(this.ss, this.se - this.ss);
  this.str = this.sel1+this.begin+this.sel+this.end+this.sel2;

  if (isMZ) 
  {
   this.scroll = t.scrollTop;
   this.undotext = t.value;
   this.undosels = t.selectionStart;
   this.undosele = t.selectionEnd;
  }

}

WikiEdit.prototype.setAreaContent = function (str)
{
  var t = this.area;
  q = str.match(new RegExp("((.|\n)*)"+this.begin));//?:
  l = q[1].length;

  if (isO8) l = l + q[1].split('\n').length - 1;
    
  q = str.match(new RegExp(this.begin+"((.|\n)*)"+this.end));
  l1 = q[1].length;

  if (isO8) l1 = l1 + q[1].split('\n').length - 1;  
  
  str = str.replace(this.rbegin, "");
  str = str.replace(this.rend, "");
  t.value = str;
  t.setSelectionRange(l, l + l1);
  if (isMZ) t.scrollTop = this.scroll;
}

WikiEdit.prototype.insTag = function (Tag, Tag2, onNewLine, expand, strip)
{
/*
onNewLine:
0 - add tags on every line inside selection
1 - add tags only on the first line of selection
2 - add tags before and after selection
//3 - add tags only if there's one line -- not implemented

expand:
0 - add tags on selection
1 - add tags on full line(s)
*/
  if (onNewLine == null) onNewLine = 0;
  if (expand == null) expand = 0;
  if (strip == null) strip = 0;

  var t = this.area;
  t.focus();

  this.getDefines();

  //alert(Tag + " | " + Tag2 + " | " + onNewLine + " | " + expand + " | " + strip);
  str = this.MarkUp(Tag, this.str, Tag2, onNewLine, expand, strip);

  this.setAreaContent(str);

  return true;
}

WikiEdit.prototype.unindent = function ()
{
  var t = this.area;
  t.focus();

  this.getDefines();

  var r = '';
  var fIn = false;
  var lines = this.str.split(isO8?'\r\n':'\n');
  var rbeginb = new RegExp("^" + this.begin);
  for(var i = 0; i < lines.length; i++)
  {
    var line = lines[i];
    if (this.rbegin.test(line)) {
      fIn = true;
      var rbeginb = new RegExp("^"+this.begin+"([ ]*)");
      line = line.replace(rbeginb, '$1'+this.begin); //catch first line
    }
    if (this.rendb.test(line)) {
      fIn = false;
    }
    if (r != '') {
      r += '\n';
    }
    if (fIn) {
      r += line.replace(/^(  )|\t/, '');
    } else {
      r += line;
    }
    if (this.rend.test(line)) {
      fIn = false;
    }
  }
  this.setAreaContent(r);
  return true;
}

WikiEdit.prototype.createLink = function (isAlt)
{
  var t = this.area;
  t.focus();

  this.getDefines();

  var n = new RegExp("\n");
  if (!n.test(this.sel)) {
    if (!isAlt) {
     lnk = prompt("Link:", this.sel);
     if (lnk==null) lnk = this.sel;
     sl = prompt("Text for linking:", this.sel);
     if (sl==null) sl = this.sel;
     this.sel = sl + (sl == ""?"":"|") + (lnk == ""?"Link":lnk);
    };
    str = this.sel1+"[["+this.trim(this.sel)+"]]"+this.sel2;
    t.value = str;
    t.setSelectionRange(this.sel1.length, str.length-this.sel2.length);
    return true;
  }
  return false;
}
WikiEdit.prototype.createImage = function (isAlt)
{
  var t = this.area;
  t.focus();

  this.getDefines();

  var n = new RegExp("\n");
  if (!n.test(this.sel)) {
    if (!isAlt) {
	 img = prompt("ImageFile:", this.sel);
	 if (img==null) img = this.sel;
     lnk = prompt("ImageLink:", this.sel);
     if (lnk==null) lnk = this.sel;
     sl = prompt("ImageTitle/AltText", this.sel);
     if (sl==null) sl = this.sel;
     this.sel = "[img["+ (sl == ""?"AltText":sl)  +"|"+  (img == "" ?"ImageFile":img)  +"]"+ (lnk == ""?"":"["+lnk+"]") +"]";
    };
    str = this.sel1+""+this.trim(this.sel)+this.sel2;
    t.value = str;
    t.setSelectionRange(this.sel1.length, str.length-this.sel2.length);
    return true;
  }
  return false;
}
WikiEdit.prototype.help = function ()
{
 s =  "WikiEdit 3.01\n";
 s += "		作者：(c) Roman Ivanov, 2003-2005   \n";
 s += "		网址：http://wackowiki.com/WikiEdit \n";
 s += "\n";
 s += "TiddlyWiki 语法支援\n"
 s += "		作者：(c) Bram Chen, 2006-2008   \n";
 s += "		网址：http://ptw.sf.net \n";
 s += "\n";
 s += "快速键列表:\n";
 s += " Ctrl+B - 粗体\n";
 s += " Ctrl+I - 斜体\n";
 s += " Ctrl+U - 底线\n";
 s += " Ctrl+Shift+S - 删除线\n";
 s += " Ctrl+Shift+1 .. 4 - 标题 1..4\n";
 s += " Alt+I or Ctrl+T - 缩排\n";
 s += " Alt+U or Ctrl+Shift+T - 反缩排\n";
 s += " Ctrl+J - 标记 (@@)\n";
 s += " Ctrl+H - 标记 (??)\n";
 s += " Alt+L - 炼结\n";
 s += " Ctrl+L - 炼结说明\n";
 s += " Ctrl+Shift+L - 取消清单\n";
 s += " Ctrl+Shift+N - 数字清单\n";
 s += " Ctrl+Shift+O - 清单\n";
 s += " Ctrl+= - 小字\n";
 s += " Ctrl+Shift+Minus - 分隔线\n";
 s += " 说明事项: 快速键未支援Opera.\n";
 alert(s);
}