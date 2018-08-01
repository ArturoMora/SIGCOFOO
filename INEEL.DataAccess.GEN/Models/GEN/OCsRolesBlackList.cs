using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    /******Esta clase no se utiliza en el proyecto, sigue aqui por que desde el inicio la relacionaron a otra tabla [gen.cat_OC]  ********** */
    [Table("GEN.cat_OCcRolesBlackList")]
    public class OCsRolesBlackList
    {
        [Key, Column(Order = 0)]
        [ForeignKey("Roles")]
        public int RolId { get; set; }
        public Roles Roles { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Ocs")]
        public String OcsId { get; set; }
        public Ocs Ocs { get; set; }
    }
}
