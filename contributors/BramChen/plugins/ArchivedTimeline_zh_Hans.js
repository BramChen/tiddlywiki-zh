/***
!Metadata:
|''Name:''|ArchivedTimeline_zh-Hans|
|''Date:''|Nov 18, 2006|
|''Source:''|http://tiddlywiki-zh.googlecode.com/svn/trunk/contributors/BramChen/plugins/|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.0.11|
|''Required:''|ArchivedTimeline|
|''Browser:''|Firefox 1.5+; InternetExplorer 6.0|

!Revision History:
|''Version''|''Date''|''Note''|
|0.6.1|Nov 18, 2006|Initial release|

!Code section:
***/
//{{{
version.extensions.archivedTimeline_zh_Hans = {major: 0, minor: 6, revision: 1,
	date: new Date("Nov 18, 2006"),
	name: "ArchivedTimeline_zh-Hans",
	type: "Lingo",
	author: "BramChen",
	source: "http://tiddlywiki-zh.googlecode.com/svn/trunk/contributors/BramChen/plugins/"
};

if (typeof config.macros.archivedTimeline != "undefined"){
	merge(config.macros.archivedTimeline, {
		tooltips: "归档顺序: ",
		orderBy: {modified: "修改日期", created: "创建日期"},
		dateFormat: "YYYY0MM0DD"
	});
}
//}}}