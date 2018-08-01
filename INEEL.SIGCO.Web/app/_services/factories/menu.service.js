(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('MenuService', ['$http', '$q', "globalGet", 'localStorageService', MenuService]);

    function MenuService($http, $q, globalGet, localStorageService) {
        var API = globalGet.get("api");

        var service = {};

        var _listafunciones = {};

        var _removeMenu = function () {
            localStorageService.remove('MenuList');
        };

        var _removeReturnUrl = function () {
            localStorageService.remove('ReturnUrl');
        };

        var _setReturnUrl = function (ReturnUrl) {
            localStorageService.set('ReturnUrl', ReturnUrl);
        };

        var _getReturnUrl = function () {
            var ReturnUrl = localStorageService.get('ReturnUrl');
            if (ReturnUrl === null) {
                ReturnUrl = null;
            }
            return ReturnUrl;
        };

        var _setRolDescripcion = function (descripcionRol) {
            localStorageService.set('descripcionRol', descripcionRol);
        };

        var _getRolDescripcion = function () {
            var descripcionRol = localStorageService.get('descripcionRol');
            if (descripcionRol === null) {
                descripcionRol = "";
            }
            return descripcionRol;
        };

        var _setRolId = function (rolId) {
            localStorageService.set('rolId', rolId);
        };

        var _getRolId = function () {
            var rolId = localStorageService.get('rolId');
            if (rolId === null) {
                rolId = "";
            }
            return rolId;
        };

        var _setMenuAdmin = function (listafunciones) {
            localStorageService.set('MenuList', listafunciones);
        };
        var _getMenuAdmin = function () {

            var menu = localStorageService.get('MenuList');
            if (menu === null) {
                menu = [];
            }
            return menu;
        };

        var _setMenuCH = function (listafunciones) {
            localStorageService.set('MenuListCH', listafunciones);
        };

        var _getMenuCH = function () {
            var menu = localStorageService.get('MenuListCH');
            if (menu === null) {
                menu = [];
            }
            return menu;
        };

        var _setMenuCR = function (listafunciones) {
            localStorageService.set('MenuListCR', listafunciones);
        };

        var _getMenuCR = function () {
            var menu = localStorageService.get('MenuListCR');
            if (menu === null) {
                menu = [];
            }
            return menu;
        };

        var _setMenuMT = function (listafunciones) {
            localStorageService.set('MenuListMT', listafunciones);
        };

        var _getMenuMT = function () {
            var menu = localStorageService.get('MenuListMT');
            if (menu === null) {
                menu = [];
            }
            return menu;
        };

        var _setMenuCP = function(listafunciones) {
            localStorageService.set('MenuListCP', listafunciones);
        };

        var _getMenuCP = function() {
            var menu = localStorageService.get('MenuListCP');
            if (menu == null) {
                menu = [];
            }
            return menu;
        };
        var _setMenuGI = function (listafunciones) {
            localStorageService.set('MenuListGI', listafunciones);
        };


        var _getMenuGI = function () {
            var menu = localStorageService.get('MenuListGI');
            return menu;
        };

        var _setMenuPI = function(listafunciones) {
            localStorageService.set('MenuListPI', listafunciones);
        };

        var _getMenuPI = function() {
            var menu = localStorageService.get('MenuListPI');

            if (menu == null) {
                menu = [];
            }
            return menu;
        };



        var _setOrigenON_1h = function () {
            localStorageService.set('_setOrigenON_1h', "1");
        };

        var _getOrigenON_1h = function () {
            var ORG = localStorageService.get('_setOrigenON_1h');

            return ORG;
        };

        var _setOrigenON_1h_Reset = function () {
            localStorageService.set('_setOrigenON_1h', "0");
        };


        var _setVariable = function (nombrevar, valor) {
            localStorageService.set(nombrevar, valor);
        }

        var _getVariable = function (nombrevar) {
            var returnValor = localStorageService.get(nombrevar);
            if (returnValor === null) {
                returnValor = null;
            }
            return returnValor;
        }

        var _deleteVariable = function (nombrevar) {
            localStorageService.remove(nombrevar);
        }

        var _setGlobalID = function (id) {
            localStorageService.set('GlobalID', id);
        };

        var _getGlobalID = function () {
            var result = localStorageService.get('GlobalID');
            if (result === null) {
                result = null;
            }
            return result;
        };
        var _removeGlobalID = function () {
            localStorageService.remove('GlobalID');
        };
        var _setGlobalID2 = function (id) {
            localStorageService.set('GlobalID2', id);
        };

        var _getGlobalID2 = function () {
            var result = localStorageService.get('GlobalID2');
            if (result === null) {
                result = null;
            }
            return result;
        };
        var _removeGlobalID2 = function () {
            localStorageService.remove('GlobalID2');
        };

        var _setGlobalID2 = function (id) {
            localStorageService.set('GlobalID2', id);
        };

        var _getGlobalID2 = function () {
            var result = localStorageService.get('GlobalID2');
            if (result === null) {
                result = null;
            }
            return result;
        };
        var _removeGlobalID2 = function () {
            localStorageService.remove('GlobalID2');
        };


        var _setOrigen = function (id) {
            localStorageService.set('Origen', id);
        };

        var _getOrigen = function () {
            var result = localStorageService.get('Origen');
            if (result === null) {
                result = null;
            }
            
            return result;
        };
        var _removeOrigen = function () {
            localStorageService.remove('Origen');
        };

        // Get Expertos
        var _getmodulos = function () {
            var endpoint = API + "Modulos/GetAllModulosActivos";
            return $http.get(endpoint);
        };

        service.setMenuAdmin = _setMenuAdmin;
        service.getMenuAdmin = _getMenuAdmin;
        service.setMenuCH = _setMenuCH;
        service.getMenuCH = _getMenuCH;
        service.setMenuCR = _setMenuCR;
        service.getMenuCR = _getMenuCR;
        service.getMenuCP = _getMenuCP;
        service.setMenuCP = _setMenuCP;

        service.getMenuGI = _getMenuGI;
        service.setMenuGI = _setMenuGI;

        service.setMenuMT = _setMenuMT;
        service.getMenuMT = _getMenuMT;
        service.setMenuPI = _setMenuPI;
        service.getMenuPI = _getMenuPI;
        service.setVariable = _setVariable;
        service.getVariable = _getVariable;
        service.deleteVariable = _deleteVariable;
        service.removeMenu = _removeMenu;
        service.listafunciones = _listafunciones;
        service.setRolDescripcion = _setRolDescripcion;
        service.getRolDescripcion = _getRolDescripcion;
        service.setRolId = _setRolId;
        service.getRolId = _getRolId;
        service.getReturnUrl = _getReturnUrl;
        service.setReturnUrl = _setReturnUrl;
        service.removeReturnUrl = _removeReturnUrl;
        service.setGlobalID = _setGlobalID;
        service.getGlobalID = _getGlobalID;
        service.removeGlobalID = _removeGlobalID;

        service.setGlobalID2 = _setGlobalID2;
        service.getGlobalID2 = _getGlobalID2;
        service.removeGlobalID2 = _removeGlobalID2;

        service.setOrigen = _setOrigen;
        service.getOrigen = _getOrigen;
        service.removeOrigen = _removeOrigen;
        service.getModulos = _getmodulos;


        service.OrigenInicioConvocatoriaSet = _setOrigenON_1h;
        service.OrigenInicioConvocatoriaGet = _getOrigenON_1h;
        service.OrigenInicioConvocatoriaReset = _setOrigenON_1h_Reset;

        return service;

    }
})();
