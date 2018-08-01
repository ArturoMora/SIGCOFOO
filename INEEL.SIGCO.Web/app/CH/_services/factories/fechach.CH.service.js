(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('FechaCHService', ['localStorageService', 'globalGet', '$http', FechaCHService]);

    function FechaCHService(localStorageService, globalGet, $http) {
        var API = globalGet.get("api");
        var service = {};

        var _fechainventariochset = function (fechainvch) {
            localStorageService.set('fechaInventarioCH', fechainvch);

        };

        var _fechainventariochget = function () {
            var fechaactual = new Date();
            var fechach = new Date(localStorageService.get('fechaInventarioCH'));
            if (fechach > fechaactual) {
                localStorageService.set('fechaInventarioCH', fechach);
                return fechaactual;
            }else{
                return fechach;
            }
           
        };

        var _fechaCH = localStorageService.get('fechaInventarioCH');


        if (!(typeof _fechaCH !== undefined && _fechaCH !== null)) {
            _fechaCH = new Date();

        }

        localStorageService.set('fechaInventarioCH', _fechaCH);

        service.fechaCH = _fechaCH;
        service.fechainventariochset = _fechainventariochset;
        service.fechainventariochget = _fechainventariochget;

        return service;

    }




})();