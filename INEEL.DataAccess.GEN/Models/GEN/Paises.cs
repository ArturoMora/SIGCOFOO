using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Paises")]
    public class Paises
    {
        public Paises() { }

        [Key]
        public int PaisId { get; set; }

        [StringLength(200)]
        public string NombrePais { get; set; }
    }
}
