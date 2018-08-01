(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('PermisosService', ['$http', '$q', 'globalGet', 'AuthService', 'localStorageService', 'MenuService', PermisosService]);

    function PermisosService($http, $q, globalGet, AuthService, localStorageService, MenuService) {
        var service = {};
        var listafuncionesadmin = MenuService.getMenuAdmin();
        var listafuncionesch = MenuService.getMenuCH();
        var listafuncionesmt = MenuService.getMenuMT();
        var listafuncionescr = MenuService.getMenuCR();
        var listafuncionescp = MenuService.getMenuCP();
        var listafuncionespi = MenuService.getMenuPI();
        var listafuncionesgi = MenuService.getMenuGI();
        var listafunciones = null;

        service.verificaPermisos = function (siguiente, modulo) {
            switch (modulo) {
                case 'ADM':
                    listafunciones = listafuncionesadmin;
                    break;
                case 'CH':
                    listafunciones = listafuncionesch;
                    break;
                case 'CR':
                    listafunciones = listafuncionescr;
                    break;
                case 'MT':
                    listafunciones = listafuncionesmt;
                    break;
                case 'CP':
                    listafunciones = listafuncionescp;
                    break;
                case 'PI':
                    listafunciones = listafuncionespi;
                    break;
                case 'GI':
                    listafunciones = listafuncionesgi;
                    break;

                default:
                    break;
            }
            var q = $q.defer();
            try {
                var next = siguiente.replace(':id', '').replace(':seccion', '').replace('/:id2', '');

                var permitir = false;
                listafunciones.forEach(function (element) {
                    if (typeof element.funcion.url !== undefined) {
                        var r = element.funcion.url.split('#');
                        if (r[1] != null) {
                            if (r[1].indexOf(next) >= 0 || next === '/home') {
                                permitir = true; return;
                            }
                        }
                    }
                });

                q.resolve(permitir);

            } catch (error) {
                q.resolve(permitir);
            }
            return q.promise;
        };

        return service;

    }

})();