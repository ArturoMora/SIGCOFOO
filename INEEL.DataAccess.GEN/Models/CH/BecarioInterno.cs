using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CH.Models;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_BecarioInterno")]
    public class BecarioInterno
    {
        [Key]
        public int BecarioInternoId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public int BecaInternaId { get; set; }
        public BecaInterna BecaInterna { get; set; }

        public int CarreraId { get; set; }
        public Carrera Carrera { get; set; }

        public int InstitucionID { get; set; }
        public Institucion Institucion { get; set; }

        public int PaisID { get; set; }
        public Pais Pais { get; set; }

        public DateTime? FechaBaja { get; set; }
        public DateTime FechaInicioBeca { get; set; }
        public DateTime FechaTerminoBeca { get; set; }
        public int? Extencion { get; set; }
        public DateTime? fechaTerminoExt { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        //public int? BecarioDirigidoId { get; set; }
        //public BecarioDirigido BecarioDirigido { get; set; }

        public string Notas { get; set; }
        public string Descripcion { get; set; }

        [NotMapped]
        public string NombrePersona { get; set; }

        [NotMapped]
        public Personas Persona { get; set; }
    }
}
