
(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("softwarePersonalAdd", ['$scope', '$rootScope', 'AuthService', 'softwarePersonalService',
            'globalGet', '$http', '$uibModal', 'uploadFileACH', 'DTOptionsBuilder', softwarePersonalAdd]);
    function softwarePersonalAdd($scope, $rootScope, AuthService, softwarePersonalService,
        globalGet, $http, $uibModal, uploadFileACH, DTOptionsBuilder) {
        //Variable API
        var API = globalGet.get("api");
        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var d = new Date();
        var clavePersona = AuthService.authentication.userprofile.clavePersona;
        // var unidadID = AuthService.authentication.userprofile.claveUnidad;
        $scope.anioActual = d.getUTCFullYear();
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.adjunto = "";
        $scope.SoftwarePersonal = { "autores": [], "estado": true };
        $scope.elementosSelectProyecto = [];
        $scope.proyecto = {};      
        $scope.proyecto.selected = undefined;
        $scope.unidadesO = [];
        $scope.unidadesOA = [];


        $scope.verificaManualUsuario = false;
        $scope.verificaManualTecnico = false;

        $scope.addFirstAutor = function () {
            ////alert($scope.SoftwarePersonal.softwarePersonalId);
            if ($scope.SoftwarePersonal.softwarePersonalId > 0) {
                $scope.proyecto.selected = { "proyectoId": $scope.SoftwarePersonal.proyectoId, "nombre": "" }
            } else {
                var element = {
                    "claveAutor": $scope.authentication.userprofile.clavePersona,
                    "nombreCompleto": $scope.authentication.userprofile.nombreCompleto,
                    "estado": true
                }
                $scope.SoftwarePersonal.autores.push(element);
            }
        }

        $scope.addFirstAutor(); //TODO:
        
        

        $scope.save = function () {
            try {

                var anio = parseInt($scope.SoftwarePersonal.anioVersion);
                if (anio < 1975 || anio > $scope.anioActual) {
                    toastr.error("El año de la versión debe estar comprendido ente 1975 y " + $scope.anioActual);
                    return false;
                }

            } catch (e) { toastr.error("Año inválido"); return; }

            if(!$scope.verificaManualUsuario && !$scope.verificaManualTecnico){
                toastr.error("Complete los campos requeridos");
                return false;
            }

            if($scope.SoftwarePersonal.proyectoId==null){
                toastr.error("Seleccione un proyecto");
                return false;
            }

            if($scope.derechosAutor!=null){
                $scope.SoftwarePersonal.derechosAutorId = $scope.derechosAutor.derechosAutorId;
            }

            $scope.SoftwarePersonal.clavePersona = clavePersona;
            $scope.SoftwarePersonal.estadoFlujoId = 1;
            // $scope.SoftwarePersonal.GerenciaClave = unidadID;
            softwarePersonalService.create($scope.SoftwarePersonal).then(
                function (result) {
                    toastr.success(result.data);
                    $rootScope.globalRegresar();
                    //alert("guarda y ");
                },
                function (error) {
                    toastr.error("error al guardar el registro");
                    console.log(error);
                }
            );
        }

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
                // console.log(selectedItem);
                $scope.SoftwarePersonal.proyectoNombre = selectedItem.nombre;
                $scope.SoftwarePersonal.proyectoId = selectedItem.proyectoId;
                $scope.SoftwarePersonal.GerenciaClave = selectedItem.claveUnidad;   ///<==== posible solucion
                $scope.form.$setDirty();
                
            });
            $scope.desabilitar = false;
        }


        $scope.clean = function () {
            $scope.SoftwarePersonal.proyectoNombre = null;
            $scope.SoftwarePersonal.proyectoId = null;
        }

        $scope.listaTipoSoftware = [];
        softwarePersonalService.TipoSoftwareGetAllOrder().then(
            function (result) {
                //$scope.listaTipoSoftware = result.data;
                $scope.listaTipoSoftware = [];
                var cont2 = 0;
                for (var cont = 0; cont < result.data.length; cont++) {
                    if (result.data[cont].estado == 1) {
                        $scope.listaTipoSoftware[cont2] = result.data[cont];
                        cont2++;
                    }
                }
            },
            function (err) {
                $scope.listaTipoSoftware = [];
                console.error(err);
            });

        $scope.onSelectedProyecto = function (item) {
            $scope.SoftwarePersonal.proyectoId = item.proyectoId;
            ////alert($scope.SoftwarePersonal.proyectoId);
        }
        $scope.refreshelementosSelectProyecto = function (search) {
            //////alert("refreshelementosSelect");
            if (search != undefined && search.length > 1) {
                //var params = { vocabulario: search, sensor: false };

                var getDatos = endPointProyectos + search
                return $http.get(
                    getDatos
                ).then(function (response) {
                    // console.log(response);
                    $scope.elementosSelectProyecto = response.data;
                    if ($scope.elementosSelectProyecto == null || $scope.elementosSelectProyecto.length == 0) {
                        $scope.elementosSelectProyecto = [];
                        $scope.elementosSelectProyecto.push({ "proyectoId": "Sin resultados con este criterio", "nombre": "" });
                    }
                },
                    function () {
                        console.log('ERROR!!!');
                    }
                );
            } else {
                $scope.elementosSelectProyecto = [];
            }
        };

        $scope.selectTipo = [];
        softwarePersonalService.getTipoAcceso().then(
            function (result) {
                $scope.selectTipo = result.data;//aqui
                // console.log($scope.selectTipo);
            },
            function (err) {
                console.error(err);
            });

        $scope.openUser = function () {

            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;
                if (!selectedItem) {
                } else {
                    $scope.add_userAutor();
                    $scope.form.$setDirty();
                }
            });
        }
        $scope.add_userAutor = function () {
            $scope.addExt = false;
            for (var i = 0; i < $scope.SoftwarePersonal.autores.length; i++) {
                if ($scope.SoftwarePersonal.autores[i].claveAutor == $scope.PersonaSeleccionada.clavePersona) {
                    toastr.error("El autor " + $scope.PersonaSeleccionada.clavePersona + " - " + $scope.PersonaSeleccionada.nombreCompleto, " ya existe en la lista de autores!");
                    return;
                }
            }
            var element = {
                "claveAutor": $scope.PersonaSeleccionada.clavePersona,
                "nombreCompleto": $scope.PersonaSeleccionada.nombreCompleto,
                "Estado": true
            }
            $scope.SoftwarePersonal.autores.push(element);
        }
        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (registro, $uibModalInstance) {
            var idx = ($scope.SoftwarePersonal.autores.indexOf(registro));
            $scope.SoftwarePersonal.autores.splice(idx, 1);
            $uibModalInstance.dismiss('close');
        };
        ////////////////////////////////////////// adjuntos:
        $scope.getFileDetails = function (adjunto, extensiones) {
            $scope.adjunto = adjunto.id;

            $scope.files = [];
            $scope.files.push(adjunto.files[0]);


            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: extensiones,
                type: Date.now(),
                size: '20', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
                        // console.log("result:");
                        // console.log(result);
                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                            borrar();
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                        borrar();
                    }

                });
        };
        // CONFIRMATION.        
        function transferComplete(result) {
            $scope.$apply(function () {
                //$scope.itf.archivos = result.fullPathFile;
                //$scope.fileNameNew = result.nameFile;
                if (!result.error) {
                    if ($scope.adjunto == "manualTecnico") {
                        //alert("manualTecnico2");
                        if (existeArchivo(result.nameFile)) {
                            toastr.error("no se permite subir el mismo nombre de archivo"); borrar();
                        } else {
                            $scope.SoftwarePersonal.adjuntoManualTecnico = { "rutaCompleta": result.fullPathFile, "nombre": result.nameFile, "moduloId": "MT" }

                            $scope.verificaManualTecnico = true;
                            $scope.form.$setDirty();
                        }
                    }
                    if ($scope.adjunto == "manualUsuario") {
                        if (existeArchivo(result.nameFile)) {
                            toastr.error("no se permite subir el mismo nombre de archivo"); borrar();
                        } else {
                            $scope.SoftwarePersonal.adjuntoManualUsuario = { "rutaCompleta": result.fullPathFile, "nombre": result.nameFile, "moduloId": "MT" }
                            $scope.verificaManualUsuario = true;
                            $scope.form.$setDirty();

                        }
                    }
                    if ($scope.adjunto == "codigoFuente") {
                        if (existeArchivo(result.nameFile)) {
                            toastr.error("no se permite subir el mismo nombre de archivo"); borrar();
                        } else {
                            $scope.SoftwarePersonal.adjuntoCodigoFuente = { "rutaCompleta": result.fullPathFile, "nombre": result.nameFile, "moduloId": "MT" }
                            $scope.form.$setDirty();
                        }

                    }
                } else { // si hay error

                    borrar();
                }
            });
        }
        function existeArchivo(nameFile) {
            var mtec = "";
            var musu = "";
            var mcod = "";
            try { mtec = $scope.SoftwarePersonal.adjuntoManualTecnico.nombre; } catch (ex) { }
            try { musu = $scope.SoftwarePersonal.adjuntoManualUsuario.nombre; } catch (ex) { }
            try { mcod = $scope.SoftwarePersonal.adjuntoCodigoFuente.nombre; } catch (ex) { }
            if (nameFile == mtec || nameFile == musu || nameFile == mcod) {
                return true;
            }
            return false;
        }
        function borrar() {
            //alert("por borrar");
            if ($scope.adjunto == "manualTecnico") {
                $("#manualTecnico").filestyle('clear');
                $scope.SoftwarePersonal.adjuntoManualTecnico = {};

                $scope.verificaManualTecnico = false;
            }
            if ($scope.adjunto == "manualUsuario") {
                $("#manualUsuario").filestyle('clear');
                $scope.SoftwarePersonal.adjuntoManualUsuario = {};
                $scope.verificaManualUsuario = false;
            }
            if ($scope.adjunto == "codigoFuente") {
                $("#codigoFuente").filestyle('clear');
                $scope.SoftwarePersonal.adjuntoCodigoFuente = {};

            }
        }
    }

})();