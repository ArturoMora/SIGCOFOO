using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Estados")]
    public class Estados
    {
        public Estados() { }

        [Key]
        public int EstadoId { get; set; }
        [StringLength(200)]
        public string NombreEstado { get; set; }

        [ForeignKey("Pais")]
        public int PaisId { get; set; }
        public Paises Pais { get; set; }
    }
}
