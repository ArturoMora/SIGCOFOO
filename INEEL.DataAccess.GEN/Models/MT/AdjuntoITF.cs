using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models.ITF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.AdjuntoITF")]
    public class AdjuntoITF
    {
        public int AdjuntoITFId {get;set;}

        [ForeignKey("Adjunto")]
        public long AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        
        [ForeignKey("ITFgeneral")]
        //[StringLength(10)]        
        public String ITFgeneralId { get; set; }
        public ITFgeneral ITFgeneral { get; set; }

        public Boolean Procesado { get; set; }
    }
}
