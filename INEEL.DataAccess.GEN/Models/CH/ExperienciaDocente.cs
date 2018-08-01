using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_ExperienciaDocente")]
    public class ExperienciaDocente
    {
        [Key]
        public int ExperienciaDocenteId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public int InstitucionID { get; set; }
        public Institucion Institucion { get; set; }

        [MaxLength(200)]
        public string CursoImpartido { get; set; }

        //[MaxLength(200)]
        //public string programa { get; set; }



        //public int NivelCursoId { get; set; }
        //public NivelCurso NivelCurso { get; set; }

        //public int EventoId { get; set; }
        //public Evento Evento { get; set; }

        //public int? NumeroHoras { get; set; }

        //public int PaisID { get; set; }
        //public Pais Pais { get; set; }

        //[MaxLength(200)]
        //public string Lugar { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaTermino { get; set; }

        public int GradoAcademicoId { get; set; }
        public GradoAcademico GradoAcademico { get; set; }

        //public int NumeroDias { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
    }
}
