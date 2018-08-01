
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace INEEL.DataAccess.CH.Models
{

    [Table("CH.cat_Disciplinas")]
    public partial class Disciplina
    {

        [Key]
        public int DisciplinaId { get; set; }

        public DateTime FechaEfectiva { get; set; }

        [StringLength(200)]
        public string Descripcion { get; set; }

        [StringLength(50)]
        public string DescripcionCorta { get; set; }

        public int? Estado { get; set; }

        public int CampoId { get; set; }
        public Campo Campo { get; set; }
    }
}