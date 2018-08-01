/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
FooEntitiesService nombre de factory en ENTITIES.service.js
"iie.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict"; 
    
    angular
        .module("ineel.GEN.services")
        .factory("rolfuncionesService", ["$http", "globalGet", rolfuncionesService]);

    function rolfuncionesService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};
               
        service.getAll = function () {
            var endPoint = API + "FuncionesRol/getAll";
            return $http.get(endPoint);
        }
       
        service.getById = function (id) {
            var endPoint = API + "FuncionesRol/GetById/" + id;
            return $http.get(endPoint);
        }
      
        service.Update = function (obj) {
            var endPoint = API + "FuncionesRol/Update/" + obj;
            return $http.put(endPoint, obj);
        }
       
        service.Add = function (obj) {
            var endPoint = API + "FuncionesRol/Create";
            return $http.post(endPoint, obj);
        }

        service.GetByRol = function (id) {

            var endPoint = API + "FuncionesRol/GetByRol/" + id;
            console.log(endPoint);
            return $http.get(endPoint);
        }


        //eliminar registro 
        service.eliminarFuncion = function (id) {
            var endPoint = API + "FuncionesRol/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "FuncionesRol/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        return service;

    }

}());