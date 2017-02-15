(function() {
    'use strict';

    angular.module('eliteApp').controller('SurveyDetailCtrl', ['$stateParams', '$ionicPopup', 'surveyApi', SurveyDetailCtrl]);

    function SurveyDetailCtrl($stateParams, $ionicPopup, surveyApi) {
        var vm = this;
        console.log("$stateParams", $stateParams, surveyApi);
        surveyApi.getSurveyData($stateParams.id).then(function(survey) {
            console.log('survey:', survey);
            vm.survey = survey;

            // set the rate and max variables
            vm.rating = {};
            vm.rating.rate = 3;
            vm.rating.max = 5;

        });

        vm.submit = function(survey){
            console.log(survey);
        }
    };
})();
