(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("capitulosCtrlEdit", ['AuthService', '$scope', '$rootScope', 'CapituloService',
            'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal",
            "DTOptionsBuilder", "MenuService", capitulosCtrlEdit]);

    function capitulosCtrlEdit(AuthService, $scope, $rootScope, CapituloService,
        globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal,
        DTOptionsBuilder, MenuService) {

        $scope.ubicacion=window.location.pathname;  //para saber si estan en MT o CH
        $scope.rolId = MenuService.getRolId();

        var API = globalGet.get("api");
        var id = $rootScope.getGlobalID();
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var d = new Date();
        $scope.anioActual = d.getUTCFullYear();

        $scope.registro = {};
        $scope.paisanterior = "";
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.editoresEliminados = [];
        $scope.autoresExternosEliminados = [];
        $scope.autoresInternosEliminados = [];
        $scope.urlDescarga = API + "Descarga/GetFile";

        $scope.listaCoAutores = "";
        //Obtener datos de usuario
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.ClavePersona = AuthService.authentication.userprofile.clavePersona;

        //Tipo de personal con sesion activa
        $scope.tipoPersonal = AuthService.authentication.userprofile.tipoPersonalId;
        $scope.ubicacion=window.location.pathname;  //para saber si estan en MT o CH

        //obtener gradoAcademicos
        //obtener el registro a editar
        $scope.pais = "";

        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        //alert($scope.idGF);
        //alert($scope.nomGF);
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
            $scope.registro.nombrePersona = $scope.nomGF;
        }

        CapituloService.getbyid(id).then(
            function (result) {
                $scope.paisanterior = result.data.pais;
                $scope.autorIIE = {};
                $scope.catNum = [{
                    "id": "1",
                    "descripcion": " 1er"
                }, {
                    "id": "2",
                    "descripcion": " 2do"
                }, {
                    "id": "3",
                    "descripcion": " 3er"
                }, {
                    "id": "4",
                    "descripcion": " 4to"
                }, {
                    "id": "5",
                    "descripcion": " 5to"
                }, {
                    "id": "6",
                    "descripcion": " 6to"
                }, {
                    "id": "7",
                    "descripcion": " 7mo"
                }, {
                    "id": "8",
                    "descripcion": " 8vo"
                }, {
                    "id": "9",
                    "descripcion": " 9no"
                }, {
                    "id": "10",
                    "descripcion": "10mo"
                }];
                $scope.registro = result.data;
                $scope.registro.nombrePersona = $scope.nomGF;

                $scope.registro.claveUnidadAut = $scope.authentication.userprofile.claveUnidad;
                //var start = new Date($scope.registro.year);
                //$scope.registro.year = start.getFullYear().toString();

                $scope.registro.year = $filter('date')($scope.registro.year, 'yyyy')
                try {
                    $scope.registro.year = parseInt($scope.registro.year);
                } catch (error) { }
                $scope.pais = parseInt($scope.registro.pais);
                for (var p = 0; p < $scope.registro.autorInternoCapitulo.length; p++) {
                    var auxCat = $scope.catNum.length;
                    var x = 0;
                    do {
                        var aux = "" + $scope.registro.autorInternoCapitulo[p].contribucion + "";
                        if ($scope.catNum[x].id == aux) {
                            $scope.r = $scope.catNum[x].id;
                            $scope.auxColabora.push($scope.catNum[x]);
                            $scope.catNum.splice(x, 1);
                        } else { x++ }

                    } while ($scope.r != aux);
                }

                //$scope.AutoresExt = result.data.autorExternoCapitulo;
                for (var p = 0; p < $scope.registro.autorExternoCapitulo.length; p++) {
                    var auxCat = $scope.catNum.length;
                    var x = 0;
                    do {
                        var aux = "" + $scope.registro.autorExternoCapitulo[p].contribucion + "";
                        if ($scope.catNum[x].id == aux) {
                            $scope.r = $scope.catNum[x].id;
                            $scope.auxColabora.push($scope.catNum[x]);
                            $scope.catNum.splice(x, 1);
                        } else { x++ }

                    } while ($scope.r != aux);
                }

                //$scope.editores = result.data.editoresCapitulo;

                CapituloService.ValidarExistencia($scope.registro.capitulosId).then(function (result) {
                    $scope.validacion = result.data;
                });

                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                }
                else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });

        CapituloService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });


        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.ModificaPais = function () {

            $scope.registro.pais = $scope.pais;
            //$scope.paisanterior = $scope.paises[$scope.pais - 1].nombrePais;
            //$scope.registro.lugarCongreso = $scope.paisanterior;
        }
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
                $scope.autorIIE.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.autorIIE.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.ValidForm.$setDirty();
            });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;ppt;pptx", /* pdf;doc;docx;ppt */
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
                        toastr.error(error);
                    }
                });
        };

        function transferComplete(result) {

            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        "moduloId": "MT"
                    }
                }
            });

        }


        $scope.regresar = function () {
            $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.update = function () {
            if ($scope.registro.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.updateF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.updateF();
            }
        }
        $scope.updateF = function () {

            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if($scope.registro.adjunto==null){
                toastr.error("Complete los datos requeridos");
                return false;
            }
             else {
                var anio = $scope.registro.year;
                var actual = new Date().getFullYear();
                if (parseInt(anio) < 1975 || parseInt(anio) > parseInt(actual)) {
                    toastr.error("El año debe estar comprendido entre 1975 y " + actual);
                    return false;
                }

                for (var i = 0; i < $scope.editoresEliminados.length; i++) {
                    $scope.registro.editoresCapitulo.push($scope.editoresEliminados[i]);
                }


                for (var i = 0; i < $scope.autoresExternosEliminados.length; i++) {
                    $scope.registro.autorExternoCapitulo.push($scope.autoresExternosEliminados[i]);
                }

                for (var i = 0; i < $scope.autoresInternosEliminados.length; i++) {
                    $scope.registro.autorInternoCapitulo.push($scope.autoresInternosEliminados[i]);
                }
                
                $scope.auxDate = $scope.registro.year;
                

                var fech = new Date($scope.registro.year, 1, 1);

                $scope.registro.year = fech;

                if ($scope.editarGestion == 0) {
                    $scope.registro.estadoFlujoId = 1;
                }
                CapituloService.update($scope.registro).then(
                    function (result) {
                        
                        toastr.success("Registro Actualizado");
                        $scope.desactivar = false;
                        $state.reload();
                    },
                    function (err) {
                        $scope.desactivar = false;
                        console.error(err);
                    });
                
            }
        }

        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var anio = $scope.registro.year;
                    var actual = new Date().getFullYear();
                    if (anio < 1975 || anio > actual) {
                        toastr.error("El año debe estar comprendido entre 1975 y " + actual);
                        return false;
                    }
                    var fech = new Date($scope.registro.year, 1, 1);
                    $scope.registro.year = fech;
                    for (var i = 0; i < $scope.editoresEliminados.length; i++) {
                        $scope.registro.editoresCapitulo.push($scope.editoresEliminados[i]);
                    }
                    
                    if($scope.registro.autorInternoCapitulo.length<0){
                        toastr.error("Debe de agregar al menos un autor");
                        return false;
                    }

                    for (var i = 0; i < $scope.registro.autorInternoCapitulo.length; i++) {
                        $scope.listaCoAutores += $scope.registro.autorInternoCapitulo[i].clavePersona + ",";
                    }
                    ////////Hace una verificacion de tipo personal, de esta forma evitamos enviar una solicitud de un gerente a si mismo
                    if ($scope.validacion == 0 && $scope.rolId != 4 && $scope.rolId != 5 && $scope.rolId != 16) {
                        var Registro = {
                            "capitulosId": $scope.registro.capitulosId,
                            "estadoFlujoId": 8
                        };
                        //Cambiar el estado del registro
                        //$scope.update();
                        $scope.desactivar = true;
                        $scope.registro.estadoFlujoId = 8;
                        CapituloService.update($scope.registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 19,
                                    "InformacionId": $scope.registro.capitulosId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 8,
                                    "ClaveUnidadAut": $scope.registro.claveUnidadAut,
                                    "titulo": $scope.registro.tituloLibro
                                }

                                CapituloService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        CapituloService.AddBitacoraSolicitud(Bitacora);

                                        var Mail = {
                                            "Modulo": "Memoria Tecnológica",
                                            "Empleado": $scope.nombreEmpleado,
                                            "Seccion": "Capítulo",
                                            "TipoCorreo": "SolicitudGerente",
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "coautores": $scope.listaCoAutores,
                                            "Descripcion1": 1
                                        };

                                        CapituloService.mailNotificacionConCoautores(Mail);  
                                        // CapituloService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        if((new RegExp('indexCH')).test($scope.ubicacion)){ //Si viene de CH
                                            $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
                                        }else{
                                            $rootScope.globalRegresar();
                                        } 
                                        
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);

                                $rootScope.globalRegresar();
                            });
                    } else {
                        var Registro = {
                            "capitulosId": $scope.registro.capitulosId,
                            "estadoFlujoId": 2
                        };
                        //Cambiar el estado del registro
                        $scope.registro.estadoFlujoId = 2;
                        CapituloService.update($scope.registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 19,
                                    "InformacionId": $scope.registro.capitulosId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 2
                                }
                                CapituloService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }

                                        CapituloService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Memoria Tecnológica",
                                            "Empleado": $scope.nombreEmpleado,
                                            "Seccion": "Capítulo",
                                            "TipoCorreo": 1,
                                            "coautores": $scope.listaCoAutores,
                                            "ClavePersona": $scope.registro.clavePersona,
                                        }

                                        CapituloService.mailNotificacionConCoautores(Mail);  
                                        // CapituloService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        if((new RegExp('indexCH')).test($scope.ubicacion)){ //Si viene de CH
                                            $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
                                        }else{
                                            $rootScope.globalRegresar();
                                        } 
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);

                                $rootScope.globalRegresar();
                            });
                    }
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }

        $scope.deleteFile = function () {
            // $scope.registro.adjunto.nombre = "eliminar";
            $scope.registro.adjuntoId = null;
            // $scope.archivos = 0;
            $scope.registro.adjunto=null;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                var Registro = {
                    "capitulosId": $scope.registro.capitulosId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    "estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona

                }
                for (var i = 0; i < $scope.registro.autorInternoCapitulo.length; i++) {
                    if ($scope.registro.autorInternoCapitulo[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.autorIIE = {};
                        return false;
                    }
                }
                //CapituloService.AddUser(Registro).then(
                             
                $scope.userAdd = false;
                $scope.autorIIE = {};
                
                $scope.PersonaSeleccionada = null;
                $scope.registro.autorInternoCapitulo.push(Registro);

                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == Registro.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }

                //});


            } else {
                toastr.error("Complete los datos requeridos del autor");
            }

        }


        $scope.delete = function (registro) {
            try {
                for (var i = 0; i < $scope.auxColabora.length; i++) {
                    if ($scope.auxColabora[i].id == registro.contribucion) {
                        $scope.catNum.push($scope.auxColabora[i]);
                    }
                }

                registro.nombreCompleto = "eliminar";
                $scope.autoresInternosEliminados.push(registro);
                var idx = ($scope.registro.autorInternoCapitulo.indexOf(registro));
                $scope.registro.autorInternoCapitulo.splice(idx, 1);
                $scope.ValidForm.$setDirty()
            } catch (e) { }


        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }
        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {

            if ($scope.autorExt != undefined && ($scope.autorExt.nombre != null || $scope.autorExt.nombre != undefined) && ($scope.autorExt.institucion != null || $scope.autorExt.institucion != undefined) && $scope.autorExt.contribucion != undefined) {
                $scope.autorExt.capitulosId = $scope.registro.capitulosId;

                for (var i = 0; i < $scope.registro.autorExternoCapitulo.length; i++) {
                    if (($scope.registro.autorExternoCapitulo[i].nombre == $scope.autorExt.nombre) && ($scope.registro.autorExternoCapitulo[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                //CapituloService.AddUserExt($scope.autorExt).then(
                //                    function (result) {
                $scope.addExt = false;
                //$scope.autorExt.autorCapituloExtId = result.data.autorCapituloExtId;
                $scope.registro.autorExternoCapitulo.push($scope.autorExt);
                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }
                $scope.autorExt = {};

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }


        $scope.deleteExt = function (registro) {

            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            registro.nombre = "eliminar";
            $scope.autoresExternosEliminados.push(registro);
            var idx = ($scope.registro.autorExternoCapitulo.indexOf(registro));
            $scope.registro.autorExternoCapitulo.splice(idx, 1);
        };

        $scope.addEditor = function () {

            if ($scope.descripcioneditor) { //se hace esta comparación para comprobar que no es undefined

                var idx = -1
                var editor = $scope.descripcioneditor;
                if (editor != "" && editor != undefined) {
                    if (!($scope.registro.editoresCapitulo == undefined && $scope.registro.editoresCapitulo == null)) {
                        for (var cont = 0; cont < $scope.registro.editoresCapitulo.length; cont++) {
                            if ($scope.registro.editoresCapitulo[cont].editor_Nombre == editor) {
                                idx = 1;
                            }
                        }
                    } else {
                        $scope.registro.editoresCapitulo = [];
                    }
                    //var idx = $scope.editores.indexOf(editor);
                    if (idx > -1) {
                        toastr.error("El editor ya se encuentra asociado, indique otro");
                        $scope.registro.descripcioneditor = ''
                    }
                    else {

                        var Registro = {
                            "capitulosId": $scope.registro.capitulosId,
                            "editor_Nombre": editor
                        }
                        $scope.registro.editoresCapitulo.push(Registro);
                    }
                }
                else {
                    toastr.error("Se requiere un editor");
                }
            } else {
                toastr.error("Se requiere un editor");
            }
            $scope.descripcioneditor = "";
        };


        $scope.add_File = function () {

            var RegistroFiles = {
                "RutaCompleta": $scope.registro.adjunto.rutaCompleta,
                "nombre": $scope.registro.adjunto.nombre,
                "ModuloId": $scope.registro.adjunto.moduloId,
                "CapitulosId": $scope.registro.capitulosId
            }

        }


        $scope.deleteEditor = function (registro) {

            registro.editor_Nombre = "eliminar";
            $scope.editoresEliminados.push(registro);
            var idx = ($scope.registro.editoresCapitulo.indexOf(registro));
            $scope.registro.editoresCapitulo.splice(idx, 1);

        };
        $scope.continueFunction = function () {
            $state.reload();
        }


    }
})();