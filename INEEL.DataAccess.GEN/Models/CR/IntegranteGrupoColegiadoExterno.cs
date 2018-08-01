using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_IntegranteGrupoColegiadoExterno")]
    public class IntegranteGrupoColegiadoExterno
    {
        public IntegranteGrupoColegiadoExterno() { }

        [Key]
        public int IntegranteGrupoColegiadoExternoId { get; set; }

        [ForeignKey("GrupoColegiadoPartInt")]
        public int GrupoColegiadoPartIntId { get; set; }
        public GrupoColegiadoPartInt GrupoColegiadoPartInt { get; set; }

        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        [StringLength(50)]
        [Required]
        public string CargoGC { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }
    }
}
