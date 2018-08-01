(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvocatoriaAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            'globalGet',
            "ConvocatoriasCRService",
            'uploadFileACH',
            "$uibModal",
            "DTOptionsBuilder",
            ConvocatoriaAddCtrl
        ]);

    function ConvocatoriaAddCtrl(AuthService, $scope, $state, $filter, globalGet,
        ConvocatoriasCRService, uploadFileACH, $uibModal, DTOptionsBuilder) {
        var API = globalGet.get("api");
        $scope.myDate = new Date();
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.sitiosWeb = [];
        $scope.contactos = [];
        $scope.nomcontactos = [];
        $scope.tasklist = [];
        $scope.files = [];



        $scope.addLiga = function () {
            if ($scope.convocatoria) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.convocatoria.descripcionLiga;
                if (liga != "" && liga != undefined) {
                    //Si la primer url que se quiere agregar el objeto es undefined, pero además
                    //también se debe de comparar con vacio, por que se puede dar el caso que ya agrego una liga
                    //y la segunda o N es la que quiere agregar como vacia, y para ese caso liga es igual a vacio no undefined.

                    var idx = $scope.sitiosWeb.indexOf(liga);
                    if (idx > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada a la convocatoria, indique otra");
                    }
                    // is newly selected
                    else {
                        $scope.sitiosWeb.push(liga);
                        $scope.convocatoria.descripcionLiga = "";
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            } else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }

            /*Nota: No limpio la caja de texto porque como es un dato requerido, 
            si lo regreso a vacio, me marca que debo de 
            poner algo en el input*/
            //$scope.convocatoria.descripcionLiga = "";
        };



        $scope.deleteTask = function (index) {
            $scope.sitiosWeb.splice(index, 1);

        }

        $scope.deleteContacto = function (index) {
            $scope.contactos.splice(index, 1);
            $scope.nomcontactos.splice(index, 1);

        }

        $scope.validarFechasInicio = function () {

            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.convocatoria.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convocatoria.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.convocatoria.fechaInicio = "";
                toastr.error("Fecha de inicio deber ser menor a fecha de término");
                return false;
            }

        }

        $scope.validarFechas = function () {
            
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.convocatoria.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convocatoria.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.convocatoria.fechaTermino = "";
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }
        }

        //--------------------------------------------------- logica de adjunto
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            var repetido = false;
            for (var c = 0; c < $scope.files.length; c++) {
                if ($scope.files[c].name == adjunto.files[0].name) {
                    repetido = true;
                    break;
                }
            }

            if (repetido) {
                $("#filesGral").filestyle('clear');
                toastr.error("El adjunto ya existe");
                return false;
            } else {
                $scope.files.push(adjunto.files[0]);
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
                                transferComplete(result);
                            } else {
                                toastr.error(result.message);
                            }
                        } else {
                            var error = err.message || "Error al adjuntar";
                            toastr.error(error);
                        }
                    });
            }


        };

        $scope.deleteTaskAdjunto = function (index, object) {
            for (var i = 0; i < $scope.files.length; i++) {
                if ($scope.files[i].name == object.nameFile) {
                    $scope.files.splice(i, 1);
                    break;
                }
            }
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);
        }

        // CONFIRMATION.        
        function transferComplete(result) {
            
            $scope.$apply(function () {
                if (!result.error) {

                    $scope.tasklist.push(
                        {
                            "nameFile": result.nameFile,
                            "fullpath": result.fullPathFile
                        });
                    $("#filesGral").filestyle('clear');
                    $scope.form.$setDirty();
                }
            });
        }


        //obtener lista de fondosPrograma estado activo
        ConvocatoriasCRService.fondosProgramaAllByEstado().then(
            function (result) {
                $scope.fondosPrograma = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros de los Fondos o programas");
            }
        );

        //obtener lista de tipos de convocatorias
        ConvocatoriasCRService.gettiposconvocatoria().then(
            function (result) {
                $scope.tiposconvocatoria = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros de tipos de convocatoria");
            }
        );


        ConvocatoriasCRService.getlistapaises().then(
            function (result) {
                $scope.listapaises = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar los registros de tipos de convocatoria");
            }
        );

        $scope.filtro = function ($query) {

            var aptitudesfiltradas = $scope.listapaises.filter(function (aptitud) {
                aptitud.descripcion = aptitud.descripcion.replace(/á/gi, "a");
                aptitud.descripcion = aptitud.descripcion.replace(/é/gi, "e");
                aptitud.descripcion = aptitud.descripcion.replace(/í/gi, "i");
                aptitud.descripcion = aptitud.descripcion.replace(/ó/gi, "o");
                aptitud.descripcion = aptitud.descripcion.replace(/ú/gi, "u");
                aptitud.descripcion = aptitud.descripcion.replace(/ñ/gi, "n");
                return aptitud.descripcion.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
            return aptitudesfiltradas.length === 0 ? $scope.listapaises : aptitudesfiltradas;
        };



        //Buscar Contacto
        $scope.ContactoSeleccionada = {};
        $scope.vercontacto = false;
        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
               
                scope: $scope,
            });
            //debugger;
            modalInstance.result.then(function (selectedItem) {
                var idx2 = $scope.contactos.indexOf(selectedItem.contactoId);
                if (idx2 > -1) {
                    toastr.error("El contacto seleccionado ya ha sido ingresado anteriormente, favor de seleccionar otro");
                }
                // is newly selected
                else {
                    // $scope.contacto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    //$scope.convocatoria.contactoId = selectedItem.contactoId;
                    $scope.contactos.push(selectedItem.contactoId);
                    $scope.nomcontactos.push(selectedItem.nombreCompleto);
                    $scope.ContactoSeleccionada = selectedItem;
                    $scope.form.$setDirty();
                }

            });
        }

        $scope.AddConvocatoria = function () {
            if ($scope.form.$invalid) {
                toastr.warning("Complete los datos requeridos");
                return false;
            } else {
                var convocatoria = {
                    "clave": 0,
                    "nombreConvocatoria": $scope.convocatoria.nombreConvocatoria,
                    "descripcion": $scope.convocatoria.descripcion,
                    "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "fechaInicio": ($filter('date')(new Date($scope.convocatoria.fechaInicio), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "fechaTermino": ($filter('date')(new Date($scope.convocatoria.fechaTermino), 'yyyy-MM-dd HH:mm:ss')).toString(),
                    "autor": AuthService.authentication.nombreCompleto,
                    "estado": 1,
                    "fondoProgramaId": $scope.convocatoria.fondoProgramaId,
                    "fondoPrograma": $scope.convocatoria.fondoPrograma,
                    "sitiosWeb": $scope.sitiosWeb,
                    "contactos": $scope.contactos,
                    "TipoFuenteFinanciamientoId": $scope.convocatoriaselected.tipoFuenteFinanciamientoId,
                    "Paises": $scope.paisesinvolucrados,
                    "Observaciones": $scope.convocatoria.observaciones

                };

                convocatoria.contactos = $scope.contactos;
                convocatoria.sitiosWeb = $scope.sitiosWeb;
                convocatoria.adjuntoPorConvocatoria = [];
                // convocatoria.sitiosWeb = $scope.sitiosWeb;

                angular.forEach($scope.tasklist, function (value, key) {
                    convocatoria.adjuntoPorConvocatoria.push({
                        fechaRegistro: ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                        autor: AuthService.authentication.nombreCompleto,
                        estado: true,
                        adjunto:
                        {
                            "rutaCompleta": value.fullpath.replace(/\"/g, ""),
                            "nombre": value.nameFile.replace(/\"/g, ""),
                            moduloId: "CR"
                        }
                    });
                });




                $scope.desactivar = true;
                ConvocatoriasCRService.create(convocatoria).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("convocatoriasGet");
                    },
                    function (err) {
                        toastr.error(err.data.message);
                        console.error(err.data);
                        $scope.desactivar = false;
                    });
            }
        }
    }
})();