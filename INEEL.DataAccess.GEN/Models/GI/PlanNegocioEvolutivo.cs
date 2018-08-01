using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_PlanNegocioEvolutivo")]
    public class PlanNegocioEvolutivo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PlanNegocioEvolutivoId { get; set; }

        //referencia con adjunto
        [Required]
        public String Titulo { get; set; }
        [ForeignKey("Propuesta")]
        public int PropuestaClave { get; set; }
        public Propuesta Propuesta { get; set; }

        [ForeignKey("Proyecto")]
        [StringLength(10)]
        public String ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        public ICollection<PlanNegocioEvolGerencias> PlanNegocioEvolGerencias { get; set; }
        public ICollection<PlanNegocioEvolAutores> PlanNegocioEvolAutores { get; set; }
        public ICollection<PlanNegocioEvolArchivos> PlanNegocioEvolArchivos { get; set; }

        public String Tema { get; set; }
        public String OfertaDeValor { get; set; }
        [ForeignKey("TipoAccesoGI")]
        public int TipoAcceso { get; set; }
        public TipoAccesoGI TipoAccesoGI { get; set; }

        public string ClavePersona { get; set; }
        public DateTime FechaRegistro { get; set; } //la primera fecha que se registra
        public DateTime FechaModificacion { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }
        public object PlanNegocioEvolCveAutores { get; internal set; }

        [NotMapped]
        public string NombreProyecto { get; set; }
        [NotMapped]
        public string NombrePersona { get; set; }
        [NotMapped]
        public string ClaveUnidad { get; set; }
    }
}
