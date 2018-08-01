
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
    [Table("MT.SolicitudAccesoITF")]
    public class SolicitudAccesoITF
    {
        public int SolicitudAccesoITFId { get; set; }
        
        [ForeignKey("InformeTecnicoFinal")]
        public String InformeTecnicoFinalId { get; set; }
        public InformeTecnicoFinal InformeTecnicoFinal { get; set; }

        [Required]
        [StringLength(10)]
        public string ClavePersonaSolicitante { get; set; }

        [StringLength(10)]
        public string ClaveUnidadDelSolicitante { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }




        /// <summary>
        /// NotMapped, se setea bajo demanda de acuerdo a ClavePersonaSolicitante
        /// </summary>
        [NotMapped]
        public Personas PersonaSolicitante { get; set; }
        /// <summary>
        /// NotMapped, se setea bajo demanda 
        /// </summary>
        [NotMapped]
        public String Justificacion { get; set; }
        /// <summary>
        /// NotMapped, se setea bajo demanda 
        /// </summary>
        [NotMapped]
        public int idRol { get; set; }
        
    }
}
