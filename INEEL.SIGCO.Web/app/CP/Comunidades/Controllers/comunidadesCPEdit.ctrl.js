(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ComunidadesCPEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "$stateParams",
        'globalGet',
        'FileUploader',
        'uploadFileACH',
        "$uibModal",
        "ComunidadesCPService",
        "CategoriaCPService",
        "MiembrosCPService",
        ComunidadesCPEditCtrl
        ]);

    function ComunidadesCPEditCtrl(AuthService, $scope, $state, $filter, $stateParams, globalGet, FileUploader, uploadFileACH, $uibModal, ComunidadesCPService, CategoriaCPService, MiembrosCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.comunidad_id = $stateParams.id;
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 0);
        $scope.seleccionado = "0";

        window.scrollTo(0, 0)

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        var API = globalGet.get("api");

        $scope.nombreLider = "";
        $scope.claveLider = "";
        $scope.claveRolLider = 3;

        $scope.nombreSecretario = "";
        $scope.claveSecretario =  "";
        $scope.claveRolSecretario = 4;

        $scope.tiposAccesos = [
             { valor: "Público", descripcion: "Público" },
             { valor: "Restringido", descripcion: "Restringido" }
        ];

        CategoriaCPService.getAllCategoriasActivas().then(
           function (result) {
               $scope.categorias = result.data;

           },
           function (err) {
               toastr.error("No se han podido cargar los registros");
         });

         ComunidadesCPService.getById($scope.comunidad_id).then(
            function (result) {
                $scope.comunidad = result.data;
                $scope.comunidad.fechaAlta = new Date($scope.comunidad.fechaAlta);

                if ($scope.comunidad.tipoAcceso == true) {
                    $scope.seleccionado = "Público";
                } else {
                    $scope.seleccionado = "Restringido";
                }
               
                MiembrosCPService.getByComunidadLider($scope.comunidad_id).then(
                   function (result) {
                       $scope.liderComunidad = result.data;
                       if (result.data != null) {
                           $scope.nombreLider = $scope.liderComunidad.nombrePersona;
                           $scope.claveLider = $scope.liderComunidad.idPersonas;
                       }
                   },
                   function (err) {
                       toastr.error("No se han podido cargar los registros");
                });

                MiembrosCPService.getByComunidadSecretario($scope.comunidad_id).then(
                   function (result) {
                       $scope.secretarioComunidad = result.data;
                       if (result.data != null) {
                           $scope.nombreSecretario = $scope.secretarioComunidad.nombrePersona;
                           $scope.claveSecretario = $scope.secretarioComunidad.idPersonas;
                       }
                   },
                   function (err) {
                       toastr.error("No se han podido cargar los registros");
                });

                $scope.ngFile = true;
            },
            function (err) {                          
              console.error(err);
         });


      

         ///////////////////////////////////////////////////////////////
         //#region info gral, GET THE FILE INFORMATION.
         $scope.getFileDetails = function (adjunto) {

            

             if (adjunto.files.length <= 0) { return false; }
             $scope.files = [];
             $scope.files.push(adjunto.files[0]);
             // $scope.uploadFiles();
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
                         $("#filesGral").filestyle('clear');
                     }
                 } else {
                     $("#filesGral").filestyle('clear');
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
                     $scope.form.$setDirty();
                     $scope.comunidad.adjunto = {
                         "rutaCompleta": result.fullPathFile,
                         "nombre": result.nameFile,
                         moduloId: "CP"
                     }
                     $scope.ngFile = false;
                 }
             });
         }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////

        ////////////////////////////////////PERSONAL

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
                 $scope.form.$setDirty();

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
                 $scope.form.$setDirty();

             });
         }

        
         $scope.save = function () {

             if ($scope.form.$invalid) {
                 toastr.error("Complete los datos requeridos");
                 return false;
             } else {


                 var registro = {
                     "dato": $scope.comunidad.descripcion.replace(/ /g, "").replace(/\n/g, ""),
                     "origen": "ComunidadCP",
                     "excepcion": $scope.excepcion
                 };

                

                 var evalua = $scope.comunidad.tipoAcceso;

                 if (evalua == "Restringido") {
                     $scope.comunidad.tipoAcceso = false;
                     $scope.seleccionado = "Restringido";
                 } else {
                     $scope.comunidad.tipoAcceso = true;
                     $scope.seleccionado = "Público";
                 }

                 ComunidadesCPService.update($scope.comunidad)
                                 .then(
                                     function (result) {
                                         toastr.success("Registro actualizado exitosamente!");
                                     },
                                     function (err) {
                                         console.error(err);
                  });
                                              
                                 
                 if ($scope.liderComunidad == null) {

                     if ($scope.nombreLider != "") {
                         var lider = {
                             "fechaAlta": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                             "fechaAceptacion": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                             "aceptacion": true,
                             "nombrePersona": $scope.nombreLider,
                             "idPersonas": $scope.claveLider,
                             "rolId": 3,
                             "idCP": $scope.comunidad_id,
                         };


                         MiembrosCPService.create(lider)
                            .then(
                                function (result) { },
                                function (err) { }
                         );
                     }

                 } else {

                     $scope.liderComunidad.nombrePersona = $scope.nombreLider;
                     $scope.liderComunidad.idPersonas = $scope.claveLider;

                     MiembrosCPService.update($scope.liderComunidad)
                         .then(
                             function (result) { },
                             function (err) { }
                          );
                 }


                  if ($scope.secretarioComunidad == null || $scope.secretarioComunidad == undefined) {

                      if ($scope.nombreSecretario != "") {
                          var secretario = {
                              "fechaAlta": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                              "fechaAceptacion": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                              "aceptacion": true,
                              "nombrePersona": $scope.nombreSecretario,
                              "idPersonas": $scope.claveSecretario,
                              "rolId": 4,
                              "idCP": $scope.comunidad_id,
                          };

                          MiembrosCPService.create(secretario)
                          .then(
                              function (result) { },
                              function (err) { }
                           );
                      }

                  } else {

                      $scope.secretarioComunidad.nombrePersona = $scope.nombreSecretario;
                      $scope.secretarioComunidad.idPersonas = $scope.claveSecretario;

                      MiembrosCPService.update($scope.secretarioComunidad)
                          .then(
                              function (result) { },
                              function (err) { }
                           );
                  }

                     //    }
                     //});

                  $scope.form.$setPristine();

             }
         };


         $scope.regresar = function () {
             $scope.globalRegresar();
         }
    }
})();