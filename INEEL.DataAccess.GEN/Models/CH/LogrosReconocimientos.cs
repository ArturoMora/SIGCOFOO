﻿using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_LogrosReconocimientos")]
    public class LogrosReconocimientos
    {
        public int LogrosReconocimientosId { get; set; }
        public string ClavePersona { get; set; }
        public DateTime? FechaValidacion { get; set; }
        [Required]
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }
        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }


        public string Titulo { get; set; }
        public string Emisor { get; set; }
        public DateTime FechaObtencion { get; set; }
        public string Descripcion { get; set; }       
    }
}