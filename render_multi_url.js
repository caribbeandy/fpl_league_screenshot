// Render Multiple URLs to file

"use strict";
var RenderUrlsToFile, arrayOfUrls, system;

system = require("system");

/*
Render given urls
@param array of URLs to render
@param callbackPerUrl Function called after finishing each URL, including the last URL
@param callbackFinal Function called after finishing everything
*/
RenderUrlsToFile = function(urls, callbackPerUrl, callbackFinal) {
    var getFilename, next, page, retrieve, urlIndex, webpage;
    urlIndex = 0;
    webpage = require("webpage");
    page = null;
    getFilename = function() {
        return "rendermulti-" + urlIndex + ".png";
    };
    next = function(status, url, file) {
        page.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };
    retrieve = function() {
        var url;
        var width = 1000;
        var height = 1050;

        if (urls.length > 0) {
            url = urls.shift();
            urlIndex++;
            page = webpage.create();
            page.viewportSize = {width: width, height: height};
			page.evaluate(function(w, h) {
			  document.body.style.width = w + "px";
			  document.body.style.height = h + "px";
			}, width, height);
			page.clipRect = {top: 250, left: 0, width: width, height: height};  

            //page.clipRect = { "top": 250, left: 250, width: 1250, height: 1300 };
            //page.settings.userAgent = "Phantom.js bot";

            return page.open(url, function(status) {
                var file;
                file = getFilename();
                if (status === "success") {
                    return window.setTimeout((function() {
                        page.render(file/*, {format: 'jpeg', quality: '75'}*/);
                        return next(status, url, file);
                    }), 1000);
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
};

arrayOfUrls = null;

if (system.args.length > 1) {
    arrayOfUrls = Array.prototype.slice.call(system.args, 1);
} else {
    console.log("Usage: phantomjs render_multi_url.js [domain.name1, domain.name2, ...]");
    arrayOfUrls = [
		"http://fantasy.premierleague.com/a/team/1117151/event/1",
		"http://fantasy.premierleague.com/a/team/1393717/event/1",
		"http://fantasy.premierleague.com/a/team/64769/event/1",
		"http://fantasy.premierleague.com/a/team/1586353/event/1",
		"http://fantasy.premierleague.com/a/team/863772/event/1",
		"http://fantasy.premierleague.com/a/team/686132/event/1",
		"http://fantasy.premierleague.com/a/team/1137790/event/1",
		"http://fantasy.premierleague.com/a/team/1516929/event/1",
		"http://fantasy.premierleague.com/a/team/2638511/event/1",
		"http://fantasy.premierleague.com/a/team/2894517/event/1"
    ];
}

RenderUrlsToFile(arrayOfUrls, (function(status, url, file) {
    if (status !== "success") {
        return console.log("Unable to render '" + url + "'");
    } else {
        return console.log("Rendered '" + url + "' at '" + file + "'");
    }
}), function() {
    return phantom.exit();
});
