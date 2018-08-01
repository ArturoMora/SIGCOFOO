(function () {
    angular
        .module("ineel.CP.services")
        .factory("RolesUsuarioCPService", [
            "$q",
            "$http",
            "globalGet",
            "MenuService",
            "AuthService",
            RolesUsuarioCPService
        ]);


    function RolesUsuarioCPService($q, $http, globalGet, MenuService, AuthService) {
        var authentication = AuthService.authentication;
        var API = globalGet.get("api");
        var service = {};
        var rol = {};

        var _getRolesUsuario = function (obj) {

            var idRol = MenuService.getRolId();
            var defered = $q.defer();
            var promise = defered.promise;

            rol.administrador = false;
            rol.miembro = false;
            rol.lider = false;
            rol.secretario = false;
            rol.invitado = false;


            var datosMiembro = {};

            if (idRol != '1027') {

                var endpoint = API + "Miembros/GetByClavePersonaComunidad/" + obj;

                $http.post(endpoint, obj)
                    .then(function(result) {
                        if (result.data != null) {
                                var rolUser = result.data.roles;
                                rol.datosMiembro = result.data;
                                switch (rolUser.rolId) {
                                case 2:
                                    rol.miembro = true;
                                    break;
                                case 3:
                                    rol.lider = true;
                                    break;
                                case 4:
                                    rol.secretario = true;
                                    break;
                                }
                            } else {
                            rol.invitado = true;
                            rol.datosMiembro = authentication;
                                
                            }
                            
                            defered.resolve(rol);
                        },
                        function(err) {
                            toastr.error("Se presentó un problema al obtener sus credenciales de acceso a esta comunidad");
                            console.log(err);
                            defered.reject(err);
                        });

            } else {
                rol.administrador = true;
                rol.datosMiembro = authentication;
                defered.resolve(rol);
            }


            return promise;

        };

        service.getRolesUsuario = _getRolesUsuario;

        return service;
    }
})();