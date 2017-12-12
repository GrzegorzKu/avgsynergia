/* *
 *	Licencja MIT
 *	Copyright (c) 2017 Grzegorz Kupyczk kupczykgrzeg@gmail.com
 *
 
 *
 *	Niniejszym gwarantuje się, bez opłat, że każda osoba która wejdzie w posiadanie kopii tego
 *	oprogramowania i związanych z nim plików dokumentacji (dalej „Oprogramowanie”) może
 *	wprowadzać do obrotu Oprogramowanie bez żadnych ograniczeń, w tym bez ograniczeń
 *	prawa do użytkowania, kopiowania, modyfikowania, łączenia, publikowania,
 *	dystrybuowania, sublicencjonowania i/lub sprzedaży kopii Oprogramowania a także
 *	zezwalania osobie, której Oprogramowanie zostało dostarczone czynienia tego samego, z
 *	zastrzeżeniem następujących warunków:
 *
 
 *
 *	Powyższa nota zastrzegająca prawa autorskie oraz niniejsza nota zezwalająca muszą zostać
 *	włączone do wszystkich kopii lub istotnych części Oprogramowania.
 *	OPROGRAMOWANIE JEST DOSTARCZONE TAKIM, JAKIE JEST, BEZ JAKIEJKOLWIEK GWARANCJI,
 *	WYRAŹNEJ LUB DOROZUMIANEJ, NIE WYŁĄCZAJĄC GWARANCJI PRZYDATNOŚCI HANDLOWEJ LUB
 *	PRZYDATNOŚCI DO OKREŚLONYCH CELÓW A TAKŻE BRAKU WAD PRAWNYCH. W ŻADNYM
 *	PRZYPADKU TWÓRCA LUB POSIADACZ PRAW AUTORSKICH NIE MOśE PONOSIĆ
 *	ODPOWIEDZIALNOŚCI Z TYTUŁU ROSZCZEŃ LUB WYRZĄDZONEJ SZKODY A TAKŻE ŻADNEJ INNEJ
 *	ODPOWIEDZIALNOŚCI CZY TO WYNIKAJĄCEJ Z UMOWY, DELIKTU, CZY JAKIEJKOLWIEK INNEJ
 *	PODSTAWY POWSTAŁEJ W ZWIĄZKU
 *
 * */
