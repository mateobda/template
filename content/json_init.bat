@set @JScript=1/*
@echo off
setlocal

cscript //nologo //E:JScript "%~f0"
goto :eof

*/

// JScript
//

var ForReading= 1;
var ForWriting = 2;

var fso = new ActiveXObject("Scripting.FileSystemObject");
var currentDirectory = fso.GetAbsolutePathName(".");

var fsofolder = fso.GetFolder(currentDirectory);
var colFiles  = fsofolder.Files;
var fc = new Enumerator(colFiles);

var co = "";
var re = "";

for (; !fc.atEnd(); fc.moveNext() ) {
 var actualExtension = fso.GetExtensionName(fc.item())
 if ( actualExtension == "html"){
 	var fileName = fso.GetFileName(fc.item());
 	var section = fileName.split(".")[0].split("_")[1];
 	var sectionName = section.substring(0,2).toLowerCase();
 	var sectionNumber = Number(section.substring(2,4));
 	if(sectionName == "co"){
 		co += '{"order" : "'+ sectionNumber +'", "title": "Tema '+ sectionNumber +'", "link":"'+fileName+'"},';
 	}
 	if(sectionName == "re"){
 		re += '{"order" : "'+ sectionNumber +'", "title": "Resumen", "link":"'+fileName+'"},';
 	}
 }
}
var menu = '{"menu" : {"content" : ['+ co +'], "resume" : ['+ re +']}}';
menu =  menu.replace(/,]/g,"]");

var newFileName  = currentDirectory+"\\navigation.json";

if(fso.FileExists(newFileName)){
	fso.DeleteFile(newFileName);
}
var json = fso.CreateTextFile(newFileName, false);
json.writeline(menu);
json.Close();
//WScript.Echo(fso.FileExists(newFileName+"s"));
