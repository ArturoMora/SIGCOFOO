using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    public class PropuestasFF
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

        public string NumProp { get; set; }
        public string NombreProp { get; set; }
        public string EstadoProp { get; set; }
        public decimal? MontoProp { get; set; }
        
        public string Claveunidad { get; set; }
        public string UnidadProp { get; set; }

        //Campos de la tabla para el reporte de propuestas por FF
        //NombreFF
        //NombreTipoFF
        //NombreF
        //NombreC
        //VigenciaC
        //NumProp
        //NombreProp
        //EstadoProp
        //MontoProy
        //Claveunidad
        //UnidadProp
    }
}
