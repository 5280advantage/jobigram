angular.module('starter')

.directive('pickProfile', function ($state, $ionicActionSheet, $rootScope) {
  return {
    templateUrl: 'app/main/choose-a-profile.html',
    link: function (scope) {
      var filepath;
      scope.setEmployee = function () {
        scope.setEmployeeDetails();
        scope.profilePopup.close();
      }
      scope.setEmployer = function () {
        scope.setEmployerDetails();
        scope.profilePopup.close();
      }
    }
  };
})
