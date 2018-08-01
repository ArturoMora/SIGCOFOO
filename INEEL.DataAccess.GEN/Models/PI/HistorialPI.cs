using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Collections.Generic;

namespace INEEL.DataAccess.GEN.Models.PI
{
    [Table("PI.tab_HistorialPI")]
    public class HistorialPI
    {
        public int HistorialPIId { get; set; }

        public int PropiedadIndustrialId { get; set; }
        public PropiedadIndustrial PropiedadIndustrial { get; set; }

        public string Accion { get; set; }

        public DateTime? FechaAccion { get; set; }

        public DateTime? FechaRegistroAccion { get; set; }

        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

    }
}
