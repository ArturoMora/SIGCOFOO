using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_SeguimientoON")]
    public class SeguimientoOportunidad
    {
        public SeguimientoOportunidad() { }

        [Key]
        public int SeguimientoOportunidadId { get; set; }

        [Required]
        [ForeignKey("OportunidadNegocio")]
        public int OportunidadNegocioId { get; set; }
        public OportunidadNegocio OportunidadNegocio { get; set; }

        public DateTime FechaRegistro { get; set; }

        [StringLength(10)]
        public string ClaveUnidad { get; set; }

        [StringLength(500)]
        public string Actividad { get; set; }

        [StringLength(10)]
        public string InvestigadorId { get; set; }
    }
}
