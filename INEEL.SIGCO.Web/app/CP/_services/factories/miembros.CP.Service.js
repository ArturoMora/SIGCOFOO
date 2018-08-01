(function () {
    angular
        .module("ineel.CP.services")
        .factory("MiembrosCPService", [
            "$http",
            "globalGet",
            MiembrosCpService
        ]);


    function MiembrosCpService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll todos los miembros
        service.getAll = function () {
            var endpoint = API + "Miembros/GetAll";
            return $http.get(endpoint);
        };

        //Get miembros por id
        service.getById = function (id) {
            var endpoint = API + "Miembros/GetById/" + id;
            return $http.get(endpoint);
        }


        //Get miembros por id
        service.getInformacionRegistrada = function (id) {
            var endpoint = API + "Miembros/verificaInformacionRegistrada/" + id;
            return $http.get(endpoint);
        }

        //GetAll todos los miembros
        service.getMiembrosAdm = function (id) {
            var endpoint = API + "Miembros/GetByComunidadAdministra/"+id;
            return $http.get(endpoint);
        };

        service.getByClavePersonaComunidad = function (obj) {
            var endpoint = API + "Miembros/GetByClavePersonaComunidad/" + obj;
            return $http.post(endpoint, obj);
        }

        //Get por comunidad
        service.getByComunidad = function (id) {
            var endpoint = API + "Miembros/GetByComunidad/" + id;
            return $http.get(endpoint);
        }

        // Obtiene la clave
        service.GetFirstMiembroByClavePersona = function (experto) {
            var endpoint = API + "Miembros/GetFirstMiembroByClavePersona/" + experto;
            return $http.post(endpoint, experto);
        }

        //Get lider comunidad
        service.getByComunidadLider = function (id) {
            var endpoint = API + "Miembros/GetByComunidadLider/" + id;
            return $http.get(endpoint);
        }

        //Get miembro by clave usuario
        service.getByUsuarioComunidad = function (clave) {
            var endpoint = API + "Miembros/GetByUsuarioComunidad/" + clave;
            return $http.post(endpoint,clave);
        }

        //Get miembros
        service.getMiembrosByComunidad = function (id) {
            var endpoint = API + "Miembros/GetMiembrosByComunidad/" + id;
            return $http.get(endpoint);
        }

        service.getMiembrosByComunidadInactivos = function (id) {
            var endpoint = API + "Miembros/GetMiembrosByInactivos/" + id;
            return $http.get(endpoint);
        }

        //Update EstadoRoles Sitio
        service.updateEstado = function (campo) {
            var endpoint = API + "Miembros/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        //Get secretario comunidad
        service.getByComunidadSecretario = function (id) {
            var endpoint = API + "Miembros/GetByComunidadSecretario/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (obj) {
            var endpoint = API + "Miembros/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Create
        service.registraMiembro = function (obj) {
            var endpoint = API + "Miembros/RegistraMiembros/" + obj;
            return $http.post(endpoint, obj);
        }


        //Create
        service.enviaNotificaciones = function (obj) {
            var endpoint = API + "Miembros/EnviaNotificaciones";
            // var endpoint = API + "Miembros/EnviaNotificaciones?block=no";
            return $http.post(endpoint, obj);
        }

        //Update
        service.update = function (obj) {
            var endpoint = API + "Miembros/Update";
            return $http.put(endpoint, obj);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Miembros/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoRoles Sitio
        service.updateEstado = function (obj) {
            var endpoint = API + "Miembros/UpdateEstado";
            return $http.put(endpoint, obj);
        }

        //Update aceptacion lineamientos
        service.updateAceptacionLineamientos = function (obj) {
            var endpoint = API + "Miembros/UpdateAceptacionLineamientos";
            return $http.put(endpoint, obj);
        }

        // Obtener foto en ficha personal
        service.getadjunto64 = function (id) {
            var endPoint = API + "Personas/ObtenerFoto/" + id;
            return $http.get(endPoint);
        }

        //crea contacto
        service.createContact = function (contacto) {
            var endpoint = API + "Contactos/CreateContact/" + contacto;
            return $http.post(endpoint, contacto);
        }

        // Create Empresa
        service.createEmpres = function (empresa) {
            var endpoint = API + "Empresas/CreateEmpres/" + empresa;
            return $http.post(endpoint, empresa);
        }

        // Get LineasDesarrolloTecnologico
        service.getLineasDesarrolloTecnologico = function () {
            var endpoint = API + "LineaDesarrolloTecnologico/GetAll";
            return $http.get(endpoint);
        };

        // Get Experto by contactoid
        service.validaexperto = function (contactoid) {
            var endpoint = API + "Expertos/GetByContactoId/" + contactoid;
            return $http.get(endpoint);
        }
        // Create experto
        service.crearexperto = function (experto) {
            var endpoint = API + "Expertos/Create/" + experto;
            return $http.post(endpoint, experto);
        }

        // Create experto
        service.crearExpertoSinInvestigadores = function (experto) {
            var endpoint = API + "Expertos/createSinInvestigadores/" + experto;
            return $http.post(endpoint, experto);
        }

        // Create experto
        service.obtenExpertosPorComunidad = function (id) {
            var endpoint = API + "Expertos/GetByComunidad/" + id;
            return $http.get(endpoint, id);
        }

        //Update
        service.updateExpertos = function (obj) {
            var endpoint = API + "Expertos/UpdateComunidad";
            return $http.put(endpoint, obj);
        }



        // Create experto
        service.obtenExpertosId = function (id) {
            var endpoint = API + "Expertos/GetById/" + id;
            return $http.get(endpoint, id);
        }

        //Delete
        service.deleteExterno = function (id) {
            var endpoint = API + "Expertos/Delete/" + id;
            return $http.delete(endpoint);
        }


        return service;
    }
})();