using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_EvolucionPlantillaHistorico")]
    public class EvolucionPlantillaHistorico
    {
        public int EvolucionPlantillaHistoricoId { get; set; }

        public int Anio { get; set; }

        public int TotalInvestigadores { get; set; }

        public int TotalPosgrado { get; set; }
    }

}
