using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Collections.Generic;

namespace INEEL.DataAccess.PI.Models
{
    [Table("PI.tab_DerechosAutor")]
    public class DerechosAutor
    {
        [Key]
        public int DerechosAutorId { get; set; }

        public Boolean EspropiedadInstituto { get; set; }

        public string TitularPropiedadPatrimonial { get; set; }

        [StringLength(300)]
        public string Titulo { get; set; }

        public string Sintesis { get; set; }

        public int RamaId { get; set; }
        public Rama Rama { get; set; }

        public int Esderivada { get; set; }

        public int DerechosAutorPadre { get; set; }

        public Boolean RelacionMedianteProyecto { get; set; }

        public string NumeroProyecto { get; set; }
        [NotMapped]
        public Proyecto Proyecto { get; set; }

        public string ClaveUnidad { get; set; }

        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        [NotMapped]
        public string UnidadPadre { get; set; }

        public DateTime FechaExpedicion { get; set; }

        public DateTime? FechaSolicitud { get; set; }

        public DateTime? FechaValidacion { get; set; }

        /// <summary>
        /// Número de registro
        /// </summary>
        [StringLength(50)]
        public string Certificado { get; set; }

        [StringLength(200)]
        public string Observaciones { get; set; }

        [StringLength(10)]
        public string ConsecutivoInterno { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public virtual ICollection<AutoresDA> Autores { get; set; }

        [StringLength(10)]
        public string ClavePersona { get; set; }

        [NotMapped]
        public string nombrePersona { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string ramita { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }
        
        [NotMapped]
        public string listacoautores{get;set;}

        [NotMapped]
        public string accion { get; set; }

    }
}
