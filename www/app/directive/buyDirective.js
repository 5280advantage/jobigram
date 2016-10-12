(function () {
    'use strict';
    angular
        .module('starter')
        .directive('buy', buyDirective);

    function buyDirective($cordovaInAppBrowser) {
        return {
            restrict: 'A',
            link: buyLink
        };

        function buyLink(scope, elem) {
            elem.bind('click', function () {
                var url     = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FAW4JZS7KJM5S';

                if(window.cordova ) {
                    cordova
                        .ThemeableBrowser
                        .open(url, '_blank', {
                            statusbar: {
                                color: '#ffffffff'
                            },
                            toolbar: {
                                height: 44,
                                color: '#f0f0f0ff'
                            },
                            title: {
                                color: '#333333',
                                showPageTitle: true
                            },
                            closeButton: {
                                image: 'close',
                                imagePressed: 'close_pressed',
                                align: 'left',
                                event: 'closePressed'
                            },
                            backButtonCanClose: true
                        });
                } else {
                    window.open(url,'_blank');
                }
            });
        }
    }

})();
