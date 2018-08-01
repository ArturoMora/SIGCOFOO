using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT.ITF
{
    
    [Table("MT.AutorITF")]
    public class AutorITF
    {
        public AutorITF()
        {
            this.Estado = true;
        }
        [Key]
        public String AutorITFId { get; set; }       

        [ForeignKey("InformeTecnicoFinal")]
        public String InformeTecnicoFinalId { get; set; }
        public InformeTecnicoFinal InformeTecnicoFinal { get; set; }

        public Boolean Estado { get; set; }
        public String ClaveAutor { get; set; }
    }
}
