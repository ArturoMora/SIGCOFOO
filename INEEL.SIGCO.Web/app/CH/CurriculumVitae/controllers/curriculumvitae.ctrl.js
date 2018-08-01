(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("curriculumvitaeCtrl", [
            "AuthService",
            "$scope",
            "CurriculumVitaeCHService",
            "MenuService",
            "DTOptionsBuilder",
            curriculumvitaeCtrl]);

    function curriculumvitaeCtrl(AuthService, $scope, CurriculumVitaeCHService, MenuService, DTOptionsBuilder) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.informacion = {};
        $scope.count = "0";
        //obtener clave de usuario
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;
        //Saber con que rol inicio session
        $scope.idRol = MenuService.getRolId();
        if ($scope.idRol != 1 && $scope.idRol != 4  && $scope.idRol != 5 && $scope.idRol != 16) {
            $scope.datosUsuarioAux = AuthService.authentication.userprofile;
        } else {
            $scope.datosUsuarioAux = {
                'clavePersona': '',
                'fechaIngreso': '',
                'categoria': { 'descripcion': '' },
                'nombreCompleto': '',
                'unidadOrganizacional': { 'nombreUnidad': '' },
                'antiguedad':''
            };
        }
        $scope.cargado = false;
        
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('responsive', true);

        if ($scope.idRol == 4) {
            CurriculumVitaeCHService.GetAllUsersGerente($scope.authentication.userprofile.claveUnidad).then(
            function (result) {
                $scope.personas = result.data;
                $scope.cargado = true;
            },function(err){
                console.log(err);
            });}

        if ($scope.idRol == 5) {
            CurriculumVitaeCHService.GetAllUsersDivicion($scope.userLogin).then(
            function (result) {
                $scope.personas = result.data;
                $scope.cargado = true;
            },function(){
                console.log(err);
            });}

        if ($scope.idRol != 4 && $scope.idRol != 5) {
            CurriculumVitaeCHService.GetAllUsersEjecutivo().then(
            function (result) {
                $scope.personas = result.data;
                $scope.cargado = true;
            },function(err){
                console.log(err);
            });}

        $scope.generar = function (registro) {

            if ($scope.idRol != 1 && $scope.idRol != 4  && $scope.idRol != 5 && $scope.idRol != 16) {  //Registros de usuarios que NO son MANDOS MEDIOS
                CurriculumVitaeCHService.GetAllInformacion($scope.userLogin).then(
                       function (result) {
                           $scope.informacion = result.data;
                           $scope.cargado = true;
                           $scope.generado = true;                          
                       });
            } else {
                $scope.aux = registro;
                CurriculumVitaeCHService.GetAllInformacion(registro.clavePersona).then(
                     function (result) {
                         $scope.informacion = result.data;
                         $scope.datosUsuarioAux.clavePersona = registro.clavePersona;
                         $scope.datosUsuarioAux.fechaIngreso = registro.fechaIngreso;
                         $scope.datosUsuarioAux.categoria.descripcion = registro.categoria.descripcion;
                         $scope.datosUsuarioAux.nombreCompleto = registro.nombreCompleto;
                         $scope.datosUsuarioAux.unidadOrganizacional.nombreUnidad = registro.unidadOrganizacional.nombreUnidad;
                         $scope.datosUsuarioAux.antiguedad = registro.antiguedad
                         $scope.selected = registro.nombreCompleto;
                         $scope.cargado = true;
                         $scope.generado = true; 
                         //$scope.generado = true;
                         
                         if ($scope.count == "0") {
                             $scope.count = "1";
                             $scope.generar($scope.aux);
                         } else {
                             $scope.count = "0";
                             $scope.download();
                             $scope.aux = {};
                         }
                     },
                    function (err) {
                    }
                );
            }
        };

        $scope.download = function () {
            var doc = new jsPDF('p', 'pt');
            //
            //var imageHeader =logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 50, 20, 150, 77);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Currículum Vitae', 250, 60);


            var res = doc.autoTableHtmlToJson(document.getElementById("informacionPersonal"));
            doc.autoTable(res.columns, res.data, {
                theme: 'plain',
                startY: 90,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                columnStyles: {
                    0: { columnWidth: 160 },
                    1: { columnWidth: 200 },
                    2: { columnWidth: 150 }
                }
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("informacionPersonal2"));
            doc.autoTable(res.columns, res.data, {
                theme: 'plain',
                startY: doc.autoTableEndPosY() + 5,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                columnStyles: {
                    0: { columnWidth: 160 },
                    1: { columnWidth: 200 },
                    2: { columnWidth: 150 }
                }
            });


            var res = doc.autoTableHtmlToJson(document.getElementById("formacionAcademica"));
            doc.setFontSize(12);
            doc.text('Formación académica', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { columnWidth: 80 }
                }
            });


            var res = doc.autoTableHtmlToJson(document.getElementById("idiomas"));
            doc.setFontSize(12);
            doc.text('Idiomas', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                columnStyles: {
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' },
                    4: { halign: 'center' },
                    5: { halign: 'center' },
                }
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("asociacion"));
            doc.setFontSize(12);
            doc.text('Asociación', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("sni"));
            doc.setFontSize(12);
            doc.text('SNI', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("distincion"));
            doc.setFontSize(12);
            doc.text('Distinción', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("tesisDirigida"));
            doc.setFontSize(12);
            doc.text('Tesis dirigidas', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("becarioInterno"));
            doc.setFontSize(12);
            doc.text('Becario interno', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("becarioExterno"));
            doc.setFontSize(12);
            doc.text('Becario externo', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("becarioDirigido"));
            doc.setFontSize(12);
            doc.text('Becario dirigido', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("experienciaDocente"));
            doc.setFontSize(12);
            doc.text('Experiencia docente', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("experienciaExterna"));
            doc.setFontSize(12);
            doc.text('Experiencia externa', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("participacion"));
            doc.setFontSize(12);
            doc.text('Participación en proyectos', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("ponencia"));
            doc.setFontSize(12);
            doc.text('Ponencias', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("articulo"));
            doc.setFontSize(12);
            doc.text('Artículos', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("cursos"));
            doc.setFontSize(12);
            doc.text('Cursos', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("da"));
            doc.setFontSize(12);
            doc.text('Derechos de autor', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("pi"));
            doc.setFontSize(12);
            doc.text('Propiedad industrial', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                theme: 'grid',
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });

            if ($scope.idRol != 1 && $scope.idRol != 4  && $scope.idRol != 5 && $scope.idRol != 16) {
                doc.save("CurriculumVitae-" + $scope.authentication.userprofile.nombreCompleto + ".pdf");
            } else {
                doc.save("CurriculumVitae-" + $scope.selected + ".pdf");
                $scope.generado = false;
            }
        };
    }
})();