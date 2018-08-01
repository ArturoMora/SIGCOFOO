
(function () {
    "use strict";

    angular
        .module("ineel.MT.services")
        .factory("buscarInsumosService", ["$http", "globalGet", buscarInsumosService]);

    function buscarInsumosService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        //Agregar una solicitud de insumo
        service.Add = function (Registro) {
            var endPoint = API + "SolicitudInsumo/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        // Get insumo cuando solo muestra
        service.getInsumo = function (FooID) {
            var endpoint = API + "Insumos/GetInsumo/" + FooID;
            return $http.get(endpoint);
        }

        //Busca por palabra
        service.GetWord = function (Palabra) {
            var endpoint = API + "Insumos/GetWord/"+Palabra;
            return $http.get(endpoint);
        }

        //Lee los que pertenecen a la persona
        service.GetByClave = function (id) {
            var endpoint = API + "SolicitudInsumo/GetByClave/" + id;
            return $http.get(endpoint);
        }

        //Lee ese insumo de la tabla de solicitudes
        service.GetPermiso = function (id) {
            var endpoint = API + "SolicitudInsumo/GetPermiso/" + id;
            return $http.get(endpoint);
        }
        //Enviar correo
        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion/" + Registro;
            return $http.post(endPoint, Registro);
        }

        ////Actualizar cuando da autorizacion
        service.UpdateAut = function (Registro) {
            var endPoint = API + "SolicitudInsumo/UpdateAut/" + Registro;
            return $http.put(endPoint, Registro);
        }
        ////Actualizar cuando da autorizacion
        service.UpdateCreate = function (Registro) {
            var endPoint = API + "SolicitudInsumo/UpdateCreate/" + Registro;
            return $http.put(endPoint, Registro);
        }
        //Da acceso al Jefe
        service.AutJefe = function (Registro) {
            var endpoint = API + "Jerarquia/isJefeHiperonimoDeProyecto/" + Registro;
            return $http.post(endpoint,Registro);
        }
        service.GetProy = function (Palabra) {
            var endpoint = API + "Insumos/GetProy/" + Palabra;
            return $http.get(endpoint);
        }
        //Lee por nombre de jefe
        service.GetJefe = function (Palabra) {
            var endpoint = API + "Insumos/GetJefe/" + Palabra;
            return $http.get(endpoint);
        }

        //Lee por nombre de jefe
        service.GetResponsableByUnOr = function (UnOr) {
            var endpoint = API + "Personas/GetResponsableByClaveUnidadWithoutStatus/" + UnOr;
            return $http.get(endpoint);
        }

        service.getTipoInsumo = function () {
            var endpoint = API + "TipoInsumo/GetAllByEstadoDisponible";
            return $http.get(endpoint);
        }
        service.DeleteInsumo = function (id) {
            var endPoint = API + "Insumos/Delete/"+id;
            return $http.delete(endPoint);
        }
        service.Update = function (Registro) {
            var endPoint = API + "Insumos/Update";
            return $http.put(endPoint, Registro);
        }
        return service;


    }

}());