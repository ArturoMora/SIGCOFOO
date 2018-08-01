(function () {
    angular
        .module("ineel.CP.services")
        .factory("ComunidadesCPService", [
            "$http",
            "globalGet",
            ComunidadesCPService
        ]);


    function ComunidadesCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll
        service.getAll = function () {
            var endpoint = API + "Comunidades/GetAll";
            return $http.get(endpoint);
        };

        //GetAll activas
        service.getActivas = function () {
            var endpoint = API + "Comunidades/GetComunidadesActivas";
            return $http.get(endpoint);
        };

        //Obtiene el numero total de comunidades activas
        service.getTotalComunidadesActivas = function () {
            var endpoint = API + "Comunidades/GetTotalComunidadesActivas";
            return $http.get(endpoint);
        };

        //Obtiene el numero total de comunidades 
        service.getTotalComunidades = function () {
            var endpoint = API + "Comunidades/GetTotalComunidades";
            return $http.get(endpoint);
        };

        //Obtiene el numero total de mis comunidades 
        service.getTotalMisComunidades = function (clave) {
            var endpoint = API + "Comunidades/GetTotalMisComunidades/"+clave;
            return $http.get(endpoint);
        };

        //Get
        service.getById = function (id) {
            var endpoint = API + "Comunidades/Get/" + id;
            return $http.get(endpoint);
        }

        //Get
        service.getInformes = function () {
            var endpoint = API + "Comunidades/GetInformes";
            return $http.get(endpoint);
        }
        service.getInformes2 = function () {
            var endpoint = API + "Comunidades/GetInformes2";
            return $http.get(endpoint);
        }
        //Get
        service.getMisComunidades = function (id) {
            var endpoint = API + "Comunidades/GetMisComunidades/" + id;
            return $http.get(endpoint);
        }

        service.create = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "Comunidades/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "Comunidades/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Comunidades/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoRoles Sitio
        service.updateEstado = function (campo) {
            var endpoint = API + "Comunidades/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        //GetAll categorias CP
        service.getAllCategorias = function () {
            var endpoint = API + "CategoriaCP/GetAll";
            return $http.get(endpoint);
        };

        //GetCompromisos
        service.getAllCompromisos = function (id) {
            var endpoint = API + "Metas/GetByComunidad/"+id;
            return $http.get(endpoint);
        };


        //GetAllLineamientos
        service.getLineamientos = function () {
            var endpoint = API + "Lineamientos/GetAll";
            return $http.get(endpoint);
        };

        //Update Lineamiento
        service.updateLineamiento = function (campo) {
            var endpoint = API + "Lineamientos/Update";
            return $http.put(endpoint, campo);
        }

        //Delete lineamientos
        service.deleteLineamiento = function (id) {
            var endpoint = API + "Lineamientos/Delete/" + id;
            return $http.delete(endpoint);
        }

        //OBTEN LA CATEGORIA DEL EMPLEADO QUE INGRESA A LA COMUNIDAD
        service.getByClavePersonaComunidad = function (obj) {
            var endpoint = API + "Miembros/GetByClavePersonaComunidad/" + obj;
            return $http.post(endpoint, obj);

        }

        //Delete noticia by id
        service.deleteNoticia = function (id) {
            var endpoint = API + "Noticias/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Delete compromiso
        service.deleteCompromiso = function (id) {
            var endpoint = API + "Metas/Delete/" + id;
            return $http.delete(endpoint);
        }

        return service;
    }
})();