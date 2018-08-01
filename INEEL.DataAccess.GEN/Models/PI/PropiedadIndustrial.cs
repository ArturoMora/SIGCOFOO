using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Collections.Generic;

namespace INEEL.DataAccess.GEN.Models.PI
{
    [Table("PI.tab_PropiedadIndustrial")]
    public class PropiedadIndustrial
    {
        [Key]
        public int PropiedadIndustrialId { get; set; }

        public Boolean EsPropiedadInstituto { get; set; }

        public string TitularPropiedadPatrimonial { get; set; }

        [StringLength(300)]
        [Required]
        public string Titulo { get; set; }

        [Required]
        public int TipoPropiedadIndustrialId  { get; set; }
        public TipoPropiedadIndustrial TipoPropiedadIndustrial { get; set; }

        [Required]
        public int EstadoDelProcesoId { get; set; }
        public virtual EstadoDelProceso EstadoDelProceso { get; set; }

        public string NumeroProyecto { get; set; }

        [NotMapped]
        public Proyecto Proyecto { get; set; }

        public string ClaveUnidad { get; set; }

        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        public string Expediente { get; set; }

        public DateTime? FechaPresentacion { get; set; }

        public int NumeroTitulo { get; set; }

        public DateTime? FechaExpedicion { get; set; }

        public DateTime? FechaVencimiento { get; set; }

        public DateTime? FechaProximoPago { get; set; }

        public DateTime? FechaInicioTramite { get; set; }

        public Boolean Licenciado { get; set; }

        [StringLength(200)]
        public string Observaciones { get; set; }

        [StringLength(10)]
        public string ConsecutivoInterno { get; set; }

        public Boolean Completo { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public virtual ICollection<AutoresPI> Inventores { get; set; }

        public virtual ICollection<HistorialPI> Historial { get; set; }

        [StringLength(10)]
        public string ClavePersona { get; set; }

        [NotMapped]
        public int EditAdmin { get; set; }
        [NotMapped]
        public Boolean Rechazar { get; set; }
        [NotMapped]
        public Boolean Aprobar { get; set; }
        [NotMapped]
        public string Justificacion { get; set; }
        [NotMapped]
        public string nombrePersona { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }

        [NotMapped]
        public string listacoautores { get; set; }

        [NotMapped]
        public string accion { get; set; }
    }
}
