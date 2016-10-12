(function () {
  'use strict';

  angular.module('starter').factory('Toast', ToastFactory);

  function ToastFactory($cordovaToast, $ionicPopup) {

    return {
      alert  : alert,
      confirm: confirm
    };

    function alert(params) {
      if (window.cordova) {
        $cordovaToast.show(params.text, 'short', 'bottom');
      } else {
        $ionicPopup.alert({
          title   : params.title,
          template: params.text,
          okType  : 'button button-clear button-assertive',
        });
      }
    }

    function confirm(title, msg) {
      return $ionicPopup.confirm({
        title   : title,
        template: msg
      });
    }
  }


})();
