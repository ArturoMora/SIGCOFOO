
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_Campos")]
    public class Campo
    {

        [Key]
        public int CampoId { get; set; }

        public DateTime FechaEfectiva { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        [StringLength(50)]
        public string DescripcionCorta { get; set; }

        public int Estado { get; set; }
    }
}
