
(function () {
    "use strict";

    angular
        .module("ineel")
        .controller("cargardatosCtrl", ["$scope", "$state", "$location",
            "AuthService", "MenuService", "PersonaService", '$uibModal', cargardatosCtrl]);

    function cargardatosCtrl($scope, $state, $location,
        AuthService, MenuService, PersonaService, $uibModal) {
        $scope.respons = [];
        $scope.message = "";
        $scope.$parent.rolDescripcion = "";

        $scope.authentication = AuthService.authentication;
        if (typeof $scope.authentication.isAuth !== undefined
            && !$scope.authentication.isAuth) {
            //$state.go("/login");
            window.location = "/index.html#/login";
        }

        if (typeof $scope.authentication.isAuth !== undefined
            && $scope.authentication.isAuth) {

            MenuService.removeMenu();

            PersonaService.getDatos(AuthService.authentication.userName).then(
                function (response) {
                    if (!(response === null)) {
                        if (typeof response.roles !== 'undefined') {

                            if (response.roles.length > 0) {

                                if (response.roles.length > 1) {

                                    $scope.openModal(response.roles);
                                }
                                else {

                                    if (typeof response.roles[0].idRol === undefined || response.roles[0].idRol <= 0) {
                                        $scope.message = "no hay rol pa el usuario: " + response.roles[0].rol.descripcion;
                                        toastr.erro($scope.message);
                                        AuthService.logOut();
                                        console.log($scope.message);
                                    }
                                    $scope.cargarfunciones(response.roles[0].idRol);
                                }
                            } else {

                                $scope.message = "No hay rol para el usuario: " + AuthService.authentication.userName;
                                toastr.error($scope.message);
                                AuthService.logOut();
                                console.log($scope.message);
                            }
                        }
                        else {

                            $scope.message = "No se encuentra la propiedad roles";
                            toastr.error($scope.message);
                        }
                    }else{
                        $state.go("login");
                    }


                },
                function (err) {

                    $scope.message = "Problema al cargar la informacion del usuario";
                    $scope.message = err.error_description;
                    toastr.error($scope.message);
                    AuthService.logOut();
                    console.log($scope.message);
                });

        }

        $scope.gotoHome = function () {
            $state.go("homeAuthorize");
        }



        $scope.openModal = function (roles) {
            $scope.roles = roles;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/home/listaroles.html',
                backdrop: 'static',
                keyboard: false,
                controller: function ($uibModalInstance) {
                    $scope.seleccionaRol = function (rol) {
                        $scope.cargarfunciones(rol.idRol);
                    }
                },
                scope: $scope
            });
        };


        $scope.funcionesCH = function (idRol) {
            PersonaService.getFunciones(idRol, 'CH').then(
                function (response) {
                    MenuService.setRolDescripcion(response.descripcion);
                    MenuService.setRolId(response.rolId);
                    MenuService.setMenuCH(response.funciones);
                    toastr.success("Bienvenido");
                    var url = MenuService.getReturnUrl();

                    if (url == null) {
                        //$state.go("homeAuthorize");
                        window.location = "/sigco.html#/homeAuthorize";
                    } else {
                        MenuService.removeReturnUrl();
                        var puerto = $location.port() == "80" ? "" : ':' + $location.port();
                        var servidor = $location.protocol() + '://' + $location.host() + puerto;
                        var fullUrl = servidor + url;
                        window.location = fullUrl;
                    }
                    
                }, function (err) {

                });
        };
        $scope.funcionesCR = function (idRol) {
            PersonaService.getFunciones(idRol, 'CR').then(
                function (response) {
                    if (typeof response.funciones && response.funciones.length === 0) {
                        $scope.message = "no hay funciones de CR para el rol: " + response.descripcion;
                        //toastr.error($scope.message);
                        console.log($scope.message);
                    }
                    else {
                        MenuService.setMenuCR(response.funciones);
                    }
                    $scope.funcionesCP(idRol);
                    

                }, function (err) {

                });
        };
        $scope.funcionesMT = function (idRol) {
            PersonaService.getFunciones(idRol, 'MT').then(
                function (response) {
                    if (typeof response.funciones && response.funciones.length === 0) {
                        $scope.message = "no hay funciones de MT para el rol: " + response.descripcion;
                        //toastr.error($scope.message);
                        console.log($scope.message);
                    }
                    else {
                        MenuService.setMenuMT(response.funciones);
                    }
                    $scope.funcionesCR(idRol);
                }, function (err) {

                });
        };
        $scope.funcionesCP = function (idRol) {
            PersonaService.getFunciones(idRol, 'CP').then(
                function (response) {

                    if (typeof response.funciones && response.funciones.length === 0) {
                        $scope.message = "no hay funciones de CP para el rol: " + response.descripcion;
                        //toastr.error($scope.message);
                        console.log($scope.message);
                    }
                    else {
                        MenuService.setMenuCP(response.funciones);
                    }
                   
                    $scope.funcionesPI(idRol);
                   
                }, function (err) {

                });
        };
        
        $scope.funcionesPI = function (idRol) {
            PersonaService.getFunciones(idRol, 'PI').then(
                function (response) {

                    if (typeof response.funciones && response.funciones.length === 0) {
                        $scope.message = "no hay funciones de PI para el rol: " + response.descripcion;
                        //toastr.error($scope.message);
                        console.log($scope.message);
                    }
                    else {
                        MenuService.setMenuPI(response.funciones);
                    }
                    $scope.funcionesGI(idRol);
                    

                   
                }, function (err) {

                });
        };
        $scope.funcionesGI = function (idRol) {
            PersonaService.getFunciones(idRol, 'GI').then(
                function (response) {

                    if (typeof response.funciones && response.funciones.length === 0) {
                        $scope.message = "no hay funciones de GI para el rol: " + response.descripcion;
                        //toastr.error($scope.message);
                        console.log($scope.message);
                    }
                    else {
                        
                        MenuService.setMenuGI(response.funciones);
                    }
                    $scope.funcionesCH(idRol);

                }, function (err) {

                });
        };


        $scope.funcionesADM = function (idRol) {
            PersonaService.getFunciones(idRol, 'ADM').then(
                function (response) {
                    if (typeof response.funciones && response.funciones.length === 0) {
                        $scope.message = "no hay funciones de Administrador para el rol: " + response.descripcion;
                        //toastr.error($scope.message);
                        console.log($scope.message);
                    }
                    else {
                        MenuService.setMenuAdmin(response.funciones);
                    }
                    $scope.funcionesMT(idRol);

                }, function (error) {

                });
        };

       

        $scope.cargarfunciones = function (idRol) {
            $scope.funcionesADM(idRol);
        }


    }
}());
