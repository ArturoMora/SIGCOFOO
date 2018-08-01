using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.SolicitudInsumo")]
    public class SolicitudInsumo
    {
        public SolicitudInsumo() { }

        [Key]
        public long SolicitudInsumoId { get; set; }

        //[ForeignKey("Insumos")]
        public long InsumosId { get; set; }

        [Required]
        [StringLength(10)]
        public string ClavePersonaSolicitante { get; set; }

        [Required]
        public DateTime FechaSolicitudInsumo { get; set; }

        [StringLength(500)]
        [Required]
        public string Justificacion { get; set; }

        [Required]
        [ForeignKey("EstadoSolicitud")]
        public int EstadoSolicitudId { get; set; }
        public EstadoSolicitud EstadoSolicitud{ get; set; }

        [Required]
        [StringLength(10)]
        public string ClavePersonaAutorizador { get; set; }

        public DateTime? FechaAtencion { get; set; }

        [StringLength(500)]
        public string TextoRespuesta { get; set; }

        public DateTime? FechaInicioDescarga { get; set; }

        public DateTime? FechaFinalDescarga { get; set; }
    }
}

