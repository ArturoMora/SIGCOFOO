using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_EstadoON")]
    public class EstadoON
    {
        public EstadoON() { }

        [Key]
        public int EstadoONId { get; set; }

        [StringLength(250)]
        public string Nombre { get; set; }

        [StringLength(100)]
        public string DescripcionCorta { get; set; }

        public bool Estado { get; set; }
    }
}
