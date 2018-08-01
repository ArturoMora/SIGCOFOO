using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_AreaConvenio")]
    public class AreaConvenio
    {
        public AreaConvenio() { }

        [Key]
        public int AreaConvenioId { get; set; }

        //[ForeignKey("UnidadOrganizacional"), Column(Order = 0)]
        //[StringLength(10)]
        public string ClaveUnidad { get; set; }
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 1)]
        //public DateTime FechaEfectiva { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        [Required]
        [ForeignKey("Convenio")]
        public int ConvenioId { get; set; }
        public Convenio Convenio { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
