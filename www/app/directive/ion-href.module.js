(function () {
    'use strict';

    angular.module('starter').directive('href', openTermsDirective);

    function openTermsDirective() {
        return {
            restrict: 'A',
            link    : function (scope, elem, attr) {

                elem.bind('click', openModal);

                function openModal() {
                    var href = attr.href;

                    if (window.cordova) {
                        // Keep in mind that you must add your own images to native resource.
                        // Images below are for sample only. They are not imported by this plugin.
                        window.cordova.ThemeableBrowser.open(href, '_blank', {
                            statusbar         : {
                                color: '#ffffffff'
                            },
                            toolbar           : {
                                height: 44,
                                color : '#f0f0f0ff'
                            },
                            title             : {
                                color        : '#000',
                                showPageTitle: true
                            },
                            backButtonCanClose: true
                        })
                        ;
                    } else {
                        window.open(href);
                    }

                    return false;
                }
            }
        };
    }

})();
