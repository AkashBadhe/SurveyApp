(function() {

    var SV = window.SV || {};

    SV.Constants = (function() {
        var TEST = "TEST";
        return {
            TEST: TEST
        }
    })();

    SV.Enums = (function() {
        var SURVEY_TYPE = {
            'NumberTen': 'NumberTen',
            'Number5': 'Number5',
            'Stars5': 'Stars5',
            'Radio': 'Radio',
            'Select': 'Select'
        }
        return {
            SURVEY_TYPE: SURVEY_TYPE
        }
    })();
})();
