(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("tecnologiaLicenciadaEdit", ['AuthService', '$scope', 'MenuService', 'tecnologiaLicenciadaService', "$stateParams", "$rootScope", "$state", "$uibModal", tecnologiaLicenciadaEdit]);

    function tecnologiaLicenciadaEdit(AuthService, $scope, MenuService, tecnologiaLicenciadaService, $stateParams, $rootScope, $state, $uibModal) {
        window.scrollTo(0, 0);
        var id = $rootScope.getGlobalID();
        if (id == undefined || id == null || id == "") {
            $state.go("tecnologiaLicenciada");
        }
        $scope.registro = {};
        $scope.Convenio1 = {};
        $scope.leccion = {};
        $scope.PIEliminados = [];
        $scope.DAEliminados = [];
        $scope.registro.nuevasGerencias = [];

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        $scope.rolId = MenuService.getRolId();


        tecnologiaLicenciadaService.gettipoPagos().then(
            function (result) {
                $scope.tipoPagos = result.data;
            },
            function (error) {
                toastr.error(error);
            });

        //obtener el registro a mostrar
        tecnologiaLicenciadaService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;

                $scope.Convenio1 = $scope.registro.convenio;
                if($scope.registro.proyecto!=null){
                    $scope.registro.proyectoNombre=$scope.registro.proyecto.nombre;
                }
                

                if ($scope.registro.lecciones == null) {
                    $scope.registro.lecciones = [];
                    $scope.lecciones = [];
                } else {
                    $scope.lecciones = $scope.registro.lecciones;
                }
                if ($scope.registro.fechaInicio != null) {
                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                }
                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                }
                $scope.estadoAux = $scope.registro.estadoLicenciamientoId;

                ///////validar que el fomrulario esta completo

                if (($scope.registro.nombreReceptor != null && $scope.registro.nombreReceptor != "")
                    && $scope.registro.fechaInicio != null
                    && $scope.registro.fechaTermino != null
                    && $scope.registro.proyectoId != null) {
                    $scope.mostrar = true;
                } else {
                    $scope.mostrar = false;
                }

            },
            function (error) {
                toastr.error(error);
            });

        $scope.$watch("Convenio1", function (newValue, oldValue) {
            try {
                $scope.registro.convenioId = $scope.Convenio1.convenioId;
                $scope.fechaReferencia = $scope.Convenio1.fechaInicio;
                //if ($scope.Convenio1.fechaInicio != null)
                //    $scope.registro.fechaInicio = new Date($scope.Convenio1.fechaInicio);
                //if ($scope.Convenio1.fechaTermino != null)
                //    $scope.registro.fechaTermino = new Date($scope.Convenio1.fechaTermino);
            } catch (err) { }
        });
        $scope.$watch("producto", function (newValue, oldValue) {
            try {


                $scope.registro.nombreTecnologiaLic = $scope.producto.nombreTecnico;
                $scope.registro.productoId = $scope.producto.productoId;
            } catch (err) { }
        });
        $scope.$watch("Aliado", function (newValue, oldValue) {
            try {


                $scope.registro.nombreReceptor = $scope.Aliado.empresaNombre;
                $scope.registro.aliadoId = $scope.Aliado.aliadoId;
                $scope.Convenio1=[];

            } catch (err) { }
        });
        $scope.$watch("propiedadW", function (newValue, oldValue) {
            try {


                var aux = {
                    'id': 0,
                    'tecnologiaLicenciadaId': id,
                    'propiedadIndustrialId': $scope.propiedadW.propiedadIndustrialId,
                    'propiedadIndustrial': $scope.propiedadW
                }

                $scope.registro.tecnologiaLicenciadaPIPIndustrial.push(aux);

            } catch (err) { }
        });

        $scope.$watch("derechoAutorW", function (newValue, oldValue) {
            try {

                var aux = {
                    'id': 0,
                    'tecnologiaLicenciadaId': id,
                    'derechosAutorId': $scope.derechoAutorW.derechosAutorId,
                    'derechosAutor': $scope.derechoAutorW
                }
                $scope.registro.tecnologiaLicenciadaPIDA.push(aux);

            } catch (err) { }
        });

        tecnologiaLicenciadaService.getAllEstadosLicenciados().then(
            function (result) {
                $scope.estados = result.data;
            }, function (error) {
                toastr.error(error);
            });


        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg', templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                // comunService.PersonalProyecto_GetByClave($scope.registro.clavePersona, selectedItem.proyectoId).then(
                //     function (result) {
                //         console.log(result.data); if (result.data != null && result.data.length > 0) {
                //             console.log(result.data.length);
                //             toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                //         } else {
                //             $scope.elemento = selectedItem;
                //             $scope.registro.proyectoNombre = selectedItem.nombre;
                //             $scope.registro.proyectoId = selectedItem.proyectoId;
                //             $scope.registro.UnidadOrganizacionalId = selectedItem.claveUnidad;

                //         }
                //     }, function (err) { toastr.error(err); console.error(err); return; });
                $scope.ValidForm.$setDirty();
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
            });
            $scope.desabilitar = false;
        }

        $scope.addPago = function () {

            if ($scope.pago.fecha == null || $scope.pago.fecha == undefined) {
                toastr.error("Ingrese la fecha del pago");
                return false;
            }
            if ($scope.pago.tipoPago == null || $scope.pago.tipoPago == undefined) {
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

            var registro = {
                'fecha': $scope.pago.fecha,
                'tipoPagosId': $scope.pago.tipoPago.tipoPagosId,
                'tipoPagoDesc': $scope.pago.tipoPago.descripcion,
                'descripcion': $scope.pago.descripcion,
                'monto': $scope.pago.monto,
                'tecnologiaLicenciadaId': id,
                'clavePersona': $scope.ClavePersonaLogin,
                'id': 0
            }

            $scope.registro.pagos.push(registro);
            $scope.pago = null;
        }

        $scope.delete = function (registro) {
            var idx = ($scope.registro.pagos.indexOf(registro));
            $scope.registro.pagos.splice(idx, 1);
        };

        $scope.eliminaUnidadAnterior = function (registro) {

            var idx = ($scope.registro.gerencias.indexOf(registro));
            $scope.registro.gerencias.splice(idx, 1);
            $scope.ValidForm.$setDirty();
        };

        $scope.eliminaUnidadNueva = function (registro) {

            var idx = ($scope.registro.nuevasGerencias.indexOf(registro));
            $scope.registro.nuevasGerencias.splice(idx, 1);
            $scope.ValidForm.$setDirty();
        };

        $scope.update = function () {

            if($scope.Convenio1.length==0){
                toastr.error("Debe de seleccionar un convenio");
                return false;
            }

            if ($scope.registro.gerencias.length == 0 && $scope.registro.nuevasGerencias == undefined) {
                toastr.error("Debe de seleccionar por lo menos una unidad organizacional");
                return false;
            }
            if ($scope.registro.gerencias.length == 0 && $scope.registro.nuevasGerencias.length == 0) {
                toastr.error("Debe de seleccionar por lo menos una unidad organizacional");
                return false;
            }


            if ($scope.registro.fechaInicio == null && $scope.registro.fechaTermino != null) {
                toastr.error("Ingrese una fecha de inicio");
                return false;
            }

            if ($scope.registro.fechaTermino == null && $scope.registro.fechaInicio != null) {
                toastr.error("Ingrese una fecha de termino");
                return false;
            }

            if ($scope.registro.fechaInicio != null && $scope.registro.fechaTermino != null) {
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de término debe ser mayor a la de inicio");
                    return false;
                }

            }

            if ($scope.registro.tecnologiaLicenciadaPIPIndustrial.length == 0 && $scope.registro.tecnologiaLicenciadaPIDA.length == 0) {

                toastr.error("Ingrese al menos una propiedad industrial o derecho de autor");
                return false;
            }

            if ($scope.registro.nuevasGerencias != undefined) {
                if ($scope.registro.nuevasGerencias.length > 0) {
                    for(var c=0; c< $scope.registro.nuevasGerencias.length; c++){
                        $scope.registro.nuevasGerencias[c].tecnologiaLicenciadaId= $scope.registro.tecnologiaLicenciadaId;
                        $scope.registro.gerencias.push($scope.registro.nuevasGerencias[c]);
                    }
                    // $scope.registro.nuevasGerencias.forEach(element => {
                    //     element.tecnologiaLicenciadaId = $scope.registro.tecnologiaLicenciadaId;
                    //     $scope.registro.gerencias.push(element);
                    // });
                }
            }


            for (var piAux = 0; piAux < $scope.PIEliminados.length; piAux++) {

                $scope.registro.tecnologiaLicenciadaPIPIndustrial.push($scope.PIEliminados[piAux]);
            }
            for (var daAux = 0; daAux < $scope.DAEliminados.length; daAux++) {

                $scope.registro.tecnologiaLicenciadaPIDA.push($scope.DAEliminados[daAux]);
            }




            tecnologiaLicenciadaService.update($scope.registro).then(
                function (result) {
                    tecnologiaLicenciadaService.crearPagos($scope.registro.pagos).then(
                        function(res){  
                            tecnologiaLicenciadaService.crearLecciones($scope.lecciones).then(
                                function (result) {
                                    toastr.success("Registro Actualizado");
                                    console.log($scope.registro.tecnologiaLicenciadaPIPIndustrial);
        
                                    tecnologiaLicenciadaService.updateAllDA($scope.registro.tecnologiaLicenciadaPIDA).then(
                                        function (result) {
                                            tecnologiaLicenciadaService.updateAllPI($scope.registro.tecnologiaLicenciadaPIPIndustrial).then(
                                                function (result) {
                                                    $state.reload();
                                                },
                                                function (error) { $state.reload(); }
                                            );
                                        },
                                        function (error) { 
                                            console.error(err);
                                            toastr.error("Error al actualizar");
                                            $state.reload(); }
                                    );
        
        
                                },
                                function (err) {
                                    console.error(err);
                                    toastr.error("Error al agregar las lecciones");
                                    $state.reload();
                                });
                        },
                        function (err) {
                            console.error(err);
                            toastr.error("Error al agregar los pagos");
                            $state.reload();
                        }
                    );
                    
                },
                function (err) {

                    console.error(err);
                    toastr.error("Error al actualizar");
                    $state.reload();
                });
        }

        $scope.$watch("Aliado", function (newValue, oldValue) {
            try {

                $scope.registro.nombreReceptor = $scope.Aliado.empresaNombre;
                $scope.registro.aliadoId = $scope.Aliado.aliadoId;
                $scope.mostrar = true;
            } catch (err) { }
        });

        $scope.addLeccion = function () {

            /*1 GCyDN, 2 GAJ, 3 Gerencia tecnica*/
            if ($scope.leccion.comentario == null) {
                toastr.error("Ingrese el comentario de la lección");
                return false;
            }


            var registro = {
                'fecha': new Date(),
                'tipo': 1,
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

        $scope.habilitar = function (nombre) {
            if (nombre == null || nombre == "" || nombre == undefined) {
                $scope.mostrar = false;
                $scope.registro.estadoLicenciamientoId = $scope.estadoAux;
            } else {
                $scope.mostrar = true;
            }
        }

        $scope.fechsaInicioVer = function () {

            if ($scope.mostrar == false && ($scope.registro.fechaInicio != null || $scope.registro.fechaInicio != undefined) && ($scope.registro.fechaTermino != null || $scope.registro.fechaTermino != undefined)) {
                $scope.mostrar = true;
            } else {
                $scope.mostrar = false;
                $scope.registro.estadoLicenciamientoId = $scope.estadoAux;
            }
        }


        $scope.eliminarPI = function (registro) {

            if (registro.id != 0) {
                var aux = registro;
                aux.propiedadIndustrial.titulo = "eliminar";
                $scope.PIEliminados.push(aux);
            }

            var idx = ($scope.registro.tecnologiaLicenciadaPIPIndustrial.indexOf(registro));
            $scope.registro.tecnologiaLicenciadaPIPIndustrial.splice(idx, 1);
            $scope.ValidForm.$setDirty();
        };

        $scope.eliminarDA = function (registro) {

            if (registro.id != 0) {
                var aux = registro;
                aux.derechosAutor.titulo = "eliminar";
                $scope.DAEliminados.push(aux);
            }

            if (registro.id != 0) {
                $scope.PIEliminados.push(registro);
            }
            var idx = ($scope.registro.tecnologiaLicenciadaPIDA.indexOf(registro));
            $scope.registro.tecnologiaLicenciadaPIDA.splice(idx, 1);
            $scope.ValidForm.$setDirty();
        };
        //$scope.update = function () {
        //    tecnologiaLicenciadaService.crearLecciones($scope.lecciones).then(
        //    function (result) {
        //        toastr.success("Registro Actualizado");
        //        $state.reload();
        //    },
        //    function (err) {
        //        console.error(err);
        //        toastr.error("Error al agregar los pagos");
        //        $state.reload();
        //    });
        //}
    }
})();