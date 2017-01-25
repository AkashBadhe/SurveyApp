(function() {
    'use strict';

    angular.module('eliteApp').factory('surveyApi', ['$http', '$q', '$ionicLoading', 'DSCacheFactory', surveyApi]);

    function surveyApi($http, $q, $ionicLoading, DSCacheFactory) {
        self.surveysCache = DSCacheFactory.get("surveysCache");
        self.surveyDataCache = DSCacheFactory.get("surveyDataCache");
        self.surveysCache && 
        self.surveysCache.setOptions({
            onExpire: function(key, value) {
                getSurveys()
                    .then(function() {
                        console.log("Surveys Cache was automatically refreshed.", new Date());
                    }, function() {
                        console.log("Error getting data. Putting expired item back in the cache.", new Date());
                        self.surveysCache.put(key, value);
                    });
            }
        });

        self.surveyDataCache && self.surveyDataCache.setOptions({
            onExpire: function(key, value) {
                getSurveyData()
                    .then(function() {
                        console.log("Survey Data Cache was automatically refreshed.", new Date());
                    }, function() {
                        console.log("Error getting data. Putting expired item back in the cache.", new Date());
                        self.surveyDataCache.put(key, value);
                    });
            }
        });

        self.staticCache = DSCacheFactory.get("staticCache");

        function setSurveyId(surveyId) {
            self.staticCache && self.staticCache.put("currentSurveyId", surveyId);
        }

        function getSurveyId() {
            var id = self.staticCache && self.staticCache.get("currentSurveyId");
            console.log("in get surveyId", id);
            return id;
        }

        function getSurveys() {
            var deferred = $q.defer(),
                cacheKey = "surveys",
                surveysData = self.surveysCache && self.surveysCache.get(cacheKey);

            if (surveysData) {
                console.log("Found data inside cache", surveysData);
            } else {
                var surveyArray = [{
                    id: 1,
                    name: 'Survey 1',
                    status: 'In Progress'
                }, {
                    id: 2,
                    name: 'Survey 2',
                    status: 'Completed'
                }, {
                    id: 3,
                    name: 'Survey 3',
                    status: 'New'
                }];
                deferred.resolve(surveyArray)

                // ToDo: Add rest call to get survey from database;
            }
            return deferred.promise;
        }

        function getSurveyData(forceRefresh) {
            if (typeof forceRefresh === "undefined") { forceRefresh = false; }

            var deferred = $q.defer(),
                cacheKey = "surveyData-" + getSurveyId(),
                surveyData = null;

            if (!forceRefresh) {
                surveyData = self.surveyDataCache && self.surveyDataCache.get(cacheKey);
            };

            if (surveyData) {
                console.log("Found data in cache", surveyData);
                deferred.resolve(surveyData);
            } else {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var survey = {
                    surveyId: 1,
                    surveyName: 'Survey 1',
                    questions: [{
                        questionId: 1,
                        question: "How likely is it that you would recommend this company to a friend or colleague?",
                        response: '',
                        resType: 'Stars5'
                    }, {
                        questionId: 2,
                        question: "Overall, how satisfied or dissatisfied are you with our company?",
                        resType: 'Radio',
                        response: '',
                        options:[
                            {
                                optionId: 1,
                                option: 'Very satisfied'
                            },{
                                optionId: 2,
                                option: 'Very satisfied'
                            },
                            {
                                optionId: 3,
                                option: 'Somewhat satisfied'
                            },{
                                optionId: 4,
                                option: 'Nither satisfied no Dissatisfied'
                            },
                            {
                                optionId: 5,
                                option: 'Very dissatisfied'
                            }
                        ]
                    }, {
                        questionId: 3,
                        question: "Which of the following words would you use to describe our products? Select all that apply.",
                        resType: 'Select',
                        response: '',
                        options:[
                            {
                                optionId: 1,
                                option: 'Reliable'
                            },
                            {
                                optionId: 2,
                                option: 'High Quality'
                            },
                            {
                                optionId: 3,
                                option: 'Userful'
                            },
                            {
                                optionId: 4,
                                option: 'Unique'
                            },
                            {
                                optionId: 5,
                                option: 'Good value for money.'
                            },
                            {
                                optionId: 6,
                                option: 'Poor Quality'
                            }

                        ]
                    },
                    {
                        questionId: 4,
                        question: "Do you have any other comments, questions, or concerns?",
                        response: '',
                        resType: 'comment',
                    }
                    ]
                };
                $ionicLoading.hide();
                deferred.resolve(survey);
            }
            return deferred.promise;
        };



        return {
            getSurveys: getSurveys,
            getSurveyData: getSurveyData,
            setSurveyId: setSurveyId
        };
    };
})();
