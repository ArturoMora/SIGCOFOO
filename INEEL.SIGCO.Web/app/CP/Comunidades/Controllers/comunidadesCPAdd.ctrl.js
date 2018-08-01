(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ComunidadesCPAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "ComunidadesCPService",
        "CategoriaCPService",
        "comunService",
        'globalGet',
        'FileUploader',
        'uploadFileACH',
        "$uibModal",
        ComunidadesCPAddCtrl
        ]);

    function ComunidadesCPAddCtrl(AuthService, $scope, $state, $filter, ComunidadesCPService, CategoriaCPService, comunService, globalGet, FileUploader, uploadFileACH, $uibModal) {

        window.scrollTo(0, 0)

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        
        var API = globalGet.get("api");

        $scope.authentication = AuthService.authentication;

        // desdel el 75 a 50 años de la fecha actual
        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);

        $scope.imagen = {};
                       
        CategoriaCPService.getAllCategoriasActivas().then(
           function (result) {
               $scope.categorias = result.data;
           },
           function (err) {
               toastr.error("No se han podido cargar los registros");
               console.log(err);
           });

        // LOGICA ADJUNTOS
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) {
                return false;
            }

            $scope.files = [];
            $scope.files.push(adjunto.files[0]);

           
            var propiedades = {
                file: adjunto.files[0],
                ext: "png;jpg;jpeg;img", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }

            uploadFileACH.upload(propiedades,
            function (err, result) {
             
                if (!err) {
                   
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
            
            $scope.$apply(function () {
                if (result.error === false) {
                   
                    $scope.comunidad.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
           
        }


        //Logica comunidad
      
        $scope.openLider = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                  
                $scope.nombreLider = selectedItem.nombreCompleto;
                $scope.claveLider = selectedItem.clavePersona;
                $scope.claveRolLider = 3;
                               
            });
        }

        $scope.openSecretario = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {

                $scope.nombreSecretario = selectedItem.nombreCompleto;
                $scope.claveSecretario = selectedItem.clavePersona;
                $scope.claveRolSecretario = 4;

            });
        }


        //Función para guardar comunidades
        $scope.save = function () {

            if ($scope.form.$invalid) {
                return false;
            } else {

                var registro = {
                    "dato": $scope.comunidad.descripcion.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "ComunidadCP"
                };
                             
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {

                        var valorTipoAcceso = false;

                        if ($scope.comunidad.tipoAcceso == 1)
                            valorTipoAcceso = true;

                        var comunidad = {
                            "descripcion": $scope.comunidad.descripcion.replace(/\n/g, ""),
                            "mision": $scope.comunidad.mision,
                            "fechaAlta": $scope.comunidad.fechaAlta,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "estado": 1,
                            "idCategoria": $scope.comunidad.idCategoria,
                            "tipoAcceso": valorTipoAcceso,
                            
                            "nombreSecretario" : $scope.nombreSecretario,
                            "claveSecretario" : $scope.claveSecretario,
                            "claveRolSecretario":  4,
                         
                            "nombreLider" : $scope.nombreLider,
                            "claveLider" : $scope.claveLider,
                            "claveRolLider" : 3,

                        };
                        
                        $scope.comunidad.estado = 1;
                        $scope.comunidad.tipoAcceso = valorTipoAcceso;
                        $scope.comunidad.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'));
                        $scope.comunidad.nombreSecretario = $scope.nombreSecretario;
                        $scope.comunidad.claveSecretario = $scope.claveSecretario;
                        $scope.comunidad.claveRolSecretario = 4;

                        $scope.comunidad.nombreLider = $scope.nombreLider;
                        $scope.comunidad.claveLider = $scope.claveLider;
                        $scope.comunidad.claveRolLider = 3;

                        
                        ComunidadesCPService.create($scope.comunidad).then(
                            function (result) {
                                //toastr.success(result.data);
                                toastr.success("Registro creado correctamente");
                                //$state.go("comunidadesGet");
                                if (result.data != null) {
                                    $state.go("homeComunidad", { id: result.data.comunidadId });
                                } else $state.go("comunidadesGet");
                                
                        },
                        function (err) {
                            toastr.error("Error al intentar crear el registro");
                            console.error(err);
                        });


                    }
                });
            }
        } //TERMINO DE LA FUNCIÓN DE GUARDADO DE COMUNIDAD DE PRÁCTICA

        $scope.regresar = function () {
            $state.go("comunidadesGet");
        }
    }
})();