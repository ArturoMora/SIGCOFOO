using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class getCorreoConfig
    {
        //variables de coneccion de Correo
        public string From = ConfigurationManager.AppSettings["FromMail"];
        public string Password = ConfigurationManager.AppSettings["PasswordMail"];
        public string Solicitudes = ConfigurationManager.AppSettings["Solicitudes"];
        public string SolicitudesGI = ConfigurationManager.AppSettings["SolicitudesGI"];
        public string ideasInnovadoras = ConfigurationManager.AppSettings["ideasInnovadoras"];
        public string Subject = ConfigurationManager.AppSettings["SubjectMail"];
        public string host = ConfigurationManager.AppSettings["Servidor"];
        public int port = Convert.ToInt32(ConfigurationManager.AppSettings["Port"]);
        public bool enableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
        public string FichaPersonal = ConfigurationManager.AppSettings["FichaPersonal"];
        public string EncabezadoImagen= ConfigurationManager.AppSettings["encabezadoImgagen"];
        public string PiePaginaImagen = ConfigurationManager.AppSettings["piepaginaImgen"];
        public string ServidorDireccion = ConfigurationManager.AppSettings["serverDireccion"];
        public string serverlocal = ConfigurationManager.AppSettings["serverlocal"];

        //RECUPERAR VALORES DE SUPLANTACIÓN DE CORREO
        public string suplantarCorreoMT = ConfigurationManager.AppSettings["suplantarCorreoMT"];
        public string suplantarCorreoCR = ConfigurationManager.AppSettings["suplantarCorreoCR"];
        public string suplantarCorreoCH = ConfigurationManager.AppSettings["suplantarCorreoCH"];
        public string suplantarCorreoDA = ConfigurationManager.AppSettings["suplantarCorreoDA"];
        public string suplantarCorreoPA = ConfigurationManager.AppSettings["suplantarCorreoPA"];
        public string suplantarCorreoGI = ConfigurationManager.AppSettings["suplantarCorreoGI"];

        public string suplantarCorreoCP = ConfigurationManager.AppSettings["suplantarCorreoCP"];

        public string suplenteCorreoMT = ConfigurationManager.AppSettings["suplenteCorreoMT"];
        public string suplenteCorreoCR = ConfigurationManager.AppSettings["suplenteCorreoCR"];
        public string suplenteCorreoCH = ConfigurationManager.AppSettings["suplenteCorreoCH"];
        public string suplenteCorreoDA = ConfigurationManager.AppSettings["suplenteCorreoDA"];
        public string suplenteCorreoPA = ConfigurationManager.AppSettings["suplenteCorreoPA"];
        public string suplenteCorreoGI = ConfigurationManager.AppSettings["suplenteCorreoGI"];
        public string suplenteCorreoCP = ConfigurationManager.AppSettings["suplenteCorreoCP"];

        public string vCopiaOcultaATecnicosSIGCO = ConfigurationManager.AppSettings["vCopiaOcultaATecnicosSIGCO"];
        public string correoTecnicosSIGCO = ConfigurationManager.AppSettings["correoTecnicosSIGCO"];
        public string subprogramasTecnicos = ConfigurationManager.AppSettings["proyectosSubProgramas"];

    }
}
