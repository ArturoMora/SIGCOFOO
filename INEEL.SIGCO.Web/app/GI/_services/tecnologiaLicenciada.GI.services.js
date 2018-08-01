(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("tecnologiaLicenciadaService", ["$http", "globalGet", tecnologiaLicenciadaService]);

    function tecnologiaLicenciadaService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        service.getAllEstadosLicenciados = function () {
            var endPoint = API + "EstadoLicenciamiento/GetAll";
            return $http.get(endPoint);
        }

        service.getUnidadProyecto = function (clave) {
            var endPoint = API + "UnidadOrganizacional/GetById/" + clave;
            return $http.get(endPoint);
        }

        service.getAllByEmpleado = function (id,clave) {
            var endPoint = API + "TecnologiaLicenciada/GetAllByEmpleado/"+id+"/" + clave;
            return $http.get(endPoint);
        }

        service.GetConsultaByEmpleado = function (obj) {
            var endPoint = API + "TecnologiaLicenciada/GetConsultaByEmpleado/" + obj;
            return $http.post(endPoint,obj);
        }

        service.getAllTecnologiasLicenciadas = function () {
            var endPoint = API + "TecnologiaLicenciada/GetAll";
            return $http.get(endPoint);
        }

        //Lista de los estados de licenciamientos registrados
        service.ListaEstadoLicenciamiento = function () {
            var endPoint = API + "TecnologiaLicenciada/ListaEstadoLicenciamiento";
            return $http.get(endPoint);
        }

        //Lista de los tipos de propiedad industrial
        service.ListaTipoPropiedadIndustrial = function () {
            var endPoint = API + "TecnologiaLicenciada/ListaTipoPropiedadIndustrial";
            return $http.get(endPoint);
        }

        //Consulta parametrizada de seguimiento a la tecnologia
        service.GetAllConsultaParametrizadaTecnologia = function (obj) {
            var endPoint = API + "TecnologiaLicenciada/GetAllConsultaParametrizadaTecnologia/" + obj;
            return $http.post(endPoint, obj);
        }

        service.GetAllCartera = function () {
            var endPoint = API + "TecnologiaLicenciada/GetAllCartera";
            return $http.get(endPoint);
        }
        

        service.add = function (registro) {
            var endpoint = API + "TecnologiaLicenciada/Create";
            return $http.post(endpoint, registro);
        }

        service.delete = function (Id) {
            debugger;
            var endPoint = API + "TecnologiaLicenciada/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "TecnologiaLicenciada/GetById/" + id;
            return $http.get(endPoint);
        }

        //service.getAllContribucion = function () {
        //    var endPoint = API + "ContribucionAutor/GetAll";
        //    return $http.get(endPoint);
        //}

        service.update = function (registro) {
            var endpoint = API + "TecnologiaLicenciada/Update";
            return $http.put(endpoint, registro);
        }

        service.gettipoPagos = function () {
            var endPoint = API + "TipoPagos/GetAll";
            return $http.get(endPoint);
        }

        service.crearPagos = function (registro) {
            var endpoint = API + "TecnologiaLicenciadaPagos/CreatePagos";
            return $http.post(endpoint, registro);
        }

        service.crearLecciones = function (registro) {
            var endpoint = API + "TecnologiaLicenciadaLecciones/CreateLecciones";
            return $http.post(endpoint, registro);
        }

        service.updateAllPI = function (registro) {
            var endpoint = API + "TecnologiaLicenciadaPIPIndustrial/UpdateAll";
            return $http.put(endpoint, registro);
        }

        service.updateAllDA = function (registro) {
            var endpoint = API + "TecnologiaLicenciadaPIDA/UpdateAll";
            return $http.put(endpoint, registro);
        }

        //service.Persona = function (clave) {
        //    var endPoint = API + "Personas/GetByClave/" + clave;
        //    return $http.get(endPoint);
        //}

        //service.getAllCartera = function () {
        //    var endPoint = API + "ProductoGI/GetAllCartera";
        //    return $http.get(endPoint);
        //}


        return service;

    }

})();