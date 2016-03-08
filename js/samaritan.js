/*
 This file is part of Samaritan.

 Samaritan is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Samaritan is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Samaritan. If not, see <http://www.gnu.org/licenses/>.
 */

wordTime = 750;
thinkTime = 1750;
lengthMin = 3;
completeMax = 4;
font = '32px magdacleanmono-bold';
chance = 0.5;

function blink() {
    $('.blink').fadeOut(750).fadeIn(750);
}

function blink2() {
    $('.blink2').fadeOut(750).fadeIn(750);
}

function blink3() {
    $('.blink3').fadeOut(750).fadeIn(750);
}

function setSpinner(){
    $('#triangle').addClass('hidden');
    $('#spinner').removeClass('hidden');
}

function setTriangle(){
    $('#spinner').addClass('hidden');
    $('#triangle').removeClass('hidden');
}


function getParameter(param) {
    var pageURL = decodeURIComponent(window.location.search.substring(1)),
        urlVariables = pageURL.split('&'),
        parameterName,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        parameterName = urlVariables[i].split('=');

        if (parameterName[0] === param) {
            return parameterName[1] === undefined ? true : parameterName[1];
        }
    }
}

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function nextText(array , index , changeOffset){
    if(array == undefined)return;
    setTimeout(function(){
        if(index == array.length)setWord('' , false);
        else{
            var text = array[index];
            changeOffset = changeOffset || text.length <= lengthMin;
            if(index == 0){
                setScrambled(text ,changeOffset, function(){
                    nextText(array , index+1 , text.length <= lengthMin);
                });
            }else{
                setWord(text , changeOffset);
                nextText(array , index+1 , text.length <= lengthMin);
            }
        }
    }, wordTime);
}

function changeTextOffset(word){
    if(word.length == 0)removeTextOffset();
    else $('#text-container')
        .attr('style' , 'margin-left: ' + getTextWidth(word.substring(0 , lengthMin+1), font)/2 + 'px');
}

function removeTextOffset(){
    $('#text-container').removeAttr('style');
}

function setText(phrase){
    if(phrase == undefined)return;
    nextText(phrase.split(' ') , 0 , false);
}

function setWord(word , changeOffset){
    removeTextOffset();
    if(changeOffset)changeTextOffset(word);

    var text = $('#text');
    text.text(word);
    $('#line').attr('style' , 'width: '+ (word == '' ? 30 : getTextWidth(word , font))+'px;');
}


function randomChar(){
    return String.fromCharCode(35 + Math.random()*91);
}

function randomText(length){
    var text = "";

    for( var i=0; i < length; i++)
        text += randomChar();

    return text;
}

function setScrambled(originalText , changeOffset , onComplete){
    var complete = 0;
    var tmpText = randomText(originalText.length);
    var id = setInterval(function () {
        for(var i = 0; i < originalText.length ; i++){
            if(originalText.charAt(i) != tmpText.charAt(i)){
                if(Math.random()<chance && complete > completeMax){
                    tmpText = tmpText.substring(0 , i)+originalText.charAt(i)+tmpText.substring(i+1);
                    complete = 0;
                } else {
                    tmpText = tmpText.substring(0 , i)+randomText(1)+tmpText.substring(i+1);
                    complete++;
                }
            }
        }
        setWord(tmpText , changeOffset);
        if(tmpText == originalText){
            clearInterval(id);
            onComplete();
        }

    } , 15);
}

/*function calculatingResponse(){
    setSpinner();
    setWord("Calculating Response");
    setTimeout(function(){
        setWord('' , true);
        setTriangle();
    } , thinkTime);
}*/

$( document ).ready(function (){
    setInterval(blink,500);
    setTimeout(function(){setInterval(blink2, 500)}, 500);
    setTimeout(function(){setInterval(blink3, 500)}, 1000);
    setText(getParameter("msg"));
});
