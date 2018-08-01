(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("productoInnovadorService", ["$http", "globalGet", productoInnovadorService]);

    function productoInnovadorService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.getbyclave = function (clave) {
            var endPoint = API + "ProductoGI/GetAllByEmpleado/" + clave;
            return $http.get(endPoint);
        }

        service.getbyclave2 = function (clave) {
            var endPoint = API + "ProductoGI/GetAllByEmpleado2/" + clave;
            return $http.get(endPoint);
        }
        service.getAllFactoresInnovacion = function () {
            var endPoint = API + "FactorInnovacion/GetAll";
            return $http.get(endPoint);
        }

        service.getAllRevisarComite = function () {
            var endPoint = API + "ProductoGI/GetAllRevisarComite";
            return $http.get(endPoint);
        }

        service.getAllRevisarComite2 = function () {
            var endPoint = API + "ProductoGI/GetAllRevisarComite2";
            return $http.get(endPoint);
        }

        service.add = function (registro) {
            var endpoint = API + "ProductoGI/Create";
            return $http.post(endpoint, registro);
        }

        service.addFI = function (registro) {
            var endpoint = API + "ProductoGISolicitud/Create";
            return $http.post(endpoint, registro);
        }
        service.RegistrarMovimientoProducto = function (registro) {
            var endpoint = API + "ProductoGI/RegistrarMovimiento";
            return $http.post(endpoint, registro);
        }
        

        service.delete = function (Id) {
            
            var endPoint = API + "ProductoGI/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.getbyid = function (id) {
            var endPoint = API + "ProductoGI/GetById/" + id;
            return $http.get(endPoint);
        }
        service.getAllContribucion = function () {
            var endPoint = API + "ContribucionAutor/GetAll";
            return $http.get(endPoint);
        }

        service.update = function (registro) {
            var endpoint = API + "ProductoGI/Update";
            return $http.put(endpoint, registro);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.getAllCartera = function () {
            var endPoint = API + "ProductoGI/GetAllCartera";
            return $http.get(endPoint);
        }
        service.getAllCartera2 = function () {
            var endPoint = API + "ProductoGI/GetAllCartera2";
            return $http.get(endPoint);
        }
        service.productoGISolicitud = function (id) {
            var endPoint = API + "ProductoGISolicitud/GetByProductoId/" + id;
            return $http.get(endPoint);
        }

        service.asignarEvaluador = function (Registro) {
            var endPoint = API + "ProductoGISolicitud/NotificarAsignacionEvalFI";
            return $http.post(endPoint, Registro);
        }

        service.grupoevaluadorexist = function (id) {
            var endPoint = API + "ProductoGI/GetGrupoEvaluadoExistFI/" + id;
            return $http.get(endPoint);
        }
        
        service.GetAllByEvaluadorFI = function (clave) {
            var endPoint = API + "ProductoGISolicitud/GetAllByEvaluadorFI/" + clave;
            return $http.get(endPoint);
        }

        service.GetConsultaRevisarComite = function (obj) {
            var endPoint = API + "ProductoGI/GetConsultaRevisarComite/" + obj;
            return $http.post(endPoint,obj);
        }

        service.GetConsultaSolicitudesFI = function (obj) {
            var endPoint = API + "ProductoGI/GetConsultaSolicitudesFI/" + obj;
            return $http.post(endPoint,obj);
        }

        service.GetConsultaMisProductos = function (obj) {
            var endPoint = API + "ProductoGI/GetConsultaMisProductos/" + obj;
            return $http.post(endPoint, obj);
        }

        service.UpdateFI = function (registro) {
            var endpoint = API + "ProductoGI/UpdateFI";
            return $http.put(endpoint, registro);
        }

        service.RegistrarFI = function (registro) {
            var endpoint = API + "ProductoGI/UpdateFI";
            return $http.put(endpoint, registro);
        }

        service.getPeriodo = function () {
            var endPoint = API + "PeriodoRecepcion/GetInPeriodoRecepcionByActivo";
            return $http.get(endPoint);
        }

        service.getSolicitudById = function (id) {
            var endPoint = API + "ProductoGISolicitud/GetByProductoId/"+id;
            return $http.get(endPoint);
        }

        service.updateVobo = function (registro) {
            var endpoint = API + "ProductoGI/UpdateVoBo";
            return $http.put(endpoint, registro);
        }

        service.GetInPeriodoReplicaByActivo = function () {
            var endPoint = API + "PeriodoReplica/GetInPeriodoReplicaByActivo";
            return $http.get(endPoint);
        }

        return service;

    }

})();