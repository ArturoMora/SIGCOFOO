namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Julio_evolucionplantillahistorico : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_EvolucionPlantillaHistorico",
                c => new
                    {
                        EvolucionPlantillaHistoricoId = c.Int(nullable: false, identity: true),
                        Anio = c.Int(nullable: false),
                        TotalInvestigadores = c.Int(nullable: false),
                        TotalPosgrado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EvolucionPlantillaHistoricoId);
            
        }
        
        public override void Down()
        {
            DropTable("CH.tab_EvolucionPlantillaHistorico");
        }
    }
}