"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var WeightedAverage=function(){function WeightedAverage(){_classCallCheck(this,WeightedAverage);this._rawValues=0;this._weights=0}_createClass(WeightedAverage,[{key:"add",value:function add(v,w){this._rawValues+=v*w;this._weights+=w}},{key:"appendAverage",value:function appendAverage(wavg){this.add(wavg.rawValue,wavg.weights)}},{key:"reset",value:function reset(){this._rawValues=0;this._weights=0}},{key:"value",get:function get(){if(this._weights!==0)return this._rawValues/this._weights;return 1}},{key:"rawValue",get:function get(){return this._rawValues}},{key:"weights",get:function get(){return this._weights}}]);return WeightedAverage}();var Mark=function(){function Mark(boxElement,grade,weight){_classCallCheck(this,Mark);if(boxElement){this._$boxElement=$(boxElement);this._$aElement=this._$boxElement.children().first();var value=this._$aElement.text();this._value=this.parseValue(value);if(typeof this._value==="number"){this._countable=true;this._countToAverage=this.parseCountToAverage(this._$aElement.attr("title"));this._weight=this.parseWeight(this._$aElement.attr("title"));if(this._countToAverage!==null&&this._weight!==null)this._countable=true;else this._countable=false}else{this._countable=false;this._countToAverage=false;this._weight=0}}else{this._value=grade;this._weight=weight;this._countToAverage=true;this._countable=true;this._$boxElement=this._generateBox();this._$aElement=this._$boxElement.children().first()}}_createClass(Mark,[{key:"parseValue",value:function parseValue(v){var re=/^\d(\-|\+)?$/;var val=0;if(re.test(v)){val=parseInt(v);if(v[v.length-1]==="-")return val-0.25;if(v[v.length-1]==="+")return val+0.5;return val}else{val=v}return val}},{key:"reverseParseValue",value:function reverseParseValue(v){if(v==v.toFixed())return v;var frac=v-v.toFixed();if(frac==-0.25)return v.toFixed()+"-";if(frac==-0.5)return parseInt(v)+"+";return v}},{key:"parseWeight",value:function parseWeight(text){var index=text.indexOf("Waga: ");if(index===-1)return null;return parseInt(text.substring(index+6,index+8))}},{key:"parseCountToAverage",value:function parseCountToAverage(text){if(text.indexOf("Licz do \u015Bredniej: tak")!==-1)return true;if(text.indexOf("Licz do \u015Bredniej: nie")!==-1)return false;return null}},{key:"_generateBox",value:function _generateBox(){var bgcolor="black";var color="white";var box=$("<span>").addClass("grade-box").css("background-color",bgcolor).css("border-color",color);$("<a>").attr("href","javascript:void(0)").addClass("ocena").css("color",color).text(this.reverseParseValue(this._value)).attr("title",this._generateTitle()).tooltip().appendTo(box);return box}},{key:"_generateTitle",value:function _generateTitle(){var d=new Date;var teacher=this._teacher;return"Kategoria: ocena niestandardowa<br>"+"Data: "+d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+"<br>"+"Nauczyciel: "+teacher+"<br>"+"Licz do \u015Bredniej: tak<br>"+"Waga: "+this._weight+"<br>"+"Doda\u0142: "+teacher}},{key:"value",get:function get(){return this._value}},{key:"weight",get:function get(){return this._weight}},{key:"countable",get:function get(){return this._countable}},{key:"countToAverage",get:function get(){return this._countToAverage}},{key:"multipliedValue",get:function get(){return this._value*this._weight}},{key:"$boxElement",get:function get(){return this._$boxElement}},{key:"_teacher",get:function get(){if(Mark.prototype.teacher){return Mark.prototype.teacher}else{var t=$("#user-section b").text();var match=t.indexOf("(ucze\u0144");if(match!==-1){t=t.substring(0,match);Mark.prototype.teacher=t.trim();return Mark.prototype.teacher}match=t.indexOf("(rodzic");if(match!==-1){t=t.substring(0,match);Mark.prototype.teacher=t.trim();return Mark.prototype.teacher}Mark.prototype.teacher=t.trim();return Mark.prototype.teacher}}}]);return Mark}();var Subject=function(){function Subject(row){_classCallCheck(this,Subject);var cells=$(row).children();this._name=$.trim($(cells[1]).text())||"brak nazwy";this._marks_I=[];this._marks_II=[];this._marks_extra_I=[];this._marks_extra_II=[];this._marks_cell_I=cells[2];this._marks_cell_II=cells[5];this._average_cell_I=cells[3];this._average_cell_II=cells[6];this._average_cell_III=cells[8];this._readMarks();this.updateAverages()}_createClass(Subject,[{key:"updateAverages",value:function updateAverages(){var avg_I=new WeightedAverage,avg_II=new WeightedAverage;var marks_I=$.merge($.merge([],this._marks_I),this._marks_extra_I);var marks_II=$.merge($.merge([],this._marks_II),this._marks_extra_II);$.each(marks_I,function(i,m){if(m.countable)avg_I.add(m.value,m.weight)});$.each(marks_II,function(i,m){if(m.countable)avg_II.add(m.value,m.weight)});if(marks_I.length!==0)$(this._average_cell_I).text(avg_I.value.toFixed(2));if(marks_II.length!==0)$(this._average_cell_II).text(avg_II.value.toFixed(2));if(marks_II.length!==0){avg_I.appendAverage(avg_II);$(this._average_cell_III).text(avg_I.value.toFixed(2))}}},{key:"addMark",value:function addMark(mark,semester){if(semester==0){this._marks_extra_I.push(mark);if($(this._marks_cell_I).text()=="Brak ocen")$(this._marks_cell_I).html("");mark.$boxElement.appendTo(this._marks_cell_I)}else{this._marks_extra_II.push(mark);if($(this._marks_cell_II).text()=="Brak ocen")$(this._marks_cell_II).html("");mark.$boxElement.appendTo(this._marks_cell_II)}this.updateAverages()}},{key:"resetMarks",value:function resetMarks(){$.merge(this._marks_extra_I,this._marks_extra_II).forEach(function(m){m.$boxElement.remove()});this._marks_extra_I=[];this._marks_extra_II=[];this.updateAverages()}},{key:"_readMarks",value:function _readMarks(){var self=this;$(this._marks_cell_I).children().each(function(i,m){self._marks_I.push(new Mark(m))});$(this._marks_cell_II).children().each(function(i,m){self._marks_II.push(new Mark(m))})}},{key:"name",get:function get(){return this._name}},{key:"marks_I",get:function get(){return this._marks_I}},{key:"marks_II",get:function get(){return this._marks_II}}]);return Subject}();var Controller=function(){function Controller(){_classCallCheck(this,Controller);this._subjects=[];this._readSubjects();this._fillForm();this._attachButtons();this._attachDisplay();$("#AverageFloating thead").click()}_createClass(Controller,[{key:"addMark",value:function addMark(){var sub=parseInt($("#avSubject").val());var semester=parseInt($("#avSemester").val());var grade=parseFloat($("#avRating").val());var weight=parseInt($("#avWeight").val());var mark=new Mark(false,grade,weight);this._subjects[sub].addMark(mark,semester)}},{key:"clearMarks",value:function clearMarks(){this._subjects.forEach(function(s){s.resetMarks()})}},{key:"normalize",value:function normalize(){$(".decorated.stretch:visible>tbody").toggleClass("markNormalize")}},{key:"_readSubjects",value:function _readSubjects(){var mark_rows=$(".decorated.stretch:visible>tbody").children().filter(function(i,e){return $(e).attr("id")===undefined});var self=this;mark_rows.each(function(i,r){if(mark_rows.length-1==i)return;self._subjects.push(new Subject(r))})}},{key:"_fillForm",value:function _fillForm(){var subs=$("#avSubject");this._subjects.forEach(function(e,i){$("<option>").attr("value",i).text(e.name).appendTo(subs)})}},{key:"_attachButtons",value:function _attachButtons(){$("#avSubmit").click(this.addMark.bind(this));$("#avReset").click(this.clearMarks.bind(this));$("#avNormalize").click(this.normalize.bind(this))}},{key:"_attachDisplay",value:function _attachDisplay(){var _this=this;this._pane_hidded=false;$("#avHide").click(function(e){if(_this._pane_hidded){$("#AverageFloating").animate({bottom:0});_this._pane_hidded=!_this._pane_hidded}else{var height=$("#AverageFloating").height()-($("#avHide").height()+parseInt($("#AverageFloating table").css("margin-top")));console.log(height);$("#AverageFloating").animate({bottom:-height});_this._pane_hidded=!_this._pane_hidded}})}}]);return Controller}();$(function(){var ext={style:"#AverageFloating{position:fixed;bottom:0;right:0;z-index:50;min-height:200px;min-width:300px}.markNormalize .grade-box{background-color:#deb887!important;color:#000!important}input[type=number]{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;border-radius:5px;border:1px solid #dfdfe0;background:#FFF;padding:0 5px;height:25px;line-height:25px;width:170px;margin:0 5px;color:#717171;font-size:12px!important;outline:0;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box}#avHide{cursor:pointer}",floating:"<div id=\"AverageFloating\"><table class=\"decorated form center\"><thead><tr><td id=\"avHide\" colspan=\"2\" title=\"Ukryj panel wprowadzania ocen\">Dodaj ocen\u0119</td></tr></thead><tbody><tr class=\"line1\"><th>Przedmiot</th><td><select id=\"avSubject\" tabindex=\"0\" class=\"left\"></select></td></tr><tr class=\"line0\"><th>Semestr</th><td><select id=\"avSemester\" tabindex=\"1\" class=\"small left\"><option value=\"0\" selected=\"1\">1</option><option value=\"1\">2</option></select></td></tr><tr class=\"line1\"><th>Ocena</th><td><select name=\"\" id=\"avRating\" class=\"small left\" tabindex=\"2\"><option value=\"0\" selected=\"0\">0</option><option value=\"0.75\" selected=\"0\">1-</option><option value=\"1\" selected=\"0\">1</option><option value=\"1.5\" selected=\"0\">1+</option><option value=\"1.75\" selected=\"0\">2-</option><option value=\"2\" selected=\"0\">2</option><option value=\"2.5\" selected=\"0\">2+</option><option value=\"2.75\" selected=\"0\">3-</option><option value=\"3\" selected=\"0\">3</option><option value=\"3.5\" selected=\"0\">3+</option><option value=\"3.75\" selected=\"0\">4-</option><option value=\"4\" selected=\"0\">4</option><option value=\"4.5\" selected=\"0\">4+</option><option value=\"4.75\" selected=\"0\">5-</option><option value=\"5\" selected=\"1\">5</option><option value=\"5.5\" selected=\"0\">5+</option><option value=\"5.75\" selected=\"0\">6-</option><option value=\"6\" selected=\"0\">6</option><option value=\"6.5\" selected=\"0\">6+</option></select></td></tr><tr class=\"line0\"><th>Waga</th><td><input id=\"avWeight\" type=\"number\" tabindex=\"3\" value=\"1\" class=\"left\"></td></tr></tbody><tfoot><tr><td colspan=\"2\"><button id=\"avSubmit\" tabindex=\"30\" class=\"small ui-button ui-widget ui-state-default ui-corner-all\">Dodaj</button><button id=\"avReset\" tabindex=\"31\" class=\"small ui-button ui-widget ui-state-default ui-corner-all\">Wyczy\u015B\u0107</button><button id=\"avNormalize\" tabindex=\"32\" class=\"small ui-button ui-widget ui-state-default ui-corner-all\">Ujednolicenie</button></td></tr></tfoot></table></div>"};$(document.head).append($.parseHTML("<style type=\"text/css\">"+ext.style+"</style>"));$(document.body).append($.parseHTML(ext.floating));var ctrl=new Controller;console.log("Automatyczne liczenie \u015Bredniej mo\u017Cliwe dzi\u0119ki %cGrzesiowi Kupczyk %c;)","color:yellowgreen","color:inherit")});