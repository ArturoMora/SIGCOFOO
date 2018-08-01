    (function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("piexternoDetallesCtrl", [
            '$scope'
            , '$filter'
            , '$stateParams'
            , '$uibModal'
            , 'CatalogosPIService'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , 'PIExternoService'
            , 'MenuService'
            , '$state'
            , piexternoDetallesCtrl]);

    function piexternoDetallesCtrl($scope, $filter, $stateParams, $uibModal, CatalogosPIService, adjuntarArchivo, PropiedadIndustrialService, PIExternoService, MenuService, $state) {
        $scope.rolId = MenuService.getRolId(); 
        if ($scope.rolId != 1 && $scope.rol!=1026 ) { toastr.error("No Autorizado"); $state.go("home"); return false; }
        $scope.pi = {};



        
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("pi.justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de una nueva propiedad industrial con la siguiente justificación: " + $scope.pi.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de una nueva propiedad industrial con la siguiente justificación: " + $scope.pi.justificacion + " ? ";
            }
        })

        $scope.registro = {};

        $scope.editAdmin = $stateParams.id2;
        $scope.piid = $stateParams.id;

        CatalogosPIService.gettipospin().then(
            function (result) {
                $scope.tipos = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        CatalogosPIService.getestadosdelprocesoactivos().then(
            function (result) {
                $scope.estados = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        $scope.cargapi = function () {
            PropiedadIndustrialService.getbyid($scope.piid).then(
                function (response) {
                    $scope.pi = response.data;
                    $scope.pi.justificacion = messageDefaultAprobacionAdminCH_ + "";
                    PIExternoService.Persona(response.data.clavePersona).then(
                        function (result) {
                            $scope.registro.nombrePersona = result.data.nombreCompleto;

                            $scope.registro.clavePersona = result.data.clavePersona;
                            $scope.pi.claveUnidadAut = result.data.claveUnidad;
                        });
                    if ($scope.pi.fechaExpedicion != null) {
                        $scope.pi.fechaExpedicion = new Date($scope.pi.fechaExpedicion);
                    }
                    if ($scope.pi.fechaPresentacion != null) {
                        $scope.pi.fechaPresentacion = new Date($scope.pi.fechaPresentacion);
                    }
                    if ($scope.pi.fechaVencimiento != null) {
                        $scope.pi.fechaVencimiento = new Date($scope.pi.fechaVencimiento);
                    }
                    if ($scope.pi.fechaProximoPago != null) {
                        $scope.pi.fechaProximoPago = new Date($scope.pi.fechaProximoPago);
                    }
                    if ($scope.pi.fechaInicioTramite != null) {
                        $scope.pi.fechaInicioTramite = new Date($scope.pi.fechaInicioTramite);
                    }
                    if ($scope.pi.fechaValidacion == null) {
                        $scope.FechaValidacionAux = new Date();
                    } else {
                        $scope.FechaValidacionAux = new Date($scope.pi.fechaValidacion);
                    }
                    if ($scope.pi.unidadOrganizacional !== null) {
                        $scope.unidadOselect = $scope.pi.unidadOrganizacional;
                    }
                    if ($scope.pi.adjuntoId == null) { $scope.regFile = true; } else { $scope.regFile = false; $scope.archivos = 1; }
                },
                function (error) {
                    toastr.error(error.message);
                }
            );

        }

        $scope.cargapi();


        $scope.actualizarpi = function () {
                 
            $scope.pi.listacoautores = "";
            var inventores = $filter('filter')($scope.pi.inventores, { esExterno: false });
            for (var i = 0; i < inventores.length; i++) {
                $scope.pi.listacoautores += inventores[i].clavePersona + ",";
            }

            debugger;

            PropiedadIndustrialService.updatepi($scope.pi).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.globalRegresar();
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
        }

        $scope.agregarinventorexterno = function () {
            var inventor = {};
            inventor.nombre = $scope.inventorExt.nombre;
            inventor.clavePersona = 'Externo';
            inventor.esExterno = true;
            inventor.institucion = $scope.inventorExt.institucion;
            $scope.existe = $filter('filter')($scope.pi.inventores, inventor.nombre, true);
            if ($scope.existe.length == 0) {
                $scope.pi.inventores.push(inventor);
                $scope.inventorExt = {};
                $scope.addExt = false;
            }
            else {
                toastr.warning("El autor ya se encuentra en la lista.");
            }
        }

        $scope.eliminainventor = function (inventor) {
            var index = $scope.pi.inventores.indexOf(inventor);
            $scope.pi.inventores.splice(index, 1);
        }

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.pi.adjunto = Adjunto;
                    $scope.ValidForm.$setDirty();
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.deleteFile = function () {
            $scope.pi.adjunto = null;
            $scope.pi.adjuntoId = null;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }


        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                var inventor = {};
                inventor.nombre = selectedItem.nombreCompleto;
                inventor.clavePersona = selectedItem.clavePersona;
                inventor.esExterno = false;
                $scope.existe = $filter('filter')($scope.pi.inventores, inventor.clavePersona, 'clavePersona');
                if ($scope.existe.length == 0) {
                    $scope.pi.inventores.push(inventor);
                }
                else {
                    toastr.warning("El autor ya se encuentra en la lista.");
                }
                $scope.ValidForm.$setDirty();
            });
        }

        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
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
                $scope.pi.proyecto.nombre = selectedItem.nombre;
                $scope.pi.numeroProyecto = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }

    }
})();