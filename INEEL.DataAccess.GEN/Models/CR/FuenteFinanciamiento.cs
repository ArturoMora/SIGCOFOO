using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_FuenteFinanciamiento")]
    public class FuenteFinanciamiento
    {
        public FuenteFinanciamiento() { }

        [Key]
        public int FuenteFinanciamientoId { get; set; }

        [Required]
        public int Clave { get; set; }

        [StringLength(250)]
        [Required]
        public string NombreFF { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [StringLength(300)]
        public string SitioWeb { get; set; }

        //[ForeignKey("TipoFuenteFinanciamiento")]
        //public int? TipoFuenteFinanciamientoId { get; set; }
        //public TipoFuenteFinanciamiento TipoFuenteFinanciamiento { get; set; }

        //[ForeignKey("Pais")]
        //public int? PaisId { get; set; }
        //public Pais Pais { get; set; }

        [ForeignKey("Contacto")]
        public int? ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        [StringLength(20)]
        public string OrigenDatos { get; set; }

        public ICollection<FondoPrograma> FondoPrograma { get; set; }
    }

    public class FuentesFinanciamientoSIGPROY
    {
        public int FuenteFinanciamientoId { get; set; }
        public string NombreFF { get; set; }
        public DateTime FechaRegistroFF { get; set; }
        public Boolean EstadoFF { get; set; }
        public string OrigenDatosFF { get; set; }
        public List<FondosFinanciamientoSIGPROY> FondosFinanciamientoSIGPROY { get; set; }
    }

    public class FondosFinanciamientoSIGPROY
    {
        public int FondoProgramaId { get; set; }
        public string NombreFP { get; set; }
        public Boolean EstadoFP { get; set; }
        public int? FuenteFinanciamientoId { get; set; }
        public List<ConvocatoriasSIGPROY> ConvocatoriasSIGPROY { get; set; }
    }
    public class ConvocatoriasSIGPROY
    {
        public int ConvocatoriaId { get; set; }
        public string NombreConvocatoria { get; set; }
        public Boolean EstadoConvoc { get; set; }
        public int FondoProgramaId { get; set; }

    }
}