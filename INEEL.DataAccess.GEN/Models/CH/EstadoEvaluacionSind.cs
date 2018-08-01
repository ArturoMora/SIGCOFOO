﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{

    [Table("CH.cat_EstadoEvaluacionSind")]
    public class EstadoEvaluacionSind
    {
        [Key]
        public int id { get; set; }
        public string descripcion { get; set; }
        public int estado { get; set; }

    }
}
