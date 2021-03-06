﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.cat_TipoDocumento")]
    public class TipoDocumento
    {
        public TipoDocumento() { }
        [Key]
        public int TipoDocumentoId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string Autor { get; set; }
        public Boolean Estado { get; set; }
    }
}
