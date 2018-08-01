(function () {
    "use strict";
    angular
    .module("ineelMT")
    .controller("BuscarInformesBecariosDetailsCtrl", [
        "AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "buscarInformesBecariosService",
        "globalGet",
        "$uibModal",
        "MenuService","$rootScope","IndicadoresMTService",
        BuscarInformesBecariosDetailsCtrl
        ]);

    function BuscarInformesBecariosDetailsCtrl(AuthService, $scope, $state, $stateParams, buscarInformesBecariosService, globalGet, $uibModal, MenuService, $rootScope, IndicadoresMTService) {
        $scope.rolCP = 19; //Rol del Centro de posgrado
        $scope.registro_id = $stateParams.id;
        $scope.tipoInf = $stateParams.id2;
        $scope.justifica = {};
        $scope.ver = $stateParams;
        $scope.Proyecto = "";
        $scope.aux = $scope.registro_id;
        $scope.justificacion = "";
        $scope.authentication = AuthService.authentication;
        var roles = AuthService.authentication.userprofile.roles;
        $scope.LongitudClave = 5; //Longitud de Clave_Persona;

        $scope.Acceso = "False";
        $scope.Descarga = "False";
        $scope.desactivarApr = false;
        $scope.desactivarRec = false;
        $scope.Presentar = "True";
        var API = globalGet.get("api");
        $scope.autorizar = false;
        $scope.becario = {};
        $scope.urlDescarga = API.concat("Descarga/GetFile");
        if ($scope.ver.id2=="AutorizarDenegar") {
            $scope.Acceso = "True";
        }


        if ($rootScope.parametrosBECARIOSMTA1 == 'undefined' || $rootScope.parametrosBECARIOSMTA1 == null || $rootScope.parametrosBECARIOSMTA1 == undefined || $rootScope.parametrosBECARIOSMTA1 == "undefined") {

        } else {
            $rootScope.parametrosBECARIOSMTA1 = $rootScope.parametrosBECARIOSMTA1;

        }



        if ($scope.tipoInf == 1) {
            buscarInformesBecariosService.getbyidInterna($scope.registro_id).then(
            function (result) {
                $scope.registro = result.data;
                buscarInformesBecariosService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombreCompleto = result.data.nombreCompleto;
                    if ($scope.registro.becarioDirigidoId != null) {
                        //Buscar si existe en Becario Dirigido el Asesor&Becario&TipoBeca
                        buscarInformesBecariosService.getbyclave($scope.registro.becarioDirigidoId).then(
                                    function (result) {
                                        if (result.data != null) {
                                            $scope.registroDir = result.data;
                                            //$scope.otorganteBeca = result.data.otorganteBeca;
                                            if (result.data.claveUnidad != null) {
                                                buscarInformesBecariosService.getUO(result.data.claveUnidad).then(
                                                    function (result) {
                                                        if (result.data != null) {
                                                            $scope.UO = result.data.nombreUnidad;
                                                        }
                                                        else {
                                                            toastr.success("Unidad Organizacional no disponible");
                                                        }
                                                    });
                                            }
                                            if ($scope.registroDir.clavePersona != null) {
                                                buscarInformesBecariosService.Persona($scope.registroDir.clavePersona).then(
                                                    function (result) {
                                                        if (result.data != null) {
                                                            $scope.registroDir.nombre = result.data.nombreCompleto;
                                                        }
                                                        else {
                                                            toastr.success("Personal no disponible");
                                                        }
                                                    });
                                            }

                                        }
                                        else {
                                            toastr.success("Becario Dirigido, no existe");
                                        }
                                    },
                                    function (error) {
                                        toastr.error(error);
                                    })
                    }
                    else {
                        //toastr.success("Becario Dirigido, no enlazado");
                    }

                });

            },
            function (error) {
                toastr.error(error);
            });
        }

        if ($scope.tipoInf == 2) {
            buscarInformesBecariosService.getbyidDirigido($scope.registro_id).then(
                                function (result) {
                                    debugger;
                                    buscarInformesBecariosService.Persona(result.data.clavePersona).then(
                                    function (result) {
                                        $scope.registro.nombreCompleto = result.data.nombreCompleto;
                                    });
                                    $scope.registro = result.data;
                                },
            function (error) {
                toastr.error(error);
            });

            //function (result) {
            //    $scope.becario = result.data;
            //    if (($scope.becario.becario_Nombre == "") && ($scope.becario.becario_ClavePersona != "")) {
            //        buscarInformesBecariosService.Persona($scope.becario.becario_ClavePersona).then(
            //             function (result) {
            //                 $scope.becario.becario_Nombre = result.data.nombreCompleto;
            //             });
            //    }
            //    if (($scope.becario.asesor_Nombre == "") && ($scope.becario.asesor_ClavePersona != "")) {
            //        buscarInformesBecariosService.Persona($scope.becario.asesor_Nombre).then(
            //                 function (result) {
            //                     $scope.becario.asessor_Nombre = result.data.nombreCompleto;
            //                 });
            //    }
            //    debugger;
            //    $scope.registro = {};
            //    $scope.registro.numeroBecario = $scope.becario.becario_ClavePersona;
            //    $scope.registro.clavePersona = $scope.becario.asesor_ClavePersona;
            //    $scope.registro.tipoBecaId = $scope.becario.tipoBecaId;
            //    //Buscar si existe en Becario Dirigido el Asesor&Becario&TipoBeca
            //    buscarInformesBecariosService.GetExistente($scope.registro).then(
            //                function (result) {
            //                    if (result.data != null) {
            //                        debugger;
            //                        $scope.otorganteBeca = result.data.otorganteBeca;
            //                        if (result.data.claveUnidad != null) {
            //                            buscarInformesBecariosService.getUO(result.data.claveUnidad).then(
            //                                function (result) {
            //                                    if (result.data != null) {
            //                                        $scope.UO = result.data.nombreUnidad;
            //                                    }
            //                                    else {
            //                                        toastr.success("Unidad Organizacional no disponible");
            //                                    }
            //                                });
            //                        }
            //                    }
            //                    else {
            //                        toastr.success("Becario Dirigido, no existe");
            //                    }
            //                },
            //                function (error) {
            //                    toastr.error(error);
            //                })
            //});
        }


        //if ($scope.tipoInf == 1) {
        //    buscarInformesBecariosService.getbyidInterna($scope.registro_id).then(
        //    function (result) {
        //        buscarInformesBecariosService.Persona(result.data.clavePersona).then(
        //        function (result) {
        //            $scope.registro.nombreCompleto = result.data.nombreCompleto;
        //        });
        //        $scope.registro = result.data;
        //        },
        //    function (error) {
        //        toastr.error(error);
        //    });
        //}

        //if ($scope.tipoInf == 2) {
        //    buscarInformesBecariosService.getbyid($scope.registro_id).then(
        //    function (result) {
        //        $scope.becario = result.data;
        //        if (($scope.becario.becario_Nombre == "" || $scope.becario.becario_Nombre == null) && ($scope.becario.becario_ClavePersona != "")) {
        //            buscarInformesBecariosService.Persona($scope.becario.becario_ClavePersona).then(
        //                 function (result) {
        //                     $scope.becario.becario_Nombre = result.data.nombreCompleto;
        //                 });
        //        }
        //        if (($scope.becario.asesor_Nombre == "") && ($scope.becario.asesor_ClavePersona != "")) {
        //            buscarInformesBecariosService.Persona($scope.becario.asesor_Nombre).then(
        //                     function (result) {
        //                         $scope.becario.asesor_Nombre = result.data.nombreCompleto;
        //                     });
        //        }
        //    },
        //function (error) {
        //    toastr.error(error);
        //});
        //}

       
        $scope.registraAcceso = function () {

           

            var datos = {
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "BEC"
            }

            IndicadoresMTService.AddAccesoModulosOC(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();

    }
})();