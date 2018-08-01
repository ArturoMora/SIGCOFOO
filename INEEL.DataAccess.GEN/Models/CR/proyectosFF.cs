using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    public class ProyectosFF
    {
        public int? FuenteFinanciamientoId { get; set; }
        public string NombreFF { get; set; }

        public int? TipoFuenteFinanciamientoId { get; set; }
        public string NombreTipoFF { get; set; }

        public int FondoProgramaId { get; set; }
        public string NombreF { get; set; }

        public int ConvocatoriaId { get; set; }
        public string NombreC { get; set; }
        public string VigenciaC { get; set; }

        public string NumProy { get; set; }
        public string NombreProy { get; set; }
        public DateTime FInicioProy { get; set; }
        public DateTime FTerminoProy { get; set; }
        public float? MontoProy { get; set; }
        
        public string Claveunidad { get; set; }
        public string UnidadProy { get; set; }

        //Campos de la tabla para el reporte de proyectos por FF
        //NombreFF
        //NombreTipoFF
        //NombreF
        //NombreC
        //VigenciaC
        //NumProy
        //NombreProy
        //FInicioProy
        //FTerminoProy
        //MontoProy
        //GerenciaProy
    }

    public class ParametrosFF
    {
        public int FuenteFinanciamientoId { get; set; }
        public int TipoFuenteFinanciamientoId { get; set; }
        public int FondoProgramaId { get; set; }
        public int ConvocatoriaId { get; set; }
        public string Claveunidad { get; set; }
    }
}
