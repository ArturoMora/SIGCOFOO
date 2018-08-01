using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.cat_ContribucionProponente")]
    public class ContribucionProponente
    {
        [Required, Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id {get;set; } 
        public String Contribucion {get;set; } /*0 princial, 1 co-prop*/
    }
}
