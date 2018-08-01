(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("tecnologiaLicenciadaEditConstant", ['AuthService', '$scope', 'tecnologiaLicenciadaService', "$stateParams", "globalGet", "$rootScope", "comunService", "$uibModal", "$state","DTOptionsBuilder", tecnologiaLicenciadaEditConstant]);

    function tecnologiaLicenciadaEditConstant(AuthService, $scope, tecnologiaLicenciadaService, $stateParams, globalGet, $rootScope, comunService, $uibModal, $state, DTOptionsBuilder) {
        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.pago = {};
        $scope.leccion = {};

        var API = globalGet.get("api");
        
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        
        tecnologiaLicenciadaService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.lecciones == null) {
                    $scope.registro.lecciones = [];
                    $scope.lecciones = [];
                } else {
                    $scope.lecciones = $scope.registro.lecciones;
                }
                
                if($scope.proyecto!=null){
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                
                if ($scope.registro.pagos == null || $scope.registro.pagos.length==0) {
                    $scope.registro.pagos = [];
                    $scope.pagosTL = [];
                } else {
                    $scope.pagosTL = $scope.registro.pagos;
                    
                    for (var i = 0; i < $scope.pagosTL.length; i++) {
                        $scope.pagosTL[i].tipoPagoDesc = $scope.pagosTL[i].tipoPagos.descripcion;
                        // $scope.pagosTL.tipoPagoDesc=
                        // tipoPagoDesc descripcion
                    }
                }
            },
            function (error) {
                toastr.error(error);
            });

        tecnologiaLicenciadaService.gettipoPagos().then(
            function (result) {
                $scope.tipoPagos = result.data;
            },
            function (error) {
                toastr.error(error);
            });

        /////////////////////////Buscar Proyecto
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true; $scope.proyectoSelect = {}; var modalInstance = $uibModal.open({
                size: 'lg', templateUrl: 'app/vistasGenericas/buscarProyecto.html', controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: { proyectoSelect: function () { $scope.verproyecto = false; return $scope.proyectoSelect; } }, scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                $scope.elemento = selectedItem;
                            $scope.registro.proyectoNombre = selectedItem.nombre;
                            $scope.registro.proyectoId = selectedItem.proyectoId;
                            $scope.registro.UnidadOrganizacionalId = selectedItem.claveUnidad;
                // comunService.PersonalProyecto_GetByClave($scope.registro.clavePersona, selectedItem.proyectoId).then(
                //     function (result) {
                //         console.log(result.data); if (result.data != null && result.data.length > 0) {
                //             console.log(result.data.length);
                //             toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                //         } else {
                            

                //             //tecnologiaLicenciadaService.getUnidadProyecto($scope.registro.UnidadOrganizacionalId).then(
                //             //    function (result) {
                //             //        
                //             //        $scope.aux = result.data;
                //             //        $scope.aux.noShow = 1;
                //             //        if ($scope.registro.gerencias == undefined || $scope.registro.gerencias == null) {
                //             //            $scope.registro.gerencias = [];
                //             //        }
                //             //        $scope.registro.gerencias.push($scope.aux);
                //             //    },
                //             //    function (error) {
                //             //        toastr.error(error);
                //             //    });
                //         }
                //     }, function (err) { toastr.error(err); console.error(err); return; });
            }); $scope.desabilitar = false;
        }

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
            $scope.registro.UnidadOrganizacionalId = null;
        }

        $scope.update = function () {
            tecnologiaLicenciadaService.update($scope.registro).then(
                function (result) {
                    tecnologiaLicenciadaService.crearPagos($scope.pagosTL).then(
                    function (result) {

                        tecnologiaLicenciadaService.crearLecciones($scope.lecciones).then(
                            function (result) {
                                toastr.success("Registro Actualizado");
                                $state.reload();
                            },
                            function (err) {
                                console.error(err);
                                toastr.error("Error al agregar los pagos");
                                $state.reload();
                            });
                    },
                    function (err) {
                        console.error(err);
                        toastr.error("Error al agregar los pagos");
                        $state.reload();
                    });  
                },
                function (err) {
                    console.error(err);
                    toastr.error("Error al actualizar");
                    $state.reload();
                });
        }

        $scope.addPago = function () {
            
            if ($scope.pago.fecha == null || $scope.pago.fecha==undefined) {
                toastr.error("Ingrese la fecha del pago");
                return false;
            }
            if ($scope.pago.tipoPago == null || $scope.pago.tipoPago==undefined) {
                toastr.error("Ingrese el tipo de pago");
                return false;
            }
            if ($scope.pago.descripcion == null) {
                toastr.error("Ingrese la descripción del pago");
                return false;
            }
            if ($scope.pago.monto == null) {
                toastr.error("Ingrese el monto del pago");
                return false;
            }

            var registro={
                'fecha': $scope.pago.fecha,
                'tipoPagosId': $scope.pago.tipoPago.tipoPagosId,
                'tipoPagoDesc': $scope.pago.tipoPago.descripcion,
                'descripcion': $scope.pago.descripcion,
                'monto': $scope.pago.monto,
                'tecnologiaLicenciadaId': id,
                'clavePersona': $scope.ClavePersonaLogin,
                'id':0
            }

            $scope.pagosTL.push(registro);
            $scope.pago = null;
        }

        $scope.delete = function (registro) {
                    var idx = ($scope.pagosTL.indexOf(registro));
                    $scope.pagosTL.splice(idx, 1);
        };

        $scope.addLeccion = function () {
            
            /*1 GCyDN, 2 GAJ, 3 Gerencia tecnica*/
            if ($scope.leccion.comentario == null) {
                toastr.error("Ingrese el comentario de la lección");
                return false;
            }


            var registro = {
                'fecha': new Date(),
                'tipo': 3,
                'comentario': $scope.leccion.comentario,
                'estado': true,
                'tecnologiaLicenciadaId': id,
                'clavePersona': $scope.ClavePersonaLogin,
                'id': 0
            }

            $scope.lecciones.push(registro);
            $scope.leccion = null;
        }

        $scope.deleteLeccion = function (registro) {
            var idx = ($scope.lecciones.indexOf(registro));
            $scope.lecciones.splice(idx, 1);
        };
    }
})();