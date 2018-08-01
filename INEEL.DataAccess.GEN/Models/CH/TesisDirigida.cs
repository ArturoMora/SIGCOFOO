using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_TesisDirigida")]
    public class TesisDirigida
    {
        [Key]
        public int TesisDirigidaId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public string Titulo { get; set; }
        public string Autor { get; set; }
        public DateTime? FechaExamen { get; set; }

        public int GradoAcademicoId { get; set; }
        public GradoAcademico GradoAcademico { get; set; }

        public DateTime? FechaAceptacion { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaTermino { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public string PalabrasClave { get; set; }

        public int? BecarioDirigidoId { get; set; }

    }
}
