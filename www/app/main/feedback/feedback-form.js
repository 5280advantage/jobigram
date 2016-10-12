(function () {
    'use strict';
    angular
        .module('app.main')
        .factory('GalleryFeedbackForm', GalleryFeedbackFormFactory);

    function GalleryFeedbackFormFactory($translate) {

        var form = [{
            key: 'title',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: $translate.instant('feedbackTitle'),
                required: true
            }
        }, {
            key: 'subject',
            type: 'select',
            templateOptions: {
                label: $translate.instant('subject'),
                options: [{
                    'label': $translate.instant('complaint'),
                    'id': 'complaint',
                }, {
                    'label': $translate.instant('bug'),
                    'id': 'bug',
                }, {
                    'label': $translate.instant('suggestion'),
                    'id': 'suggestion',
                }],
                valueProp: 'id',
                labelProp: 'label',
                icon: 'icon-list',
                iconPlaceholder: true
            }
        }, {
            key: 'status',
            type: 'textarea',
            templateOptions: {
                type: 'text',
                placeholder: $translate.instant('message'),
                icon: 'ion-quote',
                required: true,
                iconPlaceholder: true
            }
        }];

        return {
            form: form
        };
    }


})();
