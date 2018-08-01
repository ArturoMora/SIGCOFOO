using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_SeguimientoTecnologiaLicenciada")]
    public class SeguimientoTecnologiaLicenciada
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SeguimientoTecnologiaLicenciadaId { get; set; }

        //relacion con estado flujo..

        //Relacion con propiedad  intelectual

        //Relacion con tipo de PI

        //relacion con gerenecia

        //referencia co adjunto

        //relacion tipo de pago, depende opciones a verificar si es o no catlogo

    }
}
