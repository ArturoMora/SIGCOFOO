using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.PersonalProyecto")]
    public class PersonalProyecto
    {
        [Key]
        public long PersonalProyectoId { get; set; }

        [StringLength(10)]
        [Required]
        [ForeignKey("Proyecto")]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        [Required]
        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        [ForeignKey("EstadoFlujo")]
        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        [NotMapped]
        public virtual Personas persona { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaTermino { get; set; }
        
        public string Participacion { get; set; } 

        [MaxLength(500)]
        public string DescripcionActividades { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public String Origen { get; set; }

        public Decimal? Horas { get; set; }
    }
}
