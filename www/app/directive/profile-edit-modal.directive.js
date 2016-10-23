(function () {
  'use strict';

  angular.module('starter').directive('profileModalEdit', profileModalEditDirective);

  function profileModalEditDirective($ionicModal, $rootScope, ParsePush, $localStorage, User, Loading, $state) {

    return {
      restrict: 'A',
      // scope: {
      //   user: '='
      // },
      template: '',
      link: function (scope, elem) {


        elem.bind('click', openModal);
        scope.enteredSkill = '';


        function init() {
          scope.theme = $rootScope.theme;
          var user = Parse.User.current().attributes;
          scope.form = {
            name: user.name,
            email: user.email,
            status: user.status,
            photo: user.photo,
            username: user.username,
            gender: user.gender,
            facebook: user.facebook,
            headline: user.headline,
            phone: user.phone,
            bizemail: user.bizemail,
            website: user.website,
            exp: user.exp,
            avail: user.avail,
            edu: user.edu,
            salary: user.salary,
            skills: $rootScope.skills,
            selected: $rootScope.selected
          };

          if($rootScope.profile=='Employer'){
            $rootScope.profile = 'Employer';
            scope.profileImage ='img/companylogo.png';
            scope.namePlaceholder ='Company Name';
            scope.addressPlaceholder ='Business Address';
            scope.phonePlaceholder ='Business Phone';
            scope.bizemailPlaceholder ='Business E-mail';
            scope.websitePlaceholder ='Business Website';
          }
          else{
            $rootScope.profile = 'Employee';
            scope.profileImage ='img/user.png';
            scope.namePlaceholder ='Your Name';
            scope.addressPlaceholder ='Your Address';
            scope.phonePlaceholder ='Phone';
            scope.bizemailPlaceholder ='E-mail';
          }
        }
        scope.openSkillsSelectModal = function () {

          $ionicModal.fromTemplateUrl('app/directive/skills-modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modalSkills = modal;
            scope.modalSkills.show();
          });
        }

        scope.addToSelectedSkills = function (tag) {
          if (_.indexOf($rootScope.skills, tag) == -1) {
            $rootScope.skills.push(tag);
          }
          else {
            $rootScope.skills.splice(_.indexOf($rootScope.skills, tag), 1);
          }

          scope.enteredSkill = '';
          console.log($rootScope.skills);
        }
        scope.closeSkillsModal = function () {
          scope.modalSkills.hide();
          scope.modalSkills.remove();
        }

        function openModal() {
          scope.selectedTmp = [];

          scope.linkFacebook = linkFacebook;
          scope.logout = logout;
          scope.submitUpdateProfile = submitUpdateProfile;
          scope.closeModal = closeModal;
          scope.currentUser = $rootScope.currentUser;



          $ionicModal.fromTemplateUrl('app/directive/profile-edit-modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modal = modal;
            scope.modal.show();
          });

          // Cleanup the modal when we're done with it!
          scope.$on('$destroy', function () {
            scope.modal.remove();
          });

        }

        function logout() {
          delete window.localStorage['Parse/myAppId/currentUser'];
          delete window.localStorage['Parse/myAppId/installationId'];
          $localStorage.$reset({});
          $state.go('user.intro', {clear: true});
          scope.closeModal();
        }

        function linkFacebook() {
          User.facebookLink().then(function (resp) {
            console.log(resp);
          });
        }

        function submitUpdateProfile() {
          var dataForm = angular.copy(scope.form);
          Loading.start();

          var username = Parse.User.current().username;

          // Change Username Subscribe for Push
          if (username != dataForm.username) {
            ParsePush.unsubscribe(username);
            ParsePush.subscribe(username);
          }

          User.update(dataForm).then(function (resp) {
            scope.user = resp;
            $rootScope.currentUser = resp;
            Loading.end();
            scope.closeModal();
          });
        }

        function closeModal() {
          scope.modal.hide();
        }

        scope.closeIndustryModal = function () {
          scope.modalIndustry.hide();
          scope.modalIndustry.remove();
        }

        scope.openIndustrySelectModal = function () {
          console.log($rootScope.industries);
          _.each($rootScope.selected, function (n) {
            scope.selectedTmp.push(n);
          })
          $ionicModal.fromTemplateUrl('app/directive/industries-modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modalIndustry = modal;
            scope.modalIndustry.show();
          });
        }

        scope.addToSelected = function (tag) {
          if (_.indexOf($rootScope.selected, tag) == -1 && _.indexOf(scope.selectedTmp, tag) == -1) {
            scope.selectedTmp.push(tag);
          }
          else {
            scope.selectedTmp.splice(_.indexOf(scope.selectedTmp, tag), 1);
          }
          console.log(scope.selectedTmp);
          console.log($rootScope.selected);
        }


        scope.isSelectedTmp = function (industry) {
          return _.indexOf(scope.selectedTmp, industry) != -1;
        }

        scope.setSelected = function () {
          $rootScope.selected = [];
          _.each(scope.selectedTmp, function (n) {
            $rootScope.selected.push(n);
          });
          scope.selectedTmp = [];
          scope.modalIndustry.hide();
          scope.modalIndustry.remove();
        }

        init();
      }
    };
  }

})();
