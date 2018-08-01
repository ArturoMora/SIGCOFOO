using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.PI.Models
{
    [Table("PI.cat_Ramas")]
    public class Rama
    {
        [Key]
        public int RamaId { get; set; }

        public string Descripcion { get; set; }

        public string DescripcionCorta { get; set; }

        public Boolean Estado { get; set; }
    }
}
