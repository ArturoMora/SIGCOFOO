(function () {
    "use strict";

    angular
        .module("ineelCH")
        .directive('numbersOnly', function () {
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
        .controller("becariodirigidoCtrlAdd"
            , ['$rootScope', 'AuthService'
                , '$scope'
                , 'BecarioDirigidoService'
                , 'globalGet'
                , 'uploadFileACH'
                , '$state'
                , '$filter'
                , '$uibModal'
                , becariodirigidoCtrlAdd]);
    function becariodirigidoCtrlAdd($rootScope, AuthService, $scope, BecarioDirigidoService, globalGet, uploadFileACH, $state, $filter, $uibModal) {
        //Variable API
        window.scrollTo(0, 0);
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;


        $scope.registro = {};
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        if ($scope.idGF == null) {
            $scope.registro.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.registro.nombreEmpleado = AuthService.authentication.nombreCompleto;
            $scope.registro.nombrePersona = $scope.registro.nombreEmpleado;
        } else {
            $scope.registro.clavePersona = $scope.idGF;
            $scope.registro.nombreEmpleado = $scope.nomGF;
            $scope.registro.nombrePersona = $scope.registro.nombreEmpleado;
        }

        BecarioDirigidoService.getTipoBecas().then(
            function (result) {
                $scope.becas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo becas.");
            }
        );
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
        //$scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        ////////////////////////////////////Buscar EO
        $scope.ElementoSeleccionado = {};
        $scope.openArea = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EstructuraOrganizacional.html',
                controller: 'EstructuraOrganizacionalFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                //$scope.ElementoSeleccionado = selectedItem;

            });
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.becariodirigido", { seccion: 'becariodirigido' });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);

            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {

                    if (!err) {
                        console.log("result:");
                        console.log(result);

                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }

                });
        };
        function transferComplete(result) {

            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });

        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if (typeof $scope.areaasignada === 'undefined' || $scope.areaasignada === null) {
                    toastr.error("Seleccione área asignada");
                    return;
                }
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                /////////////////
                $scope.registro.claveUnidad = $scope.areaasignada.claveUnidad;
                //$scope.registro.nombreUnidad = $scope.areaasignada.nombreUnidad;
                //$scope.registro.fechaEfectiva = $scope.areaasignada.fechaEfectiva;
                $scope.desabilitar = true;
                $scope.registro.estadoFlujoId = 1;

                var registro = {
                    "ClavePersona": $scope.registro.clavePersona,
                    "TipoBecaId": $scope.registro.tipoBecaId,
                    "NumeroBecario": $scope.registro.numeroBecario,
                };

                BecarioDirigidoService.ValidaRegistroDuplicado(registro).then(
                    function (res) {
                        if(res.data){
                            toastr.warning("Intente cambiar el tipo de beca o el número de becario asociado");
                            toastr.warning("Ya existe el registro!");
                            return false;
                        }
                        BecarioDirigidoService.add($scope.registro).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("fichapersonal.becariodirigido", { seccion: 'becariodirigido' });
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                    }, function (err) {
                        console.log(err);
                    }
                );

            }
        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();