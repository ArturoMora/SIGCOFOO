(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FondoProgramaAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "FondosProgramaCRService",
            "$uibModal",
            "DTOptionsBuilder",
            FondoProgramaAddCtrl
        ]);

    function FondoProgramaAddCtrl(AuthService, $scope, $state, $stateParams, FondosProgramaCRService, $uibModal, DTOptionsBuilder) {
        var id = $stateParams.id; //MARCO

        $scope.seleccion = []; //Leti
        $scope.sitiosWeb = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.content = "si";
        $scope.requiredatalisttestinputff = true;
        $scope.fondoPrograma = {};

        // toggle selection for a given employee by name
        $scope.toggleSelection = function toggleSelection(tematicaId) {

            var idx = $scope.seleccion.indexOf(tematicaId);
            // is currently selected
            if (idx > -1) {
                $scope.seleccion.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.seleccion.push(tematicaId);

            }
            $scope.seleccion;
        };

        $scope.addLiga = function () {

            if ($scope.fondoPrograma) { //se hace esta comparación para comprobar que no es undefined
                debugger;
                var liga = $scope.fondoPrograma.descripcionLiga;
                if (liga != "" && liga != undefined) {
                    //Si la primer url que se quiere agregar el objeto es undefined, pero además
                    //también se debe de comparar con vacio, por que se puede dar el caso que ya agrego una liga
                    //y la segunda o N es la que quiere agregar como vacia, y para ese caso liga es igual a vacio no undefined.
                    var idx = $scope.sitiosWeb.indexOf(liga);
                    if (idx > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada al fondo, indique otra");
                    }
                    // is newly selected
                    else {
                        $scope.sitiosWeb.push(liga);
                        $scope.fondoPrograma.descripcionLiga = '';
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            }
            else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }

            /*Nota: No limpio el cuadro de texto porque como es un dato requerido, 
             si lo regreso a vacio, me marca que debo de poner algo en el input*/
            //$scope.fondoPrograma.descripcionLiga = "";
        };

        $scope.deleteTask = function (index) {
            $scope.sitiosWeb.splice(index, 1);

        }

        //Agrega un nuevo Input
        $scope.addNewChoice = function () {
            var newItemNo = $scope.sitiosWeb.length + 1;
            $scope.sitiosWeb.push({ 'id': 'choice' + newItemNo });
        };
        //Mostrar un nuevo Input
        $scope.showAddChoice = function (choice) {
            return choice.id === $scope.sitiosWeb[$scope.sitiosWeb.length - 1].id;
        };

        //obtener lista de fuentes de financiamiento
        FondosProgramaCRService.getFuentesFinanciamientoEstado().then(
            function (result) {
                $scope.fuentesFinanciamiento = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

        //ObtenerTematicas Para checks
        FondosProgramaCRService.getAreasTematicasChecks().then(
            function (result) {
                $scope.areasTematicas = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Tem&aacute;ticas ");
            });

        ////ObtenerTematicas
        //FondosProgramaCRService.getAreasTematicasCombo().then(
        //    function (result) {
        //        $scope.Tematicas = result.data;
        //        $scope.loading = false;
        //    },
        //    function (err) {
        //        toastr.error("No se han podido cargar los registros de Tem&aacute;ticas ");
        //    });

        //Buscar Empresa
        $scope.EmpresaSeleccionada = {};
        $scope.verempresa = false;
        $scope.openEmpresa = function () {
            $scope.institucion = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EmpresasFilterGet.html',
                controller: 'EmpresasFilterGetCtrl',
                resolve: {
                    institucion: function () {
                        $scope.verempresa = false;
                        return $scope.institucion;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                $scope.empresa = selectedItem.nombreEmpresa;
                $scope.fondoPrograma.empresaId = selectedItem.empresaId;
                $scope.EmpresaSeleccionada = selectedItem;
                $scope.form.$setDirty();
            });
        }



        $scope.AddFondoPrograma = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //var autor=$scope.authentication.nombreCompleto;

                var fondoPrograma = {
                    "clave": 0,
                    "nombreFP": $scope.fondoPrograma.nombreFP,
                    "descripcion": $scope.fondoPrograma.descripcion,
                    "fechaRegistro": new Date(),
                    "autor": AuthService.authentication.nombreCompleto,
                    "estado": 1,
                    "fechaEfectiva": new Date(),
                    "empresaId": $scope.fondoPrograma.empresaId,
                    "empresa": $scope.fondoPrograma.empresa,
                    "contacto": $scope.fondoPrograma.contacto,
                    "sitioWebFondoProgramaId": null,
                    "fuenteFinanciamientoId": $scope.fondoPrograma.fuenteFinanciamientoId,
                    "fuenteFinanciamiento": $scope.fondoPrograma.fuenteFinanciamiento,
                    "seleccion": $scope.seleccion,
                    "sitiosWeb": $scope.sitiosWeb
                };
                $scope.seleccion;
                $scope.sitiosWeb;

                fondoPrograma.seleccion = $scope.seleccion;
                fondoPrograma.sitiosWeb = $scope.sitiosWeb;

                FondosProgramaCRService.create(fondoPrograma).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("fondosProgramaGet");
                    },
                    function (err) {
                        console.error(err);
                    });

            }
        }


    }
})();