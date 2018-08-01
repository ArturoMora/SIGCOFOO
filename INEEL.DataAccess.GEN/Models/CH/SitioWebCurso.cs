using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_SitioWebCurso")]
    public class SitioWebCurso
    {
        [Key]
        public int SitioWebCursoInternoId { get; set; }

        [Required]
        public string Url { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [ForeignKey("CursoInterno")]
        public int CursoInternoId { get; set; }
        public CursoInterno CursoInterno { get; set; }
    }
}