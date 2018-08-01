(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PerfilAddCtrl", [
            "$scope",
            "$state",
            "$stateParams",
            "$uibModal",
            "ContactosCRService",
            PerfilAddCtrl
        ]);

    function PerfilAddCtrl($scope, $state,$stateParams, $uibModal, ContactosCRService) {
        var id = $stateParams.id;
        $scope.perfilContaco = [];
        $scope.contactoperfil = {};
        $scope.contactosEditPerfil = {};
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        CargarContactosPerfil($scope.contacto_id);

        ContactosCRService.getGradoAcademico().then(
            function (result) {
                $scope.gradosacademicos = result.data;
                $scope.gradosacademicos;
            },
            function (err) {
                toastr.error(err);
            });
        ContactosCRService.getCarreras().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error(err);
            });
        ContactosCRService.getIntituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error(err);
            });
        ContactosCRService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        //modal carreras
        $scope.opencarreras = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacarreras.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.carrera = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedcarrera = selectedItem;
                $scope.selectedcarrera.carreraId = selectedItem.carreraId;
            });
            $scope.desabilitar = false;
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedinstitucion = selectedItem;
                $scope.selectedinstitucion.institucionID = selectedItem.institucionID;
            });
            $scope.desabilitar = false;
        }


        function CargarContactosPerfil(contactoId) {
            ContactosCRService.getContactoPerfil(contactoId).then(
                function (result) {
                    $scope.contactosPerfil = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        $scope.AddContactoPerfil = function () {
            $scope.fechaInicio = new Date($scope.fechaInicio);
            $scope.fechaFinal = new Date($scope.fechaFinal);

            if ($scope.fechaInicio > $scope.fechaFinal) {
                toastr.error("La fecha inicio no puede ser mayor a la fecha final");
                return false;
            }

            if ($scope.contactoPerfilAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if ($scope.fechaInicio >= $scope.fechaFinal) {
                toastr.error("La fecha de término debe ser mayor a la de inicio.");
                $scope.fechaInicioMayor = true;
                return false;
            }

            $scope.contactoperfil.carreraId = $scope.selectedcarrera.carreraId;
            $scope.contactoperfil.institucionId = $scope.selectedinstitucion.institucionID;
            $scope.contactoperfil.paisId = $scope.selectedinstitucion.paisID;

            $scope.contactoperfil.fechaInicio = $scope.fechaInicio;
            $scope.contactoperfil.fechaFinal = $scope.fechaFinal;

            $scope.contactoperfil.contactoId = id;

            ContactosCRService.createPerfil($scope.contactoperfil).then(
                function (result) {
                    toastr.success(result.data);
                    CargarContactosPerfil(id);
                    //$state.go("contactoEdit.perfilCV");
                    $scope.limpiarCampos();
                },
                function (err) {
                    toastr.error(err);
                });
        };

        $scope.eliminarPerfilContacto = function (id, contactoId) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ContactosCRService.deleteContactoPerfil(id).then(
                            function (result) {
                                toastr.success(result.data);
                                $uibModalInstance.close();
                                CargarContactosPerfil(contactoId);
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

        $scope.editarContactoPerfil = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/contactos/perfil/perfilEdit.html',
                controller: function ($uibModalInstance) {
                    ContactosCRService.getContactoPerfilEdit(id).then(
                        function (result) {
                            $scope.contactosEditPerfil = result.data;
                            $scope.contactosEditPerfil.fechaInicio = new Date($scope.contactosEditPerfil.fechaInicio);
                            $scope.contactosEditPerfil.fechaFinal = new Date($scope.contactosEditPerfil.fechaFinal);
                            $scope.selectedcarrera = $scope.contactosEditPerfil.carrera;
                            $scope.selectedinstitucion = $scope.contactosEditPerfil.institucion;
                            $scope.selectedinstitucion.pais = $scope.contactosEditPerfil.pais;
                        },
                        function (err) {
                            toastr.error(err);
                        });

                    $scope.ok = function () {
                        if ($scope.contactosEditPerfil.fechaInicio > $scope.contactosEditPerfil.fechaFinal) {
                            toastr.error("La fecha inicio no puede ser mayor a la fecha final");
                            return false;
                        }

                        $scope.contactosEditPerfil.carreraId = $scope.selectedcarrera.carreraId;
                        $scope.contactosEditPerfil.institucionId = $scope.selectedinstitucion.institucionID;
                        $scope.contactosEditPerfil.paisId = $scope.selectedinstitucion.paisID;

                        ContactosCRService.updateContactoPeril($scope.contactosEditPerfil).then(
                            function (result) {
                                toastr.success(result.data);
                                $uibModalInstance.close();
                                CargarContactosPerfil($scope.contactosEditPerfil.contactoId);

                            },
                            function (err) {
                                toastr.error(err.message);
                            });
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.detallesContactoPerfil = function (id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/contactos/perfil/perfilDetails.html',
                controller: function ($uibModalInstance) {
                    ContactosCRService.getContactoPerfilEdit(id).then(
                        function (result) {
                            $scope.contactosPerfilDetails = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.limpiarCampos = function () {
            $scope.selectedcarrera = null;
            $scope.selectedinstitucion = null;
            $scope.contactoperfil.especialidad = null;
            $scope.fechaFinal = "";
            $scope.fechaInicio = "";
            $scope.contactoperfil.gradoAcademicoId = null;
            $scope.contactoperfil.institucionId = null;

            $scope.contactoPerfilAddForm.$resetForm();
            //$scope.contactoPerfilAddForm.$setPristine();
            //$scope.contactoPerfilAddForm.$setUntouched();

        }
    }
})();
