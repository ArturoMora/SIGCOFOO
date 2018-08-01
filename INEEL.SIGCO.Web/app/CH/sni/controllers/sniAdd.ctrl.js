(function () {
    "use strict";

    angular
        .module("ineelCH")
        
        .controller("sniAddCtrl"
            , ['$rootScope','AuthService'
            , '$scope'
            , 'SNIService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , sniAddCtrl]);
    function sniAddCtrl($rootScope,AuthService, $scope, SNIService, globalGet, uploadFileACH, $state, $filter) {
        //Variable API
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

        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombreEmpleado: '' };
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
        $scope.registro.nombrePersona = $scope.nombreEmpleado;

        $scope.registrosni = {};
        $scope.registrosni.claveEmpleado = AuthService.authentication.userprofile.clavePersona;

        SNIService.getnivelSNI().then(
            function (resultadoNivelesSNI) {
                $scope.nivelesSNI = resultadoNivelesSNI.data;
            }
            );
        SNIService.getareaSNI().then(
            function (resultadoAreasSNI) {
                $scope.areasSNI = resultadoAreasSNI.data;
            }
            );


        $scope.regresar=function(){
            $state.go("fichapersonal.sni", { seccion: 'sni' });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
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
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registrosni.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.sniForm.$setDirty();
                }
            });
            
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro de SNI
        $scope.sniadd = function () {
            if ($scope.sniForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registrosni.fechaInicioNombramiento > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registrosni.fechaInicioNombramiento >= $scope.registrosni.fechaTerminoNombramiento) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                if ($scope.registrosni.fechaIngreso > $scope.registrosni.fechaInicioNombramiento) {
                    toastr.error("La fecha de ingreso debe ser menor a la de inicio");
                    return false;
                }
                /////////////////
                    $scope.desabilitar = true;
                    var registro={
                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                        "FechaInicioNombramiento": $scope.registrosni.fechaInicioNombramiento,
                        "FechaTerminoNombramiento": $scope.registrosni.fechaTerminoNombramiento,
                        "NivelSNIId": $scope.registrosni.nivelSNIId
                    }
                    SNIService.ValidaRegistroDuplicado(registro).then(
                        function(res){
                            if(res.data){
                                toastr.warning("Intente cambiar el nivel de SNI o las fechas de inicio o término");
                                toastr.warning("Ya existe el registro!");
                                return false;
                            }
                            $scope.registrosni.estadoFlujoId = "1";
                            $scope.registrosni.clavePersona = $scope.clavePersona;
                            SNIService.addSNI($scope.registrosni).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("fichapersonal.sni", { seccion: 'sni' });
                                },
                                function (err) {
                                    $scope.desabilitar = false;
                                    console.error(err);
                                });
                        },function(err){
                            console.log(err);
                        }
                    );
                    
                
            }
        }

        $scope.clean = function () {
            $scope.registrosni.fechaIngreso = null;
        }
    }
})();