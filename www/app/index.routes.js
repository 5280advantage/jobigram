(function () {
    'use strict';
    angular.module('starter').config(routes);

    function routes($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider) {

        // Translation
        $translatePartialLoaderProvider.addPart('app');

        $stateProvider

            .state('loading', {
                url         : '/',
                templateUrl : 'app/main/loading/loading.html',
                controller  : 'LoadingCtrl',
                controllerAs: 'vm'
            })


            .state('intro', {
                url         : '/intro',
                templateUrl : 'app/main/user-intro/user-intro.html',
                controller  : 'UserIntroCtrl',
                controllerAs: 'vm',
            })

            .state('user.intro', {
                url        : '/intro',
                templateUrl: 'app/main/user-intro/user-intro.html',
                controller : 'UserIntroCtrl'
            })

            .state('user', {
                url        : '/user',
                abstract   : true,
                templateUrl: 'app/main/user-layout/user-layout.html'
            })

            .state('avatar', {
                url         : '/avatar',
                templateUrl : 'app/main/user-avatar/user-avatar.html',
                controller  : 'UserAvatarCtrl',
                controllerAs: 'vm'
            })


            .state('user.merge', {
                url         : '/merge',
                controller  : 'UserMergeCtrl',
                controllerAs: 'vm',
                templateUrl : 'app/main/user-merge/merge.html'
            })

            .state('logout', {
                url         : '/logout',
                template    : '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
                controller  : function (User, $localStorage, AppConfig, $state) {
                    //Parse.User.logOut();
                    User.logOut();
                    $localStorage.$reset({});
                    $state.go('intro', {clear: true});
                },
                controllerAs: 'vm'
            })

            .state('profile', {
                url         : '/profile/:username',
                templateUrl : 'app/main/profile/profile.html',
                controllerAs: 'vm',
            })

            .state('tab', {
                url         : '/tab',
                abstract    : true,
                controller  : 'MainTabCtrl',
                controllerAs: 'vm',
                templateUrl : 'app/main/tab/main-tab.html'
            })

            .state('tab.home', {
                url  : '/home',
                views: {
                    tabHome: {
                        controller  : 'HomeCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-home/home.html'
                    }
                }
            })

            .state('tab.homeProfile', {
                url  : '/home/:username',
                views: {
                    tabHome: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('galleryComments', {
                url         : '/home/:galleryId/comments',
                controller  : 'GalleryComment',
                controllerAs: 'vm',
                templateUrl : 'app/main/gallery-comment/gallery-comment.html'
            })

            .state('tab.homeGalleryLikers', {
                url  : '/home/:galleryId/likers',
                views: {
                    tabHome: {
                        controller  : 'UserLikersCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-likers/user-likers.html'
                    }
                }
            })

            .state('tab.homeProfileFollowers', {
                url  : '/home/:username/followers',
                views: {
                    tabHome: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.homeProfileFollowing', {
                url  : '/home/:username/follwing',
                views: {
                    tabHome: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

            .state('tab.homeUserlist', {
                url  : '/home/userlist',
                views: {
                    tabHome: {
                        controller  : 'UserListCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-list/user-list.html'
                    }
                }
            })

            .state('tab.search', {
                url  : '/search/:text',
                views: {
                    tabSearch: {
                        controller  : 'SearchCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-search/search.html',
                    }
                }
            })

            .state('tab.searchProfile', {
                url  : '/search/:username',
                views: {
                    tabSearch: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('tab.searchProfileFollowers', {
                url  : '/search/:username/followers',
                views: {
                    tabSearch: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.map', {
                url  : '/map',
                views: {
                    tabSearch: {
                        controller  : 'SearchMapCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-search-map/searchMap.html',
                    }
                }
            })

            .state('tab.mapProfile', {
                url  : '/map/:username',
                views: {
                    tabSearch: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('tab.mapProfileFollowers', {
                url  : '/map/:username/followers',
                views: {
                    tabSearch: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.mapProfileFollowing', {
                url  : '/map/:username/follwing',
                views: {
                    tabActivity: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

            .state('tab.account', {
                url  : '/account',
                views: {
                    tabProfile: {
                        controller  : 'AccountCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-account/account.html'
                    }
                }
            })

            .state('tab.accountFollowers', {
                url  : '/account/:username/followers',
                views: {
                    tabProfile: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.accountFollowing', {
                url  : '/account/:username/follwing',
                views: {
                    tabProfile: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

            .state('tab.activity', {
                url  : '/activity',
                views: {
                    tabActivity: {
                        controller  : 'ActivityCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-activity/activity.html'
                    }
                }
            })

            .state('tab.activityProfile', {
                url  : '/activity/:username',
                views: {
                    tabActivity: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('tab.activityProfileFollowers', {
                url  : '/activity/:username/followers',
                views: {
                    tabActivity: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.activityProfileFollowing', {
                url  : '/activity/:username/follwing',
                views: {
                    tabActivity: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

        ;

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main');
        $urlRouterProvider.otherwise('/');

    }


})();