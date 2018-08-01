(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('ComunServiceDetallesPersonal', ['$http', '$q', 'globalGet', ComunServiceDetallesPersonal]);

    function ComunServiceDetallesPersonal($http, $q, globalGet) {
        var API = globalGet.get("api");

        var service = {};

        service.UnidadOrganizacional = {};

        //Ponencias para el modal de detalles
        service.GetPonencias = function (obj) {
            var endpoint = API + "Ponencia/GetPonenciasForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };

        //Publicaciones para el modal de detalles
        service.GetPublicaciones = function (obj) {
            var endpoint = API + "Publicacion/GetPublicacionesForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };

        //Cursos para el modal de detalles
        service.GetCursos = function (obj) {
            var endpoint = API + "CursoInterno/GetCursosForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };

        //Proyectos para el modal de detalles
        service.GetProyectos = function (obj) {
            var endpoint = API + "Proyectos/GetProyectosForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };

        //Derechos autor para el modal de detalles
        service.GetDerechosAutor = function (obj) {
            var endpoint = API + "DerechosAutor/GetDerechosAutorForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };

        //Propiedad industrial para el modal de detalles
        service.GetPropiedadIndustrial = function (obj) {
            var endpoint = API + "PropiedadIndustrial/GetPropiedadIndustrialForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };

        //Formacion academica para el modal de detalles
        service.GetFormacionAcademica = function (obj) {
            var endpoint = API + "FormacionAcademica/GetFormacionForDetailsBusqueda/";
            return $http.post(endpoint, obj);
        };




        return service;
    }




})();