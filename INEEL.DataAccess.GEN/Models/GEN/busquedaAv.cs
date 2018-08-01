using System;
using System.Collections.Generic;
using System.Web;
using System.Linq;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class busquedaAv
    {

        public String FieldA { get; set; }
        public String FieldB { get; set; }
        public String FieldC { get; set; }
        public String FieldD { get; set; }
        public string criterio { get; set; }
        public string opciones { get; set; }
        public string ClavePersona { get; set; }
        public string NombreGerencia { get; set; }
        public Boolean personalActivo { get; set; }
        public int estado { get; set; }
        public Personas datosPersona { get; set; }
        public UnidadOrganizacional datosUnidad { get; set; }
        public IEnumerable<busquedaAv> Objeto { get; internal set; }
    }
}
