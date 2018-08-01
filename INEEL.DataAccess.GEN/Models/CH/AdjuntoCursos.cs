using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_AdjuntoCursos")]
    public class AdjuntoCursos
    {
        [Key]
        public long AdjuntoCursosId { get; set; }
        [Required]
        public string RutaCompleta { get; set; }
        [StringLength(100)]
        public string nombre { get; set; }
        [ForeignKey("Modulo")]
        public string ModuloId { get; set; }
        public Modulo Modulo { get; set; }

        public int CursoInternoId { get; set; }
    }
}
