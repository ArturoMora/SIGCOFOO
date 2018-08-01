(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('homeONCRCtrl', [
            '$scope',
            'AuthService',
            'MenuService',
            'OportunidadNegocioCRService',
            homeONCRCtrl
        ]);

    function homeONCRCtrl($scope, AuthServiceCR, MenuService, OportunidadNegocioCRService) {
        $scope.authentication = AuthServiceCR.authentication;
        $scope.rolid = MenuService.getRolId();
        $scope.rolDescripcion = MenuService.getRolDescripcion();


        var Id = $scope.authentication.userprofile.clavePersona;
        var claveunidad = $scope.authentication.userprofile.claveUnidad;
        $scope.seguimientos = [];
        $scope.suspendidas = [];
        $scope.canceladas = [];
        $scope.inipors = [];



        OportunidadNegocioCRService.getOportunidadesDonnut().then(
            function (result) {
                $scope.oportunidades = result.data;
                $scope.cargadona();
            },
            function (err) {
                toastr.error(err);
            });

        //cargar oportunidades registradas
        $scope.registradas = function () {
            OportunidadNegocioCRService.getMisOportunidadesRegistradas(Id).then(
                function (result) {
                    $scope.oportunidadesRegistradas = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        //cargar oportunidades asignadas
        $scope.asignadas = function () {
            OportunidadNegocioCRService.getMisOportunidadesAsignadas(Id).then(
                function (result) {
                    $scope.oportunidadesAsignadas = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        //cargar oportunidades asignadas
        $scope.asignadasespecialista = function () {
            OportunidadNegocioCRService.getMisOportunidadesAsignadasEspecialista(Id).then(
                function (result) {
                    $scope.oportunidadesAsignadas = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        //cargar oportunidades en seguimiento
        $scope.enseguimiento = function () {
            OportunidadNegocioCRService.getBySeguimiento(Id).then(
                function (result) {
                    $scope.oportunidadesEnSeguimiento = result.data;
                },
                function (err) {
                    toastr.error(err);
                }
            );
        }

        //cargar oportunidades por asignar 
        $scope.asignaron = function () {
            OportunidadNegocioCRService.getOportunidadesPorAsignadar(Id).then(
                function (result) {
                    $scope.oportunidadesPorAsignar = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        //cargar historial de oportunidades
        $scope.historial = function () {
            OportunidadNegocioCRService.getOportunidadesDonnut().then(
                function (result) {
                    $scope.historial = result.data;
                },
                function (err) {
                    toastr.error(err.data);
                });
        }

        //cargar oportunidades por asignar
        $scope.porasignar = function () {
            if ($scope.rolid == 4 || $scope.rolid == 5) {
                OportunidadNegocioCRService.getOportunidadesPorAsignarAInvestigador(claveunidad).then(
                    function (result) {
                        $scope.oportunidadesPorAsignar = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
            }
        }



        $scope.registradas();

        switch ($scope.rolid) {
            case 8:
                $scope.enseguimiento();
                $scope.asignadas();
                break;
            case 15:
                $scope.asignaron();
                $scope.historial();
                break;
            case 1025:
                $scope.asignadasespecialista();
                $scope.historial();
                break;
            case 4:
            case 5:
                $scope.porasignar();
                $scope.historial();

                break;
            case 4:
                $scope.inipors.push(estado);

        }

        $scope.cargadona = function () {
            angular.forEach($scope.oportunidades, function (value, index) {
                var estado = value.estadoONId;

                switch (estado) {
                    case 1:
                        $scope.seguimientos.push(estado);
                        break;
                    case 2:
                        $scope.suspendidas.push(estado);
                        break;
                    case 3:
                        $scope.canceladas.push(estado);
                        break;
                    case 4:
                        $scope.inipors.push(estado);

                }
            });

            $scope.seguimiento = {
                'nombre': 'En Seguimiento',
                'color': '#26B99A',
                'count': $scope.seguimientos.length
            }
            $scope.suspendida = {
                'nombre': 'Suspendida Temporalmente',
                'color': '#73879C',
                'count': $scope.suspendidas.length
            }
            $scope.cancelada = {
                'nombre': 'Cancelada',
                'color': '#F0AD4E',
                'count': $scope.canceladas.length
            }
            $scope.inipor = {
                'nombre': 'En Iniciativa o Propuesta',
                'color': '#03586A',
                'count': $scope.inipors.length
            }

            $scope.labels = [
                $scope.seguimiento.nombre,
                $scope.suspendida.nombre,
                $scope.cancelada.nombre,
                $scope.inipor.nombre,
            ];
            $scope.data = [
                $scope.seguimiento.count,
                $scope.suspendida.count,
                $scope.cancelada.count,
                $scope.inipor.count,
            ];
            $scope.options = {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                
            };
            $scope.colors = [
                $scope.seguimiento.color,
                $scope.suspendida.color,
                $scope.cancelada.color,
                $scope.inipor.color,
            ];
        }


    }
}());
