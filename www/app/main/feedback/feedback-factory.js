(function () {

    angular.module('app.main').factory('FeedbackModal', FeedbackModalFactory);

    function FeedbackModalFactory($q, AppConfig, GalleryFeedback, $rootScope, GalleryFeedbackForm, $ionicModal, Loading, Toast) {
        var path = AppConfig.path;

        return {
            modal: modal
        };
        function modal(gallery) {
            var $scope            = $rootScope.$new();
            $scope.formFields     = GalleryFeedbackForm.form;
            $scope.submitFeedback = submitFeedback;
            $scope.closeModal     = closeModal;
            $scope.form           = {
                photogramId: gallery.id,
                subject    : 'complaint'
            };

            function submitFeedback() {
                var dataForm = angular.copy($scope.form);
                Loading.start();
                GalleryFeedback.create(dataForm).then(function (resp) {
                    Loading.end();
                    closeModal();

                });
            }


            function closeModal() {
                $scope.modal.hide();
                $scope.modal.remove();
                delete $scope.modal;
            }

            $ionicModal
                .fromTemplateUrl('app/main/feedback/feedback-modal.html', {
                    scope          : $scope,
                    focusFirstInput: true
                })
                .then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
        }
    }


})();
