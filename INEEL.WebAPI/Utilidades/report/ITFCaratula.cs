using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace INEEL.WebAPI.Utilidades.report
{
    public class ITFCaratula
    {
        private string NullToEmpty(String str)
        {
            if (String.IsNullOrEmpty(str))
            {
                return "";
            }
            else return str;
        }
        public HttpResponseMessage GetITFCaratulaReport(string template, InformeTecnicoFinal itf, string id, HttpRequestMessage Request, String aditional)
        {
            Reporter reporter = new Reporter();
            reporter.setTemplate(template); //"c:\\adjuntos\\test.dotx"

            Dictionary<String, String> keywords_values = new Dictionary<String, String>();
            keywords_values.Add("ITF_CLAVE", itf.ClasificacionSignatura);
            keywords_values.Add("ITF_TITULO", itf.Titulo);
            keywords_values.Add("ITF_AUTORES", aditional);
            keywords_values.Add("ITF_ANIO", itf.AnioElaboracion + "");
            keywords_values.Add("ITF_RESUMEN", itf.ITFgeneral.Resumen);
            keywords_values.Add("ITF_NO_PROY", itf.ProyectoId);
            keywords_values.Add("ITF_NOMB_PROY", itf.Proyecto.Nombre);
            keywords_values.Add("ITF_DIVISION", itf.NombreUnidadPadre);
            keywords_values.Add("ITF_GERENCIA", itf.NombreUnidadOrganizacional);
            keywords_values.Add("ITF_NUM_INVENT", this.NullToEmpty(itf.NumInventario));

            //keywords_values.Add("ITF_NUM_INFORME", itf.NumInforme);



            //keywords_values.Add("", itf);
            keywords_values.Add("RESULT_INGRESOS", "");
            keywords_values.Add("RESULT_EGRESOS", "");
            keywords_values.Add("RESULT_FONDO_INVEST", "");
            try { 
            keywords_values.Add("RESULT_CALIFICACION", itf.ResultadosE.CalifResultadosFinancieros.Nombre);
            keywords_values.Add("RESULT_RESUMEN", itf.Resultados.Descripcion);
            keywords_values.Add("RESULT_PROYS_IDENTIF", itf.ProyFuturo.Descripcion);

            keywords_values.Add("SATISF_CLI_CALIF", itf.SatisCte.CalificacionCliente.Nombre);
            keywords_values.Add("SATISF_CLI_JUSTIF", itf.SatisCte.Justificacion);
            }catch(Exception ex) { }

            try { 
            keywords_values.Add("LA_DP_INSUMOS", itf.LAproy.Insumos);
            keywords_values.Add("LA_EQUIP_TRAB", itf.LAproy.Equipo);
            keywords_values.Add("LA_GESTION_PROY", itf.LAproy.Gestion);
            keywords_values.Add("LA_CUMPLIMIENTO", itf.LAproy.Cumplimiento);
            keywords_values.Add("LA_RC_NEGOCIA", itf.LActe.Negociacion);
            keywords_values.Add("LA_RC_DESARROLL", itf.LActe.Desarrollo);
            keywords_values.Add("LA_RC_CIERRE", itf.LActe.Cierre);
            keywords_values.Add("LA_CI_INSTALACIONES", this.NullToEmpty(itf.LAcap.Instalaciones));
            keywords_values.Add("LA_CI_SERVICIOS", this.NullToEmpty(itf.LAcap.Servicios));
            }
            catch (Exception ex) { }
            //keywords_values.Add("", itf.);


            try
            {
                var sPath = "c:\\adjuntos\\reportes\\";

                if (!Directory.Exists(sPath))
                {
                    Directory.CreateDirectory(sPath);
                }
            }
            catch (Exception e)
            {

            }

            reporter.print(keywords_values, "c:\\adjuntos\\reportes\\ITF" + id + ".pdf");
            reporter.close();
            var docPDF = reporter.GetInResponse("c:\\adjuntos\\reportes\\ITF" + id + ".pdf", "ITF" + id + ".pdf", Request);
            return docPDF;
        }
        public string getAutoresOfList(List<Personas> autores)
        {
            var resultAutores = "";
            var i = 0;
            for (i = 0; i < autores.Count() - 1; i++)
            {
                resultAutores += autores[i].NombreCompleto + ", ";
            }
            resultAutores += autores[i].NombreCompleto;
            return resultAutores;
        }

    }
}