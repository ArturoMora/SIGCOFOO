﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Municipios")]
    public class Municipios
    {
        public Municipios() { }

        [Key]
        public int MunicipioId { get; set; }

        [StringLength(200)]
        public string NombreMunicipio { get; set; }

        [ForeignKey("Estado")]
        public int EstadoId { get; set; }
        public Estados Estado { get; set; }
    }
}
