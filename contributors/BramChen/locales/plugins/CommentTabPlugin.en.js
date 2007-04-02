/***
|''Name:''|CommentTabPlugin.en|
|''Source:''|[[TiddlyWiki-zh|http://tiddlywiki-zh.googlecode.com/svn/trunk/contributors/BramChen/locales/plugins/]]|
|''Requires:''|[[CommentPlugin|http://sourceforge.net/project/showfiles.php?group_id=150646]], [[CommentTabPlugin|http://sourceforge.net/project/showfiles.php?group_id=150646]]|
|''Note:''|CommentPlugin and CommentTabPlugin modified by BramChen is required|
***/
//{{{
if (typeof config.macros.tiddlerComments != 'undefined'){
	config.shadowTiddlers.TabTimeline = "<<tabs txtTimelineTab Tiddlers Tiddlers TabTimelineTiddlers " + config.CommentPlugin.CPlingo.comments + config.CommentPlugin.CPlingo.CommentInTitle + ' TabTimelineComments>>';
	config.macros.tiddlerComments.dateFormat = "DD MMM YYYY";
}
//}}}