(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("CompetidorAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "globalGet",
            "CompetidoresCRService",
            'uploadFileACH',
            "$uibModal",
            "DTOptionsBuilder",
            "MenuService",
            CompetidorAddCtrl
        ]);

    function CompetidorAddCtrl(AuthService, $scope, $state, globalGet, CompetidoresCRService, uploadFileACH, $uibModal, DTOptionsBuilder, MenuService) {


        var API = globalGet.get("api");
        //$scope.globalGet;
        ////////////////////

        $scope.competidor = {};
        $scope.competidor = MenuService.getVariable("competidor");
        if ($scope.competidor === null) {
            $scope.competidor = {};
        }
        MenuService.deleteVariable("competidor");

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        var val = null;

        $scope.tasklist = [];
        $scope.tasklistVTC = [];
        $scope.adjuntosParam = [];
        $scope.paramCompetidor = [];

        $scope.listaServicios = [];

        $scope.listaProductos = [];



        //obtener lista de LineaDesarrolloTecnologico
        CompetidoresCRService.lineaDesarrolloTecnologico().then(
            function (result) {
                $scope.lineasDesarrolloTecnologico = result.data;
                $scope.recuperaDatos();
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

        //obtener lista de TamanoEmpresa
        CompetidoresCRService.tamanoEmpresa().then(
            function (result) {
                $scope.tamanosEmpresa = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

        //obtener lista de LineaDesarrolloTecnologico
        CompetidoresCRService.segmentoMercado().then(
            function (result) {
                $scope.segmentosMercado = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

        $scope.openEmpresa = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EmpresasGetGral.html',
                controller: 'EmpresasGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.competidor.nombreEmpresa = selectedItem.nombreEmpresa;
                $scope.competidor.empresaId = selectedItem.empresaId;
                $scope.competidorAddForm.$setDirty();
            });

        }

        //Buscar Servicio
        $scope.openServicio = function () {
            if ($scope.competidor.empresaId != null && $scope.competidor.empresaId != 0) {
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/ServiciosCompetidoresFilterGet.html',
                    controller: 'ServiciosCompetidoresFilterGetCtrl',
                    scope: $scope,
                });
                modalInstance.result.then(function (selectedItem) {
                    var repetido = false;
                    for (var c = 0; c < $scope.listaServicios.length; c++) {
                        if ($scope.listaServicios[c].servicioId == selectedItem.servicioId) {
                            repetido = true;
                            break;
                        }
                    }
                    if (repetido) {
                        toastr.error("Ya existe un registro con ese servicio, seleccione otro por favor");
                    }
                    else {
                        $scope.agregaServiciosCompetidor(selectedItem);
                    }

                });
            } else {
                toastr.error("Selecciona un competidor para poder seleccionar servicios");
            }
        }


        $scope.agregaServiciosCompetidor = function (objetoServicio) {
            $scope.listaServicios.push(objetoServicio);
            $scope.competidorAddForm.$setDirty();
        }


        //Buscar Producto
        $scope.openProducto = function () {

            if ($scope.competidor.empresaId != null && $scope.competidor.empresaId != 0) {
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/ProductosCompetidoresFilterGet.html',
                    controller: 'ProductosCompetidoresFilterGetCtrl',
                    scope: $scope,
                });
                modalInstance.result.then(function (selectedItem) {
                    var repetido = false;
                    for (var c = 0; c < $scope.listaProductos.length; c++) {
                        if ($scope.listaProductos[c].productoId == selectedItem.productoId) {
                            repetido = true;
                            break;
                        }
                    }

                    if (repetido) {
                        toastr.error("Ya existe un registro con ese producto, seleccione otro por favor");
                    }
                    else {
                        $scope.agregaProductosCompetidor(selectedItem);

                    }

                });

            }
            else {
                toastr.error("Selecciona un competidor para poder seleccionar productos");
            }
        }

        $scope.agregaProductosCompetidor = function (objetoProducto) {
            $scope.listaProductos.push(objetoProducto);
            $scope.competidorAddForm.$setDirty();
        }

        $scope.recuperaAdjuntos = function () {

            for (var c = 0; c < $scope.competidor.adjuntosParam.length; c++) {
                if ($scope.competidor.adjuntosParam[c].tipo == "tarifa") {

                    $scope.tasklist.push(
                        {
                            "nameFile": $scope.competidor.adjuntosParam[c].adjuntosNuevosNombre,
                            "fullpath": $scope.competidor.adjuntosParam[c].adjuntosNuevosRuta
                        });
                    $scope.adjuntosParam.push(
                        {
                            "adjuntosNuevosNombre": $scope.competidor.adjuntosParam[c].adjuntosNuevosNombre,
                            "adjuntosNuevosRuta": $scope.competidor.adjuntosParam[c].adjuntosNuevosRuta,
                            "tipo": "tarifa"
                        });

                }

                if ($scope.competidor.adjuntosParam[c].tipo == "vtc") {

                    $scope.tasklistVTC.push(
                        {
                            "nameFile": $scope.competidor.adjuntosParam[c].adjuntosNuevosNombre,
                            "fullpath": $scope.competidor.adjuntosParam[c].adjuntosNuevosRuta
                        });
                    $scope.adjuntosParam.push(
                        {
                            "adjuntosNuevosNombre": $scope.competidor.adjuntosParam[c].adjuntosNuevosNombre,
                            "adjuntosNuevosRuta": $scope.competidor.adjuntosParam[c].adjuntosNuevosRuta,
                            "tipo": "vtc"
                        });

                }
            }

        };

        //Se recuperan los datos que tenia el formulario antes de saltar a la navegacion a otro formulario
        $scope.recuperaDatos = function () {
            //Lista de adjuntos 
            if ($scope.competidor.adjuntosParam != null) {
                $scope.recuperaAdjuntos();
            }

            //Se recupera la unidad organizacional
            if ($scope.competidor.uoselecionada != null) {
                $scope.uoselecionada = $scope.competidor.uoselecionada;
            }

            /******Se verifica si existian productos antes de crear el nuevo producto */
            $scope.listaProductos = MenuService.getVariable("productos");
            if ($scope.listaProductos == null) {
                $scope.listaProductos = [];
            }
            MenuService.deleteVariable("productos");

            //Se recupera el producto creado del otro form
            if ($scope.competidor.producto != null) {
                $scope.agregaProductosCompetidor($scope.competidor.producto);
                $scope.competidor.producto = null;
            }

            /******Se verifica si existian servicios antes de crear el nuevo producto */
            $scope.listaServicios = MenuService.getVariable("servicios");
            if ($scope.listaServicios == null) {
                $scope.listaServicios = [];
            }
            //Se recupera el servicio creado previamente
            MenuService.deleteVariable("servicios");
            if ($scope.competidor.servicio != null) {
                $scope.agregaServiciosCompetidor($scope.competidor.servicio);
                $scope.competidor.servicio = null;
            }

        }

        //-----------Adjuntos Tarifa-----------------
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: Date.now(), /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
            uploadFileACH.upload(propiedades,
                function (err, result) {

                    if (!err) {
                        if (!result.error) {
                            transferComplete(result);
                            $("#filesGral").filestyle('clear');
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                });
        };

        $scope.deleteTarifa = function (index) {
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);

        }

        // CONFIRMATION TARIFA.        
        function transferComplete(result) {
            $scope.$apply(function () {

                $scope.siguienteIG = false;
                //if (result.error) return; //error al subir archivo
                if (!result.error) {
                    $scope.tasklist = [];

                    angular.forEach($scope.adjuntosParam, function (value, key) {
                        if (value.tipo == "tarifa") {

                            $scope.adjuntosParam.splice(key, 1);

                        }
                    });

                    $scope.tasklist.push(
                        {
                            "nameFile": result.nameFile,
                            "fullpath": result.fullPathFile
                        });
                    $scope.adjuntosParam.push(
                        {
                            "adjuntosNuevosNombre": result.nameFile.replace(/\"/g, ""),
                            "adjuntosNuevosRuta": result.fullPathFile.replace(/\"/g, ""),
                            "tipo": "tarifa"
                        });
                    $scope.competidorAddForm.$setDirty();
                        
                }
            });
        }

        //-----------Adjuntos VTC-----------------
        $scope.getFileDetailsVTC = function (adjunto) {
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: Date.now(), /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
                        console.log("result:");
                        console.log(result);
                        if (!result.error) {
                            transferCompleteVTC(result);
                            $("#vtc").filestyle('clear');
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                });
        };

        // CONFIRMATION.        
        function transferCompleteVTC(result) {
            console.log(result);
            $scope.$apply(function () {

                $scope.siguienteIG = false;
                //if (result.error) return; //error al subir archivo
                if (!result.error) {
                    $scope.tasklistVTC = [];

                    angular.forEach($scope.adjuntosParam, function (value, key) {
                        if (value.tipo == "vtc") {

                            $scope.adjuntosParam.splice(key, 1);

                        }
                    });

                    $scope.tasklistVTC.push(
                        {
                            "nameFile": result.nameFile,
                            "fullpath": result.fullPathFile
                        });
                    $scope.adjuntosParam.push(
                        {
                            "adjuntosNuevosNombre": result.nameFile.replace(/\"/g, ""),
                            "adjuntosNuevosRuta": result.fullPathFile.replace(/\"/g, ""),
                            "tipo": "vtc"
                        });
                }
            });
        }


        $scope.deleteVTC = function (index) {
            $scope.tasklistVTC.splice(index, 1);
            angular.element("input[type='file']").val(null);

        }

        $scope.deleteProducto = function (index) {
            $scope.listaProductos.splice(index, 1);
        }

        $scope.deleteServicio = function (index) {
            $scope.listaServicios.splice(index, 1);
        }

        //Guardamos el competidor
        $scope.AddCompetidor = function () {

            if ($scope.tasklist.length > 0) {
                if ($scope.uoselecionada) {
                } else {
                    toastr.error("Seleccione la unidad organizacional que realiz&oacute; la comparaci&oacute;n tarifas o precios");
                    return false;
                }
            }

            if ($scope.competidorAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                $scope.competidor.fechaRegistro = new Date();
                $scope.competidor.estado = 1;
                $scope.competidor.autor = AuthService.authentication.nombreCompleto;

                if ($scope.uoselecionada) {
                    $scope.competidor.claveUnidad = $scope.uoselecionada.claveUnidad;
                }
                if ($scope.adjuntosParam.length > 0) { //Lista de adjuntos a agregar
                    $scope.competidor.adjuntosParam = $scope.adjuntosParam;
                }
                $scope.competidor.productoId = [];  //Es una lista no mapeada en el modelo, en ella se guardan los ids de los nuevos productos a agregar
                for (var c = 0; c < $scope.listaProductos.length; c++) {
                    $scope.competidor.productoId.push($scope.listaProductos[c].productoId);
                }

                $scope.competidor.servicioId = []; //Es una lista no mapeada en el modelo, en ella se guardan los ids de los nuevos servicios a agregar
                for (var c = 0; c < $scope.listaServicios.length; c++) {
                    $scope.competidor.servicioId.push($scope.listaServicios[c].servicioId);
                }


                CompetidoresCRService.create($scope.competidor)
                    .then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("competidorGet");
                        },
                        function (err) {
                            toastr.error(err.data);
                            console.error(err.data);

                        });
            }
        }
    }
})();