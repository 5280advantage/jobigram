(function () {
    'use strict';

    angular.module('starter').filter('hashtag', hashtag);

    function hashtag($filter) {
        return function (text, target) {
            if (!text) return text;

            var replacedText = $filter('linky')(text, target);

            var targetAttr = "";
            if (angular.isDefined(target)) {
                targetAttr = target;
            }

            // replace #hashtags and send them to twitter
            var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
            replacedText        = text.replace(replacePattern1, '$1<a href="#/tab/search/%23$2"' + targetAttr + '>#$2</a>');

            // replace @mentions but keep them to our site
            var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
            replacedText        = replacedText.replace(replacePattern2, '$1<a href="#/tab/home/$2" >@$2</a>');

            return replacedText;
        };
    }

})();

