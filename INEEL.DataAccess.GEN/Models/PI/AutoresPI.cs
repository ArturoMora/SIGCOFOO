using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.PI
{
    [Table("PI.tab_AutoresPI")]
    public class AutoresPI
    {
        [Key]
        public int AutoresPIId { get; set; }

        public string ClavePersona { get; set; }

        public string Nombre { get; set; }

        public string Institucion { get; set; }

        public Boolean EsExterno { get; set; }

        public int PropiedadIndustrialId { get; set; }
        public virtual PropiedadIndustrial PropiedadIndustrial { get; set; }
    }
}
