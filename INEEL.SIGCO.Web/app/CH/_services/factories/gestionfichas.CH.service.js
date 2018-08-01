(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("gestionfichasService", ["$http", "globalGet", gestionfichasService]);

    function gestionfichasService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        service.getByClave = function (id) {
            var endPoint = API + "Personas/GetByClaveGestionFicha/" + id;
            return $http.get(endPoint);
        }

        //Disponible solo para el admin de CH
        service.GetByClaveGestionFichaPersonalInvestigador = function (id) {
            var endPoint = API + "Personas/GetByClaveGestionFichaPersonalInvestigador/" + id;
            return $http.get(endPoint);
        }

        //Disponible solo para el admin de personal sindicalizado
        service.GetByClaveGestionFichaPersonalSindicalizado = function (id) {
            var endPoint = API + "Personas/GetByClaveGestionFichaPersonalSindicalizado/" + id;
            return $http.get(endPoint);
        }

        service.getByNombre = function (id) {
            var endPoint = API + "Personas/GetByNombreGestionFicha/" + id;
            return $http.get(endPoint);
        }

        //Disponible solo para el admin de CH
        service.GetByNombreGestionFichaPersonalInvestigador = function (id) {
            var endPoint = API + "Personas/GetByNombreGestionFichaPersonalInvestigador/" + id;
            return $http.get(endPoint);
        }

        //Disponible solo para el admin de personal sindicalizado
        service.GetByNombreGestionFichaPersonalSindicalizado = function (id) {
            var endPoint = API + "Personas/GetByNombreGestionFichaPersonalSindicalizado/" + id;
            return $http.get(endPoint);
        }

        service.getAll = function () {
            var endPoint = API + "Personas/GetAllGestionFicha/" ;
            return $http.get(endPoint);
        }

        service.getByClaveSoloUno = function (id) {
            var endPoint = API + "Personas/GetByClaveGestionFichaUno/" + id;
            return $http.get(endPoint);
        }

        ////Actualizar 
        service.updateUser = function (Registro) {
            var endPoint = API + "Personas/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.updateUserExperience = function (Registro) {
            var endPoint = API + "Personas/updateUserExperience/" + Registro;
            return $http.put(endPoint, Registro);
        }

         // Obtener foto en ficha personal
        service.getadjunto64 = function (id){
            var endPoint = API + "Personas/ObtenerFoto/" + id;
            return $http.get(endPoint);
        }

        // Guardar foto en ficha personal
        service.guardarfoto = function (registro){
            var endPoint = API + "Personas/GuardaFoto/" + registro;
            return $http.put(endPoint, registro);
        }

        service.eliminarfoto = function (registro) {
            var endPoint = API + "Personas/EliminaFoto/" + registro;
            return $http.put(endPoint, registro);
        }



        // busqueda avanzada
        service.busquedaAvanzada = function (objeto) {
            var endPoint = API + "Personas/busquedaAvanzada/";
            return $http.post(endPoint,objeto);
        }

        //Extracto profesional
        service.getExtractoById = function (id) {
            var endpoint = API + "ExtractoProfesional/GetByClave/" + id;
            return $http.get(endpoint);
        }
        
        return service;
    }
})();