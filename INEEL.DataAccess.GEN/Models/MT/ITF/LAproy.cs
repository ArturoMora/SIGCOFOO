using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.ITFLeccionesAprendidasProy")]
    public class LAproy
    {
        [Required]
        public int LAproyId { get; set; }        

        [Required]
        [StringLength(500)]
        public string Insumos { get; set; }

        [Required]
        [StringLength(500)]
        public string Equipo { get; set; }

        [Required]
        [StringLength(500)]
        public string Gestion { get; set; }

        [Required]
        [StringLength(500)]
        public string Cumplimiento { get; set; }

        [Required]
        [StringLength(100)]
        public string Clave { get; set; }
    }
}
