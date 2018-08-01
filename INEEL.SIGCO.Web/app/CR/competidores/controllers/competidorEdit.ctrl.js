(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("CompetidorEditCtrl", [
            "$scope",
            "$stateParams",
            'globalGet',
            "CompetidoresCRService",
            'uploadFileACH',
            "AuthService",
            "$uibModal",
            "MenuService",
            "DTOptionsBuilder",
            CompetidorEditCtrl
        ]);

    function CompetidorEditCtrl($scope, $stateParams, globalGet,CompetidoresCRService, uploadFileACH, AuthService,$uibModal,MenuService, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        var API = globalGet.get("api");
        $scope.globalGet;
        // MenuService.deleteVariable("competidor");
        $scope.competidor_id = $stateParams.id;
        $scope.competidor = {};  //scope principal
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');

        var val = null; //al parecer utilizan esta variable para guardar datos, aparece al recuperar valores de un modal
        $scope.adjuntos = {};
        
        //recuperamos la info del competidor
        $scope.getinfocompetidor = function () {

            CompetidoresCRService.getCompetidor($scope.competidor_id).then(
                function (result) {

                    $scope.competidor = result.data;
                    $scope.competidor.uoselecionada = $scope.competidor.unidadOrganizacional;
                    $scope.adjuntos = $scope.competidor.adjuntoPorCompetidor;
                    $scope.competidor.tasklist = []; //comparacion de tadifas o precios
                    $scope.competidor.tasklistVTC = [];  //archivos VTC de competidores

                    //Carga los adjuntos de  tarifa y vtc
                    if ($scope.adjuntos.length>0) {
                        angular.forEach($scope.adjuntos, function (value, key) {
                            if (value.tarifa == true) {
                                var adjuntoTarifa={
                                    "adjunto": {
                                        "nombre": value.adjunto.nombre,
                                        "rutaCompleta": value.adjunto.rutaCompleta,
                                        "ModuloId":"CR"
                                    },
                                    "tipo": "tarifa",
                                    "CompetidorId":value.competidorId,
                                    "Autor": value.autor
                                }
                                $scope.competidor.tasklist.push(adjuntoTarifa);
                            }
                            if (value.vtc == true) {
                                var adjuntoVTC={
                                    "adjunto": {
                                        "nombre": value.adjunto.nombre,
                                        "rutaCompleta": value.adjunto.rutaCompleta,
                                        "ModuloId":"CR"
                                    },
                                    "tipo": "vtc",
                                    "CompetidorId":value.competidorId,
                                    "Autor": value.autor
                                }
                                $scope.competidor.tasklistVTC.push(adjuntoVTC);
                            }
                        });
                    }
                   
                },
                function (err) {
                    console.error(err);
                });
        }


       //Se recuperan los datos ingresados por el usuario en el formulario (en caso de que cree un nuevo producto o servicio)
       $scope.competidor = MenuService.getVariable("competidor");
        if ($scope.competidor === null) {
            $scope.competidor = {};
            $scope.getinfocompetidor();
        } 
        MenuService.deleteVariable("competidor");
        
        //obtener lista de LineaDesarrolloTecnologico
        CompetidoresCRService.lineaDesarrolloTecnologico().then(
            function (result) {
                $scope.lineasDesarrolloTecnologico = result.data;
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

        //obtener lista de segmentos de mercado
        CompetidoresCRService.segmentoMercado().then(
            function (result) {
                $scope.segmentosMercado = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );


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
                    
                    $scope.servicioRegistrado = 0;

                    if ($scope.competidor.servicioPorCompetidor.length > 0) {
                        for (var i = 0; i < $scope.competidor.servicioPorCompetidor.length; i++) {
                            if ($scope.competidor.servicioPorCompetidor[i].servicioId == selectedItem.servicioId) {
                                $scope.servicioRegistrado = 1;
                                break;
                            }
                        }
                    }
                                      
                    if ($scope.servicioRegistrado == 0) {

                        var registro = {
                            "fechaRegistro": new Date(),
                            "estado": 1,
                            "autor": $scope.competidor.autor,
                            "servicioId": selectedItem.servicioId,
                            "competidorId": $scope.competidor.competidorId
                        };

                        CompetidoresCRService.registraServicio(registro)
                          .then(
                                function (result) {

                                    var servicio = {
                                        "fechaRegistro": new Date(),
                                        "estado": 1,
                                        "autor": $scope.competidor.autor,
                                        "servicioId": selectedItem.servicioId,
                                        "nomServ": selectedItem.nomServ,
                                        "descServ": selectedItem.nomServ
                                    }

                                    result.data.servicio = servicio;
                                    toastr.success("Registro actualizado correctamente!");
                                    $scope.competidor.servicioPorCompetidor.push(result.data);


                                },
                                function (err) {
                                    console.error(err);
                                }
                          );
                        //   $scope.competidorForm.$setDirty();

                    } else {
                        toastr.error("El producto seleccionado ya se encuentra registrado");
                    }
                });
            }
            else {
                toastr.error("Selecciona un competidor para poder seleccionar servicios");
            }
        
        }
        //ELIMINAR SERVICIO
        $scope.deleteServicio = function (obj) {
            var index = $scope.competidor.servicioPorCompetidor.indexOf(obj);

          
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        CompetidoresCRService.eliminaServicio(obj.servicioPorCompetidorId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.competidor.servicioPorCompetidor.splice(index, 1);
                            },
                            function (err) {
                                console.error(err);
                            });
                        // $scope.competidorForm.$setDirty();
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

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
                    $scope.productoRegistrado = 0;
                    //Verificamos la existencia del producto
                    if ($scope.competidor.productoPorCompetidor.length > 0) {
                        for (var i = 0; i < $scope.competidor.productoPorCompetidor.length; i++) {
                            if ($scope.competidor.productoPorCompetidor.productoId == selectedItem.productoId) {
                                $scope.productoRegistrado = 1;
                                break;
                            }
                        }
                    }

                    if ($scope.productoRegistrado == 0) {

                        var registro = {
                            "fechaRegistro": new Date(),
                            "estado": 1,
                            "autor": $scope.competidor.autor,
                            "productoId": selectedItem.productoId,
                            "competidorId": $scope.competidor.competidorId
                        };

                        CompetidoresCRService.registraProducto(registro)
                          .then(
                                function (result) {
                                  
                                    var prod = {
                                        "fechaRegistro": new Date(),
                                        "estado": 1,
                                        "autor": $scope.competidor.autor,
                                        "productoId": selectedItem.servicioId,
                                        "nomProd": selectedItem.nomProd,
                                        "descProd": selectedItem.nomProd
                                    }

                                    result.data.producto = prod;
                                    toastr.success("Registro actualizado correctamente!");
                                    $scope.competidor.productoPorCompetidor.push(result.data);                             
                                },
                                function (err) {
                                    console.error(err);
                                }
                          );
                        //   $scope.competidorForm.$setDirty();

                    } else {
                        toastr.error("El producto seleccionado ya se encuentra registrado");
                    }

                });

            }
            else {
                toastr.error("Selecciona un competidor para poder seleccionar productos");
            }
        }

        //ELIMINAR PRODUCTO
        $scope.deleteProducto = function (obj) {
            var index = $scope.competidor.productoPorCompetidor.indexOf(obj);


            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        CompetidoresCRService.eliminaProducto(obj.productoPorCompetidorId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.competidor.productoPorCompetidor.splice(index, 1);
                            },
                            function (err) {
                                console.error(err);
                            });
                        // $scope.competidorForm.$setDirty();
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

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

        // Confirmacion de archivo de comparacion (tarifa)
        function transferComplete(result) {
            $scope.$apply(function () {
                $scope.siguienteIG = false;
                //if (result.error) return; //error al subir archivo
                if (!result.error) {

                    //Se agrega el nuevo adjunto a la lista
                    $scope.competidor.tasklist=[];
                    $scope.competidor.tasklist.push(
                        {
                            "adjunto": {
                                "nombre": result.nameFile,
                                "rutaCompleta": result.fullPathFile,
                                "ModuloId":"CR"
                            },   
                            "tipo": "tarifa",
                            "Autor": $scope.authentication.nombreCompleto
                        });
                    $scope.competidorForm.$setDirty();
                }
            });
        }
        
        //-----------Adjuntos VTC-----------------
        $scope.getFileDetailsVTC = function (adjunto) {
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: Date.now(), /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
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

        // Confirmacion de archivo vtc   
        function transferCompleteVTC(result) {

            $scope.$apply(function () {
                $scope.siguienteIG = false;
                
                if (!result.error) {

                    //Se agrega el nuevo adjunto a la lista
                    $scope.competidor.tasklistVTC=[];
                    $scope.competidor.tasklistVTC.push(
                        {
                            "adjunto": {
                                "nombre": result.nameFile,
                                "rutaCompleta": result.fullPathFile,
                                "ModuloId":"CR"
                            },   
                            "tipo": "vtc",
                            "Autor": $scope.authentication.nombreCompleto
                        });
                    $scope.competidorForm.$setDirty();

                }
            });
        }

        //Elimina el archivo de vigilancia tecnologica (VTC)
        $scope.deleteArchivoVTC = function (index) {
            // $scope.competidor.tasklistVTC.splice(index, 1);
            $scope.competidor.tasklistVTC=[];
            $scope.competidorForm.$setDirty();
        }


        //Elimina el archivo de comparacion de tarifas
        $scope.deleteArchivoComparacion = function (index) {
            // $scope.competidor.tasklist.splice(index, 1);
            $scope.competidor.tasklist=[];
            $scope.competidorForm.$setDirty();
        }
             
        
        $scope.actualizarcompetidor = function () {
            if ($scope.competidor.tasklist.length > 0) {
                if ($scope.competidor.uoselecionada) {
                } else {
                    toastr.error("Seleccione la unidad organizacional que realiz&oacute; la comparaci&oacute;n tarifas o precios");
                    return false;
                }
            }


            if ($scope.competidorForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.desactivar = true;
                if ($scope.competidor.uoselecionada) {
                    $scope.competidor.claveUnidad = $scope.competidor.uoselecionada.claveUnidad;
                }
                //Se agregan los adjuntos a la lista general
                $scope.competidor.adjuntoPorCompetidor=[];
                if($scope.competidor.tasklist.length>0){
                    for(var c=0; c<$scope.competidor.tasklist.length; c++){
                        $scope.competidor.adjuntoPorCompetidor.push($scope.competidor.tasklist[c]);
                    }
                }

                if($scope.competidor.tasklistVTC.length>0){
                    for(var d=0; d<$scope.competidor.tasklistVTC.length;d++){
                        $scope.competidor.adjuntoPorCompetidor.push($scope.competidor.tasklistVTC[d]);
                    }
                }
                
                //Se actualiza el registro del competidor
                CompetidoresCRService.update($scope.competidor)
                    .then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.competidorForm.$setPristine();
                    },
                    function (err) {
                        toastr.error("Error al actualizar el registro");
                        console.error(err);
                    });
            }
        };
    }
})();