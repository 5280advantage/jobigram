(function () {
  'use strict';

  angular.module('app.main').controller('UserAvatarCtrl', UserAvatarController);

  function UserAvatarController(User, Parse, $translate, $scope, Loading, Auth, AppConfig, $rootScope, $state, Toast, $ionicModal
  ,$ionicPopup, IonicClosePopupService) {



    $scope.profileImage ='img/user.png';
    $scope.enteredSkill = '';


    $scope.showProfileChoice =function() {
      var options =
      {
        title: 'Choose Profile',
        cssClass: 'sportsPickPopup', // String, The custom CSS class name
        template: '<div pick-profile></div>',
        scope:$scope
      }
      $scope.profilePopup = $ionicPopup.alert(options);
      // IonicClosePopupService.register($scope.profilePopup);
    }

    $scope.setEmployeeDetails = function(){
      $rootScope.profile = 'Employee';
      $scope.profileImage ='img/user.png';
      $scope.namePlaceholder ='Your Name';
      $scope.addressPlaceholder ='Your Address';
      $scope.phonePlaceholder ='Phone';
      $scope.bizemailPlaceholder ='E-mail';
    }

    $scope.setEmployerDetails = function(){
      $rootScope.profile = 'Employer';
      $scope.profileImage ='img/companylogo.png';
      $scope.namePlaceholder ='Company Name';
      $scope.addressPlaceholder ='Business Address';
      $scope.phonePlaceholder ='Business Phone';
      $scope.bizemailPlaceholder ='Business E-mail';
      $scope.websitePlaceholder ='Business Website';
    }

    function init() {
      $scope.showProfileChoice();
      var user = Parse.User.current();
      $scope.selectedTmp = [];
      $scope.form = {
        name: user.name,
        email: user.email,
        status: user.status,
        gender: user.gender,
        username: user.username
      };
      console.log($scope.form);
      console.log($scope.formFields);
    }

    $scope.openIndustrySelectModal = function () {
      console.log($rootScope.industries);
      _.each($rootScope.selected, function (n) {
        $scope.selectedTmp.push(n);
      })
      $ionicModal.fromTemplateUrl('app/directive/industries-modal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modalIndustry = modal;
        $scope.modalIndustry.show();
      });
    }

    $scope.openSkillsSelectModal = function () {

      $ionicModal.fromTemplateUrl('app/directive/skills-modal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modalSkills = modal;
        $scope.modalSkills.show();
      });
    }

    $scope.addToSelected = function (tag) {
      if (_.indexOf($rootScope.selected, tag) == -1 && _.indexOf($scope.selectedTmp, tag) == -1) {
        $scope.selectedTmp.push(tag);
      }
      else {
        $scope.selectedTmp.splice(_.indexOf($scope.selectedTmp, tag), 1);
      }
      console.log($scope.selectedTmp);
      console.log($rootScope.selected);
    }

    $scope.addToSelectedSkills = function (tag) {
      if (_.indexOf($rootScope.skills, tag) == -1) {
        $rootScope.skills.push(tag);
      }
      else {
        $rootScope.skills.splice(_.indexOf($rootScope.skills, tag), 1);
      }
      
      $scope.enteredSkill = '';
      console.log($rootScope.skills);
    }

    $scope.isSelectedTmp = function (industry) {
      return _.indexOf($scope.selectedTmp, industry) != -1;
    }

    $scope.setSelected = function () {
      console.log('set and close');
      $rootScope.selected = [];
      _.each($scope.selectedTmp, function (n) {
        $rootScope.selected.push(n);
      });
      $scope.selectedTmp = [];
      $scope.modalIndustry.hide();
      $scope.modalIndustry.remove();
    }

    $scope.closeIndustryModal = function () {
      $scope.modalIndustry.hide();
      $scope.modalIndustry.remove();
    }
    $scope.closeSkillsModal = function () {
      $scope.modalSkills.hide();
      $scope.modalSkills.remove();
    }
    $scope.submitAvatar = function (rForm, form) {
      console.log(form);
      Loading.start();

      if (rForm.$valid) {
        var dataForm = angular.copy(form);
        console.log(dataForm);

        User.update(dataForm).then(function (resp) {
          console.log(resp);
          $rootScope.currentUser = Parse.User.current();
          $state.go(AppConfig.routes.home, {
            clear: true
          });
          Loading.end();
        });
      } else {
        Toast.alert({
          title: $translate.instant('invalidForm'),
          text: $translate.instant('fillAllFields')
        });
        Loading.end();
      }

    }

    init();
  }


})();
