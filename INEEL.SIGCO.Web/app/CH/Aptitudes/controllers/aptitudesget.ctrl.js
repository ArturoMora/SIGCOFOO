(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("aptitudesGetCtrl", ["AuthService", "$scope","$rootScope", "$uibModal", 'comunDetailsService', aptitudesGetCtrl])
        .controller("aptitudesAddCtrl", ["AuthService", "$scope", "$http", 'globalGet', '$uibModalInstance', 'comunService', aptitudesAddCtrl])
        .controller("aptitudesEditCtrl", ["AuthService", "$scope", "$http", 'globalGet', '$uibModalInstance', 'comunDetailsService', aptitudesEditCtrl]);
    function aptitudesGetCtrl(AuthService, $scope, $rootScope, $uibModal, comunDetailsService) {
        $rootScope.setVariable("CHficha", "fichapersonal.aptitudes");
        $scope.skills = 3;
        $scope.AptitudesModel = {};
        $scope.AptitudesModel.ClaveEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.idPersona = AuthService.authentication.userprofile.clavePersona;
        var empleadoId = AuthService.authentication.userprofile.clavePersona;
        if (empleadoId == $scope.AptitudesModel.ClaveEmpleado) {
            $scope.duenio = true;
        }

        $scope.toogle = function () {
            setTimeout(function() {
                 $('[data-toggle="tooltip"]').tooltip();
            }, 1000);
           
        };

        $scope.obtieneaptitudesempleado = function (clavePersona) {

            comunDetailsService.AptitudesEmpleado_GetAllByEmpleado(clavePersona, empleadoId).then(
                function (result) {
                    $scope.AptitudesEmpleado = result.data;
                    $scope.AptitudesEmpleadoCant = $scope.AptitudesEmpleado.length;
                    setTimeout(function() {
                         $scope.toogle();
                    }, 500);
                },
                function (err) {
                    $scope.AptitudesEmpleado = [];
                    $scope.AptitudesEmpleadoCant = 0;
                    toastr.error("No se han podido cargar los datos de aptitudes del empleado");
                }
            );

        };

        $scope.obtieneaptitudesempleado($scope.AptitudesModel.ClaveEmpleado);

        $scope.loadListLikes = function (idAptitud, clavePersona, nombreAptidud, cant) {
            if (cant > 0) {
                $scope.aptidud = nombreAptidud
                $scope.cant = cant;
                $scope.clavePersona = clavePersona;
                $scope.idAptitud = idAptitud;
                var modalInstance = $uibModal.open({
                    size: 'md',
                    templateUrl: 'app/vistasGenericas/_details/personal/Likes/otorgantesLikeGet.html',
                    controller: function ($uibModalInstance) {
                        $scope.personasOtorgantes = [];
                        comunDetailsService.LikesLinked_GetAllById_Empleado(idAptitud, clavePersona).then(
                            function (result) {
                                $scope.personasOtorgantes = result.data;
                            },
                            function (err) {
                                $scope.personasOtorgantes = {};
                                toastr.error("No se han podido cargar los datos de Personas Otorgantes");
                            }
                        );
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    scope: $scope
                });
            }
            else {
                toastr.info("No existen validaciones para esta aptitud");
            }
        };



        $scope.opennewaptitudes = function () {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CH/aptitudes/aptitudesAdd.html',
                controller: 'aptitudesAddCtrl',
                scope: $scope
            });

            modalInstance.result.then(function () {
                $scope.obtieneaptitudesempleado($scope.AptitudesModel.ClaveEmpleado);
            });
        };

        $scope.openeditaptitudes = function () {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CH/aptitudes/aptitudesEdit.html',
                controller: 'aptitudesEditCtrl',
                scope: $scope
            });

            modalInstance.result.then(function () {
                $scope.obtieneaptitudesempleado($scope.AptitudesModel.ClaveEmpleado);
            });
        };

    }

    function aptitudesAddCtrl(AuthService, $scope, $http, globalGet, $uibModalInstance, comunService) {

        var API = globalGet.get("api");
        $scope.AptitudesModel = {};
        $scope.enviarcorreo = false;
        $scope.aptitudesempleado = [];
        $scope.authentication = AuthService.authentication;
        $scope.AptitudesModel.ClaveEmpleado = AuthService.authentication.userprofile.clavePersona;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.loadaptitudes = function () {
            return $http.get(API + 'AptitudesCat/GetAll').then(function (response) {
                $scope.listaaptitudes = response.data;
            }, function (error) {
                $scope.listaaptitudes = [];
                toastr.warning("No fue posible cargar la lista", "Aptitudes");
            }
            );
        };
        $scope.loadaptitudes();
        function envioAlaRed(nombreCompleto, numEmpleado) {
            var mail = {
                TipoCorreo: "MailtoLinkedNetwork",
                Modulo: "Capital Humano",
                Empleado: nombreCompleto,
                Descripcion1: "agreg&oacute; aptitud(es), y le invita a validar(las)",
                ClavePersona: numEmpleado
            }
            comunService.mailNotificacion(mail);
            $uibModalInstance.close();
        }
        $scope.guardaraptitudes = function () {
            if ($scope.aptitudesempleado == null || $scope.aptitudesempleado.length <= 0) {
                alert("No se estan registrando aptitudes");
                return false;
            }

            $scope.AptitudesModel.Aptitudes = $scope.aptitudesempleado;

            return $http.post(API + 'AptitudesEmpleado/CreateAptitudesModel/' + $scope.AptitudesModel, $scope.AptitudesModel).then(
                function (response) {
                    toastr.success("Aptitud(es) guardada(s) correctamente.");
                    if ($scope.enviarcorreo) {
                        var result = envioAlaRed($scope.authentication.userprofile.nombreCompleto, $scope.authentication.userprofile.clavePersona)
                    } else {
                        $uibModalInstance.close();
                    }
                }, function (err) {
                    toastr.error("No se ha podido guardar la información de aptitudes.");
                });
        };

        $scope.filtro = function ($query) {

            var aptitudesfiltradas = $scope.listaaptitudes.filter(function (aptitud) {
                return aptitud.nombre.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
            return aptitudesfiltradas;
        };

    }

    function aptitudesEditCtrl(AuthService, $scope, $http, globalGet, $uibModalInstance, comunDetailsService) {

        var API = globalGet.get("api");
        $scope.AptitudesModel = {};
        $scope.AptitudesModel.ClaveEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.idPersona = AuthService.authentication.userprofile.clavePersona;
        var empleadoId = AuthService.authentication.userprofile.clavePersona;
        if (empleadoId == $scope.AptitudesModel.ClaveEmpleado) {
            $scope.duenio = true;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.obtieneaptitudesempleado = function (clavePersona) {

            comunDetailsService.AptitudesEmpleado_GetAllByEmpleado(clavePersona, empleadoId).then(
                function (result) {
                    $scope.AptitudesEmpleado = result.data;
                    $scope.AptitudesEmpleadoCant = $scope.AptitudesEmpleado.length;
                },
                function (err) {
                    $scope.AptitudesEmpleado = [];
                    $scope.AptitudesEmpleadoCant = 0;
                    toastr.error("No se han podido cargar los datos de Aptitudes Empleado");
                }
            );

        };

        $scope.obtieneaptitudesempleado($scope.AptitudesModel.ClaveEmpleado);

        $scope.loadListLikes = function (idAptitud, clavePersona, nombreAptidud, cant) {
            if (cant > 0) {
                $scope.aptidud = nombreAptidud
                $scope.cant = cant;
                $scope.clavePersona = clavePersona;
                $scope.idAptitud = idAptitud;
                var modalInstance = $uibModal.open({
                    size: 'md',
                    templateUrl: 'app/vistasGenericas/_details/personal/Likes/otorgantesLikeGet.html',
                    controller: function ($uibModalInstance) {
                        $scope.personasOtorgantes = [];
                        comunDetailsService.LikesLinked_GetAllById_Empleado(idAptitud, clavePersona).then(
                            function (result) {
                                $scope.personasOtorgantes = result.data;
                            },
                            function (err) {
                                $scope.personasOtorgantes = {};
                                toastr.error("No se han podido cargar los datos de Personas Otorgantes");
                            }
                        );
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    scope: $scope
                });
            }
            else {
                toastr.info("No existen validaciones para esta aptitud");
            }
        };

        $scope.guardaraptitudes = function () {
            if ($scope.AptitudesEmpleadoId == null || $scope.AptitudesEmpleadoId.length <= 0) {
                return false;
            }

            return $http.post(API + 'AptitudesEmpleado/DeleteAptitudesModel/' + $scope.AptitudesEmpleadoId, $scope.AptitudesEmpleadoId).then(function (response) {
                toastr.success(response.data);
                $uibModalInstance.close();
            }, function (err) {
                toastr.error("No se ha podido actulizar la lista de aptitudes.");
            });
        };

        $scope.AptitudesEmpleadoId = [];

        $scope.eliminar = function (registro) {
            var idx = ($scope.AptitudesEmpleado.indexOf(registro));
            $scope.AptitudesEmpleado.splice(idx, 1);
            $scope.AptitudesEmpleadoId.push(registro.aptitudesEmpleadoId);
        };

    }
})();