using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using INEEL.DataAccess.MT.Models;
using System.Net.Http;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Utilidades.report
{
    public class InformeTF
    {
        private string NullToEmpty(String str)
        {
            if (String.IsNullOrEmpty(str))
            {
                return "";
            }
            else return str;
        }
        public HttpResponseMessage GetITFFichaReport(string template, InformeTecnicoFinal itf, string id, HttpRequestMessage Request, String aditional)
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
            //keywords_values.Add("", itf);

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