using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Collections.Generic;

namespace INEEL.DataAccess.GEN.Models.PI
{
    [Table("PI.cat_TipoPropiedadIndustrial")]
    public class TipoPropiedadIndustrial
    {
        [Key]
        public int TipoPropiedadIndustrialId { get; set; }

        public string Descripcion { get; set; }

        public string DescripcionCorta { get; set; }

        public Boolean Estado { get; set; }

        public int prioridadOrdenamiento { get; set; }
    }
}
