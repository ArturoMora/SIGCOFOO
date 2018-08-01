(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvocatoriaEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            'globalGet',
            "ConvocatoriasCRService",
            'uploadFileACH',
            "$uibModal",
            ConvocatoriaEditCtrl
        ]);

    function ConvocatoriaEditCtrl(AuthService, $scope, $state, $stateParams, globalGet,
        ConvocatoriasCRService, uploadFileACH, $uibModal) {
        $scope.authentication = AuthService.authentication;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.content = "si";
        $scope.exist = []; //Leti
        $scope.sitiosWeb = [];
        $scope.sitiosWebNuevos = [];
        $scope.sitiosWebAntDel = [];
        $scope.contactos = [];
        $scope.contactosNuevos = [];
        $scope.contactosAntDel = [];
        $scope.nomcontactos = [];
        $scope.ListaGeneralContacto = [];
        $scope.nomcontactosNuevos = [];
        $scope.nomcontactosAntDel = [];
        $scope.adjuntos = [];
        $scope.adjuntosNuevosRuta = [];
        $scope.adjuntosNuevosNombre = [];
        $scope.adjuntosAntDel = [];
        $scope.adjuntosIdAntDel = [];
        $scope.tasklist = [];
        $scope.convocatoria_id = $stateParams.id;
        $scope.convocatorias = {};
        $scope.fechaInicio = "";
        $scope.fechaTermino = "";
        $scope.fuenteFinanciamiento = "";
        $scope.dtInstance = {};

        //Atributos para validaciones
        $scope.sitiosWebA = [];
        $scope.contactosA = [];
        $scope.adjuntosA = [];

        ConvocatoriasCRService.getlistapaises().then(
            function (result) {
                $scope.listapaises = result.data;

            },
            function (err) {
                toastr.error("No se ha podido cargar los registros de tipos de convocatoria");
            }
        );



        $scope.addLiga = function () {
            if ($scope.convocatorias) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.convocatorias.descripcionLiga;
                if (liga != "" && liga != undefined) {
                    //Si la primer url que se quiere agregar el objeto es undefined, pero además
                    //también se debe de comparar con vacio, por que se puede dar el caso que ya agrego una liga
                    //y la segunda o N es la que quiere agregar como vacia, y para ese caso liga es igual a vacio no undefined.

                    var idx = $scope.sitiosWebA.indexOf(liga);
                    var idx2 = $scope.sitiosWebNuevos.indexOf(liga);
                    if (idx > -1 || idx2 > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada a la convocatoria, indique otra");
                        $scope.convocatorias.descripcionLiga = "";
                    }
                    else {
                        $scope.sitiosWebNuevos.push(liga);
                        $scope.convocatorias.descripcionLiga = "";
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            }
            else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }
        }


        $scope.validarFechasInicio = function () {
            
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.convocatorias.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convocatorias.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.convocatorias.fechaInicio = $scope.convocatorias.fechaInicioAnt;
                //$scope.convenios.fechaTermino = $scope.convenios.fechaTerminoAnt;
                toastr.error("Fecha de inicio deber ser menor a fecha de término y la fecha actual.");
                return false;
            }

        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.convenios.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convenios.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.convenios.fechaTermino = $scope.convenios.fechaTerminoAnt;
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }
        }

        ///Actualiza Fuente
        $scope.actualizaFuente = function () {
            
            $scope.fuenteFinanciamiento = $scope.convocatorias.fondoPrograma.fuenteFinanciamiento.nombreFF;
        }

        
        $scope.deleteTaskAnt = function (index, id) {
            $scope.sitiosWeb.splice(index, 1);
            $scope.sitiosWebAntDel.push(id);
            $scope.sitiosWebA.splice(index, 1);
        }
        
        $scope.deleteTaskNew = function (index) {
            $scope.sitiosWebNuevos.splice(index, 1);

        }

        
        $scope.deleteContactoNew = function (index) {
            $scope.contactosNuevos.splice(index, 1);
            $scope.nomcontactosNuevos.splice(index, 1);
            $scope.reloadTabla();
        }

        $scope.reloadTabla = function () {
            $scope.dtInstance.rerender();
        }

        $scope.deleteContactoAnt = function (index, id) {
            
            $scope.contactos.splice(index, 1);
            //$scope.nomcontactos.splice(index, 1);
            $scope.contactosAntDel.push(id);
            //$scope.nomcontactosAntDel.push(id);
            $scope.contactosA.splice(index, 1);
            $scope.reloadTabla();
        }

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.convocatorias.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convocatorias.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.convocatorias.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convocatorias.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de t&eacute;rmino debe ser mayor a fecha de inicio.");
                return false;
            }
        }

        $scope.deleteAdjuntoAnt = function (index, id, adjuntoId) {
            
            $scope.adjuntos.splice(index, 1);
            $scope.adjuntosAntDel.push(id);
            $scope.adjuntosIdAntDel.push(adjuntoId);
            $scope.adjuntosA.splice(index, 1);
        }

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
            //
            modalInstance.result.then(function (selectedItem) {
                var idx3 = $scope.contactosA.indexOf(selectedItem.contactoId);
                var idx4 = $scope.contactosNuevos.indexOf(selectedItem.contactoId);
                if (idx3 > -1 || idx4 > -1) {
                    toastr.error("El contacto seleccionado ya ha sido ingresa anteriormente indique otro");
                }
                // is newly selected
                else {
                    
                    $scope.contactosNuevos.push(selectedItem.contactoId);
                    //$scope.nomcontactos2.push(selectedItem.nombreCompleto);
                    $scope.nomcontactosNuevos.push(selectedItem.nombreCompleto);
                    $scope.ContactoSeleccionada = selectedItem;
                    $scope.form.$setDirty();
                    
                }


            });
        }

        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            var repetido = false;





            if ($scope.adjuntosA.indexOf(adjunto.files[0].name) > -1 ||
                $scope.adjuntosNuevosNombre.indexOf(adjunto.files[0].name) > -1) {
                repetido = true;
            }



            for (var i = 0; i < $scope.adjuntosA.length; i++) {
                var ref = $scope.adjuntosA[i];
                if (ref === adjunto.files[0].name) {
                    repetido = true;
                    break;
                }
            }

            for (var i = 0; i < $scope.adjuntosNuevosNombre.length; i++) {
                var ref = $scope.adjuntosNuevosNombre[i];
                if (ref === adjunto.files[0].name) {
                    repetido = true;
                    break;
                }
            }


            

            if (repetido) {
                $("#filesGral").filestyle('clear');
                toastr.error("El adjunto ya existe");
                return false;
            } else {
                var propiedades = {
                    file: adjunto.files[0],
                    ext: "*", /* pdf;doc;docx;ppt */
                    type: Date.now(),// '*', /* */
                    size: '8', /* cantidad entera en MB*/
                    api: API + "FileUploadMT/UploadFiles/"
                }
                //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
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
                            toastr.error(error);
                        }
                    });
            }

        };

        $scope.deleteTaskAdjunto = function (index) {
            $scope.tasklist.splice(index, 1);
            $scope.adjuntosNuevosNombre.splice(index, 1);
            $scope.adjuntosNuevosRuta.splice(index, 1);
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
                    $scope.adjuntosNuevosRuta.push(result.fullPathFile.replace(/\"/g, ""));
                    $scope.adjuntosNuevosNombre.push(result.nameFile.replace(/\"/g, ""));
                    $("#filesGral").filestyle('clear');
                    $scope.form.$setDirty();    

                }
            });
        }

        $scope.cargarinfoconvocatoria = function () {
            ConvocatoriasCRService.getConvocatoriaFKById($scope.convocatoria_id).then(
                function (result) {
                    $scope.convocatorias = result.data;
                    $scope.sitiosWeb = $scope.convocatorias.sitioWebPorConvocatoria;
                    $scope.contactos = $scope.convocatorias.contactoPorConvocatoria;
                    $scope.nomcontactos = $scope.convocatorias.contactoPorConvocatoria;
                    $scope.adjuntos = $scope.convocatorias.adjuntoPorConvocatoria;
                    $scope.fuenteFinanciamiento = $scope.convocatorias.fondoPrograma.fuenteFinanciamiento.nombreFF;

                    $scope.tipoconvocatoriaselected = $scope.convocatorias.tipoFuenteFinanciamiento;
                    $scope.paisesinvolucrados = [];
                    for (var index = 0; index < $scope.convocatorias.paises.length; index++) {
                        var element = $scope.convocatorias.paises[index];
                        $scope.paisesinvolucrados.push(element.pais);

                    }


                    $scope.convocatorias.fechaInicio = new Date.parse($scope.convocatorias.fechaInicio);
                    $scope.convocatorias.fechaInicioAnt = new Date.parse(result.data.fechaInicio);
                    if ($scope.convocatorias.fechaTermino != null) {
                        $scope.convocatorias.fechaTermino = new Date.parse($scope.convocatorias.fechaTermino);
                        $scope.convocatorias.fechaTerminoAnt = new Date.parse(result.data.fechaTermino);
                    }

                    //Para Validacion de ligas de acceso
                    angular.forEach($scope.sitiosWeb, function (value, key) {
                        $scope.sitiosWebA.push(value.url);
                    });

                    //Para Validacion de contactos
                    angular.forEach($scope.contactos, function (value, key) {
                        $scope.contactosA.push(value.contactoId);
                    });

                    angular.forEach($scope.adjuntos, function (value, key) {
                        $scope.adjuntosA.push(value.adjunto.nombre);
                    });

                },
                function (err) {
                    console.error(err);
                });
        }

        $scope.cargarinfoconvocatoria();

        $scope.saveConvocatoria = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                $scope.convocatorias.sitiosWebNuevos = $scope.sitiosWebNuevos;
                $scope.convocatorias.sitiosWebAntDel = $scope.sitiosWebAntDel;
                $scope.convocatorias.contactosNuevos = $scope.contactosNuevos;
                $scope.convocatorias.contactosAntDel = $scope.contactosAntDel;
                $scope.convocatorias.nomcontactosNuevos = $scope.nomcontactosNuevos;
                $scope.convocatorias.nomcontactosAntDel = $scope.nomcontactosAntDel;


                
                $scope.convocatorias.fechaInicio = $scope.convocatorias.fechaInicio;


                //$scope.convocatorias.fechaInicio = new Date($scope.convocatorias.fechaInicio);
                $scope.convocatorias.fechaTermino = $scope.convocatorias.fechaTermino;


                $scope.convocatorias.adjuntos = $scope.adjuntos;
                $scope.convocatorias.adjuntosAntDel = $scope.adjuntosAntDel;
                $scope.convocatorias.adjuntosIdAntDel = $scope.adjuntosIdAntDel;
                $scope.convocatorias.adjuntosNuevosRuta = $scope.adjuntosNuevosRuta;
                $scope.convocatorias.adjuntosNuevosNombre = $scope.adjuntosNuevosNombre;
                $scope.tasklist;
                $scope.convocatorias.tipoFuenteFinanciamientoId = $scope.tipoconvocatoriaselected.tipoFuenteFinanciamientoId;
                $scope.convocatorias.paises = $scope.tipoconvocatoriaselected.nombre === 'Internacional' ? $scope.paisesinvolucrados : [];

                $scope.desactivar = true;
                ConvocatoriasCRService.update($scope.convocatorias).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("convocatoriasGet");
                    },
                    function (err) {
                        toastr.error(err);
                        console.error(err);
                        $scope.desactivar = false;
                    });
            }
        };

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
    }
})();