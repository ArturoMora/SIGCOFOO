using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_Log")]
    public class Log
    {
        public long LogId { get; set; }
        public DateTime Date { get; set; }
        public String Thread { get; set; }
        public String Level { get; set; }
        public String Logger { get; set; }
        public String Message { get; set; }
        public String Exception { get; set; }

    }
}
