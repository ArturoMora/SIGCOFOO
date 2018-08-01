﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_FortalezasCompetencias")]
    public class Fortalezas
    {
        [Key]
        public int Id { get; set; }

        public string Descripcion { get; set; }

        public int Estado { get; set; }

        public int? EmpleadoEvaluacionId { get; set; }
    }
}