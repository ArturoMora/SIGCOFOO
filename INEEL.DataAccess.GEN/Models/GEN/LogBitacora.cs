using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models
{
    [Table("GEN.tab_LogBitacora")]
    public class LogBitacora
    {
        [Key]
        public long Id { get; set; }
        public DateTime Date { get; set; }
        public String Thread { get; set; }
        public String Level { get; set; }
        public String Logger { get; set; }
        public String Action { get; set; }
        public String Data { get; set; }
        public String User { get; set; }
        public String Ip { get; set; }

    }
}
