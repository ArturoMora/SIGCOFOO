using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_TipoArea")]
    public class TipoArea
    {
        [Key] 
        public int TipoAreaId { get; set; }

     
        public string Area { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        public int Estado { get; set; }


    }
}
