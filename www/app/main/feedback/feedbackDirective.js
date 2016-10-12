(function () {
    'use strict';

    angular.module('app.main').directive('feedback', feedbackDirective);

    function feedbackDirective($ionicModal, GalleryFeedback, Gallery, Loading, $state) {

        return {
            restrict: 'A',
            scope   : {
                galleryId: '@'
            },
            template: '',
            link    : function (scope, elem, attr) {

                scope.link           = link;
                scope.submitFeedback = submitFeedback;
                scope.closeModal     = closeModal;
                elem.bind('click', openModal);

                function init() {
                    scope.form = {};
                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('app/main/feedback/feedback-modal.html', {
                        scope          : scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });
                }

                function link(sref) {
                    $state.go(sref)
                    scope.closeModal();
                }

                scope.submitFeedback = function (rForm, form) {
                    if (rForm.$valid) {
                        Loading.start();
                        var dataForm  = angular.copy(scope.form);
                        dataForm.user = Parse.User.current();
                        Gallery.get(scope.galleryId).then(function (gallery) {
                            dataForm.gallery = gallery;
                            GalleryFeedback.create(dataForm).then(function (resp) {
                                console.log(resp);
                                init();
                                scope.closeModal();
                                Loading.stop();
                            });
                        })
                    }
                }


                function closeModal() {
                    scope.modal.hide();
                    scope.modal.remove();
                }

            }
        };
    }

})();
