(function () {
    'use strict';

    angular.module('eliteApp').controller('SurveysCtrl', ['$state', 'surveyApi', SurveysCtrl]);

    function SurveysCtrl($state, surveyApi) {
        var vm = this;
        surveyApi.getSurveys().then(function(surveys){
            vm.surveys = surveys;
        });
    };
})();