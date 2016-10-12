(function () {
    'use strict';

    var path = 'app/component/ion-language';

    angular
        .module('ion-language')
        .directive('ionLanguage', ionLanguageDirective);

    function ionLanguageDirective(AppConfig, $translate, $timeout, Loading, $ionicModal) {
        return {
            restrict   : 'E',
            link       : modalLanguageLink,
            templateUrl: path + '/ion-language.html'
        };

        function modalLanguageLink(scope, elem, attr) {


            scope.languages = AppConfig.locales;
            scope.language  = scope.languages.filter(function (item) {
                return item.code === $translate.use()
            })[0];

            elem.bind('click', openModal);

            function openModal() {

                scope.closeModal = function () {
                    scope.modal.hide();
                };

                scope.searchValue = '';

                scope.selectLanguage = function (language) {
                    console.log(language);
                    $translate.use(language.code);
                    scope.language = language;
                    scope.$emit('changeLanguage', language);
                    Loading.start();
                    scope.closeModal();
                    $timeout(function () {
                        Loading.end();
                    }, 1000);
                };

                $ionicModal
                    .fromTemplateUrl(path + '/modal-language.html', {
                        scope          : scope,
                        focusFirstInput: true
                    })
                    .then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();

                    });
            }
        }
    }

})();
