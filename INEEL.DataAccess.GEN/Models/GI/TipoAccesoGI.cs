using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.cat_TipoAcceso")]
    public class TipoAccesoGI
    {
        [Key]
        public int Id {get;set;}
        public String Nombre {get;set; } /*0 privado, 1 publico, 2 otro*/
    }
}
