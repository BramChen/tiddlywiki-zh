/***
|''Name:''|CollapseTiddlersPlugin.zh-Hant|
|''Source:''|[[TiddlyWiki-zh|http://tiddlywiki-zh.googlecode.com/svn/trunk/contributors/BramChen/locales/plugins/]]|
|''Require:''|[[CollapseTiddlersPlugin|http://www.tiddlytools.com/#CollapseTiddlersPlugin]]|
***/
//{{{
if (typeof commands.collapseTiddler != "undefined"){
	config.commands.collapseTiddler.text="摺合";
	config.commands.collapseTiddler.tooltip="摺合本文章";
	config.commands.expandTiddler.text="展開";
	config.commands.expandTiddler.tooltip="展開本文章";
	config.commands.collapseOthers.text="摺合其他";
	config.commands.collapseOthers.tooltip="展開本文章，並摺合其他以開啟的文章";
};
//}}}