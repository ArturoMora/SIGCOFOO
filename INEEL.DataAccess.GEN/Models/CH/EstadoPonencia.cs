﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.cat_EstadoPonencia")]
    public class EstadoPonencia
    {
        [Key]
        public int EstadoPonenciaId { get; set; }

        public DateTime FechaEfectiva { get; set; }
        [StringLength(200)]
        public string Descripcion { get; set; }
        [StringLength(50)]
        public string DescripcionCorta { get; set; }
        public int Estado { get; set; }
    }
}
