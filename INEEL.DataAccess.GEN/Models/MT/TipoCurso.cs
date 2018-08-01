using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace INEEL.DataAccess.MT.Models.ITF.catalogos
{
    [Table("MT.cat_TipoCurso")]
    public class TipoCurso
    {
        public TipoCurso() { }

        [Key]
        public int TipoCursoId { get; set; }

        [StringLength(250)]
        [Required]
        public string Nombre { get; set; }
        
        [StringLength(300)]
        [Required]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        public DateTime FechaEfectiva { get; set; }

        [Required]
        public Boolean Estado { get; set; }
    }
}

