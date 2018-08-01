using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.cat_EstadoSolicitud")]
    public class EstadoSolicitud
    {
        [Key]
        public int EstadoSolicitudId { get; set; }

        public DateTime FechaEfectiva { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        [StringLength(50)]
        public string DescripcionCorta { get; set; }

        public int? Estado { get; set; }
    }
}
