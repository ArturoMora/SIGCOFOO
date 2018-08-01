namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambioDeCampoDescripcionEnDetalleEvT : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.tab_DetalleEvaluacionTecnicas", "observaciones", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_DetalleEvaluacionTecnicas", "observaciones", c => c.String(maxLength: 500));
        }
    }
}
