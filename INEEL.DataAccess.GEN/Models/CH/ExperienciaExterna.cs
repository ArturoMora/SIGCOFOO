using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_ExperienciaExterna")]
    public class ExperienciaExterna
    {
        [Key]
        public int ExperienciaExternaId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        [MaxLength(100)]
        public string NombreEmpresa { get; set; }

        [MaxLength(100)]
        public string Giro { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaTermino { get; set; }

        [MaxLength(100)]
        public string Puesto { get; set; }

        [MaxLength(200)]
        public string PropositoPuesto { get; set; }

        [MaxLength(500)]
        public string Actividades { get; set; }

        [MaxLength(500)]
        public string Conocimientos { get; set; }

        [MaxLength(500)]
        public string Habilidades { get; set; }

        public int? Personas { get; set; }

        public int? Areas { get; set; }

        public string Retos { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public float? DuracionPuesto { get; set; }
    }
}
