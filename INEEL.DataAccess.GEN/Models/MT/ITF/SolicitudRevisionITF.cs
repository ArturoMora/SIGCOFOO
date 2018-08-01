using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT.ITF
{
    [Table("MT.SolicitudRevisionITF")]
    public class SolicitudRevisionITF
    {
       

        [Key]
        public int SolicitudRevisionITFId { get; set; }

   
        [ForeignKey("InformeTecnicoFinal")]
        public String InformeTecnicoFinalId { get; set; }
        public InformeTecnicoFinal InformeTecnicoFinal { get; set; }

        [Required]
        [StringLength(10)]
        public string ClavePersonaSolicitante { get; set; }
        /// <summary>
        /// NotMapped, se setea bajo demanda de acuerdo a ClavePersonaSolicitante
        /// </summary>
        [NotMapped]
        public Personas PersonaSolicitante { get; set; }
        [Required]
        public DateTime FechaSolicitud { get; set; }

        [StringLength(500)]        
        public string Justificacion { get; set; }

        [Required]
        [ForeignKey("EstadoSolicitud")]
        public int EstadoSolicitudId { get; set; }
        public EstadoSolicitud EstadoSolicitud { get; set; } //1 aprobado, 2 pendiente, 3 Denegada

        /// <summary>
        /// NotMapped, se setea bajo demanda de acuerdo a la ClaveUnidad
        /// </summary>
        [NotMapped]
        public string ClavePersonaAutorizador { get; set; }

        public string ClaveUnidad {get; set;}        

        public DateTime? FechaAtencion { get; set; }

        [StringLength(500)]
        public string TextoRespuesta { get; set; }
        /// <summary>
        /// Es una solicitud para el administrador de MT
        /// </summary>
        public bool AdminMT { get; set; }
    }
}

