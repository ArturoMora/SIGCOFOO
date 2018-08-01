(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    app.controller("gestionfichasCtr", ["AuthService", "$scope", "$rootScope", "gestionfichasService", "$uibModal",
        "DTOptionsBuilder", "$state", "MenuService", gestionfichasCtr]);
    function gestionfichasCtr(AuthService, $scope, $rootScope, gestionfichasService, $uibModal, DTOptionsBuilder, $state, MenuService) {

        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.registro = {};
        $scope.paramsDT = {};
        $scope.verTabla = false;


        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withDOM('lftrpi');

        function stateSaveCallback(settings, data) {
            var stado = $('#tablaGestionFichaPersonal').DataTable().state();
            localStorage.setItem('tablaGestionFichaPersonal' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tablaGestionFichaPersonal' + window.location.pathname))
            }

        }


        /////////////buscar
        $scope.buscar = function () {

            $scope.registrosUsuario = {};
            //0 numero/ 1 nombre/2 Todo
            var busqueda = -1;
            var dato;
            if ($scope.registro.numeroEmpleado != null && $scope.registro.numeroEmpleado != "") {
                busqueda = 0;

                //if ($scope.registro.numeroEmpleado.length==4) {
                //    dato = "0"+$scope.registro.numeroEmpleado;
                //} else {
                dato = $scope.registro.numeroEmpleado;
                //}

            }
            if ($scope.registro.nombreEmpleado && $scope.registro.nombreEmpleado != "") {
                busqueda = 1;
                dato = $scope.registro.nombreEmpleado;
            }
            if (($scope.registro.numeroEmpleado == null || $scope.registro.numeroEmpleado == "") && ($scope.registro.nombreEmpleado == null || $scope.registro.nombreEmpleado == "")) {
                busqueda = 2;
            }

            //$scope.paramsDT = {};
            /////////////////Busqueda
            switch (busqueda) {
                case 0:
                    if ($rootScope.idRol == 1) {
                        gestionfichasService.GetByClaveGestionFichaPersonalInvestigador(dato).then(
                            function (result) {
                                $scope.registrosUsuario = result.data;
                                $scope.verTabla = true;
                            },
                            function (err) {
                                toastr.warning("No hay resultados");
                                console.error(err);
                            });
                    }
                    if ($rootScope.idRol == 1026) {
                        gestionfichasService.GetByClaveGestionFichaPersonalSindicalizado(dato).then(
                            function (result) {
                                $scope.registrosUsuario = result.data;
                                $scope.verTabla = true;
                            },
                            function (err) {
                                toastr.warning("No hay resultados");
                                console.error(err);
                            });
                    }

                    break;
                case 1:
                    if ($rootScope.idRol == 1) {
                        gestionfichasService.GetByNombreGestionFichaPersonalInvestigador($scope.registro.nombreEmpleado).then(
                            function (result) {
                                $scope.registrosUsuario = result.data;
                                $scope.verTabla = true;
                            },
                            function (err) {
                                toastr.warning("No hay resultados");
                                console.error(err);
                            });
                    }
                    if ($rootScope.idRol == 1026) {
                        gestionfichasService.GetByNombreGestionFichaPersonalSindicalizado($scope.registro.nombreEmpleado).then(
                            function (result) {
                                $scope.registrosUsuario = result.data;
                                $scope.verTabla = true;
                            },
                            function (err) {
                                toastr.warning("No hay resultados");
                                console.error(err);
                            });
                    }

                    break;
                // case 2:
                //     gestionfichasService.getAll().then(
                //         function (result) {
                //             $scope.registrosUsuario = result.data;
                //             $scope.verTabla = true;
                //         },
                //         function (err) {
                //             toastr.warning("No hay resultados");
                //             console.error(err);
                //         });
                //     break;
                default:
                    toastr.warning("Opción no válida");
                    break;
            }
        }

        $scope.registro = MenuService.getVariable('gestionFichaPersonal');
        if ($scope.registro == null) {
            $scope.registro = {};
            $scope.paramsDT.displayStart = 0; //reiniciamos el parametro de filtrado en DT
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('tablaGestionFichaPersonal' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }

            $scope.buscar();
            MenuService.deleteVariable('gestionFichaPersonal');
        }

        $scope.reset = function () {
            $scope.verTabla = false;
            $scope.registro = {};
            $scope.paramsDT = {};
            $('#tablaGestionFichaPersonal').DataTable().state.clear();

        };


        $scope.guardarclave = function (clave, nobre) {

            $rootScope.GestionFichasClave = clave;
            $rootScope.GestionFichasNombre = nobre;
            var registro = {
                'nombreEmpleado': nobre,
                'numeroEmpleado': clave
            };
            MenuService.setVariable('gestionFichaPersonal', registro);
            //$state.go("fichapersonal");
        }

        $scope.escribeNum = function () {
            if ($scope.registro.numeroEmpleado != undefined) {
                if ($scope.registro.numeroEmpleado.length < 4) {
                    $scope.mensaje = true;
                    $scope.registro.nombreEmpleado = null;
                    $scope.mensaje2 = false;
                } else {
                    $scope.mensaje = false;
                }
            } else {
                //$scope.nombre = false;
            }
        }

        $scope.escribeNom = function () {

            if ($scope.registro.nombreEmpleado.length < 3) {
                $scope.mensaje2 = true;
                $scope.registro.numeroEmpleado = null;
                $scope.mensaje = false;
            } else {
                $scope.mensaje2 = false;
            }
        }
    }
})();