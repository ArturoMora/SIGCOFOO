(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PuestoAddCtrl", [
            "$scope",
            "$stateParams",
            "$uibModal",
            "EmpresasCRService",
            "ContactosCRService",
            PuestoAddCtrl
        ]);

    function PuestoAddCtrl($scope, $stateParams, $uibModal, EmpresasCRService, ContactosCRService) {
        var id = $stateParams.id;
        $scope.contactosPuesto = [];
        $scope.dtInstance = {};
        $scope.contactoPuesto = {};
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);

        ContactosCRService.getEmpresasByTrue().then(
            function (result) {
                $scope.empresas = result.data;
            },
            function (err) {
                toastr.error(err);
            });



        CargarContactosPuesto($scope.contacto_id);

        function CargarContactosPuesto(contactoId) {
            ContactosCRService.getPuestoHistorico(contactoId).then(
                function (result) {
                    $scope.contactosPuesto = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        $scope.openEmpresa = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EmpresasFilterGet.html',
                controller: 'EmpresasFilterGetCtrl',
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {

                $scope.nombreEmpresa = selectedItem.nombreEmpresa;
                EmpresasCRService.getEmpresa(selectedItem.empresaId).then(
                    function (result) {

                        $scope.contactoPuesto.empresaId = result.data.empresaId;
                    }, function (err) {
                        toastr.error(err.data.message);
                        console.log(err.data);
                    });
            });
        };


        $scope.openUnidadesOrg = function (idEmpresa) {

            if (idEmpresa == undefined || idEmpresa === null || idEmpresa === "") {
                toastr.error("debe seleccionar una empresa");
            } else {
                $scope.selectItem = {};
                $scope.idEmpresa = idEmpresa;
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/EstructuraOrganizacionalEmpresas.html',
                    controller: 'EstructuraOrganizacionalEmpresasFilterGetCtrl',
                    scope: $scope
                });
                modalInstance.result.then(function (selectedItem) {
                    if (selectedItem != null) {
                        $scope.contactoPuesto.unidadOrganizacionalEmpresas = selectedItem;
                        $scope.contactoPuesto.claveUnidad = selectedItem.claveUnidad;
                    }
                });
            }
        }


        $scope.AddContactoPuesto = function () {
            if ($scope.contactoPuestoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }

            if (!$scope.trabajoActual) {

                $scope.contactoPuesto.fechaInicio = new Date($scope.contactoPuesto.fechaInicio);
                $scope.contactoPuesto.fechaFinal = new Date($scope.contactoPuesto.fechaFinal);

                if ($scope.contactoPuesto.fechaInicio >= $scope.contactoPuesto.fechaFinal) {
                    toastr.error("La fecha inicio no puede ser mayor a la fecha final");
                    return false;
                }
            }

            if ($scope.trabajoActual && $scope.fechaFinal != null) {
                $scope.contactoPuesto.fechaFinal = null;
            }


            $scope.contactoPuesto.contactoId = id;

            ContactosCRService.createPuestoHistorico($scope.contactoPuesto).then(
                function (result) {

                    toastr.success(result.data);
                    CargarContactosPuesto(id);
                    $scope.limpiarCampos();

                },
                function (err) {
                    toastr.error("Error al crear al intentar crear el registro");
                    console.log(err);
                });
        };

        $scope.eliminarPuestoContacto = function (id, contactoId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ContactosCRService.deleteContactoPuesto(id).then(
                            function (result) {
                                toastr.success(result.data);
                                $scope.dtInstance._renderer.rerender();
                                $uibModalInstance.dismiss('cancel');
                                CargarContactosPuesto(contactoId);
                            },
                            function (err) {
                                toastr.error(err);
                            });
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.editarPuestoContacto = function (id) {
            
            $scope.contactoPuestoEditForm = {};
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/contactos/puestos/puestoEdit.html',
                controller: function ($uibModalInstance) {

                    ContactosCRService.getPuestoHistoricoEdit(id).then(
                        function (result) {
                            $scope.contactosEditPuesto = result.data;
                            $scope.contactosEditPuesto.trabajoActualModal = false;
                            $scope.contactosEditPuesto.fechaInicio = new Date(result.data.fechaInicio);
                            if ($scope.contactosEditPuesto.fechaFinal != null) {
                                $scope.contactosEditPuesto.fechaFinal = new Date(result.data.fechaFinal);
                            } else {
                                $scope.contactosEditPuesto.trabajoActualModal = true;
                            }

                            if($scope.unidad!=null){
                                $scope.contactosEditPuesto.unidadOrganizacionalEmpresas= $scope.unidad;
                            }

                        },
                        function (err) {
                            toastr.error("Error al cargar los datos del puesto del contacto");
                            console.log(err);
                        });

                    $scope.openUnidades = function (idEmpresa) {
                        
                        if (idEmpresa == undefined || idEmpresa === null || idEmpresa === "") {
                            toastr.error("debe seleccionar una empresa");
                        } else {
                            $scope.selectItem = {};
                            $scope.idEmpresa = idEmpresa;
                            var modalInstance = $uibModal.open({
                                size: 'lg',
                                templateUrl: 'app/vistasGenericas/EstructuraOrganizacionalEmpresas.html',
                                controller: 'EstructuraOrganizacionalEmpresasFilterGetCtrl',
                                scope: $scope
                            });
                            modalInstance.result.then(function (selectedItem) {
                                if (selectedItem != null) {
                                    $scope.contactosEditPuesto.unidad = selectedItem;
                                    $scope.contactosEditPuesto.claveUnidad = selectedItem.claveUnidad;
                                }
                            });
                        }
                    }
                    $scope.ok = function () {

                        if (($scope.contactosEditPuesto.puesto == "" || $scope.contactosEditPuesto.puesto == undefined || $scope.contactosEditPuesto.puesto == null)
                            || ($scope.contactosEditPuesto.empresaId == null || $scope.contactosEditPuesto.empresaId == "" || $scope.contactosEditPuesto.empresaId == undefined)
                            || ($scope.contactosEditPuesto.fechaInicio == null || $scope.contactosEditPuesto.fechaInicio == "" || $scope.contactosEditPuesto.fechaInicio == undefined)
                            || (($scope.contactosEditPuesto.fechaFinal == null || $scope.contactosEditPuesto.fechaFinal == "" || $scope.contactosEditPuesto.fechaFinal == undefined)
                            && !$scope.contactosEditPuesto.trabajoActualModal)) {
                            toastr.error("Complete los datos requeridos");
                            return false;
                        }

                        if(!$scope.contactosEditPuesto.trabajoActualModal){
                            if ($scope.contactosEditPuesto.fechaInicio > $scope.contactosEditPuesto.fechaFinal) {
                                toastr.error("La fecha inicio no puede ser mayor a la fecha final");
                                return false;
                            }
                        }
                        
                        if ($scope.contactosEditPuesto.trabajoActualModal) {
                            $scope.contactosEditPuesto.fechaFinal = null;
                        }

                        ContactosCRService.updatePuestoHistorico($scope.contactosEditPuesto).then(
                            function (result) {
                                toastr.success(result.data);
                                $scope.dtInstance._renderer.rerender();
                                $uibModalInstance.dismiss('cancel');
                                CargarContactosPuesto($scope.contactosEditPuesto.contactoId);
                            },
                            function (err) {
                                toastr.error(err);
                            });
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
                
            });
        }

        $scope.limpiarCampos = function () {
            // $scope.contactoPuesto.fechaFinal = "";
            // $scope.contactoPuesto.fechaInicio = "";
            // $scope.contactoPuesto.puesto = "";
            // $scope.contactoPuesto.empresaId = "";
            $scope.contactoPuesto={};
            $scope.nombreEmpresa = "";
            $scope.contactoPuestoAddForm.$resetForm();
        }
    }
})();