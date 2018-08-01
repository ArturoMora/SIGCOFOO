
(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .factory("videotutorialesService", ["$http", "globalGet", videotutorialesService]);

    function videotutorialesService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        return service;


    }

}());