(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('tecnologiaLicenciadaAdd', ['$scope', 'AuthService', 'MenuService', 'comunCountService', 'comunService', 'tipoAccesoService',
            'ngFabForm', 'tecnologiaLicenciadaService', '$state', '$uibModal', 'adjuntarArchivo', 'buscarPropuestaFactory', tecnologiaLicenciadaAdd]);

    function tecnologiaLicenciadaAdd($scope, AuthService, MenuService, comunCountService, comunService, tipoAccesoService,
        ngFabForm, tecnologiaLicenciadaService, $state, $uibModal, adjuntarArchivo, buscarPropuestaFactory) {
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.registro = {};
        $scope.registro.tecnologiaLicenciadaPIPIndustrial = [];
        $scope.registro.tecnologiaLicenciadaPIDA = [];
        $scope.Convenio = { objetoConvenio: null };
        $scope.fechaReferencia = null;
        $scope.registro.estadoLicenciamientoId = 0;
        $scope.registro.gerencias = [];
        tecnologiaLicenciadaService.getAllEstadosLicenciados().then(
            function (result) {
                $scope.estados = result.data;
            }, function (error) {
                toastr.error(error);
            });
        function isNull(valor) {
            if (valor == undefined || valor == null || valor == "") {
                return true;
            }
            return false;
        };
        $scope.$watch("Convenio1", function (newValue, oldValue) {
            try {
                $scope.registro.convenioId = $scope.Convenio1.convenioId;
                $scope.fechaReferencia = $scope.Convenio1.fechaInicio;
                if ($scope.Convenio1.fechaInicio != null)
                    $scope.registro.fechaInicio = new Date($scope.Convenio1.fechaInicio);
                if ($scope.Convenio1.fechaTermino != null)
                    $scope.registro.fechaTermino = new Date($scope.Convenio1.fechaTermino);
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

            } catch (err) { }
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
                comunService.PersonalProyecto_GetByClave($scope.registro.clavePersona, selectedItem.proyectoId).then(
                    function (result) {
                        if (result.data != null && result.data.length > 0) {

                            toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                        } else {
                            $scope.elemento = selectedItem;
                            $scope.registro.proyectoNombre = selectedItem.nombre;
                            $scope.registro.proyectoId = selectedItem.proyectoId;
                            $scope.registro.UnidadOrganizacionalId = selectedItem.claveUnidad;

                            tecnologiaLicenciadaService.getUnidadProyecto($scope.registro.UnidadOrganizacionalId).then(
                                function (result) {

                                    $scope.aux = result.data;
                                    $scope.aux.noShow = 1;
                                    if ($scope.registro.gerencias == undefined || $scope.registro.gerencias == null) {
                                        $scope.registro.gerencias = [];
                                    }
                                    $scope.registro.gerencias.push($scope.aux);
                                    $scope.ValidForm.$setDirty();
                                },
                                function (error) {
                                    toastr.error(error);
                                });
                        }
                    }, function (err) { toastr.error(err); console.error(err); return; });
            }); $scope.desabilitar = false;
        }

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
            $scope.registro.UnidadOrganizacionalId = null;
        }

        $scope.eliminararea = function (registro) {

            var idx = ($scope.registro.gerencias.indexOf(registro));
            $scope.registro.gerencias.splice(idx, 1);
        };

        $scope.eliminarPI = function (registro) {

            var idx = ($scope.registro.tecnologiaLicenciadaPIPIndustrial.indexOf(registro));
            $scope.registro.tecnologiaLicenciadaPIPIndustrial.splice(idx, 1);
        };

        $scope.eliminarDA = function (registro) {

            var idx = ($scope.registro.tecnologiaLicenciadaPIDA.indexOf(registro));
            $scope.registro.tecnologiaLicenciadaPIDA.splice(idx, 1);
        };

        $scope.agregar = function () {
            if (isNull($scope.registro.nombreTecnologiaLic)) {
                toastr.error("Seleccione producto para recuperar la tecnología licenciada");
                return false;
            }
            if (isNull($scope.registro.nombreReceptor)) {
                toastr.error("Seleccione aliado para recuperar el receptor de la tecnología licenciada");
                return false;
            }
            if (isNull($scope.Convenio1) || isNull($scope.Convenio1.objetoConvenio)) {
                toastr.error("Seleccione el convenio");
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

            if ($scope.registro.tecnologiaLicenciadaPIPIndustrial.length == 0 && $scope.registro.tecnologiaLicenciadaPIDA.length == 0) {

                toastr.error("Ingrese al menos una propiedad industrial o derecho de autor");
                return false;
            }

            if ($scope.registro.fechaInicio != null && $scope.registro.fechaTermino != null) {
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de término debe ser mayor a la de inicio");
                    return false;
                }

            }

            if ($scope.registro.gerencias.length == 0) {
                toastr.error("Ingrese al menos una gerencia.");
                return false;
            }
            //fechas

            if (($scope.registro.fechaInicio != null && $scope.registro.fechaInicio != undefined) && ($scope.registro.fechaTermino != null && $scope.registro.fechaTermino != undefined)) {
                if ($scope.registro.fechaTermino <= $scope.registro.fechaInicio) {
                    toastr.error("La fecha de término debe mayor a la de inicio.");
                    return false;
                }
            }

            tecnologiaLicenciadaService.add($scope.registro).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("tecnologiaLicenciada");
                },
                function (err) {
                    toastr.error("Error al crear el registro");
                    try {
                        var errorMsg = err.data.innerException.innerException.innerException.exceptionMessage;
                        if (errorMsg.indexOf("clave duplicada") > 0) {
                            toastr.warning("No se permite duplicar el número de tecnología licenciada");
                        }
                    } catch (exc) { }
                    console.error(err);
                    $scope.desabilitar = false;
                });
        }


    }
}());