using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_CalificacionnSind")]
    public class CalificacionSind
    {

        [Key]
        public int id { get; set; }
        public string descripcion { get; set; }
        public int estado { get; set; }

    }
}
