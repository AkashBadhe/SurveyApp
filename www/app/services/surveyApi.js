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
                deferred.resolve(surveysData);
            } else {
                $http.get("https://murmuring-thicket-85816.herokuapp.com/api/surveys")
                    .then(function(response) {
                        deferred.resolve(response.data);
                        self.surveysCache.put(cacheKey, response.data);
                    }, function(response) {
                        deferred.reject(response);
                    });
            }
            return deferred.promise;
        }

        function getSurveyData(id, forceRefresh) {
            if (typeof forceRefresh === "undefined") { forceRefresh = false; }

            var deferred = $q.defer(),
                cacheKey = "surveyData-" + id,
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
                $http.get("https://murmuring-thicket-85816.herokuapp.com/api/surveys/" +id)
                    .then(function(response) {
                        deferred.resolve(response.data);
                        self.surveyDataCache.put(cacheKey, response.data);
                    }, function(response) {
                        deferred.reject(response);
                    });

                $ionicLoading.hide();
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
