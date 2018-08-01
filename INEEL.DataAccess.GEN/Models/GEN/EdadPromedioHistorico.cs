using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_EdadPromedioHistorico")]
    public class EdadPromedioHistorico
    {
        [Key]
        public string year { get; set; }//año

        public decimal edadpromedio { get; set; }//edadpromedio
    }
}
